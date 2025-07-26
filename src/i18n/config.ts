import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const resources = {
  en: {
    translation: {
      // Navigation
      'nav.home': 'Home',
      'nav.about': 'About Us',
      'nav.animals': 'Our Animals',
      'nav.events': 'Events',
      'nav.volunteer': 'Get Involved',
      'nav.gallery': 'Gallery',
      'nav.contact': 'Contact',
      'nav.language': 'Čeština',
      
      // Hero Section
      'hero.title': 'Let Me Grow',
      'hero.subtitle': 'Creating a family homestead in harmony with nature, animals, and people',
      'hero.cta.volunteer': 'Join Us as Volunteer',
      'hero.cta.visit': 'Plan Your Visit',
      'hero.cta.donate': 'Support Our Mission',
      
      // About Section
      'about.title': 'Our Story',
      'about.mission': 'Our Mission',
      'about.mission.text': 'We create a space for the growth of the soul, heart, and nature. Our family homestead serves as an animal sanctuary and community hub, promoting love, respect, and sustainability.',
      'about.values.title': 'Our Values',
      'about.values.nature': 'Harmony with Nature',
      'about.values.nature.desc': 'Deep respect for the natural world and commitment to living in tune with it',
      'about.values.animals': 'Animal Welfare',
      'about.values.animals.desc': 'Providing a safe and loving home for animals in our sanctuary',
      'about.values.community': 'Community',
      'about.values.community.desc': 'Fostering a strong and supportive community around our homestead',
      'about.values.sustainability': 'Self-Sufficiency',
      'about.values.sustainability.desc': 'Actively pursuing a sustainable and self-sufficient lifestyle',
      
      // Animals Section
      'animals.title': 'Meet Our Animals',
      'animals.subtitle': 'Each animal has their own story and personality. Get to know our sanctuary family.',
      'animals.age': 'Age',
      'animals.gender': 'Gender',
      'animals.arrived': 'Arrived',
      'animals.story': 'Story',
      'animals.personality': 'Personality',
      'animals.male': 'Male',
      'animals.female': 'Female',
      'animals.years': 'years',
      
      // Events Section
      'events.title': 'Upcoming Events',
      'events.subtitle': 'Join our workshops and community events to learn and connect with nature',
      'events.register': 'Register',
      'events.free': 'Free',
      'events.participants': 'participants',
      'events.max': 'max',
      'events.deadline': 'Registration deadline',
      'events.location': 'Location',
      'events.price': 'Price',
      
      // Volunteer Section
      'volunteer.title': 'Get Involved',
      'volunteer.subtitle': 'Join our community and help us create a better world for animals and nature',
      'volunteer.why.title': 'Why Volunteer with Us?',
      'volunteer.why.experience': 'Gain hands-on experience with animals and sustainable farming',
      'volunteer.why.community': 'Join a passionate community of like-minded individuals',
      'volunteer.why.impact': 'Make a real difference in the lives of rescued animals',
      'volunteer.why.skills': 'Learn new skills in organic farming and animal care',
      'volunteer.apply': 'Apply to Volunteer',
      'volunteer.other.title': 'Other Ways to Help',
      'volunteer.donate': 'Make a Donation',
      'volunteer.sponsor': 'Sponsor an Animal',
      'volunteer.shop': 'Visit Our Shop',
      
      // Contact Section
      'contact.title': 'Contact Us',
      'contact.subtitle': 'Get in touch to learn more about our work or plan your visit',
      'contact.info.title': 'Contact Information',
      'contact.info.address': 'Address',
      'contact.info.phone': 'Phone',
      'contact.info.email': 'Email',
      'contact.form.title': 'Send us a Message',
      'contact.form.name': 'Name',
      'contact.form.email': 'Email',
      'contact.form.phone': 'Phone',
      'contact.form.subject': 'Subject',
      'contact.form.message': 'Message',
      'contact.form.send': 'Send Message',
      'contact.social.title': 'Follow Us',
      
      // Forms
      'form.required': 'Required',
      'form.submit': 'Submit',
      'form.submitting': 'Submitting...',
      'form.success': 'Thank you! Your message has been sent.',
      'form.error': 'Sorry, something went wrong. Please try again.',
      
      // Common
      'common.loading': 'Loading...',
      'common.error': 'Error occurred',
      'common.back': 'Back',
      'common.more': 'Learn More',
      'common.close': 'Close'
    }
  },
  cs: {
    translation: {
      // Navigation
      'nav.home': 'Domů',
      'nav.about': 'O nás',
      'nav.animals': 'Naše zvířata',
      'nav.events': 'Akce',
      'nav.volunteer': 'Zapojte se',
      'nav.gallery': 'Galerie',
      'nav.contact': 'Kontakt',
      'nav.language': 'English',
      
      // Hero Section
      'hero.title': 'Nech mě růst',
      'hero.subtitle': 'Vytváříme rodinnou farmu v souladu s přírodou, zvířaty a lidmi',
      'hero.cta.volunteer': 'Staňte se dobrovolníkem',
      'hero.cta.visit': 'Naplánujte návštěvu',
      'hero.cta.donate': 'Podpořte naši misi',
      
      // About Section
      'about.title': 'Náš příběh',
      'about.mission': 'Naše mise',
      'about.mission.text': 'Vytváříme prostor pro růst duše, srdce a přírody. Naše rodinná farma slouží jako útulku pro zvířata a komunitní centrum, které podporuje lásku, respekt a udržitelnost.',
      'about.values.title': 'Naše hodnoty',
      'about.values.nature': 'Soulad s přírodou',
      'about.values.nature.desc': 'Hluboký respekt k přírodnímu světu a závazek žít v souladu s ním',
      'about.values.animals': 'Péče o zvířata',
      'about.values.animals.desc': 'Poskytování bezpečného a láskyplného domova pro zvířata v našem útulku',
      'about.values.community': 'Komunita',
      'about.values.community.desc': 'Budování silné a podporující komunity kolem naší farmy',
      'about.values.sustainability': 'Soběstačnost',
      'about.values.sustainability.desc': 'Aktivní usilování o udržitelný a soběstačný způsob života',
      
      // Animals Section
      'animals.title': 'Seznamte se s našimi zvířaty',
      'animals.subtitle': 'Každé zvíře má svůj vlastní příběh a osobnost. Poznejte naši útulkovou rodinu.',
      'animals.age': 'Věk',
      'animals.gender': 'Pohlaví',
      'animals.arrived': 'Přišla',
      'animals.story': 'Příběh',
      'animals.personality': 'Osobnost',
      'animals.male': 'Samec',
      'animals.female': 'Samice',
      'animals.years': 'let',
      
      // Events Section
      'events.title': 'Nadcházející akce',
      'events.subtitle': 'Připojte se k našim workshopům a komunitním akcím, abyste se učili a spojili s přírodou',
      'events.register': 'Registrovat',
      'events.free': 'Zdarma',
      'events.participants': 'účastníků',
      'events.max': 'max',
      'events.deadline': 'Uzávěrka přihlášek',
      'events.location': 'Místo',
      'events.price': 'Cena',
      
      // Volunteer Section
      'volunteer.title': 'Zapojte se',
      'volunteer.subtitle': 'Připojte se k naší komunitě a pomozte nám vytvářet lepší svět pro zvířata a přírodu',
      'volunteer.why.title': 'Proč být dobrovolníkem u nás?',
      'volunteer.why.experience': 'Získejte praktické zkušenosti se zvířaty a udržitelným hospodařením',
      'volunteer.why.community': 'Připojte se k vášnivé komunitě podobně smýšlejících lidí',
      'volunteer.why.impact': 'Udělejte skutečný rozdíl v životech zachráněných zvířat',
      'volunteer.why.skills': 'Naučte se nové dovednosti v ekologickém zemědělství a péči o zvířata',
      'volunteer.apply': 'Přihlásit se jako dobrovolník',
      'volunteer.other.title': 'Další způsoby, jak pomoci',
      'volunteer.donate': 'Darujte',
      'volunteer.sponsor': 'Adoptujte zvíře na dálku',
      'volunteer.shop': 'Navštivte náš obchod',
      
      // Contact Section
      'contact.title': 'Kontaktujte nás',
      'contact.subtitle': 'Ozvěte se nám pro více informací o naší práci nebo pro naplánování návštěvy',
      'contact.info.title': 'Kontaktní informace',
      'contact.info.address': 'Adresa',
      'contact.info.phone': 'Telefon',
      'contact.info.email': 'Email',
      'contact.form.title': 'Napište nám',
      'contact.form.name': 'Jméno',
      'contact.form.email': 'Email',
      'contact.form.phone': 'Telefon',
      'contact.form.subject': 'Předmět',
      'contact.form.message': 'Zpráva',
      'contact.form.send': 'Odeslat zprávu',
      'contact.social.title': 'Sledujte nás',
      
      // Forms
      'form.required': 'Povinné',
      'form.submit': 'Odeslat',
      'form.submitting': 'Odesílám...',
      'form.success': 'Děkujeme! Vaše zpráva byla odeslána.',
      'form.error': 'Omlouváme se, něco se pokazilo. Zkuste to prosím znovu.',
      
      // Common
      'common.loading': 'Načítání...',
      'common.error': 'Došlo k chybě',
      'common.back': 'Zpět',
      'common.more': 'Zjistit více',
      'common.close': 'Zavřít'
    }
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'cs',
    debug: false,
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage']
    }
  })

export default i18n