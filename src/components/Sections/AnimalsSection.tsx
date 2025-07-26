import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Heart, Calendar, Info } from 'lucide-react'
import { supabase, Animal } from '../../lib/supabase'

const AnimalsSection: React.FC = () => {
  const { t, i18n } = useTranslation()
  const [animals, setAnimals] = useState<Animal[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null)

  useEffect(() => {
    fetchAnimals()
  }, [])

  const fetchAnimals = async () => {
    try {
      const { data, error } = await supabase
        .from('animals')
        .select('*')
        .eq('status', 'sanctuary')
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) throw error
      setAnimals(data || [])
    } catch (error) {
      console.error('Error fetching animals:', error)
    } finally {
      setLoading(false)
    }
  }

  const getAnimalImage = (animal: Animal) => {
    if (animal.image_url) return animal.image_url
    
    // Fallback to local images based on animal name
    const imageMap: { [key: string]: string } = {
      'Luna': '/images/animals/luna-horse.jpg',
      'Bára': '/images/animals/bara-goat.jpg',
      'Pepík': '/images/animals/pepik-pig.jpg'
    }
    
    return imageMap[animal.name] || '/images/nature-texture.jpg'
  }

  const getLocalizedText = (animal: Animal, field: 'story' | 'personality') => {
    const csField = `${field}_cs` as keyof Animal
    const enField = `${field}_en` as keyof Animal
    
    if (i18n.language === 'en' && animal[enField]) {
      return animal[enField] as string
    }
    return (animal[csField] as string) || ''
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString(i18n.language === 'cs' ? 'cs-CZ' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <section className="py-20 bg-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-emerald-600">{t('common.loading')}</div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-emerald-900 mb-6">
            {t('animals.title')}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('animals.subtitle')}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 mx-auto mt-8"></div>
        </div>

        {/* Animals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {animals.map((animal) => (
            <div 
              key={animal.id}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden cursor-pointer"
              onClick={() => setSelectedAnimal(animal)}
            >
              {/* Animal Image */}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={getAnimalImage(animal)} 
                  alt={animal.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {animal.is_featured && (
                  <div className="absolute top-4 right-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                    <Heart className="h-4 w-4" />
                    <span>Featured</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              
              {/* Animal Info */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-emerald-900">{animal.name}</h3>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {animal.species}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  {animal.age_years && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t('animals.age')}:</span>
                      <span className="font-medium">{animal.age_years} {t('animals.years')}</span>
                    </div>
                  )}
                  {animal.gender && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t('animals.gender')}:</span>
                      <span className="font-medium">
                        {t(animal.gender === 'male' ? 'animals.male' : 'animals.female')}
                      </span>
                    </div>
                  )}
                  {animal.arrival_date && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t('animals.arrived')}:</span>
                      <span className="font-medium">{formatDate(animal.arrival_date)}</span>
                    </div>
                  )}
                </div>
                
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                  {getLocalizedText(animal, 'story')}
                </p>
                
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-emerald-600 text-sm font-medium">
                    <Info className="h-4 w-4" />
                    <span>{t('common.more')}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Animal Modal */}
        {selectedAnimal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="relative">
                {/* Close Button */}
                <button
                  onClick={() => setSelectedAnimal(null)}
                  className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white text-gray-700 p-2 rounded-full transition-colors duration-200"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                
                {/* Animal Image */}
                <div className="h-64 md:h-80 overflow-hidden rounded-t-2xl">
                  <img 
                    src={getAnimalImage(selectedAnimal)} 
                    alt={selectedAnimal.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Animal Details */}
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-3xl font-bold text-emerald-900">{selectedAnimal.name}</h3>
                    <div className="flex items-center space-x-3">
                      <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
                        {selectedAnimal.species}
                      </span>
                      {selectedAnimal.breed && (
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                          {selectedAnimal.breed}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-xl font-semibold text-emerald-900 mb-4">{t('animals.story')}</h4>
                      <p className="text-gray-700 leading-relaxed mb-6">
                        {getLocalizedText(selectedAnimal, 'story')}
                      </p>
                      
                      <h4 className="text-xl font-semibold text-emerald-900 mb-4">{t('animals.personality')}</h4>
                      <p className="text-gray-700 leading-relaxed">
                        {getLocalizedText(selectedAnimal, 'personality')}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-xl font-semibold text-emerald-900 mb-4">Details</h4>
                      <div className="space-y-3">
                        {selectedAnimal.age_years && (
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">{t('animals.age')}:</span>
                            <span className="font-medium">{selectedAnimal.age_years} {t('animals.years')}</span>
                          </div>
                        )}
                        {selectedAnimal.gender && (
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">{t('animals.gender')}:</span>
                            <span className="font-medium">
                              {t(selectedAnimal.gender === 'male' ? 'animals.male' : 'animals.female')}
                            </span>
                          </div>
                        )}
                        {selectedAnimal.arrival_date && (
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">{t('animals.arrived')}:</span>
                            <span className="font-medium">{formatDate(selectedAnimal.arrival_date)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default AnimalsSection