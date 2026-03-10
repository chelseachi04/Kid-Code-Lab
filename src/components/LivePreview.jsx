import { useState } from 'react'
import { validateHTML } from '../utils/validator'
import ErrorPanel from './ErrorPanel'

function LivePreview({ code, onRun, isPlayground = false, files = {}, onSaveCloud, isSavingCloud, onDownload, isDownloading }) {
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

  const getCombinedCode = () => {
    if (!isPlayground) return code;

    const html = files['index.html'] || code;
    const css = Object.keys(files)
      .filter(f => f.endsWith('.css'))
      .map(f => `<style>${files[f]}</style>`)
      .join('\n');
    const js = Object.keys(files)
      .filter(f => f.endsWith('.js'))
      .map(f => `<script>${files[f]}</script>`)
      .join('\n');

    // Inject CSS into head and JS into body
    let combined = html;

    if (combined.includes('</head>')) {
      combined = combined.replace('</head>', `${css}\n</head>`);
    } else {
      combined = css + combined;
    }

    if (combined.includes('</body>')) {
      combined = combined.replace('</body>', `${js}\n</body>`);
    } else {
      combined = combined + js;
    }

    return combined;
  }

  const combinedCode = getCombinedCode();

  return (
    <div className="live-preview-wrapper">
      <h2 className="panel-title">
        👀 Live Preview
        <div className="editor-controls-group preview-controls">
          <button
            className="toolbar-btn run-toolbar-btn" onClick={handleRun}>
            ▶️ RUN
          </button>
          <button
            className="toolbar-btn save-cloud-btn"
            onClick={onSaveCloud}
            disabled={isSavingCloud || isDownloading}
            style={{ backgroundColor: '#4CAF50', color: 'white', border: 'none', marginLeft: '8px' }}
          >
            {isSavingCloud ? '☁️ Saving...' : '☁️ Save to Cloud'}
          </button>
          <button
            className="toolbar-btn download-btn"
            onClick={onDownload}
            disabled={isSavingCloud || isDownloading}
            style={{ backgroundColor: '#2196F3', color: 'white', border: 'none', marginLeft: '8px' }}
          >
            {isDownloading ? '📥 Packing...' : '📥 Download to My Device'}
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
        {showPreview && combinedCode.trim() ? (
          <iframe
            title="Live Preview"
            srcDoc={`<base href="/">${combinedCode}`}
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
                srcDoc={`<base href="/">${combinedCode}`}
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
