import { motion } from 'framer-motion'
import Header from './Header'
import BreakingNews from './BreakingNews'
import FeaturedArticle from './FeaturedArticle'
import Sidebar from './Sidebar'
import AboutSection from './AboutSection'
import Footer from './Footer'

const Newspaper = ({ isUnfolded }) => {
  const containerVariants = {
    hidden: { 
      scale: 0.8,
      rotateX: 90,
      opacity: 0,
      y: -100
    },
    visible: {
      scale: 1,
      rotateX: 0,
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: [0.6, -0.05, 0.01, 0.99],
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  }

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  return (
    <motion.div
      className="newspaper"
      variants={containerVariants}
      initial="hidden"
      animate={isUnfolded ? "visible" : "hidden"}
    >
      <div className="newspaper-content">
        <motion.div variants={contentVariants}>
          <Header />
        </motion.div>
        
        <motion.div variants={contentVariants}>
          <BreakingNews />
        </motion.div>
        
        <motion.div className="main-content" variants={contentVariants}>
          <FeaturedArticle />
          <Sidebar />
        </motion.div>
        
        <motion.div variants={contentVariants}>
          <AboutSection />
        </motion.div>
        
        <motion.div variants={contentVariants}>
          <Footer />
        </motion.div>
      </div>
      
      {/* Page fold corner effect */}
      <motion.div 
        className="page-fold"
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
      />
    </motion.div>
  )
}

export default Newspaper
