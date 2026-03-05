function ErrorPanel({ errors, onShowError }) {
  if (!errors || errors.length === 0) {
    return null;
  }

  return (
    <div className="error-panel error">
      {errors.map((error, idx) => (
        <div key={idx} className="error-message">
          <span className="error-emoji">❌</span>
          <div className="error-content">
            <p className="error-text">{error.message}</p>
            {error.line && (
              <button className="error-link-button" onClick={() => onShowError(error.line)}>
                Show me →
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default ErrorPanel
