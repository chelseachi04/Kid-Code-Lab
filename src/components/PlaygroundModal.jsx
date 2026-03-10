import React, { useState, useEffect } from 'react';

function PlaygroundModal({ isOpen, type, title, message, onConfirm, onCancel, defaultValue = '' }) {
    const [inputValue, setInputValue] = useState(defaultValue);

    useEffect(() => {
        if (isOpen) {
            setInputValue(defaultValue);
        }
    }, [isOpen, defaultValue]);

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (type === 'prompt') {
            onConfirm(inputValue);
        } else {
            onConfirm();
        }
    };

    const characterImg = type === 'alert' ? "/characters/download (2).jpg" : "/characters/download (1).jpg";

    return (
        <div className="modal-overlay">
            <div className={`pg-modal-card ${type}`}>
                <div className="pg-modal-content">
                    <div className="pg-modal-character">
                        <img src={characterImg} alt="Character" />
                    </div>
                    <div className="pg-modal-text">
                        <h2>{title}</h2>
                        <p>{message}</p>
                        {type === 'prompt' && (
                            <input
                                type="text"
                                className="pg-modal-input"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="e.g. style2.css"
                                autoFocus
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleConfirm();
                                    if (e.key === 'Escape') onCancel();
                                }}
                            />
                        )}
                    </div>
                </div>
                <div className="pg-modal-actions">
                    {type !== 'alert' && (
                        <button className="modal-btn cancel-btn" onClick={onCancel}>
                            Cancel
                        </button>
                    )}
                    <button className="modal-btn confirm-btn" onClick={handleConfirm}>
                        {type === 'alert' ? 'OK! 👍' : type === 'prompt' ? 'Create ✨' : 'Yes, do it! 🗑️'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PlaygroundModal;
