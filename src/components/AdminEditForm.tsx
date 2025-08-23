"use client";
import { useState } from 'react';
import { FileUpload } from './FileUpload';
import type { FeedItem } from '@/lib/types';

interface AdminEditFormProps {
  post: FeedItem;
}

export function AdminEditForm({ post }: AdminEditFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    
    // Add the selected file if any
    if (selectedFile) {
      formData.set('media', selectedFile);
    }

    try {
      const response = await fetch('/api/admin/posts', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // Redirect back to admin
        window.location.href = '/admin';
      } else {
        alert('Failed to update post');
      }
    } catch (error) {
      alert('Error updating post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input type="hidden" name="id" value={post.id} />
      
      <input 
        name="title" 
        defaultValue={post.title} 
        placeholder="Title"
        required
        className="w-full rounded-md bg-white/10 px-3 py-2 outline-none" 
      />
      
      <textarea 
        name="description" 
        defaultValue={post.description} 
        placeholder="Short description (optional)" 
        rows={3} 
        className="w-full rounded-md bg-white/10 px-3 py-2 outline-none" 
      />
      
      <textarea 
        name="fullText" 
        defaultValue={post.fullText} 
        placeholder="Full text (shown on post page and used in main card preview)" 
        rows={8} 
        className="w-full rounded-md bg-white/10 px-3 py-2 outline-none" 
      />
      
      <FileUpload 
        onFileSelect={setSelectedFile} 
        currentFileUrl={post.mediaUrl || undefined}
      />
      
      <button 
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-emerald-600 px-4 py-2 font-medium disabled:opacity-50"
      >
        {isSubmitting ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}
