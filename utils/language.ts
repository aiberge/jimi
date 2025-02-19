'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export type Language = 'fr' | 'en' | 'ar'

export const languages: Language[] = ['fr', 'en', 'ar']

export const languageNames = {
  fr: 'Français',
  en: 'English',
  ar: 'العربية'
}

export function useLanguageSwitch() {
  const router = useRouter()
  const pathname = usePathname()
  const [currentLanguage, setCurrentLanguage] = useState<Language>('fr')

  // Initialize language on mount
  useEffect(() => {
    const segments = pathname.split('/')
    const urlLang = segments[1] as Language
    
    if (languages.includes(urlLang)) {
      setCurrentLanguage(urlLang)
    } else {
      // Try to get from localStorage
      const savedLang = localStorage.getItem('preferred-language') as Language
      if (savedLang && languages.includes(savedLang)) {
        setCurrentLanguage(savedLang)
        router.push(`/${savedLang}${pathname}`)
      } else {
        // If no language is set, redirect to French version
        router.push(`/fr${pathname}`)
      }
    }
  }, [])

  // Update document properties when language changes
  useEffect(() => {
    document.documentElement.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = currentLanguage
  }, [currentLanguage])

  const switchLanguage = (newLang: Language) => {
    if (currentLanguage === newLang) return

    // Save preference
    localStorage.setItem('preferred-language', newLang)
    setCurrentLanguage(newLang)

    // Get current path without language prefix
    const segments = pathname.split('/')
    const pathWithoutLang = segments.length > 2 ? `/${segments.slice(2).join('/')}` : '/'

    // Always include language prefix
    router.push(`/${newLang}${pathWithoutLang}`)
  }

  return {
    currentLanguage,
    switchLanguage
  }
}
