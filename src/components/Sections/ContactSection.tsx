import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Mail, Phone, MapPin, Send, Instagram, Facebook, Clock } from 'lucide-react'
import { supabase, ContactSubmission } from '../../lib/supabase'

const ContactSection: React.FC = () => {
  const { t, i18n } = useTranslation()
  const [formData, setFormData] = useState<Partial<ContactSubmission>>({
    name: '',
    email: '',
    phone: '',
    subject_cs: '',
    subject_en: '',
    message_cs: '',
    message_en: '',
    inquiry_type: 'general',
    preferred_contact_method: 'email',
    preferred_language: i18n.language
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const inquiryTypes = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'volunteer', label: 'Volunteering' },
    { value: 'visit', label: 'Visit Planning' },
    { value: 'donation', label: 'Donations' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'media', label: 'Media/Press' }
  ]

  const contactMethods = [
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'both', label: 'Both' }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = () => {
    if (!formData.name || !formData.email) {
      setError('Please fill in your name and email')
      return false
    }
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address')
      return false
    }
    const message = i18n.language === 'cs' ? formData.message_cs : formData.message_en
    if (!message || message.trim().length < 10) {
      setError('Please enter a message with at least 10 characters')
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
        .from('contact_submissions')
        .insert([{
          ...formData,
          responded: false
        }])
      
      if (dbError) throw dbError
      
      // Then send email notification
      try {
        const { error: emailError } = await supabase.functions.invoke('send-notification-email', {
          body: {
            type: 'contact',
            data: {
              ...formData,
              subject: i18n.language === 'cs' ? formData.subject_cs : formData.subject_en,
              message: i18n.language === 'cs' ? formData.message_cs : formData.message_en
            }
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
        name: '',
        email: '',
        phone: '',
        subject_cs: '',
        subject_en: '',
        message_cs: '',
        message_en: '',
        inquiry_type: 'general',
        preferred_contact_method: 'email',
        preferred_language: i18n.language
      })
    } catch (error: any) {
      console.error('Error submitting contact form:', error)
      setError(error.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <section className="py-20 bg-emerald-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-12">
            <Mail className="h-16 w-16 text-emerald-300 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-6">
              {t('form.success')}
            </h2>
            <p className="text-lg text-emerald-100 mb-8">
              We'll get back to you within 24 hours. Thank you for reaching out!
            </p>
            <button
              onClick={() => setSubmitted(false)}
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
    <section className="py-20 bg-emerald-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            {t('contact.title')}
          </h2>
          <p className="text-lg md:text-xl text-emerald-100 max-w-3xl mx-auto leading-relaxed">
            {t('contact.subtitle')}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-300 to-emerald-500 mx-auto mt-8"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-emerald-200 mb-6">
                {t('contact.info.title')}
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-emerald-800 p-3 rounded-lg">
                    <MapPin className="h-6 w-6 text-emerald-300" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-emerald-200 mb-1">{t('contact.info.address')}</h4>
                    <p className="text-emerald-100">
                      Nová ves u Leštiny 32<br />
                      Czech Republic
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-emerald-800 p-3 rounded-lg">
                    <Phone className="h-6 w-6 text-emerald-300" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-emerald-200 mb-1">{t('contact.info.phone')}</h4>
                    <p className="text-emerald-100">720 307 817</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-emerald-800 p-3 rounded-lg">
                    <Mail className="h-6 w-6 text-emerald-300" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-emerald-200 mb-1">{t('contact.info.email')}</h4>
                    <p className="text-emerald-100">info@nechmerust.org</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-emerald-800 p-3 rounded-lg">
                    <Clock className="h-6 w-6 text-emerald-300" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-emerald-200 mb-1">Visit Hours</h4>
                    <p className="text-emerald-100">
                      By appointment only<br />
                      Please contact us in advance
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Social Media */}
            <div>
              <h3 className="text-2xl font-bold text-emerald-200 mb-6">
                {t('contact.social.title')}
              </h3>
              
              <div className="flex space-x-4">
                <a 
                  href="https://instagram.com/nech_me_rust" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group bg-emerald-800 hover:bg-emerald-700 p-4 rounded-lg transition-colors duration-200"
                >
                  <Instagram className="h-6 w-6 text-emerald-300 group-hover:text-white" />
                </a>
                <a 
                  href="https://www.facebook.com/p/Nech-m%C4%9B-r%C5%AFst-100092573666339/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group bg-emerald-800 hover:bg-emerald-700 p-4 rounded-lg transition-colors duration-200"
                >
                  <Facebook className="h-6 w-6 text-emerald-300 group-hover:text-white" />
                </a>
              </div>
            </div>
            
            {/* Visit Info */}
            <div className="bg-emerald-800/50 backdrop-blur-sm rounded-xl p-6">
              <h4 className="text-lg font-semibold text-emerald-200 mb-3">Planning a Visit?</h4>
              <p className="text-emerald-100 text-sm leading-relaxed">
                We love welcoming visitors to our homestead! Please contact us at least 24 hours in advance 
                to schedule your visit. This helps us ensure the animals are comfortable and we can give you 
                the best experience possible.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-emerald-200 mb-6">
              {t('contact.form.title')}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
                  <p className="text-red-200">{error}</p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-emerald-200 mb-2">
                    {t('contact.form.name')} *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-emerald-300/30 rounded-lg text-white placeholder-emerald-300 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
                    placeholder="Your name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-emerald-200 mb-2">
                    {t('contact.form.email')} *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-emerald-300/30 rounded-lg text-white placeholder-emerald-300 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-emerald-200 mb-2">
                  {t('contact.form.phone')}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-emerald-300/30 rounded-lg text-white placeholder-emerald-300 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
                  placeholder="Your phone number"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-emerald-200 mb-2">
                    Inquiry Type
                  </label>
                  <select
                    name="inquiry_type"
                    value={formData.inquiry_type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-emerald-300/30 rounded-lg text-white focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
                  >
                    {inquiryTypes.map(type => (
                      <option key={type.value} value={type.value} className="bg-emerald-900 text-white">
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-emerald-200 mb-2">
                    Preferred Contact
                  </label>
                  <select
                    name="preferred_contact_method"
                    value={formData.preferred_contact_method}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-emerald-300/30 rounded-lg text-white focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
                  >
                    {contactMethods.map(method => (
                      <option key={method.value} value={method.value} className="bg-emerald-900 text-white">
                        {method.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-emerald-200 mb-2">
                  {t('contact.form.subject')}
                </label>
                <input
                  type="text"
                  name={i18n.language === 'cs' ? 'subject_cs' : 'subject_en'}
                  value={i18n.language === 'cs' ? formData.subject_cs : formData.subject_en}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-emerald-300/30 rounded-lg text-white placeholder-emerald-300 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
                  placeholder="Brief subject of your message"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-emerald-200 mb-2">
                  {t('contact.form.message')} *
                </label>
                <textarea
                  name={i18n.language === 'cs' ? 'message_cs' : 'message_en'}
                  value={i18n.language === 'cs' ? formData.message_cs : formData.message_en}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-white/10 border border-emerald-300/30 rounded-lg text-white placeholder-emerald-300 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
                  placeholder="Tell us about your inquiry..."
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-emerald-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <span>{t('form.submitting')}</span>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    <span>{t('contact.form.send')}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactSection