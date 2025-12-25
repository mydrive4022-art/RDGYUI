
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import ImageCard from './components/ImageCard';
import { ClipartImage, ProcessingOptions } from './types';
import { processClipart } from './services/geminiService';
import { makeTransparent, applyBackgroundColor } from './utils/imageUtils';

const PRESET_COLORS = [
  { name: 'Transparent', value: 'transparent', icon: 'fa-border-none' },
  { name: 'White', value: '#ffffff', icon: 'fa-square' },
  { name: 'Black', value: '#000000', icon: 'fa-square' },
  { name: 'Blue', value: '#3b82f6', icon: 'fa-square' },
  { name: 'Pink', value: '#ec4899', icon: 'fa-square' },
];

const App: React.FC = () => {
  const [images, setImages] = useState<ClipartImage[]>([]);
  const [options, setOptions] = useState<ProcessingOptions>({
    edgeSmoothing: true,
    transparencyThreshold: 50, 
    autoRefine: true,
    backgroundColor: 'transparent'
  });
  const [isProcessingBatch, setIsProcessingBatch] = useState(false);

  useEffect(() => {
    const updateResults = async () => {
      const updatedImages = await Promise.all(images.map(async (img) => {
        if (img.status === 'done' && img.transparentUrl) {
          const newResult = await applyBackgroundColor(img.transparentUrl, options.backgroundColor);
          return { ...img, resultUrl: newResult };
        }
        return img;
      }));
      
      const hasChanges = updatedImages.some((img, idx) => img.resultUrl !== images[idx].resultUrl);
      if (hasChanges) {
        setImages(updatedImages);
      }
    };

    updateResults();
  }, [options.backgroundColor]);

  const handleFilesSelected = (files: FileList) => {
    const newImages: ClipartImage[] = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
      previewUrl: URL.createObjectURL(file),
      status: 'pending'
    }));

    setImages(prev => [...newImages, ...prev]);
  };

  const removeImage = (id: string) => {
    setImages(prev => {
      const filtered = prev.filter(img => img.id !== id);
      const removed = prev.find(img => img.id === id);
      if (removed) URL.revokeObjectURL(removed.previewUrl);
      return filtered;
    });
  };

  const processBatch = async () => {
    if (isProcessingBatch) return;
    setIsProcessingBatch(true);

    const pendingImages = images.filter(img => img.status === 'pending');
    
    for (const item of pendingImages) {
      setImages(prev => prev.map(img => 
        img.id === item.id ? { ...img, status: 'processing' } : img
      ));

      try {
        const base64Result = await processClipart(item.file);
        
        // Smart Chroma Key Removal: 
        // Removes holes in text/leaves while preserving eyes/internal details
        const transparentResult = await makeTransparent(base64Result, options.transparencyThreshold);

        const finalResult = await applyBackgroundColor(transparentResult, options.backgroundColor);

        setImages(prev => prev.map(img => 
          img.id === item.id ? { 
            ...img, 
            status: 'done', 
            transparentUrl: transparentResult,
            resultUrl: finalResult 
          } : img
        ));
      } catch (error: any) {
        setImages(prev => prev.map(img => 
          img.id === item.id ? { 
            ...img, 
            status: 'error', 
            error: error.message || 'Processing failed' 
          } : img
        ));
      }
    }

    setIsProcessingBatch(false);
  };

  const downloadImage = (item: ClipartImage) => {
    if (!item.resultUrl) return;
    const link = document.createElement('a');
    link.href = item.resultUrl;
    link.download = `clipclean-${item.file.name.replace(/\.[^/.]+$/, "")}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearDone = () => {
    setImages(prev => prev.filter(img => img.status !== 'done'));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
            Advanced <span className="text-indigo-600">Clipart Transparency</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Smart AI removal: We wipe out backgrounds in letters and leaf-gaps while protecting eyes and subject details.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6 flex items-center">
                <i className="fas fa-sliders-h mr-2"></i> Control Panel
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Preview Backdrop</label>
                  <div className="grid grid-cols-5 gap-2 mb-3">
                    {PRESET_COLORS.map(color => (
                      <button
                        key={color.value}
                        title={color.name}
                        onClick={() => setOptions(prev => ({ ...prev, backgroundColor: color.value }))}
                        className={`aspect-square rounded-lg border-2 flex items-center justify-center transition-all ${
                          options.backgroundColor === color.value 
                            ? 'border-indigo-600 scale-110 shadow-sm' 
                            : 'border-transparent hover:border-gray-200'
                        }`}
                        style={{ backgroundColor: color.value === 'transparent' ? '#f3f4f6' : color.value }}
                      >
                        {color.value === 'transparent' ? (
                          <i className="fas fa-border-none text-gray-400 text-xs"></i>
                        ) : (
                          <div className={`w-3 h-3 rounded-full ${color.value === '#ffffff' ? 'border border-gray-200' : ''}`}></div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-50">
                   <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                      <p className="text-[11px] leading-relaxed text-green-800 font-bold uppercase tracking-tight mb-2">
                        <i className="fas fa-shield-alt mr-1"></i> 
                        Precision Guard Active
                      </p>
                      <ul className="text-[10px] space-y-1.5 text-green-700 font-medium list-disc pl-3">
                        <li>Preserving eyes and teeth white</li>
                        <li>Removing gaps in text (A, O, P)</li>
                        <li>Cleaning gaps between leaves</li>
                        <li>No "white net" artifacts</li>
                      </ul>
                   </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-3xl shadow-lg text-white">
                <h3 className="font-bold text-lg mb-2">Pro Workflow</h3>
                <p className="text-indigo-100 text-sm mb-4">Export thousands of perfectly cleaned assets for professional design projects.</p>
                <button className="w-full bg-white text-indigo-600 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors">
                    Upgrade Now
                </button>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-8">
            <FileUpload onFilesSelected={handleFilesSelected} />

            {images.length > 0 && (
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm sticky top-20 z-40">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-bold text-gray-700">
                      {images.length} Assets Loaded
                    </span>
                  </div>
                  <div className="flex space-x-3">
                    <button 
                      onClick={clearDone}
                      className="text-xs font-bold text-gray-400 hover:text-red-500 px-3 py-2 rounded-lg transition-colors"
                    >
                      Reset
                    </button>
                    <button 
                      onClick={processBatch}
                      disabled={isProcessingBatch || images.filter(img => img.status === 'pending').length === 0}
                      className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all
                        ${isProcessingBatch || images.filter(img => img.status === 'pending').length === 0
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700 transform hover:-translate-y-0.5'}`}
                    >
                      {isProcessingBatch ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Deep Clean in Progress...</span>
                        </>
                      ) : (
                        <>
                          <i className="fas fa-magic"></i>
                          <span>Smart Clean Backgrounds</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {images.map((img) => (
                    <ImageCard 
                      key={img.id} 
                      item={img} 
                      onRemove={removeImage}
                      onDownload={downloadImage}
                      isTransparentActive={options.backgroundColor === 'transparent'}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
