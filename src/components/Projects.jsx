import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase-client';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          console.error('Error fetching projects:', error);
          setError(error.message);
        } else {
          setProjects(data || []);
        }
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="h-screen p-6">Loading...</div>;
  if (error) return <div className="h-screen p-6">Error: {error}</div>;

  return (
    <div className="h-screen overflow-y-auto p-6">
      <div className="space-y-6">
        {projects.map((project) => (
          <article
            key={project.id}
            className="group"
          >
            <div className="aspect-video rounded-lg overflow-hidden mb-3" style={{ background: '#404040' }}>
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
            
            <h3 className="text-base font-medium mb-1" style={{ color: '#ffffff' }}>
              {project.title}
            </h3>
            
            <p className="text-xs mb-2" style={{ color: '#a0a0a0' }}>
              {project.description}
            </p>
            
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-xs transition-colors duration-200"
              style={{ color: '#404040' }}
              onMouseEnter={(e) => e.target.style.color = '#ffffff'}
              onMouseLeave={(e) => e.target.style.color = '#404040'}
            >
              View Project
              <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Projects;