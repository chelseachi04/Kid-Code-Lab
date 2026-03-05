import { useRef } from 'react'

function MissionChecklist({ mission, checklist, moduleName }) {
    if (!mission || !checklist) return null;

    return (
        <div className="mission-checklist-container">
            <div className="mission-badge-header">
                <span className="mission-icon">🎯</span>
                <div className="mission-info">
                    <p className="mission-label">MISSION OBJECTIVE</p>
                    <h3 className="mission-title">{mission}</h3>
                </div>
            </div>

            <div className="checklist-items">
                {checklist.map((item, index) => (
                    <div key={index} className={`checklist-item ${item.completed ? 'completed' : ''}`}>
                        <span className="checkpoint-icon">{item.completed ? '✅' : '⬜'}</span>
                        <span className="checkpoint-text">{item.task}</span>
                    </div>
                ))}
            </div>

            <div className="mission-progress-bar">
                <div
                    className="progress-fill"
                    style={{ width: `${(checklist.filter(i => i.completed).length / checklist.length) * 100}%` }}
                ></div>
            </div>
        </div>
    )
}

export default MissionChecklist
