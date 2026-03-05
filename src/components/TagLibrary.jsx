import { useState } from 'react'

function TagLibrary({ onInsertTag, modules = [], currentModuleId, isPlayground = false }) {
  // Collect all tags from modules up to and including the current module
  const cumulativeTags = []
  const seenTags = new Set()

  modules.forEach(m => {
    // In playground, we show ALL tags from ALL modules
    if (isPlayground || m.id <= currentModuleId) {
      if (m.tags) {
        m.tags.forEach(tag => {
          if (!seenTags.has(tag.name)) {
            cumulativeTags.push(tag)
            seenTags.add(tag.name)
          }
        })
      }
    }
  })

  // State to track if sections are expanded
  const [showTags, setShowTags] = useState(true)
  const [showCharacters, setShowCharacters] = useState(false)

  const isModule1 = !isPlayground && Number(currentModuleId) === 1

  const handleDragStart = (e, tagName) => {
    e.dataTransfer.effectAllowed = 'copy'
    e.dataTransfer.setData('text/plain', tagName)
  }

  const characters = [
    { name: 'Alvin', filename: 'Alvin.jpg' },
    { name: 'Ben', filename: 'Ben.jpg' },
    { name: 'Bingo', filename: 'Bingo.jpg' },
    { name: 'Bluey', filename: 'Bluey.jpg' },
    { name: 'Lightning McQueen', filename: 'Cars Lightning McQueen.jpg' },
    { name: 'Chase', filename: 'Chase.jpg' },
    { name: 'Dora', filename: 'Dora.jpg' },
    { name: 'Duck', filename: 'Duck.jpg' },
    { name: 'James', filename: 'James.jpg' },
    { name: 'Judy Hopps', filename: 'Judy Hopps.jpg' },
    { name: 'Luigi', filename: 'Luigi.jpg' },
    { name: 'Mario (Happy)', filename: 'Mario!.jpg' },
    { name: 'Mario', filename: 'Mario.jpg' },
    { name: 'Mark', filename: 'Mark.jpg' },
    { name: 'Marshall', filename: 'Marshall.jpg' },
    { name: 'Nick', filename: 'Nick.jpg' },
    { name: 'PIKACHU', filename: 'PIKACHU.jpg' },
    { name: 'Panda', filename: 'Panda.jpg' },
    { name: 'Patrick Star', filename: 'Patrick.jpg' },
    { name: 'Paul', filename: 'Paul.jpg' },
    { name: 'Peter', filename: 'Peter.jpg' },
    { name: 'Pup Wall Decal', filename: 'Pup Wall Decal.jpg' },
    { name: 'Rider', filename: 'Rider.jpg' },
    { name: 'Rita', filename: 'Rita.jpg' },
    { name: 'Rocky', filename: 'rocky.jpg' },
    { name: 'Rubble', filename: 'Rubble.jpg' },
    { name: 'Simon', filename: 'Simon.jpg' },
    { name: 'Skye', filename: 'Skye.jpg' },
    { name: 'Sonic', filename: 'Sonic.png' },
    { name: 'SpongeBob', filename: 'Spongbob.jpg' },
    { name: 'Tanjiro', filename: 'Tanjiro.jpg' },
    { name: 'Theodore', filename: 'Theodore.jpg' },
    { name: 'Toad', filename: 'Toad.jpg' },
    { name: 'Tom', filename: 'Tom.jpg' },
    { name: 'Tracker', filename: 'Tracker.jpg' },
    { name: 'Zuma', filename: 'Zuma.jpg' },
    { name: 'Mystery Friend', filename: 'download (2).jpg' },
  ]

  return (
    <div className="tag-library">
      <div className="tag-module-section">
        <button
          className="tag-module-header"
          onClick={() => setShowTags(!showTags)}
          title={showTags ? 'Collapse' : 'Expand'}
        >
          <span className="module-folder-icon">
            {showTags ? '📂' : '📁'}
          </span>
          <span className="module-name">Available Tags</span>
          <span className="tag-count">({cumulativeTags.length})</span>
        </button>

        {showTags && (
          <div className="tag-module-content show">
            {cumulativeTags.map((tag) => (
              <button
                key={tag.name}
                className="tag-button"
                onClick={() => onInsertTag(tag.name)}
                draggable
                onDragStart={(e) => handleDragStart(e, tag.name)}
                title={`Click or drag to insert ${tag.name}`}
              >
                <span className="tag-emoji">{tag.emoji}</span>
                <span className="tag-name">{tag.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="tag-module-section">
        <button
          className="tag-module-header"
          onClick={() => setShowCharacters(!showCharacters)}
          disabled={isModule1}
          style={isModule1 ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
          title={isModule1 ? 'Complete Module 1 to unlock characters!' : (showCharacters ? 'Collapse' : 'Expand')}
        >
          <span className="module-folder-icon">
            {isModule1 ? '🔒' : (showCharacters ? '📂' : '📁')}
          </span>
          <span className="module-name">🌟 Character Gallery {isModule1 ? '(Locked)' : ''}</span>
        </button>
        {!isModule1 && showCharacters && (
          <div className="character-grid">
            {characters.map((char) => {
              const charPath = `/characters/${char.filename}`;
              return (
                <button
                  key={char.name}
                  className="character-card"
                  onClick={() => onInsertTag(`<img src="${charPath}" alt="${char.name}" width="150">`, null, true)}
                  title={`Add ${char.name} to your page!`}
                >
                  <img src={charPath} alt={char.name} className="character-icon" />
                  <span className="character-name">{char.name}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default TagLibrary
