import { motion } from 'framer-motion'
import AnimatedImage from './AnimatedImage'
import { usePortfolio } from '../context/PortfolioContext'

const AboutSection = () => {
  const { data } = usePortfolio()
  const profile = data.profile

  return (
    <section className="about-section">
      <motion.h2 
        className="about-title"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        About the Author
      </motion.h2>
      
      <div className="about-content">
        <motion.div 
          className="about-portrait"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="portrait-frame">
            <AnimatedImage
              src={profile.image}
              alt="Portrait"
              className="portrait-image"
            />
          </div>
          <p style={{ 
            textAlign: 'center', 
            marginTop: '10px',
            fontFamily: "'Special Elite', cursive",
            fontSize: '0.8rem'
          }}>
            {profile.name}
          </p>
        </motion.div>
        
        <motion.div 
          className="about-bio"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {profile.bio.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </motion.div>
        
        <motion.div 
          className="about-stats"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <motion.div 
            className="stat-item"
            whileHover={{ scale: 1.05, backgroundColor: '#d4c9b5' }}
          >
            <motion.div 
              className="stat-number"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              {profile.stats.experience}
            </motion.div>
            <div className="stat-label">Years Experience</div>
          </motion.div>
          
          <motion.div 
            className="stat-item"
            whileHover={{ scale: 1.05, backgroundColor: '#d4c9b5' }}
          >
            <motion.div 
              className="stat-number"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {profile.stats.projects}
            </motion.div>
            <div className="stat-label">Projects Completed</div>
          </motion.div>
          
          <motion.div 
            className="stat-item"
            whileHover={{ scale: 1.05, backgroundColor: '#d4c9b5' }}
          >
            <motion.div 
              className="stat-number"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              viewport={{ once: true }}
            >
              {profile.stats.coffee}
            </motion.div>
            <div className="stat-label">Cups of Coffee</div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default AboutSection
