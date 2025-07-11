import React, { useState } from 'react'
import HomepageCarousel from './components/HomepageCarousel'

function App() {
  const [currentView, setCurrentView] = useState('home')

  const handleNavigation = (view) => {
    setCurrentView(view)
  }

  const renderView = () => {
    switch(currentView) {
      case 'projects':
        return <div className="view-placeholder">Projects Carousel Coming Soon</div>
      case 'contact':
        return <div className="view-placeholder">Contact Form Coming Soon</div>
      case 'consulting':
        return <div className="view-placeholder">Consulting Info Coming Soon</div>
      default:
        return <HomepageCarousel onNavigate={handleNavigation} />
    }
  }

  return (
    <div className="app">
      {currentView !== 'home' && (
        <button 
          className="back-btn"
          onClick={() => setCurrentView('home')}
        >
          ← Back to Home
        </button>
      )}
      {renderView()}
    </div>
  )
}

export default App