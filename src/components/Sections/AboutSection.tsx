import React from 'react'
import { useTranslation } from 'react-i18next'
import { Leaf, Heart, Users, Recycle } from 'lucide-react'

const AboutSection: React.FC = () => {
  const { t } = useTranslation()

  const values = [
    {
      icon: Leaf,
      title: t('about.values.nature'),
      description: t('about.values.nature.desc'),
      color: 'text-emerald-600'
    },
    {
      icon: Heart,
      title: t('about.values.animals'),
      description: t('about.values.animals.desc'),
      color: 'text-red-500'
    },
    {
      icon: Users,
      title: t('about.values.community'),
      description: t('about.values.community.desc'),
      color: 'text-blue-600'
    },
    {
      icon: Recycle,
      title: t('about.values.sustainability'),
      description: t('about.values.sustainability.desc'),
      color: 'text-green-600'
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-emerald-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-emerald-900 mb-6">
            {t('about.title')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 mx-auto mb-8"></div>
        </div>

        {/* Mission Statement */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-200 rounded-full translate-y-12 -translate-x-12 opacity-30"></div>
          
          <div className="relative">
            <h3 className="text-2xl md:text-3xl font-bold text-emerald-900 mb-6 text-center">
              {t('about.mission')}
            </h3>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed text-center max-w-4xl mx-auto">
              {t('about.mission.text')}
            </p>
          </div>
        </div>

        {/* Values Grid */}
        <div className="mb-16">
          <h3 className="text-2xl md:text-3xl font-bold text-emerald-900 mb-12 text-center">
            {t('about.values.title')}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon
              return (
                <div 
                  key={index}
                  className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-emerald-100"
                >
                  <div className="text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className={`h-8 w-8 ${value.color}`} />
                    </div>
                    <h4 className="text-xl font-bold text-emerald-900 mb-3">
                      {value.title}
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Team/Community Photo */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
            <div className="p-8 md:p-12">
              <h3 className="text-2xl md:text-3xl font-bold text-emerald-900 mb-6">
                Growing Together
              </h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                Our homestead is more than just a place – it's a living example of how humans, animals, and nature can thrive together. Every day brings new growth, new friendships, and new opportunities to learn from each other.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Join us in creating a world where compassion, sustainability, and community come together to nurture all forms of life.
              </p>
            </div>
            <div className="h-64 lg:h-full">
              <img 
                src="/images/volunteers-working.jpg" 
                alt="Volunteers working together" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection