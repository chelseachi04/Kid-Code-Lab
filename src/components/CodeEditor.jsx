import { useRef, useEffect, useState } from 'react'
import { formatHTML } from '../utils/formatter'
import { cssStyleGroups } from '../data/styles'

function CodeEditor({ code, setCode, onInsertTag, language = 'html', fileName }) {
  const textareaRef = useRef(null)
  const backdropRef = useRef(null)
  const [suggestions, setSuggestions] = useState([])
  const [suggestionIndex, setSuggestionIndex] = useState(0)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestionPos, setSuggestionPos] = useState({ top: 0, left: 0 })

  const allStyles = cssStyleGroups.flatMap(g => g.styles)

  const handleChange = (e) => {
    const newValue = e.target.value
    setCode(newValue)

    // Trigger auto-complete for CSS
    if (language === 'css' || (language === 'html' && isInStyleTag(newValue, e.target.selectionStart))) {
      triggerAutoComplete(newValue, e.target.selectionStart)
    } else {
      setShowSuggestions(false)
    }
  }

  const isInStyleTag = (text, pos) => {
    const styleStart = text.lastIndexOf('<style>', pos)
    const styleEnd = text.lastIndexOf('</style>', pos)
    return styleStart > styleEnd
  }

  const triggerAutoComplete = (text, pos) => {
    const beforeCursor = text.substring(0, pos)
    const lines = beforeCursor.split('\n')
    const currentLine = lines[lines.length - 1]
    // Don't trim the current line so that trailing spaces correctly end the word
    const words = currentLine.split(/[\s{;:]/)
    const lastWord = words[words.length - 1]

    if (lastWord.length >= 2) {
      const filtered = allStyles.filter(s =>
        s.name.toLowerCase().includes(lastWord.toLowerCase())
      ).slice(0, 5)

      if (filtered.length > 0) {
        setSuggestions(filtered)
        setShowSuggestions(true)
        setSuggestionIndex(0)

        // Approximate cursor position for the dropdown
        const textarea = textareaRef.current
        const row = lines.length
        const col = lines[lines.length - 1].length

        // Use a more predictable offset for the dropdown
        setSuggestionPos({
          top: Math.min(row * 22, textarea.offsetHeight - 150),
          left: Math.min(col * 9 + 40, textarea.offsetWidth - 300)
        })
      } else {
        setShowSuggestions(false)
      }
    } else {
      setShowSuggestions(false)
    }
  }

  useEffect(() => {
    if (textareaRef.current) {
      // Sync cursor and scroll position to top when file changes
      textareaRef.current.setSelectionRange(0, 0)
      textareaRef.current.scrollTop = 0
    }
    // Also dismiss any stuck suggestions
    setShowSuggestions(false)
  }, [fileName])

  const handleKeyDown = (e) => {
    if (showSuggestions && suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSuggestionIndex(prev => (prev + 1) % suggestions.length)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSuggestionIndex(prev => (prev - 1 + suggestions.length) % suggestions.length)
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault()
        applySuggestion(suggestions[suggestionIndex])
      } else if (e.key === 'Escape' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Backspace') {
        setShowSuggestions(false)
      }
    }
  }

  const applySuggestion = (suggestion) => {
    const textarea = textareaRef.current
    const pos = textarea.selectionStart
    const text = code

    const beforeCursor = text.substring(0, pos)
    const afterCursor = text.substring(pos)

    // Find the last breakpoint (space, semicolon, brace, newline, or colon)
    const lastBreakpoint = Math.max(
      beforeCursor.lastIndexOf(' '),
      beforeCursor.lastIndexOf(';'),
      beforeCursor.lastIndexOf('{'),
      beforeCursor.lastIndexOf(':'),
      beforeCursor.lastIndexOf('\n')
    )

    let beforeWord = text.substring(0, lastBreakpoint + 1)

    let insertText = suggestion.name

    // SMART REPLACEMENT:
    // 1. If we already have a colon on this line, we're likely typing a value.
    // Strip the property name from the suggestion.
    const lineStart = beforeCursor.lastIndexOf('\n') + 1
    const currentLineBefore = beforeCursor.substring(lineStart)

    if (currentLineBefore.includes(':') && insertText.includes(':')) {
      insertText = insertText.split(':')[1].trim()
    }

    // 2. Aggressive Punctuation Cleanup:
    // If beforeWord ends with a semicolon, colon, or space that would cause duplication, strip it.
    while (beforeWord.length > 0 && (beforeWord.endsWith(';') || (beforeWord.endsWith(':') && insertText.startsWith(':')) || (beforeWord.endsWith(' ') && (insertText.startsWith(' ') || beforeWord.length > 1)))) {
      // Don't strip the only space after a colon if we are inserting a value
      if (beforeWord.endsWith(' ') && beforeWord.charAt(beforeWord.length - 2) === ':') break;
      beforeWord = beforeWord.substring(0, beforeWord.length - 1)
    }

    // Ensure the inserted text ends with a semicolon and a space
    if (!insertText.endsWith(';')) {
      insertText += ';'
    }
    if (!insertText.endsWith(' ')) {
      insertText += ' '
    }

    const newCode = beforeWord + insertText + afterCursor

    setCode(newCode)
    setShowSuggestions(false)

    setTimeout(() => {
      const newPos = beforeWord.length + insertText.length
      textarea.setSelectionRange(newPos, newPos)
      textarea.focus()
    }, 0)
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text/plain')
    const formattedText = formatHTML(text)

    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd

    const newCode = code.substring(0, start) + formattedText + code.substring(end)
    setCode(newCode)

    // Set cursor position after format
    setTimeout(() => {
      const newPos = start + formattedText.length
      textarea.setSelectionRange(newPos, newPos)
    }, 0)
  }

  const handleScroll = (e) => {
    if (backdropRef.current) {
      backdropRef.current.scrollTop = e.target.scrollTop
      backdropRef.current.scrollLeft = e.target.scrollLeft
    }
  }

  useEffect(() => {
    if (backdropRef.current && textareaRef.current) {
      backdropRef.current.scrollTop = textareaRef.current.scrollTop
      backdropRef.current.scrollLeft = textareaRef.current.scrollLeft
    }
  }, [code])

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
    textareaRef.current?.classList.add('drag-over')
  }

  const handleDragLeave = () => {
    textareaRef.current?.classList.remove('drag-over')
  }

  const handleDrop = (e) => {
    e.preventDefault()
    textareaRef.current?.classList.remove('drag-over')

    const tagName = e.dataTransfer.getData('text/plain')
    if (tagName) {
      const textarea = textareaRef.current
      const startPos = textarea.selectionStart
      onInsertTag(tagName, startPos)
      textarea.focus()
    }
  }

  // Simple syntax highlighting: wrap tags in span
  const getHighlightedCode = (text) => {
    if (!text) return ''

    // Escape HTML special characters for the backdrop display first
    let escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
    // We don't need &nbsp; because white-space: pre preserves regular spaces, 
    // and &nbsp; entities break the CSS syntax highlight regexes which split on semicolons.

    if (language === 'css') {
      // CSS Highlighting: properties, values, selectors
      return escaped
        .replace(/([a-zA-Z-]+)(?=:)/g, '<span class="code-property">$1</span>') // Properties
        .replace(/(?<=:)([^;}]+)/g, '<span class="code-value">$1</span>') // Values
        .replace(/([^{}\n]+)(?=\{)/g, '<span class="code-selector">$1</span>') // Selectors
    } else if (language === 'js') {
      // JS Highlighting: keywords, strings, comments
      return escaped
        .replace(/\b(const|let|var|function|return|if|else|for|while|import|export|default|console)\b/g, '<span class="code-keyword">$1</span>')
        .replace(/("[^"]*"|'[^']*')/g, '<span class="code-string">$1</span>')
        .replace(/(\/\/[^\n]*)/g, '<span class="code-comment">$1</span>')
    }

    // Default HTML Highlighting
    let highlighted = escaped.replace(/(&lt;\/?[a-zA-Z0-9!]+.*?&gt;)/g, '<span class="code-tag">$1</span>')

    return highlighted
  }

  return (
    <div className="code-editor-container">
      <div className="code-editor-wrapper">
        <pre
          ref={backdropRef}
          className="code-editor-backdrop"
          aria-hidden="true"
          dangerouslySetInnerHTML={{ __html: getHighlightedCode(code) + '\n' }}
        />
        <textarea
          ref={textareaRef}
          className="code-editor"
          value={code}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onClick={() => setShowSuggestions(false)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          onPaste={handlePaste}
          onScroll={handleScroll}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          placeholder={language === 'css' ? "Write your CSS here..." : language === 'js' ? "Write your JS here..." : "Write your HTML code here or drag tags from the left..."}
        />

        {showSuggestions && (
          <div className="autocomplete-dropdown" style={{ top: suggestionPos.top, left: suggestionPos.left }}>
            {suggestions.map((s, i) => (
              <div
                key={s.name}
                className={`suggestion-item ${i === suggestionIndex ? 'active' : ''}`}
                onMouseDown={(e) => {
                  e.preventDefault()
                  applySuggestion(s)
                }}
              >
                <span className="suggestion-emoji">{s.emoji}</span>
                <span className="suggestion-name">{s.name}</span>
                <span className="suggestion-desc">{s.description}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CodeEditor
