import { useState, useRef, useEffect } from 'react'
import { cssStyleGroups, cssRecipes } from '../data/styles'
import PlaygroundModal from './PlaygroundModal'
import { supabase } from '../utils/supabase'

const characters = [
  { name: 'Alvin', filename: 'Alvin.jpg' },
  { name: 'Bingo', filename: 'Bingo.jpg' },
  { name: 'Bluey', filename: 'Bluey.jpg' },
  { name: 'Dora', filename: 'Dora.jpg' },
  { name: 'Mario', filename: 'Mario.jpg' },
  { name: 'Marshall', filename: 'Marshall.jpg' },
  { name: 'Pikachu', filename: 'PIKACHU.jpg' },
  { name: 'Spongebob', filename: 'Spongbob.jpg' },
  { name: 'Sonic', filename: 'Sonic.png' },
  { name: 'Chase', filename: 'Chase.jpg' },
  { name: 'Skye', filename: 'Skye.jpg' }
];

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
  const imageUploadRef = useRef(null)
  const [isUploading, setIsUploading] = useState(false)
  const [userImages, setUserImages] = useState([])
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, path: null })

  useEffect(() => {
    fetchUserImages()
  }, [])

  const fetchUserImages = async () => {
    try {
      const { data, error } = await supabase.storage.from('student-images').list('uploads/')
      if (error) throw error

      if (data) {
        const validFiles = data.filter(f => f.name !== '.emptyFolderPlaceholder' && f.name !== '.keep')
        const images = validFiles.map(file => {
          const { data: urlData } = supabase.storage.from('student-images').getPublicUrl(`uploads/${file.name}`)
          return {
            name: file.name,
            url: urlData.publicUrl,
            path: `uploads/${file.name}`
          }
        })
        setUserImages(images.reverse())
      }
    } catch (err) {
      console.error('Error fetching images:', err)
    }
  }

  const handleDeleteUserImage = (path) => {
    setDeleteModal({ isOpen: true, path })
  }

  const confirmDeleteImage = async () => {
    const path = deleteModal.path
    if (!path) return

    try {
      const { error } = await supabase.storage.from('student-images').remove([path])
      if (error) throw error
      setUserImages(prev => prev.filter(img => img.path !== path))
    } catch (err) {
      console.error('Error deleting image:', err)
      alert('Failed to delete image.')
    } finally {
      setDeleteModal({ isOpen: false, path: null })
    }
  }

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

  const handlePersonalImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('student-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('student-images')
        .getPublicUrl(filePath);

      if (data && data.publicUrl) {
        // Optimistically add to UI list immediately
        setUserImages(prev => [{ name: fileName, url: data.publicUrl, path: filePath }, ...prev]);
        onInsertTag(`<img src="${data.publicUrl}" style="width: 300px; border-radius: 10px;">`, null, true);
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      if (imageUploadRef.current) {
        imageUploadRef.current.value = '';
      }
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

      {/* Delete Confirmation Modal */}
      <PlaygroundModal
        isOpen={deleteModal.isOpen}
        type="confirm"
        title="Wait! 🗑️"
        message="Are you sure you want to delete this image forever?"
        onConfirm={confirmDeleteImage}
        onCancel={() => setDeleteModal({ isOpen: false, path: null })}
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
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              ref={imageUploadRef}
              onChange={handlePersonalImageUpload}
            />
            <button
              className="character-card upload-own-btn"
              onClick={() => imageUploadRef.current && imageUploadRef.current.click()}
              title="Upload your own image!"
              disabled={isUploading}
              style={{ background: '#f0f8ff', border: '2px dashed #4CAF50' }}
            >
              <div className="character-icon" style={{ fontSize: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isUploading ? '⏳' : '📸'}
              </div>
              <span className="character-name">{isUploading ? 'Uploading...' : 'Upload Image'}</span>
            </button>

            {/* User Custom Uploaded Images */}
            {userImages.map((img) => (
              <div key={img.path} style={{ position: 'relative', display: 'inline-block' }}>
                <button
                  className="character-card"
                  onClick={() => onInsertTag(`<img src="${img.url}" alt="My Image" width="150" style="border-radius: 10px;">`, null, true)}
                  title={`Add your uploaded image to the page!`}
                >
                  <img src={img.url} alt="Upload" className="character-icon" style={{ objectFit: 'cover' }} />
                  <span className="character-name" style={{ fontSize: '10px' }}>Custom</span>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDeleteUserImage(img.path); }}
                  style={{ position: 'absolute', top: '2px', right: '2px', background: '#ff4d4f', color: 'white', border: 'none', borderRadius: '50%', width: '22px', height: '22px', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', padding: 0 }}
                  title="Delete this image forever"
                >
                  ×
                </button>
              </div>
            ))}

            {/* Default Built-in Characters */}
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
