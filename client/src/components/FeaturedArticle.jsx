import { motion } from 'framer-motion'
import AnimatedImage from './AnimatedImage'
import { usePortfolio } from '../context/PortfolioContext'

const FeaturedArticle = () => {
  const { data, loading } = usePortfolio()
  const latestProject = data.latestProject

  if (loading) {
    return (
      <article className="article article-featured">
        <motion.div
          style={{ padding: '40px', textAlign: 'center' }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '20px', fontFamily: "'JetBrains Mono', monospace", color: '#666' }}>⌛</div>
          <p style={{ fontFamily: "'Special Elite', cursive" }}>Loading...</p>
        </motion.div>
      </article>
    )
  }

  return (
    <article className="article article-featured">
      <motion.h2 
        className="article-headline"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        {latestProject.title}
      </motion.h2>
      
      <p className="article-subheadline">
        {latestProject.subtitle}
      </p>
      
      <div className="article-meta">
        Latest Project • {latestProject.date} • {latestProject.tags.join(' / ')}
      </div>
      
      <motion.div 
        className="article-image-container"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        <AnimatedImage 
          src={latestProject.image}
          alt={latestProject.title}
          className="article-image"
        />
        <div className="image-caption">
          Fig. 1: {latestProject.title} in action
        </div>
      </motion.div>
      
      <div className="article-body">
        {latestProject.description.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
        
        <div style={{ marginTop: '25px', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <motion.a
            href={latestProject.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              background: '#2d2926',
              color: '#faf8f3',
              padding: '12px 24px',
              textDecoration: 'none',
              fontFamily: "'Special Elite', cursive",
              fontSize: '0.9rem'
            }}
            whileHover={{ backgroundColor: '#9c7e5c', scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            → View Live Demo
          </motion.a>
          
          <motion.a
            href={latestProject.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              background: 'transparent',
              color: '#2d2926',
              padding: '12px 24px',
              textDecoration: 'none',
              fontFamily: "'Special Elite', cursive",
              fontSize: '0.9rem',
              border: '1px solid #3d3835'
            }}
            whileHover={{ backgroundColor: '#2d2926', color: '#faf8f3', scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            ↗ View Source Code
          </motion.a>
        </div>
      </div>
    </article>
  )
}

export default FeaturedArticle
