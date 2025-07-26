import React from 'react'
import { useTranslation } from 'react-i18next'
import { Heart, Users, Calendar, ArrowRight } from 'lucide-react'

interface HeroSectionProps {
  onSectionChange: (section: string) => void
}

const HeroSection: React.FC<HeroSectionProps> = ({ onSectionChange }) => {
  const { t } = useTranslation()

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src="/images/hero-background.jpg" 
          alt="Czech countryside forest" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/70 via-emerald-800/50 to-emerald-700/60"></div>
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <div className="max-w-4xl mx-auto">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <img 
                src="/images/logo-optimized.png" 
                alt="Nech mě růst logo" 
                className="h-32 w-32 md:h-40 md:w-40 object-contain filter drop-shadow-2xl"
              />
              <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-emerald-400/20 to-emerald-600/20 opacity-50 blur-xl animate-pulse"></div>
            </div>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-wide">
            <span className="bg-gradient-to-r from-emerald-200 to-white bg-clip-text text-transparent drop-shadow-lg">
              {t('hero.title')}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl lg:text-2xl mb-12 text-emerald-100 leading-relaxed max-w-3xl mx-auto font-light drop-shadow-md">
            {t('hero.subtitle')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button
              onClick={() => onSectionChange('volunteer')}
              className="group bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center space-x-2"
            >
              <Heart className="h-5 w-5" />
              <span>{t('hero.cta.volunteer')}</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
            
            <button
              onClick={() => onSectionChange('events')}
              className="group bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 hover:border-white/50 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 backdrop-blur-sm flex items-center space-x-2"
            >
              <Calendar className="h-5 w-5" />
              <span>{t('hero.cta.visit')}</span>
            </button>
            
            <button
              onClick={() => onSectionChange('contact')}
              className="group bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 hover:border-white/50 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 backdrop-blur-sm flex items-center space-x-2"
            >
              <Users className="h-5 w-5" />
              <span>{t('hero.cta.donate')}</span>
            </button>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center backdrop-blur-sm bg-white/5 rounded-xl p-4">
              <div className="text-3xl md:text-4xl font-bold text-emerald-200 mb-2">15+</div>
              <div className="text-emerald-100 text-sm md:text-base">Rescued Animals</div>
            </div>
            <div className="text-center backdrop-blur-sm bg-white/5 rounded-xl p-4">
              <div className="text-3xl md:text-4xl font-bold text-emerald-200 mb-2">50+</div>
              <div className="text-emerald-100 text-sm md:text-base">Volunteers</div>
            </div>
            <div className="text-center backdrop-blur-sm bg-white/5 rounded-xl p-4">
              <div className="text-3xl md:text-4xl font-bold text-emerald-200 mb-2">3</div>
              <div className="text-emerald-100 text-sm md:text-base">Years Growing</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection