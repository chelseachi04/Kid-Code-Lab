import { useState, useRef, useEffect } from 'react'
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
import { modules } from './data/modules'
import { saveModuleCode, loadModuleCode, isModuleUnlocked, saveQuizScore, loadQuizScore, markQuizPassed, unlockModule } from './utils/storage'
import { validateHTMLStructure, isInsideBody } from './utils/codeValidator'
import { formatHTML } from './utils/formatter'
import './style.css'

function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('kidCodeEditor_theme') || 'light'
  })
  const [view, setView] = useState('home') // 'home', 'quest', 'playground'
  const [currentModule, setCurrentModule] = useState(null)

  // Set theme attribute on root element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('kidCodeEditor_theme', theme)
  }, [theme])

  const [showTourGuide, setShowTourGuide] = useState(false)
  const [showQuiz, setShowQuiz] = useState(false)
  const [showGuide, setShowGuide] = useState(false)
  const [code, setCode] = useState('')
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [validationError, setValidationError] = useState(null)
  const [customTourStep, setCustomTourStep] = useState(null)
  const [studentName, setStudentName] = useState('Explorer')
  const [modulesList, setModulesList] = useState(modules)
  const [showSkeletonSample, setShowSkeletonSample] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [showClearModal, setShowClearModal] = useState(false)
  const [tourGuideSeen, setTourGuideSeen] = useState(() => {
    try {
      const stored = localStorage.getItem('tourGuideSeen')
      return stored ? new Set(JSON.parse(stored)) : new Set()
    } catch {
      return new Set()
    }
  })

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

  // Load code and reset history when module changes
  useEffect(() => {
    if (currentModule) {
      const savedCode = loadModuleCode(currentModule)
      const initial = savedCode || modules.find(m => m.id === currentModule)?.initialCode || ''
      setCode(initial)
      setHistory([initial])
      setHistoryIndex(0)
    } else if (view === 'playground') {
      const savedPlayground = localStorage.getItem('playground_code') || ''
      setCode(savedPlayground)
      setHistory([savedPlayground])
      setHistoryIndex(0)
    }
  }, [currentModule, view])

  // Auto-save code on every change
  const handleCodeChange = (newCode, skipHistory = false) => {
    setCode(newCode)

    if (currentModule) {
      saveModuleCode(currentModule, newCode)
    } else if (view === 'playground') {
      localStorage.setItem('playground_code', newCode)
    }

    if (!skipHistory) {
      const newHistory = history.slice(0, historyIndex + 1)
      newHistory.push(newCode)
      // Limit history to 50 steps
      if (newHistory.length > 50) newHistory.shift()
      setHistory(newHistory)
      setHistoryIndex(newHistory.length - 1)
    }

    // Validate HTML structure
    const error = validateHTMLStructure(newCode)
    setValidationError(error)
  }

  const undo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1
      const prevCode = history[prevIndex]
      setHistoryIndex(prevIndex)
      setCode(prevCode)
      if (currentModule) saveModuleCode(currentModule, prevCode)
      else if (view === 'playground') localStorage.setItem('playground_code', prevCode)
      setValidationError(validateHTMLStructure(prevCode))
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1
      const nextCode = history[nextIndex]
      setHistoryIndex(nextIndex)
      setCode(nextCode)
      if (currentModule) saveModuleCode(currentModule, nextCode)
      else if (view === 'playground') localStorage.setItem('playground_code', nextCode)
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

  const handleBackToHome = () => {
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
              ✏️ {isPlayground ? 'Playground Editor' : 'Code Editor'}
              <div className="editor-controls-group">
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
            {showSkeletonSample && !isPlayground && activeModule?.codingPlan && (
              <div className="skeleton-sample-box">
                <strong>🏠 House Plan:</strong>
                <pre style={{ margin: '5px 0 0' }}>{activeModule.codingPlan}</pre>
              </div>
            )}
            <CodeEditor code={code} setCode={handleCodeChange} onInsertTag={handleInsertTag} />
          </div>
        </div>

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
                <p>Fix your code to see the magic happen!</p>
              </div>
            ) : (
              <LivePreview code={code} onRun={handleRunCheck} />
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
    </>
  )
}

export default App
