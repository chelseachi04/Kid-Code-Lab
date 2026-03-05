// HTML VALIDATOR FOR KID-FRIENDLY ERROR MESSAGES

export const validateHTML = (code) => {
  const errors = []

  // Check for missing DOCTYPE
  if (!code.includes('<!DOCTYPE html>')) {
    errors.push({
      type: 'missing',
      message: '🤔 Your page is missing `<!DOCTYPE html>` at the top! It tells the browser: "This is an HTML page!"',
      line: 1,
      severity: 'high',
    })
  }

  // Check for missing html tag
  if (!/<html/i.test(code)) {
    errors.push({
      type: 'missing',
      message: '🏠 Your page needs an `<html>` tag to wrap everything! It\'s like the house roof!',
      line: null,
      severity: 'high',
    })
  }

  // Check for missing head tag
  if (!/<head/i.test(code)) {
    errors.push({
      type: 'missing',
      message: '🎯 Your page is missing a `<head>` tag! The head holds important info about your page.',
      line: null,
      severity: 'high',
    })
  }

  // Check for missing body tag
  if (!/<body/i.test(code)) {
    errors.push({
      type: 'missing',
      message: '📝 Your page needs a `<body>` tag! This is where your content goes!',
      line: null,
      severity: 'high',
    })
  }

  // Check for unclosed tags
  const tagRegex = /<(\w+)([^>]*)>/g
  const openTags = []
  const selfClosingTags = ['img', 'br', 'hr', 'input', 'meta', 'link']

  let match
  while ((match = tagRegex.exec(code)) !== null) {
    const tagName = match[1].toLowerCase()
    const fullTag = match[0]

    // Skip self-closing tags and closing tags
    if (!selfClosingTags.includes(tagName) && !fullTag.includes('/')) {
      openTags.push(tagName)
    }
  }

  // Check for closing tags
  const closeTagRegex = /<\/(\w+)>/g
  while ((match = closeTagRegex.exec(code)) !== null) {
    const tagName = match[1].toLowerCase()
    const lastOpenIndex = openTags.lastIndexOf(tagName)

    if (lastOpenIndex !== -1) {
      openTags.splice(lastOpenIndex, 1)
    }
  }

  // If there are unclosed tags
  if (openTags.length > 0) {
    openTags.forEach((tag) => {
      errors.push({
        type: 'unclosed',
        message: `😊 Your \`<${tag}>\` tag is missing a closing friend \`</${tag}>\`!`,
        line: null,
        severity: 'high',
      })
    })
  }

  return errors
}

export const getErrorLine = (code, errorMessage) => {
  const lines = code.split('\n')
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].length > 0 && errorMessage.includes(lines[i].substring(0, 20))) {
      return i + 1
    }
  }
  return null
}
