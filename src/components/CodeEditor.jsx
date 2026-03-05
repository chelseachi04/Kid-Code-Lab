import { useRef, useEffect } from 'react'
import { formatHTML } from '../utils/formatter'

function CodeEditor({ code, setCode, onInsertTag }) {
  const textareaRef = useRef(null)
  const backdropRef = useRef(null)

  const handleChange = (e) => {
    setCode(e.target.value)
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
      .replace(/ /g, '&nbsp;') // Preserve spaces for alignment

    // Match tags like &lt;tagname&gt; or &lt;/tagname&gt;
    // This regex looks for &lt; followed by anything until &gt;
    let highlighted = escaped.replace(/(&lt;\/?[a-zA-Z0-9!]+.*?&gt;)/g, '<span class="code-tag">$1</span>')

    // Convert &nbsp; back within tags to avoid issues with highlighting spans
    // But only if it's NOT inside a tag. Actually, it's safer to just let it be &nbsp; 
    // and ensuring the textarea also uses the same character widths.

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
          onPaste={handlePaste}
          onScroll={handleScroll}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          placeholder="Write your HTML code here or drag tags from the left..."
        />
      </div>
    </div>
  )
}

export default CodeEditor
