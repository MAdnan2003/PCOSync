import mongoose from 'mongoose';

const virtualTryOnSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    userPhotoUrl: {
      type: String,
      required: [true, 'User photo URL is required'],
    },
    outfitPhotoUrl: {
      type: String,
      required: [true, 'Outfit photo URL is required'],
    },
    resultPhotoUrl: {
      type: String,
      required: [true, 'Result photo URL is required'],
    },
    isFavorite: {
      type: Boolean,
      default: false,
      index: true,
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
      default: '',
    },
    tags: [
      {
        type: String,
        trim: true,
        maxlength: [30, 'Tag cannot exceed 30 characters'],
      },
    ],
    apiRequestId: {
      type: String,
      default: '',
    },
    processingStatus: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
      index: true,
    },
    errorMessage: {
      type: String,
      default: '',
    },
    metadata: {
      processingTime: {
        type: Number,
        default: 0,
      },
      apiResponse: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
      },
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Compound indexes for better query performance
virtualTryOnSchema.index({ userId: 1, createdAt: -1 });
virtualTryOnSchema.index({ userId: 1, isFavorite: 1, createdAt: -1 });
virtualTryOnSchema.index({ userId: 1, processingStatus: 1 });

// Virtual for formatted creation date
virtualTryOnSchema.virtual('formattedDate').get(function () {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
});

// Method to toggle favorite
virtualTryOnSchema.methods.toggleFavorite = async function () {
  this.isFavorite = !this.isFavorite;
  return await this.save();
};

const VirtualTryOn = mongoose.model('VirtualTryOn', virtualTryOnSchema);

export default VirtualTryOn;