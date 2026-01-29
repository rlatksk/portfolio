import { motion } from 'framer-motion'
import { usePortfolio } from '../context/PortfolioContext'

const Sidebar = () => {
  const { data, loading } = usePortfolio()
  const projects = data.projects
  const email = data.profile?.email || 'your@email.com'

  if (loading) {
    return (
      <aside className="sidebar">
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Loading...
          </motion.div>
        </div>
      </aside>
    )
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <h3 className="sidebar-title">All Projects</h3>
        
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            className="news-item"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ 
              x: 5,
              backgroundColor: "rgba(0,0,0,0.02)"
            }}
          >
            <h4 className="news-item-title">{project.title}</h4>
            <p className="news-item-excerpt">{project.description}</p>
            <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginTop: '8px' }}>
              {project.tags.map(tag => (
                <span 
                  key={tag}
                  style={{
                    background: '#2d2926',
                    color: '#faf8f3',
                    padding: '2px 8px',
                    fontSize: '0.65rem',
                    fontFamily: "'Special Elite', cursive"
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
            {(project.url || project.github) && (
              <div style={{ marginTop: '8px', display: 'flex', gap: '10px' }}>
                {project.url && project.url !== '#' && (
                  <a 
                    href={project.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ fontSize: '0.75rem', color: '#7a6b5a' }}
                  >
                    Live →
                  </a>
                )}
                {project.github && project.github !== '#' && (
                  <a 
                    href={project.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ fontSize: '0.75rem', color: '#7a6b5a' }}
                  >
                    GitHub →
                  </a>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </div>
      
      <motion.div 
        className="sidebar-section"
        style={{ 
          background: '#e8dcc8', 
          padding: '20px', 
          border: '2px solid #2a2a2a',
          textAlign: 'center'
        }}
        whileHover={{ scale: 1.02 }}
      >
        <h3 style={{ 
          fontFamily: "'Playfair Display', serif", 
          fontSize: '1.1rem',
          marginBottom: '10px'
        }}>
          📬 Get In Touch
        </h3>
        <p style={{ fontSize: '0.85rem', marginBottom: '15px', color: '#3a3a3a' }}>
          Interested in working together? Send me a message!
        </p>
        <motion.a
          href={`mailto:${email}`}
          style={{
            display: 'block',
            width: '100%',
            padding: '10px',
            background: '#1a1a1a',
            color: '#f5f0e1',
            border: 'none',
            fontFamily: "'Special Elite', cursive",
            cursor: 'pointer',
            textDecoration: 'none',
            textAlign: 'center'
          }}
          whileHover={{ backgroundColor: '#8b7355' }}
          whileTap={{ scale: 0.98 }}
        >
          ✉️ Send Message
        </motion.a>
      </motion.div>
    </aside>
  )
}

export default Sidebar
