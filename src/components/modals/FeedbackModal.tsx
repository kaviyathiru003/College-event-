import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Textarea } from '../common/Input';
import { useApp } from '../../context/AppContext';
import { Star, CheckCircle2 } from 'lucide-react';

export const FeedbackModal: React.FC = () => {
  const { activeFeedbackEvent, setActiveFeedbackEvent, submitFeedback, currentUser } = useApp();
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [categoryRatings, setCategoryRatings] = useState({
    sessions: 5,
    organization: 5,
    venue: 4,
    speakers: 5,
    activities: 4,
  });
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!activeFeedbackEvent) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitFeedback({
      eventId: activeFeedbackEvent.id,
      eventTitle: activeFeedbackEvent.title,
      participantId: currentUser?.id || 'guest',
      participantName: currentUser?.name || 'Alex Chen',
      rating,
      categories: categoryRatings,
      comment,
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setActiveFeedbackEvent(null);
      setComment('');
    }, 1600);
  };

  return (
    <Modal
      isOpen={!!activeFeedbackEvent}
      onClose={() => setActiveFeedbackEvent(null)}
      title="Event Experience Feedback"
      description={activeFeedbackEvent.title}
      maxWidth="md"
    >
      {submitted ? (
        <div className="py-8 text-center flex flex-col items-center">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-slate-900">Thank you for your feedback!</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-xs">
            Your review helps student organizers and faculty refine upcoming campus programming.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-center py-2 border-b border-slate-100">
            <p className="text-xs font-medium text-slate-600 mb-2">Overall Satisfaction</p>
            <div className="flex items-center justify-center gap-1.5">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    className={`w-7 h-7 ${
                      (hoverRating || rating) >= star
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs font-semibold text-slate-700 mt-1 block">
              {rating === 5 ? 'Exceptional' : rating === 4 ? 'Very Good' : rating === 3 ? 'Good' : 'Needs Improvement'}
            </span>
          </div>

          {/* Category Ratings */}
          <div className="space-y-2.5 pt-1">
            <p className="text-xs font-semibold text-slate-700">Category Breakdown</p>
            {[
              { key: 'sessions', label: 'Session Content & Flow' },
              { key: 'organization', label: 'Coordination & Timeliness' },
              { key: 'venue', label: 'Venue, Seating & Acoustics' },
              { key: 'speakers', label: 'Speakers & Presenters' },
            ].map(cat => (
              <div key={cat.key} className="flex items-center justify-between text-xs">
                <span className="text-slate-600">{cat.label}</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(score => (
                    <button
                      type="button"
                      key={score}
                      onClick={() =>
                        setCategoryRatings(prev => ({ ...prev, [cat.key]: score }))
                      }
                      className={`w-6 h-6 rounded text-[11px] font-medium transition-colors ${
                        (categoryRatings as any)[cat.key] >= score
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {score}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <Textarea
            label="Comments & Suggestions"
            placeholder="What went particularly well? What could the organizing team improve next semester?"
            value={comment}
            onChange={e => setComment(e.target.value)}
            rows={3}
          />

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setActiveFeedbackEvent(null)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Submit Feedback
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
