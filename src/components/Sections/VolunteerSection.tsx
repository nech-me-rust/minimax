import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Heart, Users, Sprout, Award, Mail, Phone, MapPin, Send } from 'lucide-react'
import { supabase, VolunteerApplication } from '../../lib/supabase'

const VolunteerSection: React.FC = () => {
  const { t, i18n } = useTranslation()
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<Partial<VolunteerApplication>>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    age: undefined,
    location: '',
    availability_weekdays: false,
    availability_weekends: false,
    availability_mornings: false,
    availability_afternoons: false,
    availability_evenings: false,
    skills: '',
    experience_animals: '',
    experience_farming: '',
    motivation_cs: '',
    motivation_en: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    has_drivers_license: false,
    can_lift_heavy: false,
    allergies: '',
    medical_conditions: '',
    preferred_language: i18n.language
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const benefits = [
    {
      icon: Sprout,
      title: t('volunteer.why.experience'),
      color: 'text-green-600'
    },
    {
      icon: Users,
      title: t('volunteer.why.community'),
      color: 'text-blue-600'
    },
    {
      icon: Heart,
      title: t('volunteer.why.impact'),
      color: 'text-red-500'
    },
    {
      icon: Award,
      title: t('volunteer.why.skills'),
      color: 'text-yellow-600'
    }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
               name === 'age' ? (value ? parseInt(value) : undefined) : value
    }))
  }

  const handleCheckboxChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: !prev[name as keyof VolunteerApplication]
    }))
  }

  const validateForm = () => {
    if (!formData.first_name || !formData.last_name || !formData.email) {
      setError('Please fill in all required fields')
      return false
    }
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    setError('')
    
    try {
      // First, save to database
      const { error: dbError } = await supabase
        .from('volunteer_applications')
        .insert([{
          ...formData,
          status: 'pending'
        }])
      
      if (dbError) throw dbError
      
      // Then send email notification
      try {
        const { error: emailError } = await supabase.functions.invoke('send-notification-email', {
          body: {
            type: 'volunteer',
            data: formData
          }
        })
        
        if (emailError) {
          console.error('Email notification failed:', emailError)
          // Don't fail the whole process if email fails
        }
      } catch (emailError) {
        console.error('Email notification error:', emailError)
      }
      
      setSubmitted(true)
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        age: undefined,
        location: '',
        availability_weekdays: false,
        availability_weekends: false,
        availability_mornings: false,
        availability_afternoons: false,
        availability_evenings: false,
        skills: '',
        experience_animals: '',
        experience_farming: '',
        motivation_cs: '',
        motivation_en: '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        has_drivers_license: false,
        can_lift_heavy: false,
        allergies: '',
        medical_conditions: '',
        preferred_language: i18n.language
      })
    } catch (error: any) {
      console.error('Error submitting application:', error)
      setError(error.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-12">
            <div className="mb-6">
              <Heart className="h-16 w-16 text-emerald-600 mx-auto" />
            </div>
            <h2 className="text-3xl font-bold text-emerald-900 mb-6">
              Thank You for Your Interest!
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              We've received your volunteer application and will get back to you within 48 hours. 
              We're excited about the possibility of having you join our community!
            </p>
            <button
              onClick={() => {
                setSubmitted(false)
                setShowForm(false)
              }}
              className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors duration-200"
            >
              {t('common.back')}
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gradient-to-br from-emerald-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!showForm ? (
          <>
            {/* Header */}
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-emerald-900 mb-6">
                {t('volunteer.title')}
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {t('volunteer.subtitle')}
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 mx-auto mt-8"></div>
            </div>

            {/* Why Volunteer */}
            <div className="mb-16">
              <h3 className="text-2xl md:text-3xl font-bold text-emerald-900 mb-12 text-center">
                {t('volunteer.why.title')}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {benefits.map((benefit, index) => {
                  const IconComponent = benefit.icon
                  return (
                    <div 
                      key={index}
                      className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                    >
                      <div className="text-center">
                        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                          <IconComponent className={`h-8 w-8 ${benefit.color}`} />
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          {benefit.title}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-16">
              <div className="text-center">
                <h3 className="text-2xl md:text-3xl font-bold text-emerald-900 mb-6">
                  Ready to Make a Difference?
                </h3>
                <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
                  Join our community of passionate volunteers and help us create a better world for animals and nature. 
                  Every contribution, big or small, makes a real impact.
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-emerald-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-emerald-700 transition-colors duration-200 transform hover:scale-105 shadow-lg flex items-center space-x-2 mx-auto"
                >
                  <Heart className="h-5 w-5" />
                  <span>{t('volunteer.apply')}</span>
                </button>
              </div>
            </div>

            {/* Other Ways to Help */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h4 className="text-xl font-bold text-emerald-900 mb-3">{t('volunteer.donate')}</h4>
                <p className="text-gray-600 mb-4">Support our mission with a financial contribution to help care for our animals.</p>
                <button className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200">
                  Donate Now
                </button>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                <Users className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h4 className="text-xl font-bold text-emerald-900 mb-3">{t('volunteer.sponsor')}</h4>
                <p className="text-gray-600 mb-4">Adopt an animal from a distance and help cover their care costs.</p>
                <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200">
                  Learn More
                </button>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                <Sprout className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h4 className="text-xl font-bold text-emerald-900 mb-3">{t('volunteer.shop')}</h4>
                <p className="text-gray-600 mb-4">Purchase our handmade products like teas, oils, and crafts.</p>
                <button className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200">
                  Shop Now
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Volunteer Application Form */
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-emerald-600 text-white p-8 text-center">
                <h2 className="text-3xl font-bold mb-4">{t('volunteer.apply')}</h2>
                <p className="text-emerald-100">Tell us about yourself and how you'd like to help</p>
              </div>
              
              <form onSubmit={handleSubmit} className="p-8">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-red-600">{error}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
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
                      value={formData.last_name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
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
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age || ''}
                      onChange={handleInputChange}
                      min="16"
                      max="99"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>
                
                {/* Availability */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    When are you available? (Select all that apply)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { key: 'availability_weekdays', label: 'Weekdays' },
                      { key: 'availability_weekends', label: 'Weekends' },
                      { key: 'availability_mornings', label: 'Mornings' },
                      { key: 'availability_afternoons', label: 'Afternoons' },
                      { key: 'availability_evenings', label: 'Evenings' }
                    ].map(item => (
                      <label key={item.key} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData[item.key as keyof VolunteerApplication] as boolean}
                          onChange={() => handleCheckboxChange(item.key)}
                          className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-sm text-gray-700">{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Why do you want to volunteer with us?
                  </label>
                  <textarea
                    name={i18n.language === 'cs' ? 'motivation_cs' : 'motivation_en'}
                    value={i18n.language === 'cs' ? formData.motivation_cs : formData.motivation_en}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Tell us what motivates you to help animals and nature..."
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skills & Experience
                  </label>
                  <textarea
                    name="skills"
                    value={formData.skills}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Any relevant skills or experience you'd like to share..."
                  />
                </div>
                
                {/* Additional Options */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Additional Information
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.has_drivers_license}
                        onChange={() => handleCheckboxChange('has_drivers_license')}
                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-sm text-gray-700">I have a driver's license</span>
                    </label>
                    
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.can_lift_heavy}
                        onChange={() => handleCheckboxChange('can_lift_heavy')}
                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-sm text-gray-700">I can lift heavy objects (up to 20kg)</span>
                    </label>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-600 transition-colors duration-200"
                  >
                    {t('common.back')}
                  </button>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-emerald-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <span>{t('form.submitting')}</span>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        <span>{t('form.submit')}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default VolunteerSection