import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase-client.js';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const postRefs = useRef([]);
  const [visiblePosts, setVisiblePosts] = useState(new Set());

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = parseInt(entry.target.dataset.index);
          if (entry.isIntersecting) {
            setVisiblePosts((prev) => new Set([...prev, index]));
          } else {
            setVisiblePosts((prev) => {
              const next = new Set(prev);
              next.delete(index);
              return next;
            });
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px 0px' }
    );

    postRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [posts]);

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) return <div className="h-screen p-6" style={{ borderRight: '1px solid #404040' }}>Loading...</div>;
  if (error) return <div className="h-screen p-6" style={{ borderRight: '1px solid #404040' }}>Error: {error}</div>;

  return (
    <div className="h-screen overflow-y-auto p-6" style={{ borderRight: '1px solid #404040' }}>
      <div className="space-y-4">
        {posts.map((post, index) => (
          <article
            key={post.id}
            ref={(el) => (postRefs.current[index] = el)}
            data-index={index}
            className="pb-4 last:border-b-0"
            style={{
              borderBottom: '1px solid #404040',
              opacity: visiblePosts.has(index) ? 1 : 0,
              transform: visiblePosts.has(index) ? 'translateX(0)' : 'translateX(-30px)',
              transition: `opacity 0.4s ease, transform 0.4s ease`,
            }}
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