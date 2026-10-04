import React from 'react';
import { CollegeEvent } from '../../types';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { Heart, Calendar, MapPin, Users, ArrowUpRight } from 'lucide-react';

interface EventCardProps {
  event: CollegeEvent;
  onRegisterClick?: (event: CollegeEvent) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onRegisterClick }) => {
  const { navigate, favoriteEventIds, toggleFavorite } = useApp();
  const isFavorite = favoriteEventIds.includes(event.id);
  const isFull = event.registeredCount >= event.capacity;
  const isLive = event.status === 'live';

  return (
    <div className="group flex flex-col bg-white rounded-xl border border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-md transition-all overflow-hidden">
      {/* Poster Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <img
          src={event.posterUrl}
          alt={event.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={e => {
            // Zero-broken-image fallback
            (e.currentTarget as HTMLElement).style.display = 'none';
          }}
        />

        {/* Favorite Heart Button */}
        <button
          onClick={e => {
            e.stopPropagation();
            toggleFavorite(event.id);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-xs text-slate-600 hover:text-rose-600 shadow-sm transition-transform active:scale-90"
          title={isFavorite ? 'Remove from saved' : 'Save event'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Status indicator on top left */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          {isLive ? (
            <Badge variant="live" size="sm" withDot>
              LIVE NOW
            </Badge>
          ) : isFull ? (
            <Badge variant="warning" size="sm">
              Event Full · Waitlist
            </Badge>
          ) : (
            <span className="text-[11px] font-semibold text-white bg-slate-900/80 backdrop-blur-xs px-2.5 py-0.5 rounded">
              {event.category}
            </span>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata line with typographic separators (anti-slop rule) */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5">
            <span className="font-medium text-slate-700">{event.department}</span>
            <span aria-hidden="true">·</span>
            <span>{event.startDate}</span>
          </div>

          <h3
            onClick={() => navigate('event-details', event.id)}
            className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 cursor-pointer"
          >
            {event.title}
          </h3>

          <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
            {event.shortDescription || event.description}
          </p>

          <div className="mt-3 space-y-1 text-xs text-slate-500">
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{event.venue}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{event.startTime} - {event.endTime}</span>
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-800 tabular-nums">
              {event.registeredCount} / {event.capacity}
            </span>
            <span className="text-slate-400">spots</span>
          </div>

          <button
            onClick={() => navigate('event-details', event.id)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors group-hover:translate-x-0.5"
          >
            <span>View Details</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
