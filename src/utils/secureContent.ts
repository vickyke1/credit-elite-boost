import DOMPurify from 'dompurify';

/**
 * Safely renders markdown-like content without XSS vulnerabilities
 * Uses a whitelist approach for maximum security
 */
export const renderSecureContent = (content: string): string => {
  // First, escape all HTML to prevent any injection
  const escapedContent = content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');

  // Then safely transform basic markdown syntax
  const processedContent = escapedContent
    .replace(/\n/g, '<br/>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mt-8 mb-4">$1</h1>')
    .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-semibold mt-6 mb-3">$1</h2>')
    .replace(/^### (.*$)/gm, '<h3 class="text-xl font-medium mt-4 mb-2">$1</h3>');

  // Final sanitization with strict whitelist
  return DOMPurify.sanitize(processedContent, {
    ALLOWED_TAGS: ['h1', 'h2', 'h3', 'p', 'br', 'strong', 'em'],
    ALLOWED_ATTR: ['class'],
    ALLOW_DATA_ATTR: false,
    USE_PROFILES: { html: true }
  });
};