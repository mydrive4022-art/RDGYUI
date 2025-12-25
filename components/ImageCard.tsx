
import React from 'react';
import { ClipartImage } from '../types';

interface ImageCardProps {
  item: ClipartImage;
  onRemove: (id: string) => void;
  onDownload: (item: ClipartImage) => void;
  isTransparentActive: boolean;
}

const ImageCard: React.FC<ImageCardProps> = ({ item, onRemove, onDownload, isTransparentActive }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col group">
      <div className={`relative aspect-square overflow-hidden transition-colors ${isTransparentActive && item.status === 'done' ? 'bg-slate-50' : 'bg-white'}`}>
        {/* Main Preview Area */}
        <div className="w-full h-full flex items-center justify-center p-4">
          <img 
            src={item.status === 'done' ? item.resultUrl : item.previewUrl} 
            alt="Clipart preview"
            className="max-w-full max-h-full object-contain drop-shadow-sm"
          />
        </div>

        {/* Status Overlays */}
        {item.status === 'processing' && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-indigo-700 font-semibold text-sm">Deep Cleaning...</p>
          </div>
        )}

        {item.status === 'error' && (
            <div className="absolute inset-0 bg-red-50/90 flex flex-col items-center justify-center p-4 text-center">
                <i className="fas fa-exclamation-circle text-red-500 text-3xl mb-2"></i>
                <p className="text-red-700 font-medium text-xs">{item.error || 'Failed to process'}</p>
            </div>
        )}

        {/* Quick Actions (Floating) */}
        <button 
          onClick={() => onRemove(item.id)}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 text-gray-400 hover:text-red-500 hover:bg-white rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10"
        >
          <i className="fas fa-times"></i>
        </button>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-medium text-gray-500 truncate max-w-[150px]">
                {item.file.name}
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                item.status === 'done' ? 'bg-green-100 text-green-700' : 
                item.status === 'error' ? 'bg-red-100 text-red-700' : 
                'bg-blue-100 text-blue-700'
            }`}>
                {item.status}
            </span>
        </div>

        <div className="mt-auto pt-3 flex space-x-2">
          {item.status === 'done' ? (
            <button 
              onClick={() => onDownload(item)}
              className="flex-1 bg-indigo-600 text-white py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2"
            >
              <i className="fas fa-download"></i>
              <span>Download PNG</span>
            </button>
          ) : (
            <div className="flex-1 bg-gray-100 text-gray-400 py-2 rounded-xl text-sm font-semibold flex items-center justify-center">
              {item.status === 'processing' ? 'Working...' : 'Waiting...'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageCard;
