import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

const AnimatedImage = ({ src, alt, className }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const imageRef = useRef(null)

  const handleMouseMove = (e) => {
    if (imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      setMousePosition({ x, y })
    }
  }

  return (
    <motion.div
      ref={imageRef}
      className="animated-image"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      <motion.img
        src={src}
        alt={alt}
        className={className}
        animate={{
          scale: isHovered ? 1.1 : 1,
          rotateX: isHovered ? mousePosition.y * 10 : 0,
          rotateY: isHovered ? -mousePosition.x * 10 : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{ transformStyle: 'preserve-3d' }}
      />
      
      {/* Magical shimmer overlay */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
          pointerEvents: 'none'
        }}
        animate={{
          x: isHovered ? ['0%', '200%'] : '0%',
        }}
        transition={{
          duration: 1.5,
          repeat: isHovered ? Infinity : 0,
          ease: "linear"
        }}
      />
      
      {/* Floating particles for magical effect */}
      {isHovered && (
        <>
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              style={{
                position: 'absolute',
                width: 4,
                height: 4,
                borderRadius: '50%',
                background: '#8b7355',
                left: `${20 + i * 15}%`,
                bottom: 0,
              }}
              animate={{
                y: [-20, -60],
                opacity: [0.8, 0],
                scale: [1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeOut"
              }}
            />
          ))}
        </>
      )}
    </motion.div>
  )
}

export default AnimatedImage
