import React, { useState, useRef } from 'react';
import { Upload, X, AlertCircle } from 'lucide-react';
import { validateImage, fileToPreview } from '../../utils/imageUtils';

const ImageUploader = ({ label, onImageSelect, preview, onRemove }) => {
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validation = validateImage(file);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    setError('');
    try {
      const previewUrl = await fileToPreview(file);
      onImageSelect(file, previewUrl);
    } catch (err) {
      setError('Failed to load image preview');
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      
      {!preview ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-sm text-gray-600 mb-1">Click to upload or drag and drop</p>
          <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 10MB</p>
        </div>
      ) : (
        <div className="relative rounded-lg overflow-hidden border-2 border-gray-200">
          <img src={preview} alt="Preview" className="w-full h-64 object-cover" />
          <button
            onClick={onRemove}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
};

export default ImageUploader;