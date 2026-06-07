export interface ManifestConfig {
  appName: string
  themeColor: string
  url: string
  iconBase64: string | null
}

export function generateManifest(config: ManifestConfig): object {
  const { appName, themeColor, url, iconBase64 } = config

  const icons = iconBase64
    ? [
        { src: iconBase64, sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
        { src: iconBase64, sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
      ]
    : [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
      ]

  return {
    name: appName,
    short_name: appName.slice(0, 12),
    description: `${appName} — converted by AppForge`,
    start_url: url,
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    theme_color: themeColor,
    background_color: '#0f172a',
    icons,
  }
}
