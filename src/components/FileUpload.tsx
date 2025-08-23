"use client";
import { useState } from 'react';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  accept?: string;
  currentFileUrl?: string;
}

export function FileUpload({ onFileSelect, accept = "image/*,video/*", currentFileUrl }: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentFileUrl || null);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    onFileSelect(selectedFile);

    if (selectedFile) {
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(currentFileUrl || null);
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreview(currentFileUrl || null);
    onFileSelect(null);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-white/90">
        Media (Image or Video)
      </label>
      
      <input
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="w-full rounded-md bg-white/10 px-3 py-2 text-sm outline-none file:mr-3 file:rounded file:border-0 file:bg-white/20 file:px-3 file:py-1 file:text-white"
      />
      
      {file && (
        <button
          type="button"
          onClick={clearFile}
          className="text-sm text-red-400 hover:text-red-300"
        >
          Clear file
        </button>
      )}
      
      {preview && (
        <div className="mt-3">
          {preview.includes('video') || file?.type.startsWith('video/') ? (
            <video 
              src={preview} 
              controls 
              className="max-w-xs rounded-lg"
              style={{ maxHeight: '200px' }}
            />
          ) : (
            <img 
              src={preview} 
              alt="Preview" 
              className="max-w-xs rounded-lg"
              style={{ maxHeight: '200px', objectFit: 'cover' }}
            />
          )}
        </div>
      )}
    </div>
  );
}
