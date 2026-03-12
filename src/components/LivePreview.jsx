import { useState } from 'react'
import { validateHTML } from '../utils/validator'
import ErrorPanel from './ErrorPanel'

import React, { useRef } from 'react'

function LivePreview({ code, onRun, isPlayground = false, files = {}, onDownload, isDownloading, onUploadFolder }) {
  const [showPreview, setShowPreview] = useState(false)
  const [errors, setErrors] = useState([])
  const [showZoom, setShowZoom] = useState(false)
  const [activePreviewFile, setActivePreviewFile] = useState('index.html')
  const fileInputRef = useRef(null)

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

  /**
   * Build the combined preview HTML for a given HTML file.
   * Links to other HTML pages in the project are rewritten so that clicking
   * them sends a window.postMessage to the parent React app, which can then
   * switch the preview file instead of navigating the real browser.
   */
  const getCombinedCode = (htmlFileName = 'index.html') => {
    if (!isPlayground) return code;

    const html = files[htmlFileName] || files['index.html'] || code;
    const css = Object.keys(files)
      .filter(f => f.endsWith('.css'))
      .map(f => `<style>${files[f]}</style>`)
      .join('\n');
    const js = Object.keys(files)
      .filter(f => f.endsWith('.js'))
      .map(f => `<script>${files[f]}<\/script>`)
      .join('\n');

    // Collect all HTML page names in the project
    const htmlPages = Object.keys(files).filter(f => f.endsWith('.html'));

    // Script injected into every preview page to intercept link clicks
    // and send a message to the parent app for same-project .html links
    const interceptScript = `
<script>
(function(){
  var pages = ${JSON.stringify(htmlPages)};
  document.addEventListener('click', function(e){
    var link = e.target.closest('a');
    if (!link) return;
    var href = link.getAttribute('href');
    if (!href) return;
    // Strip any query/hash
    var base = href.split('?')[0].split('#')[0];
    // Check if it's a same-project HTML page
    if (pages.indexOf(base) !== -1) {
      e.preventDefault();
      window.parent.postMessage({ type: 'PREVIEW_NAV', file: base }, '*');
      return;
    }
    // External or anchor links: open in new tab so they don't break the editor
    if (href.startsWith('http') || href.startsWith('//')) {
      e.preventDefault();
      window.open(href, '_blank', 'noopener');
    }
    // Same-page anchors (#id) are left alone — they work natively
  });
})();
<\/script>`;

    // Inject CSS into head and JS + interceptor into body
    let combined = html;

    if (combined.includes('</head>')) {
      combined = combined.replace('</head>', `${css}\n</head>`);
    } else {
      combined = css + combined;
    }

    if (combined.includes('</body>')) {
      combined = combined.replace('</body>', `${interceptScript}\n${js}\n</body>`);
    } else {
      combined = combined + interceptScript + js;
    }

    return combined;
  }

  // Listen for navigation messages from the preview iframe
  const handleIframeMessage = (e) => {
    if (e.data && e.data.type === 'PREVIEW_NAV') {
      const target = e.data.file;
      if (files[target]) {
        setActivePreviewFile(target);
      }
    }
  }

  const handleFolderUpload = (e) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles || uploadedFiles.length === 0) {
      alert("No files were found in this folder! Did you select an empty folder?");
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const scannedFiles = {};
    let filesProcessed = 0;

    // Accept any .html, .css, or .js files
    const validFiles = Array.from(uploadedFiles).filter(f => {
      const name = f.name.toLowerCase();
      return name.endsWith('.html') || name.endsWith('.css') || name.endsWith('.js');
    });

    if (validFiles.length === 0) {
      alert("We couldn't find any HTML, CSS, or JS files in this folder!");
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        let fileName = file.name;
        // Normalize names for index.html and style.css specifically
        if (fileName.toLowerCase() === 'index.html') fileName = 'index.html';
        if (fileName.toLowerCase() === 'style.css') fileName = 'style.css';
        if (fileName.toLowerCase() === 'script.js') fileName = 'script.js';

        scannedFiles[fileName] = event.target.result;
        filesProcessed++;

        if (filesProcessed === validFiles.length && onUploadFolder) {
          onUploadFolder(scannedFiles);
          setActivePreviewFile('index.html');
        }
      };
      reader.readAsText(file);
    });

    // Reset the input so the same folder can be uploaded again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  const combinedCode = getCombinedCode(activePreviewFile);

  return (
    <div className="live-preview-wrapper" onMouseEnter={() => window.addEventListener('message', handleIframeMessage)} onMouseLeave={() => window.removeEventListener('message', handleIframeMessage)}>
      <h2 className="panel-title">
        👀 Live Preview
        <div className="editor-controls-group preview-controls">
          <button
            className="toolbar-btn run-toolbar-btn" onClick={handleRun}>
            ▶️ RUN
          </button>
          <button
            className="toolbar-btn download-btn"
            onClick={onDownload}
            disabled={isDownloading}
            style={{ backgroundColor: '#2196F3', color: 'white', border: 'none', marginLeft: '8px' }}
          >
            {isDownloading ? '📥 Packing...' : '📥 Download'}
          </button>

          {isPlayground && onUploadFolder && (
            <>
              <input
                type="file"
                id="folderUpload"
                webkitdirectory=""
                directory=""
                style={{ display: 'none' }}
                onChange={handleFolderUpload}
                ref={fileInputRef}
              />
              <button
                className="toolbar-btn upload-btn"
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                style={{ backgroundColor: '#FF9800', color: 'white', border: 'none', marginLeft: '8px' }}
              >
                📂 Open folder
              </button>
            </>
          )}

          {showPreview && !errors.length && (
            <button className="toolbar-btn zoom-toolbar-btn" onClick={() => setShowZoom(true)} title="View in Desktop Browser">
              🔍 Open
            </button>
          )}
        </div>
      </h2>

      {/* Error Panel */}
      <ErrorPanel errors={errors} onShowError={handleShowError} />

      {/* Preview page indicator  */}
      {showPreview && isPlayground && activePreviewFile !== 'index.html' && (
        <div style={{
          fontSize: '11px', color: '#6c5ce7', fontWeight: 'bold',
          padding: '3px 8px', background: 'rgba(108,92,231,0.1)',
          borderRadius: '6px', marginBottom: '4px', display: 'inline-block'
        }}>
          📄 Previewing: {activePreviewFile}
          <button onClick={() => setActivePreviewFile('index.html')} style={{
            marginLeft: '6px', background: 'none', border: 'none',
            cursor: 'pointer', color: '#6c5ce7', fontWeight: 'bold', fontSize: '11px'
          }}>← Home</button>
        </div>
      )}

      {/* Preview Container */}
      <div className="preview-container">
        {showPreview && combinedCode.trim() ? (
          <iframe
            title="Live Preview"
            srcDoc={combinedCode}
            className="preview-iframe"
            sandbox="allow-scripts allow-same-origin"
            onLoad={(e) => {
              // Also set up message listener on mount
              window.addEventListener('message', handleIframeMessage);
            }}
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
                srcDoc={combinedCode}
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
