import React, { useState } from 'react'
import AdvancedHomepageCarousel from './components/AdvancedHomepageCarousel'

function App() {
  const [currentView, setCurrentView] = useState('home')

  const handleNavigation = (view) => {
    setCurrentView(view)
  }

  const renderView = () => {
    switch(currentView) {
      case 'projects':
        return <div>Projects Coming Soon</div>
      case 'contact':
        return <div>Contact Coming Soon</div>
      case 'about':
        return <div>About Coming Soon</div>
      case 'consulting':
        return <div>Consulting Coming Soon</div>
      default:
        return <AdvancedHomepageCarousel onNavigate={handleNavigation} />
    }
  }

  return (
    <div>
      {currentView !== 'home' && (
        <button onClick={() => setCurrentView('home')}>
          ← Back to Home
        </button>
      )}
      {renderView()}
    </div>
  )
}

export default App