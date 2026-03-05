import { useState, useEffect } from 'react'
import Confetti from './Confetti'

function Quiz({ module, onComplete, onClose }) {
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [questions, setQuestions] = useState([])
  const [showConfetti, setShowConfetti] = useState(false)

  // Initialize with random questions from pool
  useEffect(() => {
    if (module.questionPool) {
      // Shuffle and select 5 random questions
      const shuffled = [...module.questionPool].sort(() => Math.random() - 0.5)
      const selected = shuffled.slice(0, 5)
      setQuestions(selected)
    }
  }, [module])

  const handleAnswer = (questionId, optionIndex) => {
    if (!submitted) {
      setAnswers({
        ...answers,
        [questionId]: optionIndex,
      })
    }
  }

  const handleSubmit = () => {
    let correct = 0
    questions.forEach((q) => {
      if (answers[q.id] === q.correct) {
        correct++
      }
    })

    const percentage = Math.round((correct / questions.length) * 100)
    setScore(percentage)
    setSubmitted(true)

    // Show confetti if passed
    if (percentage >= 70) {
      setShowConfetti(true)
    }

    // Call parent callback after a delay
    setTimeout(() => {
      onComplete(percentage, correct, questions.length)
    }, 2000)
  }

  const passed = score >= 70

  return (
    <div className="quiz-wrapper">
      {showConfetti && <Confetti />}
      <div className="quiz-content">
        {/* CLOSE BUTTON */}
        <button className="quiz-close-button" onClick={onClose} title="Exit quiz">
          ✕
        </button>

        <h2 className="quiz-title">🎯 Module {module.id} Quiz</h2>
        <p className="quiz-subtitle">Answer 5 random questions to unlock the next module!</p>

        {!submitted ? (
          <>
            <div className="quiz-questions">
              {questions.map((question, idx) => (
                <div key={question.id} className="quiz-question-block">
                  <p className="quiz-question-text">
                    <span className="quiz-question-number">{idx + 1}.</span> {question.question}
                  </p>
                  <div className="quiz-options">
                    {question.options.map((option, optIdx) => (
                      <label key={optIdx} className="quiz-option">
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={optIdx}
                          checked={answers[question.id] === optIdx}
                          onChange={() => handleAnswer(question.id, optIdx)}
                          disabled={submitted}
                        />
                        <span className="quiz-option-text">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button className="quiz-submit-button" onClick={handleSubmit}>
              Submit Quiz ✓
            </button>
          </>
        ) : (
          <div className={`quiz-result ${passed ? 'passed' : 'failed'}`}>
            <div className="quiz-result-emoji">{passed ? '🎉' : '😊'}</div>
            <h3 className="quiz-result-title">{passed ? 'You Passed! 🚀' : 'Keep Trying!'}</h3>
            <p className="quiz-result-score">
              You got <strong>{score}%</strong> correct!
            </p>
            <p className="quiz-result-message">
              {passed
                ? '🎊 You unlocked the next module! Amazing job!'
                : '💪 You need 70% to pass. Try again with new questions!'}
            </p>

            {!passed && (
              <button className="quiz-retry-button" onClick={onClose}>
                Try Again with New Questions →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Quiz
