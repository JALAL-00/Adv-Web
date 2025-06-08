import PostCard from './PostCard';
import PostActions from './PostActions';
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from 'react';

interface Comment {
  id: React.Key;
  author: {
    avatarUrl: string;
    name: string;
  };
  text: string;
}

interface Post {
  author: {
    avatarUrl: string;
    name: string;
    headline: string;
  };
  content: string;
  likes: number;
  comments: Comment[];
}

interface EngagingPostProps {
  post: Post;
}

export const EngagingPost = ({ post }: EngagingPostProps) => {
  return (
    <PostCard>
      {/* Post Header */}
      <div className="flex items-center mb-3">
         <div className="avatar">
          <div className="w-12 rounded-full">
            <img src={post.author.avatarUrl} alt={post.author.name} />
          </div>
        </div>
        <div className="ml-3">
          <p className="font-bold">{post.author.name}</p>
          <p className="text-xs text-gray-500">{post.author.headline}</p>
        </div>
      </div>
      
      {/* Post Content */}
      <p className="mb-3">{post.content}</p>
      <div className="text-xs text-gray-500 mt-2">
        <span>{post.likes} likes</span>
      </div>

      <PostActions />

      {/* Comments Section */}
      <div className="mt-4">
        {post.comments.map((comment: { id: Key | null | undefined; author: { avatarUrl: string | Blob | undefined; name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }; text: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => (
          <div key={comment.id} className="flex items-start gap-2 mt-3">
            <div className="avatar">
              <div className="w-8 rounded-full">
                <img src={comment.author.avatarUrl} alt={typeof comment.author.name === 'string' ? comment.author.name : undefined} />
              </div>
            </div>
            <div className="bg-gray-100 p-2 rounded-lg">
              <p className="font-bold text-sm">{comment.author.name}</p>
              <p className="text-sm">{comment.text}</p>
            </div>
          </div>
        ))}
      </div>
    </PostCard>
  );
};