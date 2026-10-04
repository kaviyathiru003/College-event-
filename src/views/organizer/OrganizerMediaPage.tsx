import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OrganizerLayout } from '../../components/layout/OrganizerLayout';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input, Select } from '../../components/common/Input';
import { PlusCircle, Image as ImageIcon, Trash2 } from 'lucide-react';

export const OrganizerMediaPage: React.FC = () => {
  const { events, showToast } = useApp();

  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [mediaTitle, setMediaTitle] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');

  const [mediaItems, setMediaItems] = useState([
    {
      id: 'med-1',
      title: 'Quantum Horizons Main Auditorium Stage Setup',
      url: events[0]?.posterUrl || '',
      date: 'Oct 02, 2026',
      tag: 'Keynote Stage',
    },
    {
      id: 'med-2',
      title: 'Spring Symphony Open-Air Soundcheck',
      url: events[2]?.posterUrl || '',
      date: 'Oct 03, 2026',
      tag: 'Amphitheatre',
    },
    {
      id: 'med-3',
      title: 'CodePulse Innovation Lab Setup & Mentors',
      url: events[1]?.posterUrl || '',
      date: 'Oct 01, 2026',
      tag: 'Hackathon Quad',
    },
  ]);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaTitle) return;

    setMediaItems([
      {
        id: 'med-' + Date.now(),
        title: mediaTitle,
        url: mediaUrl || events[0]?.posterUrl || '',
        date: 'Today',
        tag: 'Campus Media',
      },
      ...mediaItems,
    ]);

    setMediaTitle('');
    setMediaUrl('');
    setUploadModalOpen(false);

    showToast({
      type: 'success',
      title: 'Asset Added',
      message: 'New media asset published to event galleries.',
    });
  };

  return (
    <OrganizerLayout activeNav="media">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Event Media & Asset Gallery
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Store high-resolution banners, stage photography, and promotional posters.
            </p>
          </div>

          <Button
            variant="primary"
            onClick={() => setUploadModalOpen(true)}
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            Upload Media
          </Button>
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mediaItems.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div className="aspect-[16/10] bg-slate-100 overflow-hidden relative">
                <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 text-[10px] font-bold bg-slate-900/80 text-white px-2 py-0.5 rounded">
                  {item.tag}
                </span>
              </div>

              <div className="p-4">
                <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>{item.date}</span>
                  <button
                    onClick={() => setMediaItems(mediaItems.filter(m => m.id !== item.id))}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Upload Modal */}
        <Modal
          isOpen={uploadModalOpen}
          onClose={() => setUploadModalOpen(false)}
          title="Upload Event Media"
          maxWidth="sm"
        >
          <form onSubmit={handleUpload} className="space-y-4">
            <Input
              label="Asset Title"
              placeholder="e.g. Auditorium Soundcheck Photo"
              value={mediaTitle}
              onChange={e => setMediaTitle(e.target.value)}
              required
            />

            <Input
              label="Image URL or Preset"
              placeholder="Paste public image URL or keep default"
              value={mediaUrl}
              onChange={e => setMediaUrl(e.target.value)}
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setUploadModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Add to Gallery
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </OrganizerLayout>
  );
};
