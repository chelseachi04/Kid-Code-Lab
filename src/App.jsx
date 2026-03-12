import { useState, useEffect } from 'react'
import HomeScreen from './components/HomeScreen'
import ModuleSelector from './components/ModuleSelector'
import TourGuide from './components/TourGuide'
import TagLibrary from './components/TagLibrary'
import CodeEditor from './components/CodeEditor'
import LivePreview from './components/LivePreview'
import Quiz from './components/Quiz'
import ThemeToggle from './components/ThemeToggle'
import Guide from './components/Guide'
import ClearConfirmModal from './components/ClearConfirmModal'
import PlaygroundModal from './components/PlaygroundModal'
import { modules } from './data/modules'
import { saveModuleCode, loadModuleCode, saveQuizScore, loadQuizScore, markQuizPassed } from './utils/storage'
import { validateHTMLStructure, isInsideBody } from './utils/codeValidator'
import { formatHTML } from './utils/formatter'
import { supabase } from './utils/supabase'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import './style.css'
import './playground.css'

function App() {
  const [theme] = useState(() => {
    return localStorage.getItem('kidCodeEditor_theme') || 'light'
  })
  const [view, setView] = useState(() => {
    return localStorage.getItem('kidCodeEditor_view') || 'home'
  }) // 'home', 'quest', 'playground'
  const [currentModule, setCurrentModule] = useState(() => {
    const saved = localStorage.getItem('kidCodeEditor_currentModule')
    return saved ? parseInt(saved, 10) : null
  })

  const [activeFile, setActiveFile] = useState(() => {
    return localStorage.getItem('playground_activeFile') || 'index.html'
  })

  // Set theme attribute on root element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('kidCodeEditor_theme', theme)
  }, [theme])

  const [showTourGuide, setShowTourGuide] = useState(false)
  const [showQuiz, setShowQuiz] = useState(false)
  const [showGuide, setShowGuide] = useState(false)
  const [code, setCode] = useState('')
  const [playgroundFiles, setPlaygroundFiles] = useState(() => {
    try {
      const saved = localStorage.getItem('playground_files')
      return saved ? JSON.parse(saved) : {
        'index.html': '<!DOCTYPE html>\n<html>\n  <head>\n    <title>My Project</title>\n  </head>\n  <body>\n    <h1>Hello World!</h1>\n  </body>\n</html>',
        'style.css': 'body {\n  background-color: #f0f8ff;\n  font-family: sans-serif;\n}\n\nh1 {\n  color: #ff69b4;\n}',
        'script.js': '// Add your magic here!\nconsole.log("Welcome to the Playground!");'
      }
    } catch {
      return { 'index.html': '', 'style.css': '', 'script.js': '' }
    }
  })
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [validationError, setValidationError] = useState(null)
  const [errorLine, setErrorLine] = useState(null)
  const [customTourStep, setCustomTourStep] = useState(null)
  const [studentName] = useState('Explorer')
  const [modulesList, setModulesList] = useState(modules)
  const [showSkeletonSample, setShowSkeletonSample] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [showClearModal, setShowClearModal] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [expandedEditor, setExpandedEditor] = useState(false)
  const [pgModal, setPgModal] = useState({ isOpen: false, type: 'alert', title: '', message: '', onConfirm: () => { }, onCancel: () => { } })
  const [tourGuideSeen, setTourGuideSeen] = useState(() => {
    try {
      const stored = localStorage.getItem('tourGuideSeen')
      return stored ? new Set(JSON.parse(stored)) : new Set()
    } catch {
      return new Set()
    }
  })

  // View and Module persistence
  useEffect(() => {
    localStorage.setItem('kidCodeEditor_view', view)
    if (currentModule) {
      localStorage.setItem('kidCodeEditor_currentModule', currentModule.toString())
    } else {
      localStorage.removeItem('kidCodeEditor_currentModule')
    }
  }, [view, currentModule])

  // Robust Playground Persistence: centralized save whenever files or activeFile change
  useEffect(() => {
    localStorage.setItem('playground_files', JSON.stringify(playgroundFiles))
    localStorage.setItem('playground_activeFile', activeFile)
  }, [playgroundFiles, activeFile])

  // Removed beforeunload alert to clean up UI for fast editing

  // Initialize modules with unlock status from localStorage
  useEffect(() => {
    const updatedModules = modules.map((m) => {
      // Module 1 is always unlocked
      if (m.id === 1) {
        return {
          ...m,
          locked: false,
          quizPassed: loadQuizScore(m.id) ? loadQuizScore(m.id).passed : false,
        }
      }

      // Other modules are unlocked if the previous one was passed
      const prevModuleQuiz = loadQuizScore(m.id - 1)
      return {
        ...m,
        locked: !prevModuleQuiz || !prevModuleQuiz.passed,
        quizPassed: loadQuizScore(m.id) ? loadQuizScore(m.id).passed : false,
      }
    })
    setModulesList(updatedModules)
  }, [])

  // Load code and reset history when module or active file changes
  useEffect(() => {
    if (currentModule) {
      const savedCode = loadModuleCode(currentModule)
      const initial = savedCode || modules.find(m => m.id === currentModule)?.initialCode || ''
      setCode(initial)
      setHistory([initial])
      setHistoryIndex(0)
    } else if (view === 'playground') {
      const activeCode = playgroundFiles[activeFile] || ''
      setCode(activeCode)
      setHistory([activeCode])
      setHistoryIndex(0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentModule, view, activeFile])

  // Reactive validation — runs on EVERY code change including folder uploads
  useEffect(() => {
    if (!code || (!activeFile.endsWith('.html') && !currentModule)) {
      setValidationError(null)
      setErrorLine(null)
      return
    }
    const error = validateHTMLStructure(code)
    setValidationError(error ? error.message : null)
    setErrorLine(error ? error.line : null)
  }, [code, activeFile, currentModule])

  // Auto-save code on every change
  const handleCodeChange = (newCode, skipHistory = false) => {
    setCode(newCode)

    if (currentModule) {
      saveModuleCode(currentModule, newCode)
    } else if (view === 'playground') {
      setPlaygroundFiles(prev => ({ ...prev, [activeFile]: newCode }))
    }

    if (!skipHistory) {
      const newHistory = history.slice(0, historyIndex + 1)
      newHistory.push(newCode)
      // Limit history to 50 steps
      if (newHistory.length > 50) newHistory.shift()
      setHistory(newHistory)
      setHistoryIndex(newHistory.length - 1)
    }
  }

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      const zip = new JSZip()
      let projName = 'MyCodeLab_Project'

      if (view === 'playground') {
        projName = 'MyCodeLab_Playground'
      } else {
        const foundModule = modulesList.find(m => m.id === currentModule)
        if (foundModule && foundModule.name) {
          projName = foundModule.name.replace(/\s+/g, '_')
        }
      }

      const projectName = projName

      if (view === 'playground') {
        Object.entries(playgroundFiles).forEach(([fileName, fileContent]) => {
          zip.file(fileName, fileContent)
        })
      } else {
        zip.file('index.html', code || '')
        // We don't have a separate CSS file in Quest mode usually, but if we did, we'd add it here.
      }

      const content = await zip.generateAsync({ type: 'blob' })
      saveAs(content, `${projectName}.zip`)

      setToastMessage('Success! Project downloaded 📥')
      setTimeout(() => setToastMessage(''), 3000)
    } catch (err) {
      console.error('Error downloading project:', err)
      setToastMessage('Error downloading project ❌')
      setTimeout(() => setToastMessage(''), 3000)
    } finally {
      setIsDownloading(false)
    }
  }

  const undo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1
      const prevCode = history[prevIndex]
      setHistoryIndex(prevIndex)
      setCode(prevCode)
      if (currentModule) {
        saveModuleCode(currentModule, prevCode)
      } else if (view === 'playground') {
        setPlaygroundFiles(prev => ({ ...prev, [activeFile]: prevCode }))
      }
      setValidationError(validateHTMLStructure(prevCode))
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1
      const nextCode = history[nextIndex]
      setHistoryIndex(nextIndex)
      setCode(nextCode)
      if (currentModule) {
        saveModuleCode(currentModule, nextCode)
      } else if (view === 'playground') {
        setPlaygroundFiles(prev => ({ ...prev, [activeFile]: nextCode }))
      }
      setValidationError(validateHTMLStructure(nextCode))
    }
  }

  const clearCode = () => {
    setShowClearModal(true)
  }

  const handleConfirmClear = () => {
    handleCodeChange('')
    setShowClearModal(false)
  }

  // Handle file deletion in playground
  const handleDeleteFile = (fileName, e) => {
    e.stopPropagation(); // Prevent tab switching when clicking delete

    // Prevent deletion of the last file
    const fileCount = Object.keys(playgroundFiles).length;
    if (fileCount <= 1) {
      setPgModal({
        isOpen: true,
        type: 'alert',
        title: 'Oops! 🏠',
        message: 'You need at least one file in your playground!',
        onConfirm: () => setPgModal(prev => ({ ...prev, isOpen: false })),
        onCancel: () => setPgModal(prev => ({ ...prev, isOpen: false }))
      });
      return;
    }

    setPgModal({
      isOpen: true,
      type: 'confirm',
      title: 'Wait! 🗑️',
      message: `Are you sure you want to delete ${fileName}?`,
      onConfirm: () => {
        const updatedFiles = { ...playgroundFiles };
        delete updatedFiles[fileName];
        setPlaygroundFiles(updatedFiles);

        if (activeFile === fileName) {
          const remainingFiles = Object.keys(updatedFiles);
          const nextFile = remainingFiles.includes('index.html') ? 'index.html' : remainingFiles[0];
          setActiveFile(nextFile);
        }
        setPgModal(prev => ({ ...prev, isOpen: false }));
      },
      onCancel: () => setPgModal(prev => ({ ...prev, isOpen: false }))
    });
  };

  // Handle tag and character insertion
  const handleInsertTag = (tagContent, cursorPos = null, isCharacter = false) => {
    const textarea = document.querySelector('.code-editor');
    const actualCursorPos = cursorPos !== null ? cursorPos : (textarea ? textarea.selectionStart : code.length);

    // Check if character insertion is valid (must be inside <body>)
    if (isCharacter) {
      if (!isInsideBody(code, actualCursorPos)) {
        setCustomTourStep({
          target: textarea ? '.code-editor' : 'body',
          placement: 'center',
          content: (
            <div className="tour-step-content">
              <div className="tour-character">🤖</div>
              <h3>Oops! 🙊</h3>
              <p>Characters love to play inside the <strong>Body</strong>! Move your cursor there to add them.</p>
            </div>
          ),
        });
        setShowTourGuide(true);
        return;
      }
    }

    let insertText = tagContent;
    const CURSOR_MARKER = '__CURSOR_POSITION__';

    // Logic for tags vs characters/snippets
    if (tagContent.startsWith('<') && !tagContent.startsWith('</') && !tagContent.includes('/>') && !isCharacter && !tagContent.includes('img') && !tagContent.includes('!DOCTYPE')) {
      const tagNameMatch = tagContent.match(/<([^\s>]+)/);
      const tagName = tagNameMatch ? tagNameMatch[1] : '';

      const isStructureTag = ['html', 'head', 'body', 'ol', 'ul', 'div', 'section'].includes(tagName.toLowerCase());

      if (isStructureTag) {
        // Structural: Tag pair with nested, indented marker
        insertText = `${tagContent}\n${CURSOR_MARKER}\n</${tagName}>`;
      } else {
        // Other tags: Cursor inside the pair
        insertText = `${tagContent}${CURSOR_MARKER}</${tagName}>`;
      }
    } else {
      // Snippets, images, or closing tags: Cursor after the content
      insertText = tagContent + CURSOR_MARKER;
    }

    const tempCode = code.slice(0, actualCursorPos) + insertText + code.slice(actualCursorPos);
    const formattedWithMarker = formatHTML(tempCode);

    // Find the marker and clean it up
    const finalCursorPos = formattedWithMarker.indexOf(CURSOR_MARKER);
    const finalNewCode = formattedWithMarker.replace(CURSOR_MARKER, '');

    handleCodeChange(finalNewCode);

    // Re-focus and position the cursor
    setTimeout(() => {
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(finalCursorPos, finalCursorPos);
      }
    }, 50);
  }

  // Handle RUN button click success check
  const handleRunCheck = () => {
    // Auto-format the code when RUN is clicked
    const formattedCode = formatHTML(code);
    if (formattedCode !== code) {
      handleCodeChange(formattedCode);
    }

    if (view === 'playground') return; // No missions in playground

    if (!validationError) {
      const hasDoctype = /<!DOCTYPE html>/i.test(code);
      const hasHtml = /<html>/i.test(code) && /<\/html>/i.test(code);
      const hasHead = /<head>/i.test(code) && /<\/head>/i.test(code);
      const hasTitle = /<title>/i.test(code) && /<\/title>/i.test(code);
      const hasBody = /<body>/i.test(code) && /<\/body>/i.test(code);

      const skeletonComplete = hasDoctype && hasHtml && hasHead && hasTitle && hasBody;

      if (currentModule === 1 && skeletonComplete) {
        setShowSuccessMessage(true);
      } else if (currentModule === 2 && skeletonComplete) {
        const hasH1 = /<h1>/i.test(code) && /<\/h1>/i.test(code);
        const hasP = /<p>/i.test(code) && /<\/p>/i.test(code);
        const hasImg = /<img/i.test(code);

        if (hasH1 && hasP && hasImg) {
          setShowSuccessMessage(true);
        }
      }
    }
  }

  // Handle module selection
  const handleSelectModule = (moduleId) => {
    setCurrentModule(moduleId)
    setCustomTourStep(null)
    const savedCode = loadModuleCode(moduleId)
    const initial = savedCode || modules.find(m => m.id === moduleId)?.initialCode || ''

    setCode(initial)
    setHistory([initial])
    setHistoryIndex(0)

    if (!tourGuideSeen.has(moduleId)) {
      setShowTourGuide(true)
      const updated = new Set([...tourGuideSeen, moduleId])
      setTourGuideSeen(updated)
      localStorage.setItem('tourGuideSeen', JSON.stringify([...updated]))
    }
    setShowQuiz(false)
  }

  const handleBackToModules = () => {
    setCurrentModule(null)
    setShowQuiz(false)
    setShowSuccessMessage(false)
    setShowSkeletonSample(false)
  }

  const handleBackToHome = async () => {
    setView('home')
    setCurrentModule(null)
    setShowQuiz(false)
    setShowSuccessMessage(false)
    setShowSkeletonSample(false)
  }

  // Handle quiz completion
  const handleQuizComplete = (percentage, correct, total) => {
    saveQuizScore(currentModule, percentage, correct, total)

    if (percentage >= 70) {
      const updatedModules = markQuizPassed(currentModule, modulesList)

      if (currentModule < modules.length) {
        setModulesList(updatedModules.map((m) => {
          if (m.id === currentModule + 1) {
            return { ...m, locked: false }
          }
          return m
        }))
      } else {
        setModulesList(updatedModules)
      }

      setTimeout(() => {
        handleBackToModules()
      }, 3000)
    }
  }

  const handleQuizClose = () => {
    setShowQuiz(false)
  }

  // Render Home Screen
  if (view === 'home') {
    return <HomeScreen onStartQuest={() => setView('quest')} onStartPlayground={() => setView('playground')} />
  }

  // Render Module Selector (Quest view but no module selected)
  if (view === 'quest' && !currentModule) {
    return (
      <div className="view-container">
        <button className="back-to-home-btn" onClick={handleBackToHome}>🏠 Back to Home</button>
        <ModuleSelector currentModule={currentModule} onSelectModule={handleSelectModule} modules={modulesList} />
      </div>
    )
  }

  const activeModule = view === 'playground' ? null : modulesList.find((m) => m.id === currentModule)
  const isPlayground = view === 'playground'

  const handleUploadFolder = (filesObj) => {
    setPlaygroundFiles(prev => ({ ...prev, ...filesObj }))

    if (filesObj['index.html']) {
      setActiveFile('index.html')
      setCode(filesObj['index.html'])
    } else {
      const firstKey = Object.keys(filesObj)[0];
      if (firstKey) {
        setActiveFile(firstKey)
        setCode(filesObj[firstKey])
      }
    }
  }

  return (
    <>
      {showTourGuide && activeModule && (
        <TourGuide
          module={activeModule}
          studentName={studentName}
          customStep={customTourStep}
          onClose={() => {
            setShowTourGuide(false);
            setCustomTourStep(null);
          }}
        />
      )}

      {showQuiz && activeModule && <Quiz module={activeModule} onComplete={handleQuizComplete} onClose={handleQuizClose} />}

      {showGuide && <Guide onInsertTag={(tagContent) => setCode(prev => prev + '\n' + tagContent)} onClose={() => setShowGuide(false)} />}

      {/* TOP HEADER BAR */}
      <div className="app-header">
        <button className="back-button" id="back-to-modules-btn" onClick={isPlayground ? handleBackToHome : handleBackToModules}>
          ← {isPlayground ? 'Back to Home' : 'Back to Modules'}
        </button>
        <div className="theme-toggle-container" id="theme-toggle-btn">
          <ThemeToggle />
        </div>
        {!isPlayground && (
          <button className="quiz-button" id="take-quiz-btn" onClick={() => setShowQuiz(true)}>
            📝 Take Quiz
          </button>
        )}
      </div>

      <div className="editor-workspace-container">
        <div className="editor-top-row">
          <div className="panel panel-left" id="tag-library-panel">
            <h2 className="panel-title">📚 {isPlayground ? 'Playground Tags' : activeModule?.name}</h2>
            <TagLibrary
              onInsertTag={handleInsertTag}
              modules={modulesList}
              currentModuleId={isPlayground ? 100 : currentModule}
              isPlayground={isPlayground}
            />
          </div>
          <div className="panel panel-center" id="code-editor-panel">
            <h2 className="panel-title">
              ✏️ {isPlayground ? `Editor - ${activeFile}` : 'Code Editor'}
              <div className="editor-controls-group">
                <button className="toolbar-btn expand-btn" onClick={() => setExpandedEditor(true)} title="Expand editor to see all code">⛶ Expand</button>
                <button className="toolbar-btn" onClick={undo} disabled={historyIndex <= 0}>↩️ Undo</button>
                <button className="toolbar-btn" onClick={redo} disabled={historyIndex >= history.length - 1}>↪️ Redo</button>
                <button className="toolbar-btn clear-btn" onClick={clearCode}>🗑️ Clear</button>
                {!isPlayground && activeModule?.codingPlan && (
                  <button className="skeleton-toggle-btn toolbar-btn" onClick={() => setShowSkeletonSample(!showSkeletonSample)}>
                    {showSkeletonSample ? '🙈 Plan' : '📜 Plan'}
                  </button>
                )}
              </div>
            </h2>

            {isPlayground && (
              <div className="file-explorer-tab">
                {Object.keys(playgroundFiles).map(fileName => (
                  <div key={fileName} className="file-tab-container">
                    <button
                      className={`file-tab ${activeFile === fileName ? 'active' : ''}`}
                      onClick={() => setActiveFile(fileName)}
                    >
                      {fileName.endsWith('.html') ? '📄' : fileName.endsWith('.css') ? '🎨' : '⚡'} {fileName}
                    </button>
                    <button
                      className="delete-file-btn"
                      onClick={(e) => handleDeleteFile(fileName, e)}
                      title={`Delete ${fileName}`}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  className="file-tab add-file-btn"
                  onClick={() => {
                    setPgModal({
                      isOpen: true,
                      type: 'prompt',
                      title: 'New Magic File! ✨',
                      message: 'What should we call your new file?',
                      onConfirm: (name) => {
                        if (name && !playgroundFiles[name]) {
                          const ext = name.split('.').pop();
                          const defaultContent = ext === 'css' ? '/* New Styles */' : ext === 'js' ? '// New Logic' : '<!-- New HTML -->';
                          const updatedFiles = { ...playgroundFiles, [name]: defaultContent }
                          setPlaygroundFiles(updatedFiles)
                          setActiveFile(name)
                        }
                        setPgModal(prev => ({ ...prev, isOpen: false }));
                      },
                      onCancel: () => setPgModal(prev => ({ ...prev, isOpen: false }))
                    });
                  }}
                >
                  ➕ New File
                </button>
              </div>
            )}

            {showSkeletonSample && !isPlayground && activeModule?.codingPlan && (
              <div className="skeleton-sample-box">
                <strong>🏠 House Plan:</strong>
                <pre style={{ margin: '5px 0 0' }}>{activeModule.codingPlan}</pre>
              </div>
            )}
            <CodeEditor
              code={code}
              setCode={handleCodeChange}
              onInsertTag={handleInsertTag}
              fileName={activeFile}
              language={activeFile.split('.').pop()}
              errorLine={errorLine}
            />
          </div>
        </div>

        {/* FULLSCREEN EDITOR OVERLAY */}
        {expandedEditor && (
          <div className="fullscreen-editor-overlay" onClick={(e) => { if (e.target === e.currentTarget) setExpandedEditor(false) }}>
            <div className="fullscreen-editor-card">
              <div className="fullscreen-editor-header">
                <span>✏️ {isPlayground ? `Editor - ${activeFile}` : 'Code Editor'}</span>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button className="toolbar-btn" onClick={undo} disabled={historyIndex <= 0}>↩️ Undo</button>
                  <button className="toolbar-btn" onClick={redo} disabled={historyIndex >= history.length - 1}>↪️ Redo</button>
                  <button className="toolbar-btn clear-btn" onClick={clearCode}>🗑️ Clear</button>
                  <button className="toolbar-btn expand-btn" onClick={() => setExpandedEditor(false)} title="Close expanded view">✕ Close</button>
                </div>
              </div>
              {isPlayground && (
                <div className="file-explorer-tab" style={{ margin: '0 0 6px 0' }}>
                  {Object.keys(playgroundFiles).map(fileName => (
                    <div key={fileName} className="file-tab-container">
                      <button
                        className={`file-tab ${activeFile === fileName ? 'active' : ''}`}
                        onClick={() => setActiveFile(fileName)}
                      >
                        {fileName.endsWith('.html') ? '📄' : fileName.endsWith('.css') ? '🎨' : '⚡'} {fileName}
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="fullscreen-editor-body">
                <CodeEditor
                  code={code}
                  setCode={handleCodeChange}
                  onInsertTag={handleInsertTag}
                  fileName={activeFile}
                  language={activeFile.split('.').pop()}
                  errorLine={errorLine}
                />
              </div>
            </div>
          </div>
        )}

        {showSuccessMessage && !isPlayground && (
          <div className="success-overlay">
            <div className="success-card">
              <button className="close-success-btn" onClick={() => setShowSuccessMessage(false)}>✖️</button>
              <h2 style={{ fontSize: '30px' }}>🎉 Well Done!</h2>
              <p style={{ fontSize: '18px' }}>You built the perfect house skeleton!</p>
              <div style={{ fontSize: '50px', margin: '20px 0' }}>🏫🏆</div>
              <button className="quiz-button primary" onClick={() => { setShowQuiz(true); setShowSuccessMessage(false); }}>📝 Take the Quiz</button>
            </div>
          </div>
        )}

        <div className="editor-bottom-row">
          <div className="panel panel-right" id="live-preview-panel">
            {validationError ? (
              <div className="validation-error-container">
                <div className="validation-error-icon">🕵️‍♂️</div>
                <div className="validation-error-message">{validationError}</div>
                {errorLine && (
                  <button
                    className="error-goto-btn"
                    onClick={() => {
                      const textarea = document.querySelector('.code-editor');
                      if (!textarea) return;
                      const lines = code.split('\n');
                      let charPos = 0;
                      for (let i = 0; i < Math.min(errorLine - 1, lines.length); i++) {
                        charPos += lines[i].length + 1;
                      }
                      textarea.focus();
                      textarea.setSelectionRange(charPos, charPos + (lines[errorLine - 1] || '').length);
                      // Scroll the textarea to the line
                      const lineHeight = 22;
                      textarea.scrollTop = Math.max(0, (errorLine - 3) * lineHeight);
                    }}
                  >
                    📍 Show me the error!
                  </button>
                )}
                <p>Fix your code to see the magic happen!</p>
              </div>
            ) : (
              <LivePreview
                code={code}
                onRun={handleRunCheck}
                isPlayground={isPlayground}
                files={playgroundFiles}
                onDownload={handleDownload}
                isDownloading={isDownloading}
                onUploadFolder={isPlayground ? handleUploadFolder : undefined}
              />
            )}
          </div>
        </div>
      </div>

      <button className="help-fab" onClick={() => setShowGuide(true)}>❓</button>

      <ClearConfirmModal
        isOpen={showClearModal}
        onConfirm={handleConfirmClear}
        onCancel={() => setShowClearModal(false)}
      />

      <PlaygroundModal
        isOpen={pgModal.isOpen}
        type={pgModal.type}
        title={pgModal.title}
        message={pgModal.message}
        onConfirm={pgModal.onConfirm}
        onCancel={pgModal.onCancel}
      />

      {toastMessage && (
        <div style={{
          position: 'fixed', bottom: '20px', right: '20px',
          backgroundColor: toastMessage.includes('Error') ? '#ff4d4f' : '#4CAF50',
          color: 'white', padding: '15px 25px', borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 9999,
          fontWeight: 'bold', animation: 'slideIn 0.3s ease-out'
        }}>
          {toastMessage}
        </div>
      )}
    </>
  )
}

export default App
