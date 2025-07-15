import React, { useState, useCallback, useEffect } from 'react'

// All styling contained within this component
const styles = {
  projectsPage: {
    minHeight: '100vh',
    width: '100%',
    maxWidth: '100vw',
    background: 'linear-gradient(135deg, #2c3e3e 0%, #1a2b2b 100%)',
    color: '#f5f3f0',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    overflow: 'auto',
    overflowX: 'hidden',
    position: 'relative',
    padding: '20px 0',
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
    opacity: 0.3,
    animation: 'float 10s infinite ease-in-out'
  },

  container: {
    position: 'relative',
    zIndex: 10,
    maxWidth: '1200px',
    width: '100%',
    margin: '0 auto',
    padding: '0 20px',
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
    maxWidth: '800px',
    margin: '0 auto'
  },

  // Category tabs (mobile-first horizontal scroll)
  categoryTabs: {
    display: 'flex',
    gap: '20px',
    marginBottom: '40px',
    padding: '20px',
    overflowX: 'auto',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    boxSizing: 'border-box'
  },

  categoryTab: {
    minWidth: 'fit-content',
    padding: '15px 25px',
    background: 'rgba(44, 62, 62, 0.8)',
    border: '2px solid #d4af37',
    borderRadius: '25px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
    whiteSpace: 'nowrap',
    textAlign: 'center'
  },

  categoryTabActive: {
    background: 'rgba(212, 175, 55, 0.2)',
    borderColor: '#f4d03f',
    transform: 'scale(1.05)',
    boxShadow: '0 5px 15px rgba(212, 175, 55, 0.3)'
  },

  categoryTabHover: {
    background: 'rgba(212, 175, 55, 0.1)',
    borderColor: '#f4d03f',
    transform: 'translateY(-2px)'
  },

  categoryTabTitle: {
    fontSize: '1.1rem',
    color: '#d4af37',
    fontFamily: '"Great Vibes", cursive',
    fontWeight: '400',
    letterSpacing: '0.04em',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
    margin: '0 0 5px 0'
  },

  categoryTabIcon: {
    fontSize: '1.5rem',
    marginBottom: '8px',
    display: 'block'
  },

  categoryTabCount: {
    fontSize: '0.9rem',
    color: '#f5f3f0',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontWeight: '300',
    opacity: 0.8
  },

  // Projects container with unique staggered layout
  projectsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '30px',
    padding: '20px 0'
  },

  // Project card with alternating heights for visual interest
  projectCard: {
    background: 'rgba(44, 62, 62, 0.9)',
    border: '2px solid #d4af37',
    borderRadius: '20px',
    padding: '30px',
    backdropFilter: 'blur(15px)',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
    cursor: 'pointer',
    transition: 'all 0.4s ease',
    position: 'relative',
    overflow: 'hidden',
    opacity: 0,
    transform: 'translateY(30px)',
    animation: 'slideInUp 0.6s ease forwards'
  },

  projectCardHover: {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: '0 20px 40px rgba(212, 175, 55, 0.2)',
    borderColor: '#f4d03f'
  },

  projectCardExpanded: {
    background: 'rgba(212, 175, 55, 0.1)',
    borderColor: '#f4d03f',
    transform: 'scale(1.03)',
    zIndex: 100
  },

  // Project header
  projectHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px'
  },

  projectIcon: {
    fontSize: '2.5rem',
    marginRight: '15px',
    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))'
  },

  projectTitle: {
    fontSize: '1.8rem',
    color: '#d4af37',
    fontFamily: '"Great Vibes", cursive',
    fontWeight: '400',
    letterSpacing: '0.04em',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
    margin: '0 0 5px 0'
  },

  projectType: {
    fontSize: '0.9rem',
    color: '#f5f3f0',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontWeight: '500',
    opacity: 0.8,
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },

  // Project content
  projectDescription: {
    fontSize: '1.1rem',
    color: '#f5f3f0',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontWeight: '300',
    lineHeight: '1.6',
    opacity: 0.9,
    marginBottom: '20px'
  },

  // Tech stack tags
  techStack: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '20px'
  },

  techTag: {
    padding: '6px 12px',
    background: 'rgba(212, 175, 55, 0.2)',
    border: '1px solid #d4af37',
    borderRadius: '12px',
    fontSize: '0.8rem',
    color: '#d4af37',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '0.3px'
  },

  // Project stats
  projectStats: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    padding: '15px 0',
    borderTop: '1px solid rgba(212, 175, 55, 0.2)',
    borderBottom: '1px solid rgba(212, 175, 55, 0.2)'
  },

  statItem: {
    textAlign: 'center',
    flex: 1
  },

  statValue: {
    fontSize: '1.5rem',
    color: '#d4af37',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontWeight: '600',
    margin: '0 0 5px 0'
  },

  statLabel: {
    fontSize: '0.8rem',
    color: '#f5f3f0',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontWeight: '300',
    opacity: 0.8,
    textTransform: 'uppercase',
    letterSpacing: '0.3px'
  },

  // Project links
  projectLinks: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap'
  },

  projectLink: {
    padding: '8px 16px',
    background: 'rgba(212, 175, 55, 0.1)',
    border: '2px solid #d4af37',
    borderRadius: '8px',
    color: '#d4af37',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    textAlign: 'center',
    minWidth: 'fit-content'
  },

  projectLinkHover: {
    background: 'rgba(212, 175, 55, 0.2)',
    borderColor: '#f4d03f',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(212, 175, 55, 0.3)'
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
    zIndex: 200
  },

  // Mobile styles
  mobile: {
    title: {
      fontSize: '2.5rem'
    },
    subtitle: {
      fontSize: '1.1rem'
    },
    projectsContainer: {
      gridTemplateColumns: '1fr',
      gap: '20px'
    },
    projectCard: {
      padding: '25px 20px'
    },
    projectHeader: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      textAlign: 'left'
    },
    projectIcon: {
      marginRight: '0',
      marginBottom: '10px'
    },
    projectStats: {
      flexDirection: 'column',
      gap: '15px'
    },
    statItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      textAlign: 'left'
    },
    projectLinks: {
      flexDirection: 'column'
    },
    projectLink: {
      textAlign: 'center'
    }
  }
}

// Gold Flakes Component
const GoldFlakes = () => {
  const [flakes, setFlakes] = useState([])

  useEffect(() => {
    const generateFlakes = () => {
      const newFlakes = []
      for (let i = 0; i < 30; i++) {
        newFlakes.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 2,
          delay: Math.random() * 10,
          duration: Math.random() * 6 + 8
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
            0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.2; }
            25% { transform: translateY(-20px) rotate(90deg); opacity: 0.4; }
            50% { transform: translateY(-10px) rotate(180deg); opacity: 0.6; }
            75% { transform: translateY(-25px) rotate(270deg); opacity: 0.3; }
          }
          
          @keyframes slideInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  )
}

// Main Projects Page Component
const ProjectsPage = ({ onBack }) => {
  const [activeCategory, setActiveCategory] = useState('mobile')
  const [expandedProject, setExpandedProject] = useState(null)
  const [hoveredTab, setHoveredTab] = useState(null)
  const [hoveredProject, setHoveredProject] = useState(null)
  const [hoveredLink, setHoveredLink] = useState(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // Projects data organized by category
  const projectCategories = {
    mobile: {
      title: 'Mobile Apps',
      icon: '📱',
      count: 3,
      projects: [
        {
          id: 'scroll',
          title: 'Scroll',
          type: 'iOS Bible App',
          icon: '📖',
          description: 'Explore the depths of spirituality with a curated collection of uplifting Bible verses categorized by themes like love, joy, and peace.',
          tech: ['Swift', 'iOS', 'Core Data', 'UIKit'],
          stats: {
            rating: '5.0★',
            downloads: '10K+',
            reviews: '100+'
          },
          links: [
            { label: 'App Store', url: 'https://apps.apple.com/us/app/scroll/id6497410297' }
          ]
        },
        {
          id: 'roadvision',
          title: 'RoadVision',
          type: 'AR Navigation App',
          icon: '🏎️',
          description: 'Dynamic navigation with real-time AR route visualization using iPhone camera, MapKit integration, and advanced location services.',
          tech: ['Swift', 'ARKit', 'MapKit', 'Core Location'],
          stats: {
            features: '15+',
            accuracy: '98%',
            platforms: 'iOS'
          },
          links: [
            { label: 'LinkedIn Demo', url: 'https://www.linkedin.com/feed/update/urn:li:ugcPost:7178911923894190080' }
          ]
        },
        {
          id: 'sundai-eq',
          title: 'Sundai EQ',
          type: 'Audio Equalizer Extension',
          icon: '🎵',
          description: 'Professional-grade audio equalizer extension for YouTube with real-time effects, preset management, and seamless integration.',
          tech: ['JavaScript', 'Web Extensions', 'Audio API', 'Chrome API'],
          stats: {
            presets: '20+',
            users: '5K+',
            platforms: 'Chrome'
          },
          links: [
            { label: 'Chrome Store', url: 'https://chromewebstore.google.com/detail/odjoljgdlfligaffcafkbgehfnngmdbj' }
          ]
        }
      ]
    },
    business: {
      title: 'Business Apps',
      icon: '💼',
      count: 4,
      projects: [
        {
          id: 'medrec',
          title: 'MedRec',
          type: 'AI Clinical Platform',
          icon: '🏥',
          description: 'AI-powered medical document processing platform reducing manual data entry by 90% with HIPAA-compliant workflows.',
          tech: ['Azure OpenAI', 'React', 'Node.js', 'HIPAA'],
          stats: {
            efficiency: '90%',
            processing: 'Real-time',
            compliance: 'HIPAA'
          },
          links: [
            { label: 'Platform', url: 'https://medrec.sundai.us/' }
          ]
        },
        {
          id: 'stocks2',
          title: 'Stocks2',
          type: 'Market Analysis Platform',
          icon: '📈',
          description: 'AI-powered market analysis with 8-hour forecasts, real-time data, sentiment analysis, and secure Azure AD authentication.',
          tech: ['React', 'AI/ML', 'Azure AD', 'Real-time APIs'],
          stats: {
            forecasts: '8-hour',
            accuracy: '85%',
            security: 'Azure AD'
          },
          links: [
            { label: 'Platform', url: 'https://stocks.sundai.us/' }
          ]
        },
        {
          id: 'pdf-titan',
          title: 'PDF Titan',
          type: 'ServiceTitan Integration',
          icon: '📄',
          description: 'Simple PDF editor integrated with ServiceTitan for technicians to edit, sign, and fill PDFs directly from jobs.',
          tech: ['ServiceTitan API', 'PDF.js', 'React', 'Node.js'],
          stats: {
            timeSaved: '10-15min',
            integration: 'ServiceTitan',
            efficiency: '80%'
          },
          links: [
            { label: 'Platform', url: 'https://a1.sundai.us/' }
          ]
        },
        {
          id: 'azure-cd',
          title: 'Azure Container CD',
          type: 'DevOps Platform',
          icon: '🚀',
          description: 'Configure continuous deployment with Azure and GitHub Container Registry through a simple 6-step process.',
          tech: ['Azure', 'GitHub Actions', 'Docker', 'CI/CD'],
          stats: {
            steps: '6',
            deployment: 'Automated',
            integration: 'GitHub'
          },
          links: [
            { label: 'Platform', url: 'https://dev.sundai.us/' }
          ]
        }
      ]
    },
    other: {
      title: 'Other Apps',
      icon: '🔧',
      count: 1,
      projects: [
        {
          id: 'sundai-portfolio',
          title: 'Sundai Portfolio',
          type: '3D Interactive Website',
          icon: '🌐',
          description: 'Modern 3D portfolio website built with React Three Fiber featuring interactive carousel navigation and responsive design.',
          tech: ['React', 'Three.js', 'React Three Fiber', 'Vite'],
          stats: {
            performance: '60 FPS',
            responsive: '100%',
            interactive: '3D'
          },
          links: [
            { label: 'Live Site', url: 'https://sundai.us/' }
          ]
        }
      ]
    }
  }

  const handleCategoryClick = useCallback((category) => {
    setActiveCategory(category)
    setExpandedProject(null)
  }, [])

  const handleProjectClick = useCallback((projectId) => {
    setExpandedProject(expandedProject === projectId ? null : projectId)
  }, [expandedProject])

  // Get responsive styles
  const titleStyles = {
    ...styles.title,
    ...(isMobile ? styles.mobile.title : {})
  }
  
  const subtitleStyles = {
    ...styles.subtitle,
    ...(isMobile ? styles.mobile.subtitle : {})
  }

  const projectsContainerStyles = {
    ...styles.projectsContainer,
    ...(isMobile ? styles.mobile.projectsContainer : {})
  }

  const activeProjects = projectCategories[activeCategory].projects

  return (
    <div style={styles.projectsPage}>
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
          <h1 style={titleStyles}>My Projects</h1>
          <p style={subtitleStyles}>
            A collection of innovative solutions spanning mobile applications, business platforms, 
            and creative projects that solve real-world problems.
          </p>
        </div>

        {/* Category Tabs */}
        <div style={styles.categoryTabs}>
          {Object.entries(projectCategories).map(([key, category]) => (
            <div
              key={key}
              style={{
                ...styles.categoryTab,
                ...(activeCategory === key ? styles.categoryTabActive : {}),
                ...(hoveredTab === key && activeCategory !== key ? styles.categoryTabHover : {})
              }}
              onClick={() => handleCategoryClick(key)}
              onMouseEnter={() => setHoveredTab(key)}
              onMouseLeave={() => setHoveredTab(null)}
            >
              <span style={styles.categoryTabIcon}>{category.icon}</span>
              <div style={styles.categoryTabTitle}>{category.title}</div>
              <div style={styles.categoryTabCount}>{category.count} projects</div>
            </div>
          ))}
        </div>

        {/* Projects Grid */}
        <div style={projectsContainerStyles}>
          {activeProjects.map((project, index) => (
            <div
              key={project.id}
              style={{
                ...styles.projectCard,
                ...(isMobile ? styles.mobile.projectCard : {}),
                ...(hoveredProject === project.id && expandedProject !== project.id ? styles.projectCardHover : {}),
                ...(expandedProject === project.id ? styles.projectCardExpanded : {}),
                animationDelay: `${index * 0.1}s`
              }}
              onClick={() => handleProjectClick(project.id)}
              onMouseEnter={() => setHoveredProject(project.id)}
              onMouseLeave={() => setHoveredProject(null)}
            >
              {/* Project Header */}
              <div style={{
                ...styles.projectHeader,
                ...(isMobile ? styles.mobile.projectHeader : {})
              }}>
                <span style={{
                  ...styles.projectIcon,
                  ...(isMobile ? styles.mobile.projectIcon : {})
                }}>
                  {project.icon}
                </span>
                <div>
                  <h3 style={styles.projectTitle}>{project.title}</h3>
                  <div style={styles.projectType}>{project.type}</div>
                </div>
              </div>

              {/* Project Description */}
              <p style={styles.projectDescription}>{project.description}</p>

              {/* Tech Stack */}
              <div style={styles.techStack}>
                {project.tech.map((tech, techIndex) => (
                  <span key={techIndex} style={styles.techTag}>{tech}</span>
                ))}
              </div>

              {/* Project Stats */}
              <div style={{
                ...styles.projectStats,
                ...(isMobile ? styles.mobile.projectStats : {})
              }}>
                {Object.entries(project.stats).map(([key, value]) => (
                  <div key={key} style={{
                    ...styles.statItem,
                    ...(isMobile ? styles.mobile.statItem : {})
                  }}>
                    <div style={styles.statValue}>{value}</div>
                    <div style={styles.statLabel}>{key}</div>
                  </div>
                ))}
              </div>

              {/* Project Links */}
              <div style={{
                ...styles.projectLinks,
                ...(isMobile ? styles.mobile.projectLinks : {})
              }}>
                {project.links.map((link, linkIndex) => (
                  <a
                    key={linkIndex}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      ...styles.projectLink,
                      ...(isMobile ? styles.mobile.projectLink : {}),
                      ...(hoveredLink === `${project.id}-${linkIndex}` ? styles.projectLinkHover : {})
                    }}
                    onMouseEnter={() => setHoveredLink(`${project.id}-${linkIndex}`)}
                    onMouseLeave={() => setHoveredLink(null)}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProjectsPage