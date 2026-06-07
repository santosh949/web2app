import { supabase } from './supabase';
import { generateManifest, type ManifestConfig } from './generateManifest';
import { generateSW } from './generateSW';

export async function uploadPWA(config: ManifestConfig): Promise<{ installUrl: string, folderPath: string }> {
  const uuid = crypto.randomUUID();
  const bucketName = 'pwa-files';
  
  // Generate file contents
  const manifestContent = JSON.stringify(generateManifest(config), null, 2);
  const swContent = generateSW(config.appName);
  
  // HTML Install page (same as the ZIP generator logic)
  const indexContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${config.appName} — Install Guide</title>
  <link rel="manifest" href="manifest.json" />
  <script>
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js')
    }
  </script>
  <style>
    body { font-family: sans-serif; background: #0f172a; color: #f1f5f9; 
           display: flex; flex-direction: column; align-items: center; 
           justify-content: center; height: 100vh; margin: 0; text-align: center; padding: 20px; }
    h1 { margin-bottom: 10px; }
    p { color: #94a3b8; max-width: 400px; line-height: 1.5; }
    .icon { width: 96px; height: 96px; border-radius: 20px; margin-bottom: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); object-fit: cover; }
    .btn { margin-top: 30px; padding: 15px 30px; background: ${config.themeColor}; color: #000; 
           border: none; border-radius: 12px; font-weight: bold; font-size: 16px; cursor: pointer; }
    .safari-note { display: none; margin-top: 20px; font-size: 14px; background: rgba(255,255,255,0.05); padding: 15px; border-radius: 10px; }
    .safari-note b { color: ${config.themeColor}; }
  </style>
</head>
<body>
  ${config.iconBase64 
      ? `<img class="icon" src="\${config.iconBase64}" alt="Icon">` 
      : `<div class="icon" style="background: ${config.themeColor}; display: flex; align-items: center; justify-content: center; font-size: 40px; font-weight: bold; color: white;">${config.appName.charAt(0)}</div>`
  }
  <h1>Install ${config.appName}</h1>
  <p>To install this app on your device, tap the button below or use your browser's install feature.</p>
  
  <div class="safari-note" id="safariNote">
    To install on iOS: tap the <b>Share</b> button at the bottom of Safari, then scroll down and tap <b>Add to Home Screen</b>.
  </div>

  <button class="btn" onclick="installApp()" id="installBtn">Install App</button>

  <script>
    let deferredPrompt;
    const installBtn = document.getElementById('installBtn');
    const safariNote = document.getElementById('safariNote');

    // Detect iOS Safari
    const isIos = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /iphone|ipad|ipod/.test(userAgent);
    };
    
    const isStandalone = () => {
      return ('standalone' in window.navigator) && (window.navigator.standalone);
    };

    if (isIos() && !isStandalone()) {
      installBtn.style.display = 'none';
      safariNote.style.display = 'block';
    }

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
    });

    async function installApp() {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          deferredPrompt = null;
        }
      } else {
        alert("Your browser doesn't support direct installation. Please use 'Add to Home Screen' from your browser menu.");
      }
    }
  </script>
</body>
</html>`;

  const filesToUpload = [
    { path: `${uuid}/manifest.json`, content: manifestContent, contentType: 'application/json' },
    { path: `${uuid}/sw.js`, content: swContent, contentType: 'application/javascript' },
    { path: `${uuid}/index.html`, content: indexContent, contentType: 'text/html' },
  ];

  for (const file of filesToUpload) {
    const { error } = await supabase.storage
      .from(bucketName)
      .upload(file.path, file.content, {
        contentType: file.contentType,
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw new Error(`Failed to upload ${file.path}: ${error.message}`);
    }
  }

  // Get public URL for index.html
  const { data } = supabase.storage
    .from(bucketName)
    .getPublicUrl(`${uuid}/index.html`);

  return {
    installUrl: data.publicUrl,
    folderPath: uuid
  };
}
