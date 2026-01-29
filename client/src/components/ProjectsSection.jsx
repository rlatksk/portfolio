import { motion } from 'framer-motion'
import AnimatedImage from './AnimatedImage'

const projects = [
  {
    name: "The Enchanted Dashboard",
    description: "A magical analytics platform with real-time data visualization and predictive insights.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
    tags: ["React", "D3.js", "Node.js"]
  },
  {
    name: "Spell-Check AI",
    description: "An intelligent writing assistant powered by advanced language models and NLP.",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=80",
    tags: ["Python", "TensorFlow", "FastAPI"]
  },
  {
    name: "Portal Marketplace",
    description: "A mystical e-commerce platform with seamless payments and inventory management.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80",
    tags: ["Next.js", "Stripe", "PostgreSQL"]
  },
  {
    name: "Chronicle Keeper",
    description: "A digital journal application with mood tracking and memory visualization.",
    image: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=600&q=80",
    tags: ["React Native", "Firebase", "TypeScript"]
  },
  {
    name: "Weather Oracle",
    description: "An atmospheric prediction system with beautiful animated forecasts.",
    image: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=600&q=80",
    tags: ["Vue.js", "Weather API", "Canvas"]
  },
  {
    name: "Code Grimoire",
    description: "A collaborative code snippet manager with syntax highlighting and sharing.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80",
    tags: ["TypeScript", "Monaco", "GraphQL"]
  }
]

const ProjectsSection = () => {
  return (
    <section className="projects-section">
      <motion.h2 
        className="projects-title"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        Featured Works
      </motion.h2>
      
      <div className="projects-grid">
        {projects.map((project, index) => (
          <motion.div
            key={project.name}
            className="project-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ 
              y: -10,
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
            }}
          >
            <AnimatedImage
              src={project.image}
              alt={project.name}
              className="project-image"
            />
            <div className="project-info">
              <h3 className="project-name">{project.name}</h3>
              <p className="project-description">{project.description}</p>
              <div className="project-tags">
                {project.tags.map((tag) => (
                  <motion.span 
                    key={tag} 
                    className="project-tag"
                    whileHover={{ scale: 1.1 }}
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default ProjectsSection
