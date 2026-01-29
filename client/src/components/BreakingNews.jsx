import { motion } from 'framer-motion'
import { usePortfolio } from '../context/PortfolioContext'

const BreakingNews = () => {
  const { data, loading } = usePortfolio()
  
  // Create breaking news text from projects
  const createBreakingText = () => {
    if (loading || !data.projects.length) {
      return "→ Welcome to my portfolio! Explore my latest projects and creations..."
    }
    
    const projectNews = data.projects.map(p => 
      `${p.title} — ${p.description}`
    ).join('  ·  ')
    
    return `FEATURED WORKS:  ${projectNews}  ·  More projects coming soon`
  }

  return (
    <div className="breaking-news">
      <motion.span 
        className="breaking-label"
        animate={{ 
          boxShadow: [
            "0 0 5px rgba(204,0,0,0.5)",
            "0 0 20px rgba(204,0,0,0.8)",
            "0 0 5px rgba(204,0,0,0.5)"
          ]
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        Featured Works
      </motion.span>
      <div className="breaking-text-container" style={{ overflow: 'hidden', flex: 1 }}>
        <motion.span 
          className="breaking-text"
          animate={{ x: [1000, -3000] }}
          transition={{ 
            duration: 35,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {createBreakingText()}
        </motion.span>
      </div>
    </div>
  )
}

export default BreakingNews
