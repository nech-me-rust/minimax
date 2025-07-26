import React from 'react'
import { useTranslation } from 'react-i18next'
import { Heart, Mail, Phone, MapPin, Instagram, Facebook } from 'lucide-react'

const Footer: React.FC = () => {
  const { t } = useTranslation()

  return (
    <footer className="bg-emerald-900 text-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Mission */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="/images/logo-optimized.png" 
                alt="Nech mě růst" 
                className="h-16 w-16 object-contain"
              />
              <span className="font-bold text-2xl tracking-wide text-white">
                {t('hero.title')}
              </span>
            </div>
            <p className="text-emerald-200 leading-relaxed mb-4">
              {t('about.mission.text')}
            </p>
            <div className="flex items-center space-x-2 text-emerald-200">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-400" />
              <span>for nature and animals</span>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-white mb-4">{t('contact.info.title')}</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <MapPin className="h-5 w-5 text-emerald-300 mt-0.5 flex-shrink-0" />
                <span className="text-sm">
                  Nová ves u Leštiny 32<br />
                  Czech Republic
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-emerald-300" />
                <span className="text-sm">720 307 817</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-emerald-300" />
                <span className="text-sm">info@nechmerust.org</span>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-semibold text-white mb-4">{t('contact.social.title')}</h3>
            <div className="flex space-x-4">
              <a 
                href="https://instagram.com/nech_me_rust" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-emerald-800 rounded-full hover:bg-emerald-700 transition-colors duration-200"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://www.facebook.com/p/Nech-m%C4%9B-r%C5%AFst-100092573666339/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-emerald-800 rounded-full hover:bg-emerald-700 transition-colors duration-200"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
            
            <div className="mt-6">
              <p className="text-sm text-emerald-300">
                {t('volunteer.other.title')}
              </p>
              <div className="mt-2 space-y-1">
                <button className="block text-sm text-emerald-200 hover:text-white transition-colors duration-200">
                  {t('volunteer.donate')}
                </button>
                <button className="block text-sm text-emerald-200 hover:text-white transition-colors duration-200">
                  {t('volunteer.sponsor')}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-emerald-800 mt-8 pt-8 text-center">
          <p className="text-emerald-300 text-sm">
            © 2025 Nech mě růst z.s. All rights reserved. • Built with love for nature by MiniMax Agent
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer