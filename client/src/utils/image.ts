/**
 * Get the full URL for uploaded files
 * Handles both relative and absolute URLs
 */
export function getImageUrl(relativePath: string | null | undefined): string | null {
  if (!relativePath) return null;

  // If it's already a full URL, return as is
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
    return relativePath;
  }

  // If it's a relative path, construct the full URL
  if (relativePath.startsWith('/')) {
    // In production, use relative URL (same domain)
    if (import.meta.env.VITE_NODE_ENV === 'production') {
      return relativePath;
    }
    // In development, construct full URL to localhost
    return `http://localhost:3000${relativePath}`;
  }

  return null;
}
