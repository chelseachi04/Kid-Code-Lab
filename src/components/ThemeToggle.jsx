import { useState, useEffect } from 'react'

function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.getAttribute('data-theme') === 'dark'
  })

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          setIsDark(document.documentElement.getAttribute('data-theme') === 'dark')
        }
      })
    })

    observer.observe(document.documentElement, { attributes: true })
    return () => observer.disconnect()
  }, [])

  const handleThemeToggle = () => {
    const newTheme = !isDark ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('kidCodeEditor_theme', newTheme)
  }

  return (
    <button className="theme-toggle" onClick={handleThemeToggle} title={isDark ? 'Light Mode' : 'Dark Mode'}>
      {isDark ? '☀️ Light' : '🌙 Dark'}
    </button>
  )
}

export default ThemeToggle
