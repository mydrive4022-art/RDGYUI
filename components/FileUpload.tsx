
import React, { useRef, useState } from 'react';

interface FileUploadProps {
  onFilesSelected: (files: FileList) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFilesSelected }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(e.target.files);
    }
  };

  return (
    <div 
      className={`relative border-2 border-dashed rounded-3xl p-12 transition-all duration-300 group cursor-pointer
        ${isDragging 
          ? 'border-indigo-500 bg-indigo-50 shadow-inner' 
          : 'border-gray-300 bg-white hover:border-indigo-400 hover:bg-slate-50'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden" 
        multiple 
        accept="image/*"
      />
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        <div className={`p-6 rounded-full transition-transform duration-300 group-hover:scale-110 
          ${isDragging ? 'bg-indigo-200' : 'bg-indigo-100'}`}>
          <i className="fas fa-cloud-upload-alt text-4xl text-indigo-600"></i>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Upload your clipart</h3>
          <p className="text-gray-500 mt-1">Drag and drop or click to browse files</p>
          <p className="text-xs text-gray-400 mt-3">Supports PNG, JPG, SVG, GIF (max 10MB each)</p>
        </div>
        <div className="pt-4 flex space-x-4">
            <span className="flex items-center text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                <i className="fas fa-check-circle text-green-500 mr-2"></i> Transparent PNG
            </span>
            <span className="flex items-center text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                <i className="fas fa-bolt text-amber-500 mr-2"></i> Instant Processing
            </span>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
