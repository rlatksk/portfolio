import { motion } from 'framer-motion'
import { usePortfolio } from '../context/PortfolioContext'

const Footer = () => {
  const { data } = usePortfolio()
  const social = data.profile?.social || {}
  const currentYear = new Date().getFullYear()

  return (
    <footer className="newspaper-footer">
      <div className="footer-content">
        <div className="footer-links">
          <motion.a 
            href="#" 
            className="footer-link"
            whileHover={{ scale: 1.05 }}
          >
            Home
          </motion.a>
          <motion.a 
            href="#about" 
            className="footer-link"
            whileHover={{ scale: 1.05 }}
          >
            About
          </motion.a>
          <motion.a 
            href="#projects" 
            className="footer-link"
            whileHover={{ scale: 1.05 }}
          >
            Projects
          </motion.a>
          <motion.a 
            href={`mailto:${data.profile?.email || ''}`}
            className="footer-link"
            whileHover={{ scale: 1.05 }}
          >
            Contact
          </motion.a>
        </div>
        
        <div className="footer-social">
          <motion.a
            href={social.github || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
          >
            <img src="/GitHub_Invertocat_Black.svg" alt="GitHub" style={{ width: '20px', height: '20px' }} />
          </motion.a>
          <motion.a
            href={social.linkedin || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
            whileHover={{ scale: 1.1, rotate: -5 }}
            whileTap={{ scale: 0.9 }}
          >
            <img src="/linkedin-svgrepo-com.svg" alt="LinkedIn" style={{ width: '20px', height: '20px' }} />
          </motion.a>
          <motion.a
            href={social.twitter || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
          >
            <img src="/twitter-svgrepo-com.svg" alt="Twitter" style={{ width: '20px', height: '20px' }} />
          </motion.a>
        </div>
      </div>
      
      <motion.div 
        className="footer-bottom"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <p>© {currentYear} The Tech Prophet • Crafted with ☕ and 🪄</p>
        <p style={{ marginTop: '5px', fontSize: '0.65rem' }}>
          "In Code We Trust" • All Rights Reserved
        </p>
      </motion.div>
      
      {/* Decorative ornament */}
      <motion.div
        style={{
          marginTop: '20px',
          fontSize: '1.5rem',
          opacity: 0.3
        }}
        animate={{ 
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        ❧ ✦ ❧
      </motion.div>
    </footer>
  )
}

export default Footer
