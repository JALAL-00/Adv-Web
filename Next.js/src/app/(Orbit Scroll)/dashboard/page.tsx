// src/components/pages/DashboardPage.tsx
'use client'; // This page needs to be a client component for state management

import { useState } from 'react';
import { mockFeedData } from '@/lib/mock-data';
import LeftSidebar from '@/components/Orbit/LeftSidebar';
import RightSidebar from '@/components/Orbit/RightSidebar';
import { ArticlePost } from '@/components/Orbit/feed/ArticlePost';
import { CompanyUpdatePost } from '@/components/Orbit/feed/CompanyUpdatePost';
import { JobRecommendationPost } from '@/components/Orbit/feed/JobRecommendationPost';
import { EngagingPost } from '@/components/Orbit/feed/EngagingPost';
import StartPost from '@/components/Orbit/feed/StartPost';


const renderPost = (post: any) => {
    switch (post.type) {
        case 'article': return <ArticlePost key={post.id} post={post} />;
        case 'companyUpdate': return <CompanyUpdatePost key={post.id} post={post} />;
        case 'job': return <JobRecommendationPost key={post.id} post={post} />;
        case 'engagement': return <EngagingPost key={post.id} post={post} />;
        default: return null;
    }
};

export default function DashboardPage() {
  const [feedData, setFeedData] = useState(mockFeedData);

  const handleCreatePost = (content: string) => {
    const newPost = {
      type: 'engagement', id: Date.now(),
      author: {
        name: 'John Doe', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
        headline: 'Frontend Developer at Acme Inc.',
      },
      content: content, likes: 0, comments: [],
    };
    setFeedData([newPost, ...feedData]);
  };

  return (
    <>
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 px-4 py-8">
          <aside className="md:col-span-3">
            <LeftSidebar />
          </aside>
          <main className="md:col-span-6">
            <StartPost onPostCreated={handleCreatePost} />
            {feedData.map(post => renderPost(post))}
          </main>
          <aside className="md:col-span-3">
            <RightSidebar />
          </aside>
        </div>
      </div>
    </>
  );
}