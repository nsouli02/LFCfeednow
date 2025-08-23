"use client";
import { useState } from 'react';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  onDeleteCurrent?: () => void;
  accept?: string;
  currentFileUrl?: string;
  allowDelete?: boolean;
}

export function FileUpload({ onFileSelect, onDeleteCurrent, accept = "image/*,video/*", currentFileUrl, allowDelete = false }: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentFileUrl || null);
  const [file, setFile] = useState<File | null>(null);
  const [currentDeleted, setCurrentDeleted] = useState(false);

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
    setPreview(currentDeleted ? null : currentFileUrl || null);
    onFileSelect(null);
  };

  const deleteCurrentFile = () => {
    setCurrentDeleted(true);
    setPreview(null);
    setFile(null);
    onFileSelect(null);
    if (onDeleteCurrent) {
      onDeleteCurrent();
    }
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
      
      <div className="flex gap-2">
        {file && (
          <button
            type="button"
            onClick={clearFile}
            className="text-sm text-red-400 hover:text-red-300"
          >
            Clear new file
          </button>
        )}
        
        {allowDelete && currentFileUrl && !currentDeleted && !file && (
          <button
            type="button"
            onClick={deleteCurrentFile}
            className="text-sm text-red-400 hover:text-red-300"
          >
            Delete current media
          </button>
        )}
      </div>
      
      {preview && !currentDeleted && (
        <div className="mt-3 flex justify-center rounded-lg bg-white/5 p-2">
          {preview.includes('video') || file?.type.startsWith('video/') ? (
            <video 
              src={preview} 
              controls 
              className="rounded-lg object-contain"
              style={{ maxHeight: '300px', maxWidth: '100%' }}
            />
          ) : (
            <img 
              src={preview} 
              alt="Preview" 
              className="rounded-lg object-contain"
              style={{ maxHeight: '300px', maxWidth: '100%' }}
            />
          )}
        </div>
      )}

      {currentDeleted && (
        <div className="mt-3 text-sm text-yellow-400">
          Current media will be deleted when you save
        </div>
      )}
    </div>
  );
}
