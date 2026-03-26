import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase-client';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          console.error('Error fetching posts:', error);
          setError(error.message);
        } else {
          setPosts(data || []);
        }
        setLoading(false);
      });
  }, []);

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) return <div className="h-screen p-6" style={{ borderRight: '1px solid #404040' }}>Loading...</div>;
  if (error) return <div className="h-screen p-6" style={{ borderRight: '1px solid #404040' }}>Error: {error}</div>;

  return (
    <div className="h-screen overflow-y-auto p-6" style={{ borderRight: '1px solid #404040' }}>
      <div className="space-y-4">
        {posts.map((post) => (
          <article
            key={post.id}
            className="pb-4 last:border-b-0"
            style={{ borderBottom: '1px solid #404040' }}
          >
            <p className="leading-relaxed text-sm" style={{ color: '#ffffff' }}>
              {post.content}
            </p>
            <time className="text-xs mt-2 block" style={{ color: '#a0a0a0' }}>
              {formatDate(post.created_at)}
            </time>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Feed;