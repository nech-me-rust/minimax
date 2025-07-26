import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Menu, X, Globe } from 'lucide-react'

interface NavigationProps {
  currentSection: string
  onSectionChange: (section: string) => void
}

const Navigation: React.FC<NavigationProps> = ({ currentSection, onSectionChange }) => {
  const { t, i18n } = useTranslation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false)

  const toggleLanguage = () => {
    const newLang = i18n.language === 'cs' ? 'en' : 'cs'
    i18n.changeLanguage(newLang)
    setIsLanguageMenuOpen(false)
  }

  const navigationItems = [
    { key: 'home', label: t('nav.home') },
    { key: 'about', label: t('nav.about') },
    { key: 'animals', label: t('nav.animals') },
    { key: 'events', label: t('nav.events') },
    { key: 'volunteer', label: t('nav.volunteer') },
    { key: 'contact', label: t('nav.contact') },
  ]

  const handleNavClick = (section: string) => {
    onSectionChange(section)
    setIsMenuOpen(false)
  }

  return (
    <nav className="bg-emerald-900/95 backdrop-blur-sm text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => handleNavClick('home')}
          >
            <img 
              src="/images/logo-optimized.png" 
              alt="Nech mě růst" 
              className="h-12 w-12 object-contain"
            />
            <span className="font-bold text-xl tracking-wide text-white">
              {t('hero.title')}
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map(item => (
              <button
                key={item.key}
                onClick={() => handleNavClick(item.key)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-emerald-800 ${
                  currentSection === item.key ? 'bg-emerald-800 text-emerald-100' : 'text-emerald-100'
                }`}
              >
                {item.label}
              </button>
            ))}
            
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium hover:bg-emerald-800 transition-colors duration-200"
              >
                <Globe className="h-4 w-4" />
                <span>{i18n.language.toUpperCase()}</span>
              </button>
              
              {isLanguageMenuOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg py-1 z-10">
                  <button
                    onClick={toggleLanguage}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    {t('nav.language')}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
              className="p-2 rounded-md hover:bg-emerald-800"
            >
              <Globe className="h-5 w-5" />
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md hover:bg-emerald-800"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Language Menu */}
        {isLanguageMenuOpen && (
          <div className="md:hidden bg-emerald-800 rounded-md mt-2 py-2">
            <button
              onClick={toggleLanguage}
              className="block px-4 py-2 text-sm text-emerald-100 hover:bg-emerald-700 w-full text-left"
            >
              {t('nav.language')}
            </button>
          </div>
        )}

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-emerald-800 rounded-md mt-2">
              {navigationItems.map(item => (
                <button
                  key={item.key}
                  onClick={() => handleNavClick(item.key)}
                  className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors duration-200 hover:bg-emerald-700 ${
                    currentSection === item.key ? 'bg-emerald-700 text-emerald-100' : 'text-emerald-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navigation