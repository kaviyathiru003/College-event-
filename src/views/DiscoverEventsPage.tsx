import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { EventCard } from '../components/events/EventCard';
import { Input, Select } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Search, Filter, X, Calendar, MapPin, Building, RotateCcw, History, Download } from 'lucide-react';

export const DiscoverEventsPage: React.FC = () => {
  const { 
    events, 
    searchHistory, 
    addSearchQuery, 
    removeSearchQuery, 
    clearSearchHistory, 
    setCalendarExportModalOpen 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
  const [selectedVenue, setSelectedVenue] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('upcoming');
  const [showFilters, setShowFilters] = useState(false);
  const [showHistoryDropdown, setShowHistoryDropdown] = useState(false);

  const categories = ['All', 'Technical', 'Cultural', 'Sports', 'Workshop', 'Academic'];

  // Extract unique departments and venues
  const departments = useMemo(() => {
    const list = Array.from(new Set(events.map(e => e.department)));
    return ['All', ...list];
  }, [events]);

  const venues = useMemo(() => {
    const list = Array.from(new Set(events.map(e => e.building)));
    return ['All', ...list];
  }, [events]);

  const filteredEvents = useMemo(() => {
    return events
      .filter(evt => {
        // Search query
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const matchTitle = evt.title.toLowerCase().includes(q);
          const matchDesc = evt.description.toLowerCase().includes(q);
          const matchDept = evt.department.toLowerCase().includes(q);
          const matchTags = evt.tags.some(t => t.toLowerCase().includes(q));
          if (!matchTitle && !matchDesc && !matchDept && !matchTags) return false;
        }

        // Category
        if (selectedCategory !== 'All' && evt.category !== selectedCategory) {
          return false;
        }

        // Department
        if (selectedDepartment !== 'All' && evt.department !== selectedDepartment) {
          return false;
        }

        // Venue
        if (selectedVenue !== 'All' && evt.building !== selectedVenue) {
          return false;
        }

        // Status
        if (selectedStatus !== 'All' && evt.status !== selectedStatus) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'upcoming') {
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        }
        if (sortBy === 'popular') {
          return b.registeredCount - a.registeredCount;
        }
        if (sortBy === 'capacity') {
          return b.capacity - a.capacity;
        }
        return 0;
      });
  }, [events, searchQuery, selectedCategory, selectedDepartment, selectedVenue, selectedStatus, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedDepartment('All');
    setSelectedVenue('All');
    setSelectedStatus('All');
    setSortBy('upcoming');
  };

  const hasActiveFilters =
    searchQuery ||
    selectedCategory !== 'All' ||
    selectedDepartment !== 'All' ||
    selectedVenue !== 'All' ||
    selectedStatus !== 'All';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Discover Campus Events
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse upcoming symposiums, tournaments, workshops, and student festivals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCalendarExportModalOpen(true)}
            leftIcon={<Download className="w-3.5 h-3.5 text-indigo-600" />}
          >
            Calendar Export
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            leftIcon={<Filter className="w-3.5 h-3.5" />}
          >
            {showFilters ? 'Hide Advanced Filters' : 'Filters'}
          </Button>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Search Bar & Primary Category Tabs */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Input
              placeholder="Search by event name, topics, department, or tags..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  addSearchQuery(searchQuery);
                }
              }}
              onFocus={() => setShowHistoryDropdown(true)}
              leftIcon={<Search className="w-4 h-4" />}
              rightIcon={
                searchQuery ? (
                  <button onClick={() => setSearchQuery('')} className="p-1 hover:text-slate-700">
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : null
              }
            />
          </div>

          <div className="w-full sm:w-48">
            <Select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              options={[
                { label: 'Sort: Date (Upcoming)', value: 'upcoming' },
                { label: 'Sort: Most Registered', value: 'popular' },
                { label: 'Sort: Venue Capacity', value: 'capacity' },
              ]}
            />
          </div>
        </div>

        {/* Search History Row */}
        {searchHistory.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap pt-0.5 pb-1">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 mr-1">
              <History className="w-3 h-3 text-slate-400" />
              <span>Recent:</span>
            </span>
            {searchHistory.slice(0, 6).map(q => (
              <span
                key={q}
                className="group inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-100 hover:bg-indigo-50 border border-slate-200 text-[11px] font-medium text-slate-700 hover:text-indigo-700 transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setSearchQuery(q)}
                  className="cursor-pointer"
                >
                  {q}
                </button>
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    removeSearchQuery(q);
                  }}
                  className="text-slate-400 hover:text-rose-500 ml-0.5"
                  title="Remove from history"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            ))}
            <button
              onClick={clearSearchHistory}
              className="text-[10px] text-slate-400 hover:text-rose-600 transition-colors ml-1"
            >
              Clear
            </button>
          </div>
        )}

        {/* Category Filter Tabs (Interactive Segmented Buttons) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="p-4 rounded-xl bg-white border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in fade-in duration-150">
          <Select
            label="Department"
            value={selectedDepartment}
            onChange={e => setSelectedDepartment(e.target.value)}
            options={departments.map(d => ({ label: d, value: d }))}
          />

          <Select
            label="Campus Facility"
            value={selectedVenue}
            onChange={e => setSelectedVenue(e.target.value)}
            options={venues.map(v => ({ label: v, value: v }))}
          />

          <Select
            label="Status"
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            options={[
              { label: 'All Statuses', value: 'All' },
              { label: 'Published & Open', value: 'published' },
              { label: 'Live Today', value: 'live' },
              { label: 'Completed', value: 'completed' },
            ]}
          />
        </div>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          Showing <strong className="text-slate-900 font-mono tabular-nums">{filteredEvents.length}</strong> events
        </span>
      </div>

      {/* Grid: 3-column desktop layout, 2-column tablet layout, 1-column mobile layout */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(evt => (
            <EventCard key={evt.id} event={evt} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 p-8">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No matching events found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search keywords, clearing selected category filters, or resetting date options.
          </p>
          <Button variant="outline" size="sm" className="mt-4" onClick={resetFilters}>
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  );
};
