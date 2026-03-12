/**
 * HTML Structure Validator
 * Returns { message, line } so that the editor can scroll to and highlight errors.
 * Uses a stack-based approach to find the exact unclosed tag line.
 */

// These tags are self-closing/void and never need a closing partner
const VOID_TAGS = new Set(['br', 'hr', 'img', 'input', 'meta', 'link', 'area',
    'base', 'col', 'embed', 'param', 'source', 'track', 'wbr']);

export const validateHTMLStructure = (code) => {
    const cleanCode = code.trim();
    if (!cleanCode) return null;

    const lines = cleanCode.split('\n');

    /**
     * Stack-based check: find the exact line where an opening tag was left unclosed.
     */
    const findUnclosedOpenTag = (tag) => {
        const stack = [];
        const openRe = new RegExp(`<\\s*${tag}(\\s[^>]*)?>`, 'gi');
        const closeRe = new RegExp(`<\\/${tag}\\s*>`, 'gi');
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            // Find all opens and closes on this line in order
            const events = [];
            let m;
            openRe.lastIndex = 0;
            while ((m = openRe.exec(line)) !== null) events.push({ type: 'open', col: m.index, lineNo: i + 1 });
            closeRe.lastIndex = 0;
            while ((m = closeRe.exec(line)) !== null) events.push({ type: 'close', col: m.index });
            events.sort((a, b) => a.col - b.col);
            for (const ev of events) {
                if (ev.type === 'open') stack.push(ev.lineNo);
                else if (ev.type === 'close') stack.pop();
            }
        }
        return stack.length > 0 ? stack[0] : null; // earliest unclosed open tag
    };

    /**
     * Find line of an extra closing tag (more closes than opens).
     */
    const findExtraCloseTag = (tag) => {
        let openCount = 0;
        const openRe = new RegExp(`<\\s*${tag}(\\s[^>]*)?>`, 'gi');
        const closeRe = new RegExp(`<\\/${tag}\\s*>`, 'gi');
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            openRe.lastIndex = 0;
            while (openRe.exec(line)) openCount++;
            closeRe.lastIndex = 0;
            let m;
            while ((m = closeRe.exec(line)) !== null) {
                openCount--;
                if (openCount < 0) return i + 1;
            }
        }
        return null;
    };

    // Paired tags that always need a closing friend
    const pairedTags = ['b', 'strong', 'i', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'p', 'div', 'span', 'ul', 'ol', 'li', 'a', 'table', 'tr', 'td', 'th',
        'head', 'body', 'title', 'html', 'form', 'label', 'section', 'mark',
        'header', 'footer', 'main', 'nav', 'article', 'aside'];

    for (const tag of pairedTags) {
        if (VOID_TAGS.has(tag)) continue; // skip void tags just in case
        const openRe = new RegExp(`<\\s*${tag}(\\s[^>]*)?>`, 'gi');
        const closeRe = new RegExp(`<\\/${tag}\\s*>`, 'gi');
        const openCount = (cleanCode.match(openRe) || []).length;
        const closeCount = (cleanCode.match(closeRe) || []).length;

        if (openCount > closeCount) {
            const line = findUnclosedOpenTag(tag);
            return {
                message: `😊 Your \`<${tag}>\` tag is missing a closing friend \`</${tag}>\`!`,
                line
            };
        }
        if (closeCount > openCount) {
            const line = findExtraCloseTag(tag);
            return {
                message: `Oops! You have an extra \`</${tag}>\` with no matching \`<${tag}>\` to close! 🤔`,
                line
            };
        }
    }

    return null; // All good!
};

/**
 * Checks if a given position (index) in the code is between <body> and </body>.
 */
export const isInsideBody = (code, index) => {
    const bodyStartMatch = /<body[^>]*>/i.exec(code);
    const bodyEndMatch = /<\/body>/i.exec(code);

    if (!bodyStartMatch || !bodyEndMatch) return false;

    const bodyStartIndex = bodyStartMatch.index + bodyStartMatch[0].length;
    const bodyEndIndex = bodyEndMatch.index;

    return index >= bodyStartIndex && index <= bodyEndIndex;
};
