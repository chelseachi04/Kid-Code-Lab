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
    { name: 'Alvin', url: '/characters/Alvin.jpg' },
    { name: 'Ben', url: '/characters/Ben.jpg' },
    { name: 'Bingo', url: '/characters/Bingo.jpg' },
    { name: 'Bluey', url: '/characters/Bluey.jpg' },
    { name: 'Cars Lightning McQueen', url: '/characters/Cars%20Lightning%20McQueen.jpg' },
    { name: 'Chase', url: '/characters/Chase.jpg' },
    { name: 'Dora', url: '/characters/Dora.jpg' },
    { name: 'Duck', url: '/characters/Duck.jpg' },
    { name: 'James', url: '/characters/James.jpg' },
    { name: 'Judy Hopps', url: '/characters/Judy%20Hopps.jpg' },
    { name: 'Luigi', url: '/characters/Luigi.jpg' },
    { name: 'Mario (Happy)', url: '/characters/Mario!.jpg' },
    { name: 'Mario', url: '/characters/Mario.jpg' },
    { name: 'Mark', url: '/characters/Mark.jpg' },
    { name: 'Marshall', url: '/characters/Marshall.jpg' },
    { name: 'Nick', url: '/characters/Nick.jpg' },
    { name: 'Panda', url: '/characters/Panda.jpg' },
    { name: 'Patrick', url: '/characters/Patrick.jpg' },
    { name: 'Paul', url: '/characters/Paul.jpg' },
    { name: 'Peter', url: '/characters/Peter.jpg' },
    { name: 'Pikachu', url: '/characters/PIKACHU.jpg' },
    { name: 'Pup Wall Decal', url: '/characters/Pup%20Wall%20Decal.jpg' },
    { name: 'Rider', url: '/characters/Rider.jpg' },
    { name: 'Rita', url: '/characters/Rita.jpg' },
    { name: 'Rocky', url: '/characters/rocky.jpg' },
    { name: 'Rubble', url: '/characters/Rubble.jpg' },
    { name: 'Simon', url: '/characters/Simon.jpg' },
    { name: 'Skye', url: '/characters/Skye.jpg' },
    { name: 'SpongeBob', url: '/characters/Spongbob.jpg' },
    { name: 'Tanjiro', url: '/characters/Tanjiro.jpg' },
    { name: 'Theodore', url: '/characters/Theodore.jpg' },
    { name: 'Toad', url: '/characters/Toad.jpg' },
    { name: 'Tom', url: '/characters/Tom.jpg' },
    { name: 'Tracker', url: '/characters/Tracker.jpg' },
    { name: 'Zuma', url: '/characters/Zuma.jpg' },
    { name: 'Mystery Friend', url: '/characters/download%20(2).jpg' },
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
            {characters.map((char) => (
              <button
                key={char.name}
                className="character-card"
                onClick={() => onInsertTag(`<img src="${char.url}" alt="${char.name}" width="150">`, null, true)}
                title={`Add ${char.name} to your page!`}
              >
                <img src={char.url} alt={char.name} className="character-icon" />
                <span className="character-name">{char.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default TagLibrary
