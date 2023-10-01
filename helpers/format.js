import { escape } from 'html-escaper';

/**
 * Escape html
 * @param {string} text Text to escape
 * @return {string} Text with escaped HTML
 */
export function escapeHtml(text) {
    return escape(text);
}

/**
 * Format links for content, disregards other html
 * @param {string} content Text content with maybe links
 * @param {string} color Color of the link
 * @param {boolean} noUnderline Remove text deocration
 * @return {string} HTML with links wrapped in <a>
 */
export function formatHrefLink(content, color='', noUnderline=false) {
    return escapeHtml(content)
        .replace(/(https?:\/\/[\w.\d:?&=#/;]+)/gm, `<a style="color: ${color};${noUnderline ? 'text-decoration:none' : ''}"
            href="$1" target="_blank">$1</a>`);
}
