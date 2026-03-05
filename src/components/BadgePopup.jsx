import { useEffect, useState } from 'react'
import Confetti from './Confetti'

function BadgePopup({ badge, onClose }) {
    const [show, setShow] = useState(false)

    useEffect(() => {
        setShow(true)
        const timer = setTimeout(() => {
            // Auto-close after 5 seconds if not closed manually
            // onClose()
        }, 5000)
        return () => clearTimeout(timer)
    }, [onClose])

    return (
        <div className={`badge-popup-overlay ${show ? 'show' : ''}`}>
            <Confetti />
            <div className="badge-popup-content">
                <div className="badge-sparkles">✨🌟✨</div>
                <h2 className="badge-congrats">AMAZING JOB!</h2>
                <p className="badge-earned-text">You earned a new badge:</p>
                <div className="badge-display">
                    <div className="badge-icon">{badge.split(' ').pop()}</div>
                    <div className="badge-name">{badge}</div>
                </div>
                <button className="badge-close-btn" onClick={onClose}>
                    Awesome! 🚀
                </button>
            </div>
        </div>
    )
}

export default BadgePopup
