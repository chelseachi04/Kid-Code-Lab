import { useEffect } from 'react'

function Confetti() {
  useEffect(() => {
    const confettiPieces = []

    // Create confetti pieces
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div')
      confetti.className = 'confetti-piece'
      confetti.style.left = Math.random() * 100 + '%'
      confetti.style.backgroundColor = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#FFD700', '#00FF00', '#FF6B6B'][
        Math.floor(Math.random() * 7)
      ]
      confetti.style.animation = `confetti-fall ${Math.random() * 2 + 2}s linear forwards`
      confetti.style.delay = Math.random() * 0.5 + 's'
      document.body.appendChild(confetti)
      confettiPieces.push(confetti)
    }

    // Clean up after animation
    const timeout = setTimeout(() => {
      confettiPieces.forEach((piece) => {
        piece.remove()
      })
    }, 4000)

    return () => clearTimeout(timeout)
  }, [])

  return null
}

export default Confetti
