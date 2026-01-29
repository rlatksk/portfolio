import { useState, useEffect } from 'react'

const HN_API_BASE = 'https://hacker-news.firebaseio.com/v0'

export const useHackerNews = (type = 'topstories', limit = 5) => {
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true)
        
        // Fetch story IDs
        const response = await fetch(`${HN_API_BASE}/${type}.json`)
        const storyIds = await response.json()
        
        // Fetch details for top stories (limited)
        const storyPromises = storyIds.slice(0, limit).map(async (id) => {
          const storyResponse = await fetch(`${HN_API_BASE}/item/${id}.json`)
          return storyResponse.json()
        })
        
        const storiesData = await Promise.all(storyPromises)
        
        // Format the stories
        const formattedStories = storiesData
          .filter(story => story && story.title) // Filter out null/deleted stories
          .map(story => ({
            id: story.id,
            title: story.title,
            url: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
            score: story.score,
            author: story.by,
            time: story.time,
            comments: story.descendants || 0,
            date: formatDate(story.time)
          }))
        
        setStories(formattedStories)
        setError(null)
      } catch (err) {
        setError('Failed to fetch news')
        console.error('Error fetching Hacker News:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStories()
    
    // Refresh every 10 minutes
    const interval = setInterval(fetchStories, 10 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [type, limit])

  return { stories, loading, error }
}

// Fetch a single story by ID
export const useHackerNewsStory = (storyId) => {
  const [story, setStory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!storyId) return

    const fetchStory = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${HN_API_BASE}/item/${storyId}.json`)
        const data = await response.json()
        
        setStory({
          id: data.id,
          title: data.title,
          url: data.url || `https://news.ycombinator.com/item?id=${data.id}`,
          score: data.score,
          author: data.by,
          time: data.time,
          comments: data.descendants || 0,
          text: data.text || '',
          date: formatDate(data.time)
        })
        setError(null)
      } catch (err) {
        setError('Failed to fetch story')
        console.error('Error fetching story:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStory()
  }, [storyId])

  return { story, loading, error }
}

// Format Unix timestamp to readable date
const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000)
  const now = new Date()
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
  
  if (diffInHours < 1) {
    const diffInMinutes = Math.floor((now - date) / (1000 * 60))
    return `${diffInMinutes} minutes ago`
  } else if (diffInHours < 24) {
    return `${diffInHours} hours ago`
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }
}

export default useHackerNews
