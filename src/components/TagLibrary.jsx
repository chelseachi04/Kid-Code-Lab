import { useState } from 'react'
import { cssStyleGroups, cssRecipes } from '../data/styles'
import PlaygroundModal from './PlaygroundModal'

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

  // New Tag Groups for Advanced Curriculum
  const advancedTagGroups = [
    {
      name: 'Formatting',
      emoji: '🖋️',
      tags: [
        { name: '<b>', emoji: 'B' },
        { name: '<strong>', emoji: '💪' },
        { name: '<i>', emoji: 'I' },
        { name: '<em>', emoji: '✨' },
        { name: '<mark>', emoji: '🖊️' },
        { name: '<small>', emoji: '🐜' },
        { name: '<sub>', emoji: '⬇️' },
        { name: '<sup>', emoji: '⬆️' },
        { name: '<span>', emoji: '📏' },
      ]
    },
    {
      name: 'Lists',
      emoji: '📋',
      tags: [
        { name: '<ol>', emoji: '🔢' },
        { name: '<ul>', emoji: '📝' },
        { name: '<li>', emoji: '✓' },
      ]
    },
    {
      name: 'Tables',
      emoji: '📊',
      tags: [
        { name: '<table>', emoji: '🧱' },
        { name: '<tr>', emoji: '➖' },
        { name: '<th>', emoji: '🔝' },
        { name: '<td>', emoji: '🔲' },
      ]
    },
    {
      name: 'Forms',
      emoji: '📝',
      tags: [
        { name: '<form>', emoji: '📥' },
        { name: '<input>', emoji: '⌨️' },
        { name: '<label>', emoji: '🏷️' },
      ]
    },
    {
      name: 'Advanced',
      emoji: '⚙️',
      tags: [
        { name: '<style>', emoji: '🎨' },
      ]
    }
  ]

  // State to track if sections are expanded
  const [showTags, setShowTags] = useState(true)
  const [showCharacters, setShowCharacters] = useState(false)
  const [expandedGroups, setExpandedGroups] = useState({})
  const [activeTab, setActiveTab] = useState('html') // 'html' or 'css'
  const [recipeModal, setRecipeModal] = useState({ isOpen: false, title: '', code: '' })

  const toggleGroup = (groupName) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }))
  }

  const isModule1 = !isPlayground && Number(currentModuleId) === 1

  const handleDragStart = (e, tagName) => {
    e.dataTransfer.effectAllowed = 'copy'
    e.dataTransfer.setData('text/plain', tagName)
  }

  const handleTagClick = (tagName) => {
    if (!isPlayground && cssRecipes[tagName]) {
      // Show recipe for Code Quest
      setRecipeModal({
        isOpen: true,
        title: cssRecipes[tagName].title,
        code: cssRecipes[tagName].code
      });
    } else {
      onInsertTag(tagName);
    }
  }

  return (
    <div className="tag-library">
      {/* Recipe Modal for Code Quest */}
      <PlaygroundModal
        isOpen={recipeModal.isOpen}
        type="alert"
        title={recipeModal.title}
        message={
          <div className="recipe-box">
            <p>Here's your professional recipe: 👨‍🍳</p>
            <pre className="recipe-code">{recipeModal.code}</pre>
            <p>Click OK to add this magic to your code!</p>
          </div>
        }
        onConfirm={() => {
          onInsertTag(recipeModal.code);
          setRecipeModal({ isOpen: false, title: '', code: '' });
        }}
        onCancel={() => setRecipeModal({ isOpen: false, title: '', code: '' })}
      />

      {!isPlayground ? (
        // Code Quest View: Show cumulative tags from modules + Styles if needed
        <div className="tag-module-section">
          <div className="quest-tag-tabs">
            <button
              className={`quest-tab ${activeTab === 'html' ? 'active' : ''}`}
              onClick={() => setActiveTab('html')}
            >
              🏠 HTML Tags
            </button>
            <button
              className={`quest-tab ${activeTab === 'css' ? 'active' : ''}`}
              onClick={() => setActiveTab('css')}
            >
              🎨 Styles
            </button>
          </div>

          <button
            className="tag-module-header"
            onClick={() => setShowTags(!showTags)}
            title={showTags ? 'Collapse' : 'Expand'}
          >
            <span className="module-folder-icon">
              {showTags ? '📂' : '📁'}
            </span>
            <span className="module-name">
              {activeTab === 'html' ? 'Available Tags' : 'Professional Styles'}
            </span>
            <span className="tag-count">
              ({activeTab === 'html' ? cumulativeTags.length : cssStyleGroups.reduce((acc, g) => acc + g.styles.length, 0)})
            </span>
          </button>

          {showTags && (
            <div className="tag-module-content show">
              {activeTab === 'html' ? (
                cumulativeTags.map((tag) => (
                  <button
                    key={tag.name}
                    className="tag-button"
                    onClick={() => handleTagClick(tag.name)}
                    draggable
                    onDragStart={(e) => handleDragStart(e, tag.name)}
                    title={`Click or drag to insert ${tag.name}`}
                  >
                    <span className="tag-emoji">{tag.emoji}</span>
                    <span className="tag-name">{tag.name}</span>
                  </button>
                ))
              ) : (
                cssStyleGroups.map(group => (
                  <div key={group.name} className="style-subgroup">
                    <div className="style-subgroup-title">{group.emoji} {group.name}</div>
                    {group.styles.map(style => (
                      <button
                        key={style.name}
                        className="tag-button css-style-btn"
                        onClick={() => handleTagClick(style.name)}
                        title={style.description}
                      >
                        <span className="tag-emoji">{style.emoji}</span>
                        <span className="tag-name">{style.name}</span>
                      </button>
                    ))}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      ) : (
        // Playground/Sandbox View: Show grouped tags
        <div className="playground-tags-container">
          <div className="playground-folders">
            {/* HTML FOLDER */}
            <div className="tag-module-section">
              <button
                className="tag-module-header main-folder"
                onClick={() => toggleGroup('html_main')}
              >
                <span className="module-folder-icon">
                  {expandedGroups['html_main'] ? '📂' : '📁'}
                </span>
                <span className="module-name">🌐 HTML Elements</span>
              </button>

              {expandedGroups['html_main'] && (
                <div className="nested-folders">
                  {advancedTagGroups.map((group) => (
                    <div key={group.name} className="tag-module-section">
                      <button
                        className="tag-module-header"
                        onClick={() => toggleGroup(group.name)}
                        title={expandedGroups[group.name] ? 'Collapse' : 'Expand'}
                      >
                        <span className="module-folder-icon">
                          {expandedGroups[group.name] ? '📂' : '📁'}
                        </span>
                        <span className="module-name">{group.emoji} {group.name}</span>
                        <span className="tag-count">({group.tags.length})</span>
                      </button>

                      {expandedGroups[group.name] && (
                        <div className="tag-module-content show">
                          {group.tags.map((tag) => (
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
                  ))}
                </div>
              )}
            </div>

            {/* CSS FOLDER */}
            <div className="tag-module-section">
              <button
                className="tag-module-header main-folder css-folder"
                onClick={() => toggleGroup('css_main')}
              >
                <span className="module-folder-icon">
                  {expandedGroups['css_main'] ? '📂' : '📁'}
                </span>
                <span className="module-name">🎨 Style Library</span>
              </button>

              {expandedGroups['css_main'] && (
                <div className="nested-folders">
                  {cssStyleGroups.map((group) => (
                    <div key={group.name} className="tag-module-section">
                      <button
                        className="tag-module-header"
                        onClick={() => toggleGroup(group.name)}
                        title={expandedGroups[group.name] ? 'Collapse' : 'Expand'}
                      >
                        <span className="module-folder-icon">
                          {expandedGroups[group.name] ? '📂' : '📁'}
                        </span>
                        <span className="module-name">{group.emoji} {group.name}</span>
                        <span className="tag-count">({group.styles.length})</span>
                      </button>

                      {expandedGroups[group.name] && (
                        <div className="tag-module-content show style-grid">
                          {group.styles.map((style) => (
                            <button
                              key={style.name}
                              className="tag-button style-card"
                              onClick={() => onInsertTag(style.name)}
                              title={style.description}
                            >
                              <span className="tag-emoji">{style.emoji}</span>
                              <span className="tag-name">{style.name}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
