import React from 'react';
import { useApp } from '../../context/AppContext';
import { EventCard } from '../../components/events/EventCard';
import { Button } from '../../components/common/Button';
import { Bookmark, Compass } from 'lucide-react';

export const FavoritesPage: React.FC = () => {
  const { events, favoriteEventIds, navigate } = useApp();

  const savedEvents = events.filter(e => favoriteEventIds.includes(e.id));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Saved Events
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Your bookmarked events for this semester.
        </p>
      </div>

      {savedEvents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedEvents.map(evt => (
            <EventCard key={evt.id} event={evt} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-white rounded-2xl border border-slate-200 p-8 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Bookmark className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No saved events yet</h3>
          <p className="text-xs text-slate-500 mt-1">
            Tap the heart icon on any event card to save it here for quick access later.
          </p>
          <Button
            variant="primary"
            size="sm"
            className="mt-4"
            onClick={() => navigate('discover')}
            leftIcon={<Compass className="w-4 h-4" />}
          >
            Explore Events
          </Button>
        </div>
      )}
    </div>
  );
};
