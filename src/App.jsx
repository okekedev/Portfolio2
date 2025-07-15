import React, { useState } from 'react'
import AdvancedHomepageCarousel from './components/AdvancedHomepageCarousel'
import ContactPage from './components/ContactPage'
import AboutPage from './components/AboutPage' // Add this import

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
        return <div>Projects Coming Soon</div>
      case 'contact':
        return <ContactPage onBack={handleBackToHome} />
      case 'about':
        return <AboutPage onBack={handleBackToHome} /> // Use the new AboutPage component
      case 'consulting':
        return <div>Consulting Coming Soon</div>
      default:
        return <AdvancedHomepageCarousel onNavigate={handleNavigation} />
    }
  }

  return (
    <div>
      {/* Remove the generic back button since ContactPage and AboutPage have their own */}
      {currentView !== 'home' && currentView !== 'contact' && currentView !== 'about' && (
        <button onClick={() => setCurrentView('home')}>
          ← Back to Home
        </button>
      )}
      {renderView()}
    </div>
  )
}

export default App