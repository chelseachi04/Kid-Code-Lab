import React from 'react';

function ClearConfirmModal({ isOpen, onConfirm, onCancel }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="clear-modal-card">
                <div className="clear-modal-content">
                    <div className="clear-modal-character">
                        <img src="/characters/download%20(2).jpg" alt="Worried friend" />
                    </div>
                    <div className="clear-modal-text">
                        <h2>Wait! 🗑️</h2>
                        <p>Do you really want to clear all your hard work?</p>
                    </div>
                </div>
                <div className="clear-modal-actions">
                    <button className="modal-btn cancel-btn" onClick={onCancel}>
                        No, Keep it! ✨
                    </button>
                    <button className="modal-btn confirm-btn" onClick={onConfirm}>
                        Yes, Clear it
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ClearConfirmModal;
