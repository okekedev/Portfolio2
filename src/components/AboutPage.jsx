import React, { useState, useCallback, useEffect } from 'react'

// All styling contained within this component
const styles = {
  aboutPage: {
    height: '100vh',
    width: '100vw',
    background: 'linear-gradient(135deg, #2c3e3e 0%, #1a2b2b 100%)',
    color: '#f5f3f0',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    overflow: 'auto',
    position: 'relative',
    padding: '20px'
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
    margin: '0 auto',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
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
    maxWidth: '600px'
  },

  // Tree container
  treeContainer: {
    flex: 1,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative'
  },

  // Root level (main categories)
  rootLevel: {
    display: 'flex',
    gap: '60px',
    marginBottom: '60px',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },

  // Node styles
  node: {
    background: 'rgba(44, 62, 62, 0.9)',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: '#d4af37',
    borderRadius: '16px',
    padding: '25px',
    cursor: 'pointer',
    transition: 'all 0.4s ease',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
    textAlign: 'center',
    minWidth: '200px',
    position: 'relative'
  },

  nodeActive: {
    background: 'rgba(212, 175, 55, 0.2)',
    borderColor: '#f4d03f',
    transform: 'scale(1.05)',
    boxShadow: '0 12px 32px rgba(212, 175, 55, 0.4)'
  },

  nodeHover: {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 28px rgba(212, 175, 55, 0.3)'
  },

  nodeTitle: {
    fontSize: '1.4rem',
    color: '#d4af37',
    fontFamily: '"Great Vibes", cursive',
    marginBottom: '8px',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)'
  },

  nodeSubtitle: {
    fontSize: '0.9rem',
    color: '#f5f3f0',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontWeight: '300',
    opacity: 0.8,
    lineHeight: '1.4'
  },

  nodeIcon: {
    fontSize: '2.5rem',
    marginBottom: '15px',
    display: 'block'
  },

  // Expanded content area
  expandedContent: {
    width: '100%',
    maxWidth: '1000px',
    background: 'rgba(44, 62, 62, 0.95)',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#d4af37',
    borderRadius: '20px',
    padding: '40px',
    backdropFilter: 'blur(15px)',
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.4)',
    marginTop: '40px',
    opacity: 0,
    transform: 'translateY(20px)',
    animation: 'fadeInUp 0.6s ease forwards'
  },

  expandedTitle: {
    fontSize: '2.2rem',
    color: '#d4af37',
    fontFamily: '"Great Vibes", cursive',
    marginBottom: '25px',
    textAlign: 'center',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)'
  },

  // Content grids
  skillsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '25px',
    marginTop: '20px'
  },

  skillCategory: {
    background: 'rgba(26, 43, 43, 0.6)',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'rgba(212, 175, 55, 0.3)',
    borderRadius: '12px',
    padding: '20px',
    transition: 'all 0.3s ease'
  },

  skillCategoryHover: {
    background: 'rgba(26, 43, 43, 0.8)',
    borderColor: 'rgba(212, 175, 55, 0.5)',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(212, 175, 55, 0.2)'
  },

  skillCategoryTitle: {
    fontSize: '1.3rem',
    color: '#d4af37',
    fontFamily: '"Great Vibes", cursive',
    marginBottom: '15px',
    textAlign: 'center',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)'
  },

  skillsList: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },

  skillItem: {
    fontSize: '1rem',
    color: '#f5f3f0',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontWeight: '400',
    paddingTop: '8px',
    paddingBottom: '8px',
    paddingLeft: '0px',
    paddingRight: '0px',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: 'rgba(212, 175, 55, 0.1)',
    opacity: 0.9,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    position: 'relative'
  },

  skillItemHover: {
    opacity: 1,
    color: '#d4af37',
    paddingLeft: '10px',
    borderBottomColor: 'rgba(212, 175, 55, 0.3)'
  },

  skillTooltip: {
    position: 'absolute',
    bottom: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(44, 62, 62, 0.95)',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#d4af37',
    borderRadius: '8px',
    padding: '10px 15px',
    fontSize: '0.85rem',
    color: '#f5f3f0',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontWeight: '300',
    whiteSpace: 'nowrap',
    zIndex: 100,
    opacity: 0,
    transform: 'translateX(-50%) translateY(10px)',
    transition: 'all 0.3s ease',
    pointerEvents: 'none',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
  },

  skillTooltipVisible: {
    opacity: 1,
    transform: 'translateX(-50%) translateY(0)'
  },

  // Career timeline
  timeline: {
    position: 'relative',
    paddingLeft: '30px'
  },

  timelineItem: {
    position: 'relative',
    marginBottom: '40px',
    paddingLeft: '40px',
    transition: 'all 0.3s ease'
  },

  timelineItemHover: {
    transform: 'translateX(5px)'
  },

  timelineDate: {
    fontSize: '1rem',
    color: '#d4af37',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontWeight: '600',
    marginBottom: '8px',
    letterSpacing: '0.5px'
  },

  timelineTitle: {
    fontSize: '1.4rem',
    color: '#f5f3f0',
    fontFamily: '"Great Vibes", cursive',
    marginBottom: '8px',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)'
  },

  timelineCompany: {
    fontSize: '1.1rem',
    color: '#d4af37',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontWeight: '500',
    marginBottom: '10px',
    opacity: 0.9
  },

  timelineDescription: {
    fontSize: '1rem',
    color: '#f5f3f0',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontWeight: '300',
    lineHeight: '1.6',
    opacity: 0.9
  },

  timelineDot: {
    position: 'absolute',
    left: '-35px',
    top: '5px',
    width: '12px',
    height: '12px',
    background: '#d4af37',
    borderRadius: '50%',
    boxShadow: '0 0 10px rgba(212, 175, 55, 0.5)',
    transition: 'all 0.3s ease'
  },

  timelineDotHover: {
    transform: 'scale(1.2)',
    boxShadow: '0 0 15px rgba(212, 175, 55, 0.8)'
  },

  timelineLine: {
    position: 'absolute',
    left: '-29px',
    top: '20px',
    bottom: '-25px',
    width: '2px',
    background: 'linear-gradient(to bottom, #d4af37, rgba(212, 175, 55, 0.3))'
  },

  // Back button
  backButton: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    background: 'rgba(44, 62, 62, 0.9)',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#d4af37',
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

  // Reset button
  resetButton: {
    background: 'rgba(212, 175, 55, 0.1)',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#d4af37',
    borderRadius: '8px',
    padding: '12px 24px',
    color: '#d4af37',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontWeight: '500',
    fontSize: '1.1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
    marginTop: '30px'
  },

  // Mobile styles
  mobile: {
    title: {
      fontSize: '2.5rem'
    },
    subtitle: {
      fontSize: '1.1rem'
    },
    rootLevel: {
      gap: '30px'
    },
    node: {
      minWidth: '160px',
      padding: '20px'
    },
    expandedContent: {
      padding: '25px',
      margin: '20px'
    },
    skillsGrid: {
      gridTemplateColumns: '1fr'
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
          duration: Math.random() * 5 + 8
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
          
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  )
}

// Main About Page Component
const AboutPage = ({ onBack }) => {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [hoveredNode, setHoveredNode] = useState(null)
  const [hoveredSkill, setHoveredSkill] = useState(null)
  const [hoveredCategory, setHoveredCategory] = useState(null)
  const [hoveredTimelineItem, setHoveredTimelineItem] = useState(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // Enhanced data structure with skill explanations
  const categories = [
    {
      id: 'skills',
      title: 'Technical Skills',
      subtitle: 'Technologies & Expertise',
      icon: '⚡',
      content: {
        'AI & Machine Learning': [
          { name: 'Azure OpenAI', description: 'Integrated GPT models for document processing and automation' },
          { name: 'Document Processing', description: 'AI-powered extraction and analysis of clinical documents' },
          { name: 'Intelligent Automation', description: 'Automated workflows reducing manual tasks by 90%' },
          { name: 'HIPAA-Compliant AI', description: 'Secure AI solutions meeting healthcare compliance standards' }
        ],
        'Cloud & Infrastructure': [
          { name: 'Microsoft Azure', description: 'Cloud platform for scalable healthcare applications' },
          { name: 'Power BI', description: 'Advanced analytics and data visualization for health insights' },
          { name: 'Power Automate', description: 'Workflow automation reducing processing time by 95%' },
          { name: 'System Integration', description: 'Connected EMR, Teams, and analytics platforms seamlessly' }
        ],
        'Development': [
          { name: 'React & Three.js', description: 'Modern web apps with 3D visualizations and interactions' },
          { name: 'Swift (iOS)', description: 'Native mobile apps including AR navigation and Bible study' },
          { name: 'Web Development', description: 'Full-stack solutions with responsive design and APIs' },
          { name: 'Database Management', description: 'Optimized data structures for healthcare and analytics' }
        ],
        'Healthcare Technology': [
          { name: 'EMR Optimization', description: 'Enhanced clinical workflows and data accuracy' },
          { name: 'Clinical Workflows', description: 'Streamlined patient care processes and documentation' },
          { name: 'Health Data Analytics', description: 'Population health insights and care disparity analysis' },
          { name: 'Compliance Systems', description: 'HIPAA-compliant frameworks and security protocols' }
        ]
      }
    },
    {
      id: 'career',
      title: 'Career Journey',
      subtitle: 'Professional Experience',
      icon: '🚀',
      content: [
        {
          date: 'Mar 2024 - Present',
          title: 'Director of Information Technology',
          company: 'Healing Hands Healthcare, LLC',
          description: 'Spearheading digital transformation through AI-powered solutions and data-driven automation. Leading technology strategy with advanced analytics, intelligent document processing, and system integration to optimize clinical workflows.'
        },
        {
          date: '2021 - 2024',
          title: 'Technology Innovation',
          company: 'Healthcare Solutions',
          description: 'Developed multiple healthcare technology solutions including MedRec AI platform, hospice referral digitization, and health equity analysis systems.'
        },
        {
          date: '2020 - Present',
          title: 'Independent Developer',
          company: 'Sundai',
          description: 'Creating innovative mobile and web applications including RoadVision navigation app, Scroll Bible app, and various AI-powered tools.'
        }
      ]
    },
    {
      id: 'achievements',
      title: 'Key Achievements',
      subtitle: 'Notable Projects & Impact',
      icon: '🏆',
      content: {
        'MedRec - AI Clinical Platform': [
          { name: 'Reduced manual data entry by 90%', description: 'Automated clinical document processing saves hours daily' },
          { name: 'Azure OpenAI integration', description: 'Intelligent document analysis and data extraction' },
          { name: 'HIPAA-compliant workflows', description: 'Secure, compliant healthcare data processing' },
          { name: 'Hours to minutes processing', description: 'Accelerated referral workflows dramatically' }
        ],
        'Digital Transformation': [
          { name: 'One-click automation', description: 'Transformed 10-minute manual processes to 3-5 minutes' },
          { name: '70% time reduction', description: 'Eliminated multi-step Teams download workflows' },
          { name: 'Improved data accuracy', description: 'Reduced human error through automated systems' },
          { name: 'Workflow optimization', description: 'Streamlined complex multi-system processes' }
        ],
        'Health Equity Analysis': [
          { name: 'Power BI analytics platform', description: 'Comprehensive health disparities visualization' },
          { name: 'Multi-source integration', description: 'Connected VVI, SHP, and HCHB data sources' },
          { name: 'Population health insights', description: 'Identified care gaps across demographics' },
          { name: 'Social determinants impact', description: 'Analyzed factors affecting health outcomes' }
        ],
        'Mobile Innovation': [
          { name: 'RoadVision AR navigation', description: 'AR-powered navigation with real-time route visualization' },
          { name: 'Scroll Bible app (5.0★)', description: 'Feature-rich Bible study with categorized verses' },
          { name: 'MapKit integration', description: 'Advanced iOS location services and mapping' },
          { name: 'App Store success', description: 'Published applications with excellent user ratings' }
        ]
      }
    }
  ]

  const handleCategoryClick = useCallback((categoryId) => {
    setSelectedCategory(categoryId)
  }, [])

  const handleReset = useCallback(() => {
    setSelectedCategory(null)
  }, [])

  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory)

  // Get responsive styles
  const titleStyles = {
    ...styles.title,
    ...(isMobile ? styles.mobile.title : {})
  }
  
  const subtitleStyles = {
    ...styles.subtitle,
    ...(isMobile ? styles.mobile.subtitle : {})
  }

  const rootLevelStyles = {
    ...styles.rootLevel,
    ...(isMobile ? styles.mobile.rootLevel : {})
  }

  const nodeStyles = (categoryId) => ({
    ...styles.node,
    ...(isMobile ? styles.mobile.node : {}),
    ...(selectedCategory === categoryId ? styles.nodeActive : {}),
    ...(hoveredNode === categoryId && !selectedCategory ? styles.nodeHover : {})
  })

  const expandedContentStyles = {
    ...styles.expandedContent,
    ...(isMobile ? styles.mobile.expandedContent : {})
  }

  const skillsGridStyles = {
    ...styles.skillsGrid,
    ...(isMobile ? styles.mobile.skillsGrid : {})
  }

  const renderExpandedContent = () => {
    if (!selectedCategoryData) return null

    return (
      <div style={expandedContentStyles}>
        <h3 style={styles.expandedTitle}>{selectedCategoryData.title}</h3>
        
        {(selectedCategory === 'skills' || selectedCategory === 'achievements') && (
          <div style={skillsGridStyles}>
            {Object.entries(selectedCategoryData.content).map(([category, items]) => (
              <div 
                key={category} 
                style={{
                  ...styles.skillCategory,
                  ...(hoveredCategory === category ? styles.skillCategoryHover : {})
                }}
                onMouseEnter={() => setHoveredCategory(category)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <h4 style={styles.skillCategoryTitle}>{category}</h4>
                <ul style={styles.skillsList}>
                  {items.map((item, index) => (
                    <li 
                      key={index} 
                      style={{
                        ...styles.skillItem,
                        ...(hoveredSkill === `${category}-${index}` ? styles.skillItemHover : {})
                      }}
                      onMouseEnter={() => setHoveredSkill(`${category}-${index}`)}
                      onMouseLeave={() => setHoveredSkill(null)}
                    >
                      • {item.name}
                      <div 
                        style={{
                          ...styles.skillTooltip,
                          ...(hoveredSkill === `${category}-${index}` ? styles.skillTooltipVisible : {})
                        }}
                      >
                        {item.description}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {selectedCategory === 'career' && (
          <div style={styles.timeline}>
            {selectedCategoryData.content.map((item, index) => (
              <div 
                key={index} 
                style={{
                  ...styles.timelineItem,
                  ...(hoveredTimelineItem === index ? styles.timelineItemHover : {})
                }}
                onMouseEnter={() => setHoveredTimelineItem(index)}
                onMouseLeave={() => setHoveredTimelineItem(null)}
              >
                <div 
                  style={{
                    ...styles.timelineDot,
                    ...(hoveredTimelineItem === index ? styles.timelineDotHover : {})
                  }}
                ></div>
                {index < selectedCategoryData.content.length - 1 && (
                  <div style={styles.timelineLine}></div>
                )}
                <div style={styles.timelineDate}>{item.date}</div>
                <div style={styles.timelineTitle}>{item.title}</div>
                <div style={styles.timelineCompany}>{item.company}</div>
                <div style={styles.timelineDescription}>{item.description}</div>
              </div>
            ))}
          </div>
        )}

        <button
          style={styles.resetButton}
          onClick={handleReset}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(212, 175, 55, 0.2)'
            e.target.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(212, 175, 55, 0.1)'
            e.target.style.transform = 'translateY(0)'
          }}
        >
          ← Back to Overview
        </button>
      </div>
    )
  }

  return (
    <div style={styles.aboutPage}>
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
          <h1 style={titleStyles}>About Christian</h1>
          <p style={subtitleStyles}>
            Director of Information Technology passionate about AI-powered healthcare solutions, 
            digital transformation, and creating technology that makes a meaningful impact.
          </p>
        </div>

        {/* Interactive Tree */}
        <div style={styles.treeContainer}>
          {!selectedCategory && (
            <div style={rootLevelStyles}>
              {categories.map((category) => (
                <div
                  key={category.id}
                  style={nodeStyles(category.id)}
                  onClick={() => handleCategoryClick(category.id)}
                  onMouseEnter={() => setHoveredNode(category.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <span style={styles.nodeIcon}>{category.icon}</span>
                  <div style={styles.nodeTitle}>{category.title}</div>
                  <div style={styles.nodeSubtitle}>{category.subtitle}</div>
                </div>
              ))}
            </div>
          )}

          {/* Expanded Content */}
          {selectedCategory && renderExpandedContent()}
        </div>
      </div>
    </div>
  )
}

export default AboutPage