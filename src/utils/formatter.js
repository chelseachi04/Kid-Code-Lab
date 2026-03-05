/**
 * A simple HTML formatter that adds line breaks and indentation.
 * Designed for a kid-friendly coding environment.
 * Forced to provide a vertical structure.
 */
export const formatHTML = (html) => {
    if (!html) return '';

    // Remove existing extra whitespace but preserve hierarchy
    let clean = html.replace(/>\s+</g, '><').trim();

    let formatted = '';
    let indent = 0;
    const tab = '  '; // 2 spaces for indentation

    // Split by tags, but keep the tags
    const tokens = clean.split(/(<[^>]+>)/g).filter(token => token.trim().length > 0);

    // Self-closing tags or tags that don't increase indentation
    const voidTags = ['img', 'br', 'hr', 'input', 'meta', 'link', '!doctype'];

    tokens.forEach((token) => {
        token = token.trim();

        if (token.startsWith('</')) {
            // Closing tag: decrease indent before adding
            indent = Math.max(0, indent - 1);
            formatted += '\n' + tab.repeat(indent) + token;
        } else if (token.startsWith('<') && !token.endsWith('/>')) {
            // Opening tag
            const tagNameMatch = token.match(/<([^\s>]+)/);
            const tagName = tagNameMatch ? tagNameMatch[1].toLowerCase() : '';

            // Don't add newline for the very first tag
            if (formatted !== '') {
                formatted += '\n';
            }
            formatted += tab.repeat(indent) + token;

            // Increase indent if it's not a void tag or comment/doctype
            if (!voidTags.includes(tagName) && !token.startsWith('<!')) {
                indent++;
            }
        } else {
            // Text content or self-closing tag
            formatted += '\n' + tab.repeat(indent) + token;
        }
    });

    return formatted.trim();
};
