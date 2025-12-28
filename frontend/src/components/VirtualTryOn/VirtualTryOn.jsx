import React, { useState } from 'react';
import { Sparkles, ArrowRight, History } from 'lucide-react';
import ImageUploader from './ImageUploader';
import SavedTryOns from './SavedTryOns';
import Loader from '../Common/Loader';  
import ErrorMessage from '../Common/ErrorMessage';
import SuccessMessage from '../Common/SuccessMessage';
import { generateVirtualTryOn } from '../../services/virtualTryOnService';
import { BASE_URL } from '../../utils/constants';

const VirtualTryOn = () => {
  const [userPhoto, setUserPhoto] = useState(null);
  const [userPhotoPreview, setUserPhotoPreview] = useState('');
  const [outfitPhoto, setOutfitPhoto] = useState(null);
  const [outfitPhotoPreview, setOutfitPhotoPreview] = useState('');
  const [resultUrl, setResultUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('create'); // 'create' or 'history'

  const handleUserPhotoSelect = (file, preview) => {
    setUserPhoto(file);
    setUserPhotoPreview(preview);
    setError('');
  };

  const handleOutfitPhotoSelect = (file, preview) => {
    setOutfitPhoto(file);
    setOutfitPhotoPreview(preview);
    setError('');
  };

  const handleGenerate = async () => {
    if (!userPhoto || !outfitPhoto) {
      setError('Please upload both your photo and outfit photo');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    setResultUrl('');

    try {
      const tagsArray = tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const result = await generateVirtualTryOn(
        userPhoto,
        outfitPhoto,
        notes,
        tagsArray
      );

      setResultUrl(result.data.resultPhotoUrl);
      setSuccess('Virtual try-on generated successfully!');
      
      // Reset form after 2 seconds
      setTimeout(() => {
        handleReset();
      }, 2000);
    } catch (err) {
      setError(
        err.message || 'Failed to generate virtual try-on. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setUserPhoto(null);
    setUserPhotoPreview('');
    setOutfitPhoto(null);
    setOutfitPhotoPreview('');
    setNotes('');
    setTags('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
            <Sparkles className="w-8 h-8 text-purple-600" />
            AI Virtual Outfit Try-On
          </h1>
          <p className="text-gray-600">
            See how outfits look on you with AI-powered virtual try-on
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveTab('create')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'create'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Create Try-On
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
              activeTab === 'history'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <History className="w-5 h-5" />
            My Try-Ons
          </button>
        </div>

        {activeTab === 'create' ? (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <ErrorMessage message={error} onClose={() => setError('')} />
            <SuccessMessage message={success} onClose={() => setSuccess('')} />

            {loading ? (
              <Loader message="Generating your virtual try-on... This may take a moment" />
            ) : resultUrl ? (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Your Virtual Try-On Result
                  </h2>
                  <img
                    src={`${BASE_URL}${resultUrl}`}
                    alt="Virtual Try-On Result"
                    className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
                  />
                </div>

                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setResultUrl('')}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                  >
                    Try Another Outfit
                  </button>
                  <button
                    onClick={() => setActiveTab('history')}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    View All Try-Ons
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Upload Section */}
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <ImageUploader
                    label="Your Photo"
                    onImageSelect={handleUserPhotoSelect}
                    preview={userPhotoPreview}
                    onRemove={() => {
                      setUserPhoto(null);
                      setUserPhotoPreview('');
                    }}
                  />

                  <ImageUploader
                    label="Outfit Photo"
                    onImageSelect={handleOutfitPhotoSelect}
                    preview={outfitPhotoPreview}
                    onRemove={() => {
                      setOutfitPhoto(null);
                      setOutfitPhotoPreview('');
                    }}
                  />
                </div>

                {/* Optional Fields */}
                <div className="space-y-4 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes (Optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add any notes about this try-on..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      rows="3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags (Optional)
                    </label>
                    <input
                      type="text"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="casual, summer, party (comma separated)"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  onClick={handleGenerate}
                  disabled={!userPhoto || !outfitPhoto || loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <Sparkles className="w-6 h-6" />
                  Generate Virtual Try-On
                  <ArrowRight className="w-6 h-6" />
                </button>

                {/* Tips */}
                <div className="mt-8 bg-purple-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Tips for Best Results:
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Use a clear, full-body photo with good lighting</li>
                    <li>• Wear fitted clothing for better accuracy</li>
                    <li>• Choose outfit photos with clear visibility</li>
                    <li>• Stand straight facing the camera</li>
                    <li>• Avoid busy backgrounds</li>
                  </ul>
                </div>
              </>
            )}
          </div>
        ) : (
          <SavedTryOns />
        )}
      </div>
    </div>
  );
};

export default VirtualTryOn;