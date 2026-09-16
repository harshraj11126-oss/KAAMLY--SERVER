import React, { useState } from 'react';
import { X, Star, Send, ThumbsUp, AlertCircle } from 'lucide-react';
import { Booking, User } from '../types';

interface ReviewModalProps {
  booking: Booking | null;
  currentUser: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitReview: (reviewData: {
    bookingId: string;
    jobId?: string;
    rating: number;
    comment: string;
    tags: string[];
    toUserId: string;
    toUserName: string;
    targetType: 'worker' | 'customer';
    serviceCategory: string;
  }) => void;
}

const REVIEW_TAGS = [
  'Punctual Arrival',
  'Polite Behavior',
  'Fair Pricing',
  'Expert Quality Work',
  'Clean Finish',
  'Good Communication',
  'Fast Response'
];

export const ReviewModal: React.FC<ReviewModalProps> = ({
  booking,
  currentUser,
  isOpen,
  onClose,
  onSubmitReview
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !booking || !currentUser) return null;

  const isCustomerReviewing = currentUser.id === booking.customerId;
  const targetName = isCustomerReviewing ? booking.workerName : booking.customerName;
  const targetUserId = isCustomerReviewing ? booking.workerUserId : booking.customerId;
  const targetType = isCustomerReviewing ? 'worker' : 'customer';

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Please write a few words about your experience.');
      return;
    }

    onSubmitReview({
      bookingId: booking.id,
      jobId: booking.jobId,
      rating,
      comment: comment.trim(),
      tags: selectedTags,
      toUserId: targetUserId,
      toUserName: targetName,
      targetType,
      serviceCategory: booking.serviceCategory
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div>
            <h3 className="font-bold text-white text-base">Rate & Review</h3>
            <p className="text-xs text-slate-400">Share feedback for {targetName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 bg-red-950/60 border border-red-800/60 rounded-xl flex items-center gap-2 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Star Rating */}
          <div className="text-center py-2">
            <span className="text-xs font-semibold text-slate-300 block mb-2">
              Overall Experience Rating
            </span>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 ${
                      (hoverRating || rating) >= star
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-600'
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs font-bold text-amber-400 mt-2 block">
              {rating === 5 ? 'Excellent Work (5/5)' : rating === 4 ? 'Good Experience (4/5)' : rating === 3 ? 'Average (3/5)' : 'Needs Improvement'}
            </span>
          </div>

          {/* Highlight Tags */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              What went well? (Select tags)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {REVIEW_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '} {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Written Review & Feedback *
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder={`Describe how ${targetName} handled the ${booking.serviceCategory} work...`}
              required
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-amber-400 placeholder-slate-500 leading-relaxed"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-bold text-sm shadow-md hover:shadow-amber-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4 text-slate-950" />
            <span>Submit Public Review</span>
          </button>
        </form>
      </div>
    </div>
  );
};
