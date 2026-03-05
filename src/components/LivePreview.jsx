import { useState } from 'react'
import { validateHTML } from '../utils/validator'
import ErrorPanel from './ErrorPanel'

function LivePreview({ code, onRun }) {
  const [showPreview, setShowPreview] = useState(false)
  const [errors, setErrors] = useState([])
  const [showZoom, setShowZoom] = useState(false)

  const handleRun = () => {
    // Validate HTML
    const validationErrors = validateHTML(code)
    setErrors(validationErrors)

    // Only show preview if no errors
    if (validationErrors.length === 0) {
      setShowPreview(true)
    } else {
      setShowPreview(false)
    }

    // Call onRun callback if provided
    if (onRun) onRun();
  }

  const handleShowError = (lineNumber) => {
    // Future: scroll to error line
    console.log('Show error at line:', lineNumber)
  }

  return (
    <div className="live-preview-wrapper">
      <h2 className="panel-title">
        👀 Live Preview
        <div className="editor-controls-group">
          <button className="toolbar-btn run-toolbar-btn" onClick={handleRun}>
            ▶️ RUN
          </button>
          {showPreview && !errors.length && (
            <button className="toolbar-btn zoom-toolbar-btn" onClick={() => setShowZoom(true)} title="View in Desktop Browser">
              🔍 Zoom
            </button>
          )}
        </div>
      </h2>

      {/* Error Panel */}
      <ErrorPanel errors={errors} onShowError={handleShowError} />

      {/* Preview Container */}
      <div className="preview-container">
        {showPreview && code.trim() ? (
          <iframe
            title="Live Preview"
            srcDoc={code}
            className="preview-iframe"
            sandbox="allow-scripts allow-same-origin"
          />
        ) : (
          <div className="preview-placeholder">
            <p>👇 Click RUN to see your page!</p>
          </div>
        )}
      </div>

      {/* Zoom Modal */}
      {showZoom && (
        <div className="zoom-modal-overlay" onClick={() => setShowZoom(false)}>
          <div className="zoom-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="zoom-modal-header">
              <h3>🌐 Desktop View Preview</h3>
              <button className="close-zoom-btn" onClick={() => setShowZoom(false)}>✖️ Close</button>
            </div>
            <div className="zoom-modal-body">
              <iframe
                title="Zoom Preview"
                srcDoc={code}
                className="zoom-iframe"
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LivePreview
