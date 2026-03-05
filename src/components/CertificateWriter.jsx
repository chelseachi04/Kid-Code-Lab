import { useState } from 'react'

function CertificateWriter({ onNameSubmit }) {
    const [name, setName] = useState('')

    return (
        <div className="certificate-writer">
            <div className="cert-card">
                <h2>🏆 You Did It!</h2>
                <p>You have completed all 10 modules of the Code Learning Lab.</p>
                <p>Type your name below to see your certificate!</p>

                <input
                    type="text"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="cert-name-input"
                />

                {name && (
                    <div className="cert-preview">
                        <div className="cert-border">
                            <div className="cert-inner">
                                <h1 className="cert-header">CERTIFICATE</h1>
                                <p className="cert-sub">OF COMPLETION</p>
                                <p className="cert-awarded">This is awarded to</p>
                                <h2 className="cert-student-name">{name}</h2>
                                <p className="cert-desc">For mastering the basics of HTML at Code Learning Lab</p>
                                <div className="cert-footer">
                                    <span className="cert-date">{new Date().toLocaleDateString()}</span>
                                    <span className="cert-seal">🎖️</span>
                                </div>
                            </div>
                        </div>
                        <button className="download-btn" onClick={() => window.print()}>
                            🖨️ Print Certificate
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CertificateWriter
