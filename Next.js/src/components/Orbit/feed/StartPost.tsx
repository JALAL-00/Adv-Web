// src/components/dashboard/StartPost.tsx
'use client';

import { useState } from 'react';
import { Image, Video, FileText } from 'lucide-react';

// Define the props interface. We need a function to call when a post is created.
interface StartPostProps {
  onPostCreated: (content: string) => void;
}

const StartPost = ({ onPostCreated }: StartPostProps) => {
  const [postText, setPostText] = useState('');

  const handlePostSubmit = () => {
    if (!postText.trim()) return; // Don't post empty content

    // Call the function passed from the parent component
    onPostCreated(postText);
    
    // Clear the textarea and close the modal
    setPostText('');
    const modal = document.getElementById('create_post_modal') as HTMLDialogElement;
    if (modal) {
      modal.close();
    }
  };

  const openModal = () => {
    const modal = document.getElementById('create_post_modal') as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  };

  return (
    <>
      {/* The Trigger Bar */}
      <div className="card w-full bg-base-100 shadow-md border border-gray-200 rounded-lg mb-4 p-4">
        <div className="flex items-center gap-4">
          <div className="avatar">
            <div className="w-12 rounded-full">
              <img src="/images/Jalal.jpg"  alt="User Avatar" />
            </div>
          </div>
          
          <button 
            className="input input-bordered flex-grow text-left pl-4 text-gray-500"
            onClick={openModal}
          >
            Start a post
          </button>
        </div>
        <div className="flex justify-around mt-4 pt-2 border-t">
          <button className="btn btn-ghost btn-sm flex-1" onClick={openModal}>
            <Image size={20} className="text-blue-500" /> Photo
          </button>
          <button className="btn btn-ghost btn-sm flex-1" onClick={openModal}>
            <Video size={20} className="text-green-500" /> Video
          </button>
          <button className="btn btn-ghost btn-sm flex-1" onClick={openModal}>
            <FileText size={20} className="text-orange-500" /> Article
          </button>
        </div>
      </div>

      {/* The Modal */}
      <dialog id="create_post_modal" className="modal">
        <div className="modal-box w-11/12 max-w-2xl">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold text-lg">Create a Post</h3>
          <div className="py-4">
            <textarea
              className="textarea textarea-bordered w-full h-40"
              placeholder="What do you want to talk about?"
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
            ></textarea>
          </div>
          <div className="modal-action">
            <button 
              className="btn btn-primary" 
              onClick={handlePostSubmit}
              disabled={!postText.trim()} // Disable button if textarea is empty
            >
              Post
            </button>
          </div>
        </div>
        {/* Click outside to close */}
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};

export default StartPost;