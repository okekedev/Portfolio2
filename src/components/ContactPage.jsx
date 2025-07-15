import React, { useState, useCallback, useEffect } from 'react'

// All styling contained within this component
const styles = {
  contactPage: {
    minHeight: '100vh',
    width: '100%',
    maxWidth: '100vw',
    background: 'linear-gradient(135deg, #2c3e3e 0%, #1a2b2b 100%)',
    color: '#f5f3f0',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    overflow: 'hidden',
    overflowX: 'hidden',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box'
  },

  // Gold flakes animation
  goldFlakesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 1
  },

  goldFlake: {
    position: 'absolute',
    background: '#d4af37',
    borderRadius: '50%',
    opacity: 0.6,
    animation: 'float 6s infinite ease-in-out'
  },

  // Main container
  container: {
    position: 'relative',
    zIndex: 10,
    maxWidth: '600px',
    width: '100%',
    margin: '0 auto',
    background: 'rgba(44, 62, 62, 0.95)',
    border: '2px solid #d4af37',
    borderRadius: '20px',
    padding: '60px',
    backdropFilter: 'blur(15px)',
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.4)',
    textAlign: 'center',
    boxSizing: 'border-box'
  },

  title: {
    fontSize: '3rem',
    color: '#d4af37',
    fontFamily: '"Great Vibes", cursive',
    fontWeight: '400',
    letterSpacing: '0.04em',
    textShadow: '0 4px 8px rgba(0, 0, 0, 0.8)',
    margin: 0,
    marginBottom: '15px'
  },

  subtitle: {
    fontSize: '1.1rem',
    color: '#f5f3f0',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontWeight: '300',
    opacity: 0.9,
    lineHeight: '1.6',
    marginBottom: '40px'
  },

  // Step indicator
  stepIndicator: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '40px'
  },

  stepDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    transition: 'all 0.3s ease'
  },

  stepDotActive: {
    background: '#d4af37',
    boxShadow: '0 0 15px rgba(212, 175, 55, 0.5)'
  },

  stepDotInactive: {
    background: 'rgba(212, 175, 55, 0.3)',
    border: '2px solid rgba(212, 175, 55, 0.5)'
  },

  stepDotCompleted: {
    background: '#d4af37',
    transform: 'scale(1.2)'
  },

  stepLine: {
    width: '30px',
    height: '2px',
    transition: 'all 0.3s ease'
  },

  stepLineActive: {
    background: '#d4af37'
  },

  stepLineInactive: {
    background: 'rgba(212, 175, 55, 0.3)'
  },

  // Form step container
  stepContainer: {
    minHeight: '300px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },

  stepTitle: {
    fontSize: '2rem',
    color: '#d4af37',
    fontFamily: '"Great Vibes", cursive',
    fontWeight: '400',
    letterSpacing: '0.04em',
    marginBottom: '30px',
    textShadow: '0 4px 8px rgba(0, 0, 0, 0.8)',
    opacity: 0,
    transform: 'translateY(20px)',
    animation: 'fadeInUp 0.6s ease forwards'
  },

  inputGroup: {
    width: '100%',
    maxWidth: '400px',
    marginBottom: '30px'
  },

  input: {
    width: '100%',
    padding: '20px',
    fontSize: '1.1rem',
    color: '#f5f3f0',
    background: 'rgba(26, 43, 43, 0.8)',
    border: '2px solid rgba(212, 175, 55, 0.3)',
    borderRadius: '12px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontWeight: '400',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(5px)',
    boxSizing: 'border-box',
    textAlign: 'center',
    opacity: 0,
    transform: 'translateY(20px)',
    animation: 'fadeInUp 0.6s ease 0.2s forwards'
  },

  inputFocus: {
    borderColor: '#d4af37',
    boxShadow: '0 0 0 3px rgba(212, 175, 55, 0.2)',
    outline: 'none',
    transform: 'scale(1.02)'
  },

  textarea: {
    width: '100%',
    padding: '20px',
    fontSize: '1.1rem',
    color: '#f5f3f0',
    background: 'rgba(26, 43, 43, 0.8)',
    border: '2px solid rgba(212, 175, 55, 0.3)',
    borderRadius: '12px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontWeight: '400',
    lineHeight: '1.6',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(5px)',
    minHeight: '150px',
    resize: 'vertical',
    boxSizing: 'border-box',
    opacity: 0,
    transform: 'translateY(20px)',
    animation: 'fadeInUp 0.6s ease 0.2s forwards'
  },

  // Button styles
  buttonContainer: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
    marginTop: '30px',
    opacity: 0,
    transform: 'translateY(20px)',
    animation: 'fadeInUp 0.6s ease 0.4s forwards'
  },

  button: {
    padding: '15px 30px',
    fontSize: '1rem',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontWeight: '500',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    border: 'none'
  },

  primaryButton: {
    color: '#2c3e3e',
    background: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)',
    boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)'
  },

  primaryButtonHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 16px rgba(212, 175, 55, 0.4)'
  },

  primaryButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
    transform: 'none'
  },

  secondaryButton: {
    color: '#d4af37',
    background: 'rgba(212, 175, 55, 0.1)',
    border: '2px solid #d4af37'
  },

  secondaryButtonHover: {
    background: 'rgba(212, 175, 55, 0.2)',
    transform: 'translateY(-2px)'
  },

  // Summary step
  summaryContainer: {
    textAlign: 'left',
    opacity: 0,
    transform: 'translateY(20px)',
    animation: 'fadeInUp 0.6s ease 0.2s forwards'
  },

  summaryItem: {
    margin: '15px 0',
    padding: '15px',
    background: 'rgba(26, 43, 43, 0.5)',
    borderRadius: '8px',
    border: '2px solid rgba(212, 175, 55, 0.3)'
  },

  summaryLabel: {
    fontSize: '0.9rem',
    color: '#d4af37',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontWeight: '500',
    marginBottom: '5px',
    textTransform: 'uppercase',
    letterSpacing: '0.8px'
  },

  summaryValue: {
    fontSize: '1.1rem',
    color: '#f5f3f0',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontWeight: '400',
    lineHeight: '1.6',
    opacity: 0.9,
    wordBreak: 'break-word'
  },

  successMessage: {
    textAlign: 'center',
    opacity: 0,
    transform: 'scale(0.8)',
    animation: 'popIn 0.6s ease forwards'
  },

  successIcon: {
    fontSize: '4rem',
    color: '#d4af37',
    marginBottom: '20px',
    animation: 'bounce 1s infinite'
  },

  successText: {
    fontSize: '1.8rem',
    color: '#d4af37',
    fontFamily: '"Great Vibes", cursive',
    fontWeight: '400',
    letterSpacing: '0.04em',
    textShadow: '0 4px 8px rgba(0, 0, 0, 0.8)',
    marginBottom: '15px'
  },

  successSubtext: {
    fontSize: '1.1rem',
    color: '#f5f3f0',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontWeight: '300',
    lineHeight: '1.6',
    opacity: 0.9
  },

  // Back to Home Button
  backButton: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    background: 'rgba(44, 62, 62, 0.9)',
    border: '2px solid #d4af37',
    borderRadius: '8px',
    padding: '12px 24px',
    color: '#d4af37',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontWeight: '500',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
    zIndex: 20
  },

  // Mobile styles
  mobile: {
    container: {
      padding: '40px 20px',
      margin: '0 15px',
      width: 'calc(100% - 30px)',
      maxWidth: '500px'
    },
    title: {
      fontSize: '2.2rem'
    },
    stepTitle: {
      fontSize: '1.6rem'
    },
    input: {
      fontSize: '1rem',
      padding: '15px'
    },
    textarea: {
      fontSize: '1rem',
      padding: '15px'
    },
    successText: {
      fontSize: '1.5rem'
    },
    successSubtext: {
      fontSize: '1rem'
    }
  }
}

// Gold Flakes Animation Component
const GoldFlakes = () => {
  const [flakes, setFlakes] = useState([])

  useEffect(() => {
    const generateFlakes = () => {
      const newFlakes = []
      for (let i = 0; i < 25; i++) {
        newFlakes.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 2,
          delay: Math.random() * 6,
          duration: Math.random() * 3 + 4
        })
      }
      setFlakes(newFlakes)
    }

    generateFlakes()
  }, [])

  return (
    <div style={styles.goldFlakesContainer}>
      {flakes.map(flake => (
        <div
          key={flake.id}
          style={{
            ...styles.goldFlake,
            left: `${flake.x}%`,
            top: `${flake.y}%`,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            animationDelay: `${flake.delay}s`,
            animationDuration: `${flake.duration}s`
          }}
        />
      ))}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.6; }
            25% { transform: translateY(-20px) rotate(90deg); opacity: 0.8; }
            50% { transform: translateY(-10px) rotate(180deg); opacity: 1; }
            75% { transform: translateY(-30px) rotate(270deg); opacity: 0.8; }
          }
          
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes popIn {
            from { opacity: 0; transform: scale(0.8); }
            to { opacity: 1; transform: scale(1); }
          }
          
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
        `}
      </style>
    </div>
  )
}

// Step-by-Step Contact Form Component
const ContactPage = ({ onBack }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [focusedField, setFocusedField] = useState(null)
  const [buttonHovered, setButtonHovered] = useState(null)
  
  // Responsive check
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const steps = [
    {
      title: "What's your name?",
      field: 'name',
      placeholder: 'Enter your full name...',
      type: 'text'
    },
    {
      title: "Your email address?",
      field: 'email',
      placeholder: 'Enter your email...',
      type: 'email'
    },
    {
      title: "Tell me about your project",
      field: 'message',
      placeholder: 'Describe your project, goals, or questions...',
      type: 'textarea'
    },
    {
      title: "Review your message",
      field: 'review',
      type: 'review'
    }
  ]

  const handleInputChange = useCallback((value) => {
    const currentField = steps[currentStep].field
    setFormData(prev => ({ ...prev, [currentField]: value }))
  }, [currentStep, steps])

  const handleNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    }
  }, [currentStep, steps.length])

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }, [currentStep])

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true)

    try {
      // Create mailto link with form data
      const subject = encodeURIComponent('Contact Form Submission')
      const body = encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
      )
      const mailtoLink = `mailto:cokeke@sundai.us?subject=${subject}&body=${body}`
      
      // Open email client
      window.location.href = mailtoLink
      
      // Show success
      setIsComplete(true)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }, [formData])

  const getCurrentValue = () => {
    return formData[steps[currentStep]?.field] || ''
  }

  const isCurrentStepValid = () => {
    const value = getCurrentValue()
    if (steps[currentStep]?.field === 'email') {
      return value.includes('@') && value.includes('.')
    }
    return value.trim().length > 0
  }

  // Get responsive styles
  const containerStyles = {
    ...styles.container,
    ...(isMobile ? styles.mobile.container : {})
  }
  
  const titleStyles = {
    ...styles.title,
    ...(isMobile ? styles.mobile.title : {})
  }

  if (isComplete) {
    return (
      <div style={styles.contactPage}>
        <GoldFlakes />
        <div style={containerStyles}>
          <div style={styles.successMessage}>
            <div style={styles.successIcon}>✨</div>
            <div style={{...styles.successText, ...(isMobile ? styles.mobile.successText : {})}}>
              Message Sent!
            </div>
            <div style={{...styles.successSubtext, ...(isMobile ? styles.mobile.successSubtext : {})}}>
              Your email client should open shortly. I'll get back to you soon!
            </div>
            <div style={{...styles.buttonContainer, marginTop: '40px'}}>
              <button
                onClick={() => {
                  setIsComplete(false)
                  setCurrentStep(0)
                  setFormData({ name: '', email: '', message: '' })
                }}
                style={{
                  ...styles.button,
                  ...styles.primaryButton,
                  ...(buttonHovered === 'new' ? styles.primaryButtonHover : {})
                }}
                onMouseEnter={() => setButtonHovered('new')}
                onMouseLeave={() => setButtonHovered(null)}
              >
                Send Another
              </button>
              {onBack && (
                <button
                  onClick={onBack}
                  style={{
                    ...styles.button,
                    ...styles.secondaryButton,
                    ...(buttonHovered === 'home' ? styles.secondaryButtonHover : {})
                  }}
                  onMouseEnter={() => setButtonHovered('home')}
                  onMouseLeave={() => setButtonHovered(null)}
                >
                  Back to Home
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.contactPage}>
      <GoldFlakes />
      
      <div style={containerStyles}>
        <h1 style={titleStyles}>Get in Touch</h1>
        <p style={styles.subtitle}>
          Let's discuss your project step by step
        </p>

        {/* Step Indicator */}
        <div style={styles.stepIndicator}>
          {steps.map((_, index) => (
            <React.Fragment key={index}>
              <div
                style={{
                  ...styles.stepDot,
                  ...(index === currentStep ? styles.stepDotActive : 
                      index < currentStep ? styles.stepDotCompleted : 
                      styles.stepDotInactive)
                }}
              />
              {index < steps.length - 1 && (
                <div
                  style={{
                    ...styles.stepLine,
                    ...(index < currentStep ? styles.stepLineActive : styles.stepLineInactive)
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step Content */}
        <div style={styles.stepContainer}>
          {steps[currentStep].type === 'review' ? (
            <div>
              <div style={{...styles.stepTitle, ...(isMobile ? styles.mobile.stepTitle : {})}}>
                {steps[currentStep].title}
              </div>
              <div style={styles.summaryContainer}>
                <div style={styles.summaryItem}>
                  <div style={styles.summaryLabel}>Name</div>
                  <div style={styles.summaryValue}>{formData.name}</div>
                </div>
                <div style={styles.summaryItem}>
                  <div style={styles.summaryLabel}>Email</div>
                  <div style={styles.summaryValue}>{formData.email}</div>
                </div>
                <div style={styles.summaryItem}>
                  <div style={styles.summaryLabel}>Message</div>
                  <div style={styles.summaryValue}>{formData.message}</div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div style={{...styles.stepTitle, ...(isMobile ? styles.mobile.stepTitle : {})}}>
                {steps[currentStep].title}
              </div>
              <div style={styles.inputGroup}>
                {steps[currentStep].type === 'textarea' ? (
                  <textarea
                    value={getCurrentValue()}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onFocus={() => setFocusedField(steps[currentStep].field)}
                    onBlur={() => setFocusedField(null)}
                    placeholder={steps[currentStep].placeholder}
                    style={{
                      ...styles.textarea,
                      ...(isMobile ? styles.mobile.textarea : {}),
                      ...(focusedField === steps[currentStep].field ? styles.inputFocus : {})
                    }}
                  />
                ) : (
                  <input
                    type={steps[currentStep].type}
                    value={getCurrentValue()}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onFocus={() => setFocusedField(steps[currentStep].field)}
                    onBlur={() => setFocusedField(null)}
                    placeholder={steps[currentStep].placeholder}
                    style={{
                      ...styles.input,
                      ...(isMobile ? styles.mobile.input : {}),
                      ...(focusedField === steps[currentStep].field ? styles.inputFocus : {})
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && isCurrentStepValid()) {
                        handleNext()
                      }
                    }}
                  />
                )}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div style={styles.buttonContainer}>
            {currentStep > 0 && (
              <button
                onClick={handleBack}
                style={{
                  ...styles.button,
                  ...styles.secondaryButton,
                  ...(buttonHovered === 'back' ? styles.secondaryButtonHover : {})
                }}
                onMouseEnter={() => setButtonHovered('back')}
                onMouseLeave={() => setButtonHovered(null)}
              >
                Back
              </button>
            )}

            {currentStep < steps.length - 1 ? (
              <button
                onClick={handleNext}
                disabled={!isCurrentStepValid()}
                style={{
                  ...styles.button,
                  ...styles.primaryButton,
                  ...(buttonHovered === 'next' && isCurrentStepValid() ? styles.primaryButtonHover : {}),
                  ...(!isCurrentStepValid() ? styles.primaryButtonDisabled : {})
                }}
                onMouseEnter={() => setButtonHovered('next')}
                onMouseLeave={() => setButtonHovered(null)}
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                style={{
                  ...styles.button,
                  ...styles.primaryButton,
                  ...(buttonHovered === 'submit' && !isSubmitting ? styles.primaryButtonHover : {}),
                  ...(isSubmitting ? styles.primaryButtonDisabled : {})
                }}
                onMouseEnter={() => setButtonHovered('submit')}
                onMouseLeave={() => setButtonHovered(null)}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Back to Home Button */}
      {onBack && (
        <button
          onClick={onBack}
          style={styles.backButton}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(212, 175, 55, 0.2)'
            e.target.style.transform = 'translateX(-5px)'
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(44, 62, 62, 0.9)'
            e.target.style.transform = 'translateX(0)'
          }}
        >
          ← Back to Home
        </button>
      )}
    </div>
  )
}

export default ContactPage