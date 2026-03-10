// LOCALSTORAGE UTILITIES FOR KID LEARNING

const STORAGE_PREFIX = 'kidCodeEditor_'

// Save code for a specific module
export const saveModuleCode = (moduleId, code) => {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}module_${moduleId}_code`, code)
  } catch (e) {
    console.warn('Could not save to localStorage:', e)
  }
}

// Load code for a specific module
export const loadModuleCode = (moduleId) => {
  try {
    return localStorage.getItem(`${STORAGE_PREFIX}module_${moduleId}_code`) || ''
  } catch (e) {
    console.warn('Could not load from localStorage:', e)
    return ''
  }
}

// Save quiz score for a module
export const saveQuizScore = (moduleId, score, correct, total) => {
  try {
    const quizData = {
      moduleId,
      score, // percentage
      correct,
      total,
      timestamp: new Date().toISOString(),
      passed: score >= 70,
    }
    localStorage.setItem(`${STORAGE_PREFIX}module_${moduleId}_quiz`, JSON.stringify(quizData))
  } catch (e) {
    console.warn('Could not save quiz score:', e)
  }
}

// Load quiz score for a module
export const loadQuizScore = (moduleId) => {
  try {
    const data = localStorage.getItem(`${STORAGE_PREFIX}module_${moduleId}_quiz`)
    return data ? JSON.parse(data) : null
  } catch (e) {
    console.warn('Could not load quiz score:', e)
    return null
  }
}

// Check if module is unlocked (previous module quiz passed)
export const isModuleUnlocked = (moduleId) => {
  if (moduleId === 1) return true // First module always unlocked
  const prevModuleQuiz = loadQuizScore(moduleId - 1)
  return prevModuleQuiz && prevModuleQuiz.passed
}

// Update module in list
export const unlockModule = (moduleId, modules) => {
  return modules.map((m) => {
    if (m.id === moduleId) {
      return { ...m, locked: false }
    }
    return m
  })
}

// Mark quiz as passed
export const markQuizPassed = (moduleId, modules) => {
  return modules.map((m) => {
    if (m.id === moduleId) {
      return { ...m, quizPassed: true }
    }
    return m
  })
}

// Get all progress
export const getAllProgress = () => {
  try {
    const progress = {
      completedModules: [],
      scores: {},
    }

    for (let i = 1; i <= 10; i++) {
      const score = loadQuizScore(i)
      if (score) {
        progress.scores[i] = score
        if (score.passed) {
          progress.completedModules.push(i)
        }
      }
    }

    return progress
  } catch (e) {
    console.warn('Could not get progress:', e)
    return { completedModules: [], scores: {} }
  }
}

// SUPABASE STORAGE PREPARATION (Placeholders)
// Project: chelseachi04's Project

export const saveFilesToSupabase = async (projectId, files) => {
  console.log(`[Supabase] Saving files for project ${projectId}:`, files)
  // TODO: Implement actual Supabase storage logic here
  // const { data, error } = await supabase.storage.from('projects').upload(...)
  return { success: true }
}

export const loadFilesFromSupabase = async (projectId) => {
  console.log(`[Supabase] Loading files for project ${projectId}`)
  // TODO: Implement actual Supabase retrieval logic here
  // const { data, error } = await supabase.storage.from('projects').download(...)
  return null
}

export const saveProjectMetadata = async (metadata) => {
  console.log('[Supabase] Saving project metadata:', metadata)
}
