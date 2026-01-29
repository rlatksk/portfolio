import { motion } from 'framer-motion'

const skills = [
  { icon: '⚛️', name: 'React' },
  { icon: '📘', name: 'TypeScript' },
  { icon: '🟢', name: 'Node.js' },
  { icon: '🐍', name: 'Python' },
  { icon: '🎨', name: 'CSS/Sass' },
  { icon: '🗄️', name: 'PostgreSQL' },
  { icon: '☁️', name: 'AWS' },
  { icon: '🐳', name: 'Docker' },
  { icon: '📱', name: 'React Native' },
  { icon: '🔥', name: 'Firebase' },
  { icon: '🧪', name: 'Testing' },
  { icon: '📊', name: 'GraphQL' },
]

const SkillsSection = () => {
  return (
    <section className="skills-section">
      <motion.h2 
        className="skills-title"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        🛠️ Arsenal of Expertise
      </motion.h2>
      
      <div className="skills-grid">
        {skills.map((skill, index) => (
          <motion.div
            key={skill.name}
            className="skill-item"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            viewport={{ once: true }}
            whileHover={{ 
              scale: 1.1,
              boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
              y: -5
            }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div 
              className="skill-icon"
              animate={{ 
                rotate: [0, 10, -10, 0],
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3 + index * 0.5
              }}
            >
              {skill.icon}
            </motion.div>
            <div className="skill-name">{skill.name}</div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default SkillsSection
