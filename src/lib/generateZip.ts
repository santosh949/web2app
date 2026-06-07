import JSZip from 'jszip'
import { generateManifest, type ManifestConfig } from './generateManifest'
import { generateSW } from './generateSW'

export async function generateZip(config: ManifestConfig): Promise<Blob> {
  const zip = new JSZip()

  const manifest = generateManifest(config)
  zip.file('manifest.json', JSON.stringify(manifest, null, 2))

  const sw = generateSW(config.appName)
  zip.file('sw.js', sw)

  const html = `<!DOCTYPE html>
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
           justify-content: center; min-height: 100vh; padding: 2rem; text-align: center; }
    h1 { font-size: 2rem; margin-bottom: 1rem; color: #22d3ee; }
    p { color: #94a3b8; max-width: 480px; line-height: 1.7; }
    .step { background: #1e293b; border-radius: 12px; padding: 1rem 1.5rem; 
            margin: 0.75rem 0; width: 100%; max-width: 480px; text-align: left; }
    .step strong { color: #22d3ee; }
  </style>
</head>
<body>
  <h1>${config.appName}</h1>
  <p>Your PWA is ready. Follow the steps below to install it on your device.</p>
  <div class="step"><strong>Android:</strong> Open this page in Chrome → tap the 3-dot menu → "Add to Home screen"</div>
  <div class="step"><strong>iOS:</strong> Open in Safari → tap the Share icon → "Add to Home Screen"</div>
  <div class="step"><strong>Desktop:</strong> Open in Chrome → click the install icon in the address bar</div>
</body>
</html>`

  zip.file('index.html', html)

  return zip.generateAsync({ type: 'blob' })
}
