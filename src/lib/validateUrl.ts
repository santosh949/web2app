export async function validateUrl(url: string): Promise<{ valid: boolean; error?: string }> {
  if (!url || url.trim() === '') {
    return { valid: false, error: 'Please enter a URL' }
  }

  if (!url.startsWith('https://')) {
    return { valid: false, error: 'URL must start with https://' }
  }

  try {
    new URL(url)
    return { valid: true }
  } catch {
    return { valid: false, error: 'Invalid URL format' }
  }
}
