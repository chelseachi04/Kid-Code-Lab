import Joyride, { STATUS } from 'react-joyride'
import { useState } from 'react'

function TourGuide({ module, studentName, onClose, customStep }) {
  const [run, setRun] = useState(true)

  const steps = [
    {
      target: 'body',
      placement: 'center',
      content: (
        <div className="tour-step-content">
          <div className="tour-character">🤖</div>
          <h3>Hi {studentName}! 👋</h3>
          <p>Welcome to <strong>{module.name}</strong>! I'm your cartoon guide, and I'm so excited to help you "write magic" today!</p>
        </div>
      ),
      disableBeacon: true,
    },
    {
      target: '#back-to-modules-btn',
      content: (
        <div className="tour-step-content">
          <div className="tour-character">↩️</div>
          <h3>Pick a New Adventure</h3>
          <p>Want to try a different module? Click here to go back to the list!</p>
        </div>
      ),
    },
    {
      target: '#theme-toggle-btn',
      content: (
        <div className="tour-step-content">
          <div className="tour-character">🌓</div>
          <h3>Change the Vibe</h3>
          <p>Prefer a different look? Switch between <strong>Light</strong> and <strong>Dark</strong> mode here!</p>
        </div>
      ),
    },
    {
      target: '#take-quiz-btn',
      content: (
        <div className="tour-step-content">
          <div className="tour-character">📝</div>
          <h3>Show Off!</h3>
          <p>Ready to prove your skills? Click here to take the module quiz!</p>
        </div>
      ),
    },
    {
      target: '#tag-library-panel',
      content: (
        <div className="tour-step-content">
          <div className="tour-character">📚</div>
          <h3>Tag Library</h3>
          <p>This is your <strong>building block</strong> station! Pick any tag and it will jump right into your code.</p>
        </div>
      ),
    },
    {
      target: '#code-editor-panel',
      content: (
        <div className="tour-step-content">
          <div className="tour-character">✏️</div>
          <h3>Code Editor</h3>
          <p>This is where you <strong>write your magic</strong>! Mix and match tags to create anything you can imagine.</p>
        </div>
      ),
    },
    {
      target: '#live-preview-panel',
      content: (
        <div className="tour-step-content">
          <div className="tour-character">👀</div>
          <h3>Live Preview</h3>
          <p>Watch your <strong>creation come to life</strong> right here! Every change you make shows up instantly.</p>
        </div>
      ),
    },
  ]

  const handleJoyrideCallback = (data) => {
    const { status } = data
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRun(false)
      onClose()
    }
  }

  const activeSteps = customStep ? [customStep] : steps

  return (
    <Joyride
      steps={activeSteps}
      run={run}
      continuous={!customStep}
      showProgress={!customStep}
      showSkipButton={!customStep}
      callback={handleJoyrideCallback}
      styles={{
        options: {
          arrowColor: '#fff',
          backgroundColor: '#fff',
          overlayColor: 'rgba(0, 0, 0, 0.75)',
          primaryColor: '#6366f1',
          textColor: '#1f2937',
          zIndex: 10000,
        },
        tooltip: {
          borderRadius: '1.5rem',
          padding: '1.5rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        },
        buttonNext: {
          borderRadius: '9999px',
          padding: '0.75rem 1.5rem',
          fontWeight: '600',
        },
        buttonBack: {
          marginRight: '1rem',
          color: '#6b7280',
        },
        buttonSkip: {
          color: '#ef4444',
        }
      }}
    />
  )
}

export default TourGuide
