import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Calendar, Clock, MapPin, Users, DollarSign, CalendarDays, X, Send } from 'lucide-react'
import { supabase, Event, EventRegistration } from '../../lib/supabase'

const EventsSection: React.FC = () => {
  const { t, i18n } = useTranslation()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [showRegistrationModal, setShowRegistrationModal] = useState(false)
  const [registrationData, setRegistrationData] = useState<Partial<EventRegistration>>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    age: undefined,
    dietary_restrictions: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    special_requests: '',
    preferred_language: i18n.language
  })
  const [registrationLoading, setRegistrationLoading] = useState(false)
  const [registrationSuccess, setRegistrationSuccess] = useState(false)
  const [registrationError, setRegistrationError] = useState('')

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'active')
        .gte('start_date', new Date().toISOString())
        .order('start_date', { ascending: true })

      if (error) throw error
      setEvents(data || [])
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const getEventImage = (event: Event) => {
    if (event.image_url) return event.image_url
    
    // Fallback to local images based on event type
    const imageMap: { [key: string]: string } = {
      'workshop': '/images/workshop-indoor.jpg',
      'open_day': '/images/events/open-day.jpg',
      'permaculture': '/images/events/permaculture-workshop.JPG',
      'cosmetics': '/images/events/cosmetics-workshop.jpg'
    }
    
    // Check if event title contains specific keywords
    const title = (i18n.language === 'en' ? event.title_en : event.title_cs).toLowerCase()
    if (title.includes('permak') || title.includes('zahrad')) {
      return imageMap['permaculture']
    }
    if (title.includes('kosmetik') || title.includes('cosmetic')) {
      return imageMap['cosmetics']
    }
    if (title.includes('otevřen') || title.includes('open')) {
      return imageMap['open_day']
    }
    
    return imageMap[event.event_type] || imageMap['workshop']
  }

  const getLocalizedText = (event: Event, field: 'title' | 'description') => {
    const csField = `${field}_cs` as keyof Event
    const enField = `${field}_en` as keyof Event
    
    if (i18n.language === 'en' && event[enField]) {
      return event[enField] as string
    }
    return (event[csField] as string) || ''
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(i18n.language === 'cs' ? 'cs-CZ' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString(i18n.language === 'cs' ? 'cs-CZ' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatPrice = (price: number) => {
    if (price === 0) return t('events.free')
    return `${price.toLocaleString(i18n.language === 'cs' ? 'cs-CZ' : 'en-US')} Kč`
  }

  const isRegistrationOpen = (event: Event) => {
    if (!event.registration_required) return false
    if (!event.registration_deadline) return true
    return new Date(event.registration_deadline) > new Date()
  }

  const getAvailableSpots = (event: Event) => {
    if (!event.max_participants) return null
    return event.max_participants - event.current_participants
  }

  const handleRegistrationInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setRegistrationData(prev => ({
      ...prev,
      [name]: name === 'age' ? (value ? parseInt(value) : undefined) : value
    }))
  }

  const validateRegistrationForm = () => {
    if (!registrationData.first_name || !registrationData.last_name || !registrationData.email) {
      setRegistrationError('Please fill in all required fields')
      return false
    }
    if (registrationData.email && !/\S+@\S+\.\S+/.test(registrationData.email)) {
      setRegistrationError('Please enter a valid email address')
      return false
    }
    return true
  }

  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedEvent || !validateRegistrationForm()) return
    
    setRegistrationLoading(true)
    setRegistrationError('')
    
    try {
      const response = await supabase.functions.invoke('process-event-registration', {
        body: {
          ...registrationData,
          event_id: selectedEvent.id
        }
      })
      
      if (response.error) {
        throw response.error
      }
      
      setRegistrationSuccess(true)
      setShowRegistrationModal(false)
      
      // Refresh events to update participant count
      fetchEvents()
      
      // Reset form
      setRegistrationData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        age: undefined,
        dietary_restrictions: '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        special_requests: '',
        preferred_language: i18n.language
      })
    } catch (error: any) {
      console.error('Registration error:', error)
      setRegistrationError(error.message || 'Registration failed. Please try again.')
    } finally {
      setRegistrationLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-emerald-600">{t('common.loading')}</div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-emerald-900 mb-6">
            {t('events.title')}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('events.subtitle')}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 mx-auto mt-8"></div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => {
            const availableSpots = getAvailableSpots(event)
            const registrationOpen = isRegistrationOpen(event)
            
            return (
              <div 
                key={event.id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100"
              >
                {/* Event Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={getEventImage(event)} 
                    alt={getLocalizedText(event, 'title')}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  
                  {/* Event Type Badge */}
                  <div className="absolute top-4 left-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold capitalize">
                    {event.event_type.replace('_', ' ')}
                  </div>
                  
                  {/* Price Badge */}
                  <div className="absolute top-4 right-4 bg-white/90 text-emerald-900 px-3 py-1 rounded-full text-sm font-bold">
                    {formatPrice(event.price)}
                  </div>
                </div>
                
                {/* Event Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-emerald-900 mb-3 line-clamp-2">
                    {getLocalizedText(event, 'title')}
                  </h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-gray-600 text-sm">
                      <CalendarDays className="h-4 w-4 flex-shrink-0" />
                      <span>{formatDate(event.start_date)}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-gray-600 text-sm">
                      <Clock className="h-4 w-4 flex-shrink-0" />
                      <span>
                        {formatTime(event.start_date)}
                        {event.end_date && ` - ${formatTime(event.end_date)}`}
                      </span>
                    </div>
                    
                    {event.location && (
                      <div className="flex items-center space-x-2 text-gray-600 text-sm">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                    )}
                    
                    {event.max_participants && (
                      <div className="flex items-center space-x-2 text-gray-600 text-sm">
                        <Users className="h-4 w-4 flex-shrink-0" />
                        <span>
                          {event.current_participants}/{event.max_participants} {t('events.participants')}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                    {getLocalizedText(event, 'description')}
                  </p>
                  
                  {/* Registration Info */}
                  <div className="space-y-3">
                    {event.registration_deadline && (
                      <div className="text-xs text-gray-500">
                        {t('events.deadline')}: {formatDate(event.registration_deadline)}
                      </div>
                    )}
                    
                    {availableSpots !== null && availableSpots <= 3 && availableSpots > 0 && (
                      <div className="text-sm text-orange-600 font-medium">
                        Only {availableSpots} spots left!
                      </div>
                    )}
                    
                    <button
                      onClick={() => {
                        if (event.registration_required && registrationOpen && (availableSpots === null || availableSpots > 0)) {
                          setSelectedEvent(event)
                          setShowRegistrationModal(true)
                        } else {
                          setSelectedEvent(event)
                        }
                      }}
                      disabled={!registrationOpen || (availableSpots !== null && availableSpots <= 0)}
                      className={`w-full py-2 px-4 rounded-lg font-semibold text-sm transition-colors duration-200 ${
                        !registrationOpen || (availableSpots !== null && availableSpots <= 0)
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700'
                      }`}
                    >
                      {!registrationOpen ? 'Registration Closed' : 
                       availableSpots !== null && availableSpots <= 0 ? 'Sold Out' :
                       event.registration_required ? t('events.register') : t('common.more')}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        
        {events.length === 0 && (
          <div className="text-center py-16">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No upcoming events</h3>
            <p className="text-gray-500">Check back soon for new workshops and events!</p>
          </div>
        )}

        {/* Event Details Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="relative">
                {/* Close Button */}
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white text-gray-700 p-2 rounded-full transition-colors duration-200"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                
                {/* Event Image */}
                <div className="h-64 md:h-80 overflow-hidden rounded-t-2xl">
                  <img 
                    src={getEventImage(selectedEvent)} 
                    alt={getLocalizedText(selectedEvent, 'title')}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Event Details */}
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <h3 className="text-3xl font-bold text-emerald-900 flex-1">
                      {getLocalizedText(selectedEvent, 'title')}
                    </h3>
                    <div className="ml-4 text-right">
                      <div className="text-2xl font-bold text-emerald-600">
                        {formatPrice(selectedEvent.price)}
                      </div>
                      {selectedEvent.max_participants && (
                        <div className="text-sm text-gray-500">
                          {selectedEvent.current_participants}/{selectedEvent.max_participants} {t('events.participants')}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-xl font-semibold text-emerald-900 mb-4">Event Details</h4>
                      <p className="text-gray-700 leading-relaxed mb-6">
                        {getLocalizedText(selectedEvent, 'description')}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-xl font-semibold text-emerald-900 mb-4">Information</h4>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <CalendarDays className="h-5 w-5 text-emerald-600 mt-0.5" />
                          <div>
                            <div className="font-medium">{formatDate(selectedEvent.start_date)}</div>
                            <div className="text-sm text-gray-500">
                              {formatTime(selectedEvent.start_date)}
                              {selectedEvent.end_date && ` - ${formatTime(selectedEvent.end_date)}`}
                            </div>
                          </div>
                        </div>
                        
                        {selectedEvent.location && (
                          <div className="flex items-start space-x-3">
                            <MapPin className="h-5 w-5 text-emerald-600 mt-0.5" />
                            <div className="font-medium">{selectedEvent.location}</div>
                          </div>
                        )}
                        
                        {selectedEvent.registration_deadline && (
                          <div className="flex items-start space-x-3">
                            <Clock className="h-5 w-5 text-emerald-600 mt-0.5" />
                            <div>
                              <div className="font-medium">{t('events.deadline')}</div>
                              <div className="text-sm text-gray-500">
                                {formatDate(selectedEvent.registration_deadline)}
                              </div>
                            </div>
                          </div>
                        )}
                        
                        <div className="pt-4">
                          <button
                            disabled={!isRegistrationOpen(selectedEvent) || (getAvailableSpots(selectedEvent) !== null && getAvailableSpots(selectedEvent)! <= 0)}
                            className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors duration-200 ${
                              !isRegistrationOpen(selectedEvent) || (getAvailableSpots(selectedEvent) !== null && getAvailableSpots(selectedEvent)! <= 0)
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-emerald-600 text-white hover:bg-emerald-700'
                            }`}
                          >
                            {!isRegistrationOpen(selectedEvent) ? 'Registration Closed' : 
                             getAvailableSpots(selectedEvent) !== null && getAvailableSpots(selectedEvent)! <= 0 ? 'Sold Out' :
                             selectedEvent.registration_required ? t('events.register') : 'Get More Info'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Registration Modal */}
        {showRegistrationModal && selectedEvent && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="relative">
                {/* Close Button */}
                <button
                  onClick={() => {
                    setShowRegistrationModal(false)
                    setRegistrationError('')
                  }}
                  className="absolute top-4 right-4 z-10 bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-full transition-colors duration-200"
                >
                  <X className="h-6 w-6" />
                </button>
                
                {/* Header */}
                <div className="bg-emerald-600 text-white p-6 rounded-t-2xl">
                  <h3 className="text-2xl font-bold mb-2">{t('events.register')}</h3>
                  <p className="text-emerald-100">{getLocalizedText(selectedEvent, 'title')}</p>
                  <p className="text-emerald-200 text-sm">
                    {formatDate(selectedEvent.start_date)} • {formatPrice(selectedEvent.price)}
                  </p>
                </div>
                
                {/* Registration Form */}
                <form onSubmit={handleRegistrationSubmit} className="p-6">
                  {registrationError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                      <p className="text-red-600">{registrationError}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="first_name"
                        value={registrationData.first_name}
                        onChange={handleRegistrationInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="last_name"
                        value={registrationData.last_name}
                        onChange={handleRegistrationInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={registrationData.email}
                        onChange={handleRegistrationInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={registrationData.phone}
                        onChange={handleRegistrationInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={registrationData.age || ''}
                      onChange={handleRegistrationInputChange}
                      min="1"
                      max="120"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dietary Restrictions
                    </label>
                    <textarea
                      name="dietary_restrictions"
                      value={registrationData.dietary_restrictions}
                      onChange={handleRegistrationInputChange}
                      rows={2}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Any dietary restrictions or allergies..."
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Emergency Contact Name
                      </label>
                      <input
                        type="text"
                        name="emergency_contact_name"
                        value={registrationData.emergency_contact_name}
                        onChange={handleRegistrationInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Emergency Contact Phone
                      </label>
                      <input
                        type="tel"
                        name="emergency_contact_phone"
                        value={registrationData.emergency_contact_phone}
                        onChange={handleRegistrationInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Special Requests
                    </label>
                    <textarea
                      name="special_requests"
                      value={registrationData.special_requests}
                      onChange={handleRegistrationInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Any special requests or questions..."
                    />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowRegistrationModal(false)
                        setRegistrationError('')
                      }}
                      className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-600 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    
                    <button
                      type="submit"
                      disabled={registrationLoading}
                      className="flex-1 bg-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-emerald-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {registrationLoading ? (
                        <span>Registering...</span>
                      ) : (
                        <>
                          <Send className="h-5 w-5" />
                          <span>{t('events.register')}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Registration Success Modal */}
        {registrationSuccess && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-emerald-900 mb-2">Registration Successful!</h3>
                <p className="text-gray-600">
                  Thank you for registering! You will receive a confirmation email shortly with event details and payment instructions (if applicable).
                </p>
              </div>
              <button
                onClick={() => setRegistrationSuccess(false)}
                className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default EventsSection