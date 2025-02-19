'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

type Language = 'fr' | 'en' | 'ar'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  isLoading: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [language, setLanguageState] = useState<Language>('fr')

  useEffect(() => {
    // Initialize language
    const getInitialLanguage = (): Language => {
      try {
        const savedLang = localStorage.getItem('preferred-language')
        if (savedLang && ['fr', 'en', 'ar'].includes(savedLang)) {
          return savedLang as Language
        }
        
        const browserLang = navigator.language.split('-')[0]
        if (['fr', 'en', 'ar'].includes(browserLang)) {
          return browserLang as Language
        }
      } catch (error) {
        console.error('Error getting initial language:', error)
      }
      return 'fr'
    }

    const initialLang = getInitialLanguage()
    setLanguageState(initialLang)
    setIsLoading(false)
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
    <LanguageContext.Provider value={{ language, setLanguage, isLoading }}>
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
