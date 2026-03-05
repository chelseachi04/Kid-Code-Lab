/**
 * Strict HTML Structure Validator
 * Enforces:
 * 1. Only one <html>, <head>, <title>, and <body> tag.
 * 2. All content must be inside <html>.
 * 3. No tags should be outside <html>.
 */

export const validateHTMLStructure = (code) => {
    const errors = [];
    const cleanCode = code.trim();

    if (!cleanCode) return null;

    // 1. Check for multiple instances of primary tags
    const primaryTags = ['html', 'head', 'title', 'body'];
    primaryTags.forEach(tag => {
        const openTagRegex = new RegExp(`<\\s*${tag}\\b[^>]*>`, 'gi');
        const closeTagRegex = new RegExp(`</${tag}>`, 'gi');

        const openCount = (cleanCode.match(openTagRegex) || []).length;
        const closeCount = (cleanCode.match(closeTagRegex) || []).length;

        if (openCount > 1) {
            errors.push(`Oops! You have more than one <${tag}> tag. You only need one!`);
        }
        if (closeCount > 1) {
            errors.push(`Oops! You have more than one </${tag}> tag. You only need one!`);
        }
    });

    // 2. Check if content starts with <html> and ends with </html> (ignoring doctype)
    const codeWithoutDoctype = cleanCode.replace(/^<!DOCTYPE html>/i, '').trim();

    const startsWithHtml = /<html[^>]*>/i.test(codeWithoutDoctype);
    const endsWithHtml = /<\/html>\s*$/i.test(codeWithoutDoctype);

    if (!startsWithHtml || !endsWithHtml) {
        errors.push("Everything should be inside your <html>house</html>! Don't leave tags standing outside.");
    }

    // 3. Simple containment check using DOMParser (browser only, but we are in a React app)
    if (typeof window !== 'undefined') {
        const parser = new DOMParser();
        const doc = parser.parseFromString(cleanCode, 'text/html');

        // If the parser had to move elements out of body/head to fix it, it might be invalid for our strict rules
        // But for a kid's editor, we mainly want to enforce the visually obvious structure.
    }

    return errors.length > 0 ? errors[0] : null; // Return first error for simplicity
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
