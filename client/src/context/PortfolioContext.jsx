import { createContext, useContext, useState, useEffect } from 'react';
import { fetchAllData } from '../api/portfolio';

const PortfolioContext = createContext(null);

// Default data (fallback if API fails)
const defaultData = {
  profile: {
    name: "Your Name Here",
    title: "Full Stack Developer",
    subtitle: "Illuminating the Digital Realm Since the Dawn of Code",
    bio: ["Loading..."],
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    stats: { experience: "5+", projects: "50+", coffee: "∞" },
    email: "your@email.com",
    social: { github: "#", linkedin: "#", twitter: "#" }
  },
  latestProject: {
    title: "Loading...",
    subtitle: "Please wait while we fetch the data",
    date: "2026",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
    tags: ["Loading"],
    description: ["Loading project details..."],
    liveUrl: "#",
    githubUrl: "#"
  },
  projects: [],
  skills: []
};

export const PortfolioProvider = ({ children }) => {
  const [data, setData] = useState(defaultData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const fetchedData = await fetchAllData();
      setData(fetchedData);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch portfolio data:', err);
      setError(err.message);
      // Keep default data on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const refreshData = () => loadData();

  return (
    <PortfolioContext.Provider value={{ data, loading, error, refreshData }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
