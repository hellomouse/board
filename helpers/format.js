/**
 * Format links for content, disregards other html
 * @param {string} content Text content with maybe links
 * @param {string} color Color of the link
 * @return {string} HTML with links wrapped in <a>
 */
export function formatHrefLink(content, color='') {
    return content
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
        .replace(/(https?:\/\/[\w\.\d:?&=#]+)/gm, `<a style="color: ${color}" href="$1" target="_blank">$1</a>`);
}
