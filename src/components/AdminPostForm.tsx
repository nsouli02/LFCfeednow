"use client";
import { useState } from 'react';
import { FileUpload } from './FileUpload';

export function AdminPostForm() {
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
        // Reset form
        e.currentTarget.reset();
        setSelectedFile(null);
        // Redirect or refresh
        window.location.reload();
      } else {
        alert('Failed to publish post');
      }
    } catch (error) {
      alert('Error publishing post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input 
        name="title" 
        placeholder="Title" 
        required
        className="w-full rounded-md bg-white/10 px-3 py-2 outline-none" 
      />
      <textarea 
        name="description" 
        placeholder="Short description" 
        className="w-full rounded-md bg-white/10 px-3 py-2 outline-none" 
        rows={4} 
      />
      <textarea 
        name="fullText" 
        placeholder="Full text (optional)" 
        className="w-full rounded-md bg-white/10 px-3 py-2 outline-none" 
        rows={6} 
      />
      <FileUpload onFileSelect={setSelectedFile} />
      <button 
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-emerald-600 px-4 py-2 font-medium disabled:opacity-50"
      >
        {isSubmitting ? 'Publishing...' : 'Publish'}
      </button>
    </form>
  );
}
