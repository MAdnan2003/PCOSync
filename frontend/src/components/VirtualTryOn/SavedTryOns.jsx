import React, { useState, useEffect } from 'react';
import { Heart, Filter } from 'lucide-react';
import { getTryOns } from '../../services/virtualTryOnService';
import TryOnResult from './TryOnResult';
import Loader from '../Common/Loader';
import ErrorMessage from '../Common/ErrorMessage';

const SavedTryOns = () => {
  const [tryOns, setTryOns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // 'all' or 'favorites'
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    loadTryOns();
  }, [filter, page]);

  const loadTryOns = async () => {
    setLoading(true);
    setError('');

    try {
      const isFavorite = filter === 'favorites' ? true : null;
      const result = await getTryOns({ page, limit: 12, isFavorite });
      setTryOns(result.data);
      setPagination(result.pagination);
    } catch (err) {
      setError(err.message || 'Failed to load try-ons');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (updatedTryOn) => {
    setTryOns((prev) =>
      prev.map((t) => (t._id === updatedTryOn._id ? updatedTryOn : t))
    );
  };

  const handleDelete = (id) => {
    setTryOns((prev) => prev.filter((t) => t._id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">My Try-Ons</h2>

        {/* Filter Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => {
              setFilter('all');
              setPage(1);
            }}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => {
              setFilter('favorites');
              setPage(1);
            }}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              filter === 'favorites'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Heart className="w-4 h-4" />
            Favorites
          </button>
        </div>
      </div>

      <ErrorMessage message={error} onClose={() => setError('')} />

      {loading ? (
        <Loader message="Loading try-ons..." />
      ) : tryOns.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {filter === 'favorites'
              ? 'No favorite try-ons yet'
              : 'No try-ons yet. Create your first virtual try-on!'}
          </p>
        </div>
      ) : (
        <>
          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tryOns.map((tryOn) => (
              <TryOnResult
                key={tryOn._id}
                tryOn={tryOn}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>

              <span className="px-4 py-2 text-gray-700">
                Page {page} of {pagination.totalPages}
              </span>

              <button
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SavedTryOns;