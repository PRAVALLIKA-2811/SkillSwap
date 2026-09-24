const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
  {
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reviewedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating between 1 and 5'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, 'Please add a constructive review comment'],
      trim: true,
      maxlength: 600,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent multiple reviews for the same session by the same reviewer
ReviewSchema.index({ reviewer: 1, session: 1 }, { unique: true });

// Static method to calculate and update average rating for the reviewed user
ReviewSchema.statics.calculateAverageRating = async function (userId) {
  const stats = await this.aggregate([
    {
      $match: { reviewedUser: new mongoose.Types.ObjectId(userId) },
    },
    {
      $group: {
        _id: '$reviewedUser',
        avgRating: { $avg: '$rating' },
        count: { $sum: 1 },
      },
    },
  ]);

  try {
    if (stats.length > 0) {
      await mongoose.model('User').findByIdAndUpdate(userId, {
        rating: Math.round(stats[0].avgRating * 10) / 10,
        reviewCount: stats[0].count,
      });
    } else {
      await mongoose.model('User').findByIdAndUpdate(userId, {
        rating: 5.0,
        reviewCount: 0,
      });
    }
  } catch (err) {
    console.error('Error updating user rating:', err);
  }
};

ReviewSchema.post('save', async function () {
  await this.constructor.calculateAverageRating(this.reviewedUser);
});

ReviewSchema.post('remove', async function () {
  await this.constructor.calculateAverageRating(this.reviewedUser);
});

module.exports = mongoose.model('Review', ReviewSchema);
