import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Newspaper from './components/Newspaper'
import LoadingScreen from './components/LoadingScreen'
import AdminPanel from './components/AdminPanel'
import { PortfolioProvider } from './context/PortfolioContext'
import './App.css'

function PortfolioPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isUnfolded, setIsUnfolded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isLoading) {
      const unfoldTimer = setTimeout(() => {
        setIsUnfolded(true)
      }, 500)
      return () => clearTimeout(unfoldTimer)
    }
  }, [isLoading])

  return (
    <div className="app">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingScreen key="loading" />
        ) : (
          <Newspaper key="newspaper" isUnfolded={isUnfolded} />
        )}
      </AnimatePresence>
    </div>
  )
}

function AdminPage() {
  const navigate = useNavigate()
  
  return (
    <div className="admin-page" style={{ 
      minHeight: '100vh', 
      background: '#1a1a1a',
      padding: '20px'
    }}>
      <AdminPanel onClose={() => navigate('/')} isPage={true} />
    </div>
  )
}

function App() {
  return (
    <PortfolioProvider>
      <Routes>
        <Route path="/" element={<PortfolioPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </PortfolioProvider>
  )
}

export default App
