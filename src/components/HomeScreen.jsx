import React from 'react';

function HomeScreen({ onStartQuest, onStartPlayground }) {
    return (
        <div className="home-screen-wrapper">
            <div className="home-screen-header">
                <h1 className="home-title">🚀 Kid Code Lab</h1>
                <p className="home-subtitle">Choose your adventure!</p>
            </div>

            <div className="home-grid">
                <button className="home-card quest" onClick={onStartQuest}>
                    <div className="home-card-emoji">🎓</div>
                    <div className="home-card-content">
                        <h2 className="home-card-title">Code Quest</h2>
                        <p className="home-card-desc">Follow the path to become a coding master!</p>
                    </div>
                    <div className="home-card-action">Start Learning →</div>
                </button>

                <button className="home-card playground" onClick={onStartPlayground}>
                    <div className="home-card-emoji">🎨</div>
                    <div className="home-card-content">
                        <h2 className="home-card-title">Code Editor</h2>
                        <p className="home-card-desc">Practice your skills in a free sandbox!</p>
                    </div>
                    <div className="home-card-action">Go to Sandbox →</div>
                </button>
            </div>
        </div>
    );
}

export default HomeScreen;
