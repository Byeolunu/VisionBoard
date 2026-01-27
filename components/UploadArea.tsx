
import React, { useRef, useState } from 'react';
import { Upload, X, Camera, Plus, ImagePlus, Terminal, FileCode } from 'lucide-react';
import { FileUpload } from '../types';

interface UploadAreaProps {
  files: FileUpload[];
  onFilesSelected: (files: FileUpload[]) => void;
  onRemoveFile: (id: string) => void;
  isProcessing: boolean;
  compact?: boolean;
}

const UploadArea: React.FC<UploadAreaProps> = ({ 
  files, 
  onFilesSelected, 
  onRemoveFile, 
  isProcessing,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const newFiles: FileUpload[] = [];
    const promises: Promise<void>[] = [];
    Array.from(fileList).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const promise = new Promise<void>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          newFiles.push({
            id: Math.random().toString(36).substr(2, 9),
            file: file,
            previewUrl: e.target?.result as string,
            base64: (e.target?.result as string).split(',')[1],
            mimeType: file.type,
          });
          resolve();
        };
        reader.readAsDataURL(file);
      });
      promises.push(promise);
    });
    Promise.all(promises).then(() => onFilesSelected(newFiles));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (isProcessing) return;
    processFiles(e.dataTransfer.files);
  };

  if (files.length > 0) {
    return (
      <div className="w-full max-w-2xl relative p-4">
        <input type="file" id="file-input" ref={fileInputRef} className="hidden" multiple accept="image/*" onChange={(e) => processFiles(e.target.files)} />
        <div className="flex flex-wrap items-center justify-center gap-6">
          {files.map((file) => (
            <div key={file.id} className="relative group w-40 h-40">
              <div className="w-full h-full rounded-2xl overflow-hidden bg-slate-900 border-2 border-slate-800 shadow-2xl">
                <img src={file.previewUrl} alt="preview" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              {!isProcessing && (
                <button 
                  onClick={(e) => { e.stopPropagation(); onRemoveFile(file.id); }}
                  className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
          {!isProcessing && (
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-40 h-40 border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-500 hover:text-indigo-400 hover:border-indigo-500 hover:bg-indigo-500/5 transition-all"
            >
              <Plus className="w-8 h-8 mb-2" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Append Source</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl relative group">
      <input type="file" id="file-input" ref={fileInputRef} className="hidden" multiple accept="image/*" onChange={(e) => processFiles(e.target.files)} />
      
      <div
        className={`relative w-full aspect-[4/3] border-2 border-dashed rounded-[40px] p-12 flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden
          ${isDragging ? 'border-indigo-500 bg-indigo-500/10 scale-105' : 'border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/60'}
        `}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {/* Abstract design elements */}
        <div className="absolute top-0 left-0 p-8 text-indigo-500/10"><Terminal className="w-24 h-24" /></div>
        <div className="absolute bottom-0 right-0 p-8 text-indigo-500/10"><FileCode className="w-32 h-32" /></div>
        
        <div className="text-center relative z-10">
            <div className="w-20 h-20 bg-indigo-600/10 border border-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform">
              <Camera className="w-10 h-10 text-indigo-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Ingest Visual Data</h3>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Drag & Drop or Click to Browse System</p>
        </div>
      </div>
    </div>
  );
};

export default UploadArea;
