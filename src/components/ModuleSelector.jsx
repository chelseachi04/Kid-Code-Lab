import ThemeToggle from './ThemeToggle'

function ModuleSelector({ currentModule, onSelectModule, modules }) {
  return (
    <div className="module-selector-wrapper">
      {/* THEME TOGGLE */}
      <div className="theme-toggle-container">
        <ThemeToggle />
      </div>

      <div className="module-selector-header">
        <h1 className="app-title">🎓 Code Learning Lab</h1>
        <p className="app-subtitle">Learn HTML by building cool things!</p>
      </div>

      <div className="modules-grid">
        {modules.map((module) => (
          <button
            key={module.id}
            className={`module-card ${currentModule === module.id ? 'active' : ''} ${module.locked ? 'locked' : ''}`}
            onClick={() => !module.locked && onSelectModule(module.id)}
            disabled={module.locked}
            title={module.locked ? '🔒 Unlock by completing the previous module!' : module.description}
          >
            <div className="module-card-content">
              <div className="module-emoji">{module.emoji}</div>
              <h2 className="module-name">Module {module.id}</h2>
              <p className="module-title">{module.name}</p>
              <p className="module-description">{module.description}</p>

              {module.locked && (
                <div className="lock-badge">
                  🔒 LOCKED
                </div>
              )}

              {module.quizPassed && (
                <div className="badge-passed">
                  ✅ PASSED
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default ModuleSelector
