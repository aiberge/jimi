'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

export type Language = 'fr' | 'en' | 'ar'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  isInitialized: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('fr')
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    let mounted = true

    const initializeLanguage = () => {
      let selectedLang: Language = 'fr'

      try {
        // Try to get stored language
        const storedLang = localStorage.getItem('preferred-language')
        if (storedLang && ['fr', 'en', 'ar'].includes(storedLang)) {
          selectedLang = storedLang as Language
        } else {
          // Try to get browser language
          const browserLang = navigator.language.split('-')[0]
          if (['fr', 'en', 'ar'].includes(browserLang)) {
            selectedLang = browserLang as Language
          }
        }
      } catch (error) {
        console.error('Error accessing localStorage:', error)
      }

      if (mounted) {
        setLanguageState(selectedLang)
        document.documentElement.dir = selectedLang === 'ar' ? 'rtl' : 'ltr'
        document.documentElement.lang = selectedLang
        setIsInitialized(true)
      }
    }

    // Small delay to ensure proper hydration
    setTimeout(initializeLanguage, 0)

    return () => {
      mounted = false
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    try {
      localStorage.setItem('preferred-language', lang)
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
      document.documentElement.lang = lang
    } catch (error) {
      console.error('Error setting language:', error)
    }
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isInitialized }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
