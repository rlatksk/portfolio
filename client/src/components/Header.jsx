import { motion } from 'framer-motion'
import { usePortfolio } from '../context/PortfolioContext'

const Header = () => {
  const { data } = usePortfolio()
  const profile = data.profile

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <header className="newspaper-header">
      <div className="header-top">
        <span>Vol. MMXXVI No. 42</span>
        <span>{currentDate}</span>
        <span>Price: Free Knowledge</span>
      </div>
      
      <motion.h1 
        className="newspaper-title"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ 
          duration: 0.5,
          repeat: Infinity,
          repeatType: "reverse",
          repeatDelay: 5
        }}
      >
        {profile.name || 'The Tech Prophet'}
      </motion.h1>
      
      <p className="newspaper-subtitle">
        "{profile.subtitle}"
      </p>
      
      <div className="header-line">
        <span>Web Development</span>
        <span>•</span>
        <span>AI & Innovation</span>
        <span>•</span>
        <span>Software Craftsmanship</span>
      </div>
    </header>
  )
}

export default Header
