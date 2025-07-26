import React, { useState, useEffect } from 'react'
import './i18n/config'

// Layout Components
import Navigation from './components/Layout/Navigation'
import Footer from './components/Layout/Footer'

// Section Components
import HeroSection from './components/Sections/HeroSection'
import AboutSection from './components/Sections/AboutSection'
import AnimalsSection from './components/Sections/AnimalsSection'
import EventsSection from './components/Sections/EventsSection'
import VolunteerSection from './components/Sections/VolunteerSection'
import ContactSection from './components/Sections/ContactSection'

function App() {
  const [currentSection, setCurrentSection] = useState('home')
  const [isScrolling, setIsScrolling] = useState(false)

  // Handle smooth scrolling to sections
  const handleSectionChange = (section: string) => {
    setCurrentSection(section)
    
    // Scroll to section
    const element = document.getElementById(section)
    if (element) {
      setIsScrolling(true)
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
      
      // Reset scrolling state after animation
      setTimeout(() => setIsScrolling(false), 1000)
    }
  }

  // Handle scroll detection for active section
  useEffect(() => {
    const handleScroll = () => {
      if (isScrolling) return // Don't update during programmatic scrolling
      
      const sections = ['home', 'about', 'animals', 'events', 'volunteer', 'contact']
      const scrollPosition = window.scrollY + 100 // Offset for navigation height
      
      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            if (currentSection !== section) {
              setCurrentSection(section)
            }
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [currentSection, isScrolling])

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navigation 
        currentSection={currentSection} 
        onSectionChange={handleSectionChange} 
      />
      
      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section id="home">
          <HeroSection onSectionChange={handleSectionChange} />
        </section>
        
        {/* About Section */}
        <section id="about">
          <AboutSection />
        </section>
        
        {/* Animals Section */}
        <section id="animals">
          <AnimalsSection />
        </section>
        
        {/* Events Section */}
        <section id="events">
          <EventsSection />
        </section>
        
        {/* Volunteer Section */}
        <section id="volunteer">
          <VolunteerSection />
        </section>
        
        {/* Contact Section */}
        <section id="contact">
          <ContactSection />
        </section>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}

export default App