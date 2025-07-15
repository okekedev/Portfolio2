import React, { useState } from 'react'
import AdvancedHomepageCarousel from './components/AdvancedHomepageCarousel'
import ContactPage from './components/ContactPage'
import AboutPage from './components/AboutPage'
import ProjectsPage from './components/ProjectsPage'
import ConsultingPage from './components/ConsultingPage'

function App() {
  const [currentView, setCurrentView] = useState('home')

  const handleNavigation = (view) => {
    setCurrentView(view)
  }

  const handleBackToHome = () => {
    setCurrentView('home')
  }

  const renderView = () => {
    switch(currentView) {
      case 'projects':
        return <ProjectsPage onBack={handleBackToHome} />
      case 'contact':
        return <ContactPage onBack={handleBackToHome} />
      case 'about':
        return <AboutPage onBack={handleBackToHome} />
      case 'consulting':
        return <ConsultingPage onBack={handleBackToHome} onNavigate={handleNavigation} />
      default:
        return <AdvancedHomepageCarousel onNavigate={handleNavigation} />
    }
  }

  return (
    <div style={{ 
      width: '100%', 
      maxWidth: '100vw', 
      overflowX: 'hidden', 
      boxSizing: 'border-box' 
    }}>
      {/* All pages now have their own back buttons, so no generic one needed */}
      {renderView()}
    </div>
  )
}

export default App