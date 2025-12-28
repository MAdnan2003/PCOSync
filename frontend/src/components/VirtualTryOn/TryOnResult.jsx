import React, { useState } from 'react';
import { Heart, Download, Trash2, Edit2, Save, X } from 'lucide-react';
import { toggleFavorite, updateTryOn, deleteTryOn } from '../../services/virtualTryOnService';
import { BASE_URL } from '../../utils/constants';

const TryOnResult = ({ tryOn, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState(tryOn.notes || '');
  const [tags, setTags] = useState(tryOn.tags?.join(', ') || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggleFavorite = async () => {
    try {
      const result = await toggleFavorite(tryOn._id);
      onUpdate({ ...tryOn, isFavorite: result.data.isFavorite });
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const handleSaveEdit = async () => {
    setIsUpdating(true);
    try {
      const result = await updateTryOn(tryOn._id, {
        notes,
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      });
      onUpdate(result.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this try-on?')) return;

    try {
      await deleteTryOn(tryOn._id);
      onDelete(tryOn._id);
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = `${BASE_URL}${tryOn.resultPhotoUrl}`;
    link.download = `virtual-tryon-${tryOn._id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Result Image */}
      <div className="relative">
        <img
          src={`${BASE_URL}${tryOn.resultPhotoUrl}`}
          alt="Virtual Try-On Result"
          className="w-full h-96 object-cover"
        />

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={handleToggleFavorite}
            className={`p-2 rounded-full shadow-lg transition-all ${
              tryOn.isFavorite
                ? 'bg-red-500 text-white'
                : 'bg-white text-gray-600 hover:bg-red-50'
            }`}
          >
            <Heart className={`w-5 h-5 ${tryOn.isFavorite ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={handleDownload}
            className="p-2 bg-white rounded-full shadow-lg text-gray-600 hover:bg-purple-50 hover:text-purple-600 transition-all"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Details Section */}
      <div className="p-4">
        {!isEditing ? (
          <>
            {tryOn.notes && <p className="text-gray-700 mb-3">{tryOn.notes}</p>}

            {tryOn.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {tryOn.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex justify-between items-center pt-3 border-t">
              <span className="text-xs text-gray-500">
                {new Date(tryOn.createdAt).toLocaleDateString()}
              </span>

              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-3">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows="3"
            />

            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Tags (comma separated)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />

            <div className="flex gap-2">
              <button
                onClick={handleSaveEdit}
                disabled={isUpdating}
                className="flex-1 flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {isUpdating ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setNotes(tryOn.notes || '');
                  setTags(tryOn.tags?.join(', ') || '');
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TryOnResult;