import React, { useState, useEffect } from 'react';
import feedData from '../data/feed.json';

const Feed = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    setPosts(feedData);
  }, []);

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
            <time className="text-xs mt-2 block" style={{ color: '#404040' }}>
              {post.timestamp}
            </time>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Feed;