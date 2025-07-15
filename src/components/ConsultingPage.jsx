import React, { useState, useCallback, useEffect } from 'react'

// All styling contained within this component
const styles = {
  consultingPage: {
    minHeight: '100vh',
    width: '100%',
    maxWidth: '100vw',
    background: 'linear-gradient(135deg, #2c3e3e 0%, #1a2b2b 100%)',
    color: '#f5f3f0',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    overflow: 'auto',
    overflowX: 'hidden',
    position: 'relative',
    padding: '20px',
    boxSizing: 'border-box'
  },

  // Gold flakes animation
  goldFlakesContainer: {
    position: 'fixed',
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
    opacity: 0.4,
    animation: 'float 8s infinite ease-in-out'
  },

  container: {
    position: 'relative',
    zIndex: 10,
    maxWidth: '1200px',
    width: '100%',
    margin: '0 auto',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxSizing: 'border-box'
  },

  header: {
    textAlign: 'center',
    marginBottom: '60px',
    paddingTop: '40px'
  },

  title: {
    fontSize: '3.5rem',
    color: '#d4af37',
    fontFamily: '"Great Vibes", cursive',
    fontWeight: '400',
    letterSpacing: '0.04em',
    textShadow: '0 4px 8px rgba(0, 0, 0, 0.8)',
    margin: 0,
    marginBottom: '15px'
  },

  subtitle: {
    fontSize: '1.3rem',
    color: '#f5f3f0',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontWeight: '300',
    opacity: 0.9,
    lineHeight: '1.6',
    maxWidth: '800px'
  },

  // Breadcrumb navigation
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '40px',
    padding: '15px 25px',
    background: 'rgba(44, 62, 62, 0.8)',
    borderRadius: '25px',
    border: '2px solid #d4af37',
    backdropFilter: 'blur(10px)'
  },

  breadcrumbItem: {
    fontSize: '1rem',
    color: '#d4af37',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    padding: '5px 10px',
    borderRadius: '15px'
  },

  breadcrumbItemHover: {
    background: 'rgba(212, 175, 55, 0.2)',
    transform: 'scale(1.05)'
  },

  breadcrumbSeparator: {
    fontSize: '1rem',
    color: 'rgba(212, 175, 55, 0.6)',
    fontWeight: '300'
  },

  // Decision tree container
  treeContainer: {
    flex: 1,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative'
  },

  // Node levels
  nodeLevel: {
    display: 'flex',
    gap: '40px',
    marginBottom: '50px',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%'
  },

  // Node styles
  node: {
    background: 'rgba(44, 62, 62, 0.9)',
    border: '2px solid #d4af37',
    borderRadius: '20px',
    padding: '30px',
    cursor: 'pointer',
    transition: 'all 0.4s ease',
    backdropFilter: 'blur(15px)',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
    textAlign: 'center',
    minWidth: '280px',
    maxWidth: '350px',
    position: 'relative',
    opacity: 0,
    transform: 'translateY(20px)',
    animation: 'fadeInUp 0.6s ease forwards'
  },

  nodeHover: {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: '0 15px 35px rgba(212, 175, 55, 0.4)',
    borderColor: '#f4d03f'
  },

  nodeIcon: {
    fontSize: '3rem',
    marginBottom: '20px',
    display: 'block'
  },

  nodeTitle: {
    fontSize: '1.8rem',
    color: '#d4af37',
    fontFamily: '"Great Vibes", cursive',
    fontWeight: '400',
    letterSpacing: '0.04em',
    marginBottom: '15px',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)'
  },

  nodeDescription: {
    fontSize: '1.1rem',
    color: '#f5f3f0',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontWeight: '300',
    lineHeight: '1.6',
    opacity: 0.9,
    marginBottom: '20px'
  },

  nodeDetails: {
    fontSize: '0.95rem',
    color: '#d4af37',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontWeight: '500',
    opacity: 0.8,
    fontStyle: 'italic'
  },

  // Service detail view
  serviceDetail: {
    width: '100%',
    maxWidth: '900px',
    background: 'rgba(44, 62, 62, 0.95)',
    border: '2px solid #d4af37',
    borderRadius: '25px',
    padding: '50px',
    backdropFilter: 'blur(15px)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
    opacity: 0,
    transform: 'translateY(20px)',
    animation: 'fadeInUp 0.6s ease forwards'
  },

  serviceTitle: {
    fontSize: '2.5rem',
    color: '#d4af37',
    fontFamily: '"Great Vibes", cursive',
    fontWeight: '400',
    letterSpacing: '0.04em',
    textAlign: 'center',
    marginBottom: '30px',
    textShadow: '0 4px 8px rgba(0, 0, 0, 0.8)'
  },

  serviceDescription: {
    fontSize: '1.2rem',
    color: '#f5f3f0',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontWeight: '300',
    lineHeight: '1.6',
    opacity: 0.9,
    textAlign: 'center',
    marginBottom: '40px'
  },

  // Features grid
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '25px',
    marginBottom: '40px'
  },

  featureCard: {
    background: 'rgba(26, 43, 43, 0.6)',
    border: '2px solid #d4af37',
    borderRadius: '15px',
    padding: '25px',
    transition: 'all 0.3s ease'
  },

  featureCardHover: {
    background: 'rgba(26, 43, 43, 0.8)',
    borderColor: '#f4d03f',
    transform: 'translateY(-3px)',
    boxShadow: '0 8px 25px rgba(212, 175, 55, 0.2)'
  },

  featureIcon: {
    fontSize: '2.5rem',
    color: '#d4af37',
    marginBottom: '15px',
    display: 'block'
  },

  featureTitle: {
    fontSize: '1.4rem',
    color: '#d4af37',
    fontFamily: '"Great Vibes", cursive',
    fontWeight: '400',
    letterSpacing: '0.04em',
    marginBottom: '10px',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)'
  },

  featureDescription: {
    fontSize: '1rem',
    color: '#f5f3f0',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontWeight: '300',
    lineHeight: '1.6',
    opacity: 0.9
  },

  // Action buttons
  actionButtons: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
    marginTop: '40px',
    flexWrap: 'wrap'
  },

  button: {
    padding: '15px 30px',
    fontSize: '1.1rem',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontWeight: '500',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    border: 'none',
    textDecoration: 'none',
    display: 'inline-block',
    textAlign: 'center'
  },

  primaryButton: {
    color: '#2c3e3e',
    background: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)',
    boxShadow: '0 6px 20px rgba(212, 175, 55, 0.3)'
  },

  primaryButtonHover: {
    transform: 'translateY(-3px)',
    boxShadow: '0 10px 25px rgba(212, 175, 55, 0.4)'
  },

  secondaryButton: {
    color: '#d4af37',
    background: 'rgba(212, 175, 55, 0.1)',
    border: '2px solid #d4af37'
  },

  secondaryButtonHover: {
    background: 'rgba(212, 175, 55, 0.2)',
    transform: 'translateY(-3px)'
  },

  // Back button
  backButton: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    background: 'rgba(44, 62, 62, 0.9)',
    border: '2px solid #d4af37',
    borderRadius: '10px',
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
    title: {
      fontSize: '2.5rem'
    },
    subtitle: {
      fontSize: '1.1rem'
    },
    node: {
      minWidth: '250px',
      padding: '25px'
    },
    serviceDetail: {
      padding: '30px 25px',
      margin: '20px'
    },
    featuresGrid: {
      gridTemplateColumns: '1fr'
    },
    actionButtons: {
      flexDirection: 'column',
      alignItems: 'center'
    }
  }
}

// Gold Flakes Component
const GoldFlakes = () => {
  const [flakes, setFlakes] = useState([])

  useEffect(() => {
    const generateFlakes = () => {
      const newFlakes = []
      for (let i = 0; i < 35; i++) {
        newFlakes.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 2,
          delay: Math.random() * 8,
          duration: Math.random() * 5 + 6
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
            0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
            25% { transform: translateY(-25px) rotate(90deg); opacity: 0.6; }
            50% { transform: translateY(-15px) rotate(180deg); opacity: 0.8; }
            75% { transform: translateY(-30px) rotate(270deg); opacity: 0.5; }
          }
          
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  )
}

// Main Consulting Page Component
const ConsultingPage = ({ onBack, onNavigate }) => {
  const [currentPath, setCurrentPath] = useState([])
  const [selectedService, setSelectedService] = useState(null)
  const [hoveredNode, setHoveredNode] = useState(null)
  const [hoveredFeature, setHoveredFeature] = useState(null)
  const [hoveredButton, setHoveredButton] = useState(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // Consulting services data structure
  const consultingServices = {
    'it-infrastructure': {
      title: 'IT Infrastructure',
      description: 'Modernize your technology foundation with scalable, secure, and efficient infrastructure solutions.',
      icon: '🏗️',
      detail: 'Transform your business with enterprise-grade IT infrastructure designed for growth, security, and performance.',
      features: [
        {
          icon: '☁️',
          title: 'Cloud Migration',
          description: 'Seamlessly migrate to Azure, AWS, or hybrid cloud environments with minimal downtime and maximum efficiency.'
        },
        {
          icon: '🔒',
          title: 'Security Implementation',
          description: 'Deploy comprehensive security frameworks including HIPAA compliance, data encryption, and access controls.'
        },
        {
          icon: '⚡',
          title: 'Performance Optimization',
          description: 'Enhance system performance through load balancing, caching strategies, and infrastructure scaling.'
        },
        {
          icon: '🔧',
          title: 'System Integration',
          description: 'Connect disparate systems and applications for seamless data flow and improved operational efficiency.'
        },
        {
          icon: '📊',
          title: 'Monitoring & Analytics',
          description: 'Implement real-time monitoring solutions with comprehensive dashboards and automated alerting.'
        },
        {
          icon: '🛡️',
          title: 'Disaster Recovery',
          description: 'Design robust backup and disaster recovery solutions to ensure business continuity and data protection.'
        }
      ]
    },
    'custom-apps': {
      title: 'Custom Applications',
      description: 'Build tailored software solutions that perfectly align with your business processes and goals.',
      icon: '📱',
      detail: 'Create powerful, user-friendly applications that solve your unique business challenges and drive growth.',
      features: [
        {
          icon: '🎨',
          title: 'UI/UX Design',
          description: 'Craft intuitive, responsive interfaces that provide exceptional user experiences across all devices.'
        },
        {
          icon: '⚛️',
          title: 'Modern Web Apps',
          description: 'Develop fast, scalable web applications using React, Three.js, and cutting-edge technologies.'
        },
        {
          icon: '📲',
          title: 'Mobile Development',
          description: 'Build native iOS and Android applications with advanced features like AR navigation and real-time sync.'
        },
        {
          icon: '🔗',
          title: 'API Integration',
          description: 'Connect your applications with external services, databases, and third-party APIs seamlessly.'
        },
        {
          icon: '⚡',
          title: 'Real-time Features',
          description: 'Implement live updates, notifications, and collaborative features for enhanced user engagement.'
        },
        {
          icon: '🧪',
          title: 'Testing & QA',
          description: 'Comprehensive testing strategies ensuring reliability, performance, and user satisfaction.'
        }
      ]
    },
    'data-analytics': {
      title: 'Data Analytics',
      description: 'Transform raw data into actionable insights with advanced analytics and visualization solutions.',
      icon: '📈',
      detail: 'Unlock the power of your data with intelligent analytics platforms that drive informed decision-making.',
      features: [
        {
          icon: '🔍',
          title: 'Data Discovery',
          description: 'Identify and catalog data sources, assess quality, and establish governance frameworks.'
        },
        {
          icon: '🔄',
          title: 'ETL Pipelines',
          description: 'Design robust data extraction, transformation, and loading processes for seamless data flow.'
        },
        {
          icon: '📊',
          title: 'Power BI Solutions',
          description: 'Create interactive dashboards and reports that reveal insights and drive strategic decisions.'
        },
        {
          icon: '🤖',
          title: 'AI Integration',
          description: 'Implement machine learning models and AI-powered analytics for predictive insights.'
        },
        {
          icon: '🏥',
          title: 'Healthcare Analytics',
          description: 'Specialized analytics for population health, care disparities, and clinical outcomes analysis.'
        },
        {
          icon: '📋',
          title: 'Compliance Reporting',
          description: 'Automated reporting solutions ensuring regulatory compliance and audit readiness.'
        }
      ]
    }
  }

  const handleServiceClick = useCallback((serviceId) => {
    setSelectedService(serviceId)
    setCurrentPath(['services', serviceId])
  }, [])

  const handleBreadcrumbClick = useCallback((index) => {
    if (index === -1) {
      // Root level
      setCurrentPath([])
      setSelectedService(null)
    } else {
      // Navigate to specific level
      const newPath = currentPath.slice(0, index + 1)
      setCurrentPath(newPath)
      if (newPath.length === 0) {
        setSelectedService(null)
      }
    }
  }, [currentPath])

  const handleContactClick = useCallback(() => {
    if (onNavigate) {
      onNavigate('contact')
    }
  }, [onNavigate])

  // Get responsive styles
  const titleStyles = {
    ...styles.title,
    ...(isMobile ? styles.mobile.title : {})
  }
  
  const subtitleStyles = {
    ...styles.subtitle,
    ...(isMobile ? styles.mobile.subtitle : {})
  }

  const nodeStyles = (serviceId) => ({
    ...styles.node,
    ...(isMobile ? styles.mobile.node : {}),
    ...(hoveredNode === serviceId ? styles.nodeHover : {})
  })

  const serviceDetailStyles = {
    ...styles.serviceDetail,
    ...(isMobile ? styles.mobile.serviceDetail : {})
  }

  const featuresGridStyles = {
    ...styles.featuresGrid,
    ...(isMobile ? styles.mobile.featuresGrid : {})
  }

  const actionButtonsStyles = {
    ...styles.actionButtons,
    ...(isMobile ? styles.mobile.actionButtons : {})
  }

  const renderBreadcrumb = () => {
    if (currentPath.length === 0) return null

    const breadcrumbItems = [
      { label: 'Consulting Services', path: [] }
    ]

    if (currentPath.includes('services')) {
      breadcrumbItems.push({ label: 'Services', path: ['services'] })
    }

    if (selectedService) {
      breadcrumbItems.push({ 
        label: consultingServices[selectedService].title, 
        path: ['services', selectedService] 
      })
    }

    return (
      <div style={styles.breadcrumb}>
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={index}>
            <span
              style={styles.breadcrumbItem}
              onClick={() => handleBreadcrumbClick(index - 1)}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(212, 175, 55, 0.2)'
                e.target.style.transform = 'scale(1.05)'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent'
                e.target.style.transform = 'scale(1)'
              }}
            >
              {item.label}
            </span>
            {index < breadcrumbItems.length - 1 && (
              <span style={styles.breadcrumbSeparator}>→</span>
            )}
          </React.Fragment>
        ))}
      </div>
    )
  }

  const renderServiceDetail = () => {
    if (!selectedService) return null

    const service = consultingServices[selectedService]

    return (
      <div style={serviceDetailStyles}>
        <h2 style={styles.serviceTitle}>{service.title}</h2>
        <p style={styles.serviceDescription}>{service.detail}</p>
        
        <div style={featuresGridStyles}>
          {service.features.map((feature, index) => (
            <div
              key={index}
              style={{
                ...styles.featureCard,
                ...(hoveredFeature === index ? styles.featureCardHover : {})
              }}
              onMouseEnter={() => setHoveredFeature(index)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <span style={styles.featureIcon}>{feature.icon}</span>
              <h3 style={styles.featureTitle}>{feature.title}</h3>
              <p style={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>

        <div style={actionButtonsStyles}>
          <button
            style={{
              ...styles.button,
              ...styles.primaryButton,
              ...(hoveredButton === 'contact' ? styles.primaryButtonHover : {})
            }}
            onClick={handleContactClick}
            onMouseEnter={() => setHoveredButton('contact')}
            onMouseLeave={() => setHoveredButton(null)}
          >
            Get Started
          </button>
          <button
            style={{
              ...styles.button,
              ...styles.secondaryButton,
              ...(hoveredButton === 'back' ? styles.secondaryButtonHover : {})
            }}
            onClick={() => handleBreadcrumbClick(-1)}
            onMouseEnter={() => setHoveredButton('back')}
            onMouseLeave={() => setHoveredButton(null)}
          >
            View All Services
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.consultingPage}>
      <GoldFlakes />
      
      {/* Back Button */}
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

      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={titleStyles}>Technology Consulting</h1>
          <p style={subtitleStyles}>
            Transform your business with expert consulting in IT infrastructure, custom applications, and data analytics. 
            Leveraging years of experience in healthcare technology and enterprise solutions.
          </p>
        </div>

        {/* Breadcrumb Navigation */}
        {renderBreadcrumb()}

        {/* Decision Tree */}
        <div style={styles.treeContainer}>
          {!selectedService ? (
            <div style={styles.nodeLevel}>
              {Object.entries(consultingServices).map(([key, service]) => (
                <div
                  key={key}
                  style={nodeStyles(key)}
                  onClick={() => handleServiceClick(key)}
                  onMouseEnter={() => setHoveredNode(key)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <span style={styles.nodeIcon}>{service.icon}</span>
                  <h3 style={styles.nodeTitle}>{service.title}</h3>
                  <p style={styles.nodeDescription}>{service.description}</p>
                  <div style={styles.nodeDetails}>Click to explore →</div>
                </div>
              ))}
            </div>
          ) : (
            renderServiceDetail()
          )}
        </div>
      </div>
    </div>
  )
}

export default ConsultingPage