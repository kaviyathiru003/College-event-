import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OrganizerLayout } from '../../components/layout/OrganizerLayout';
import { Button } from '../../components/common/Button';
import { Input, Textarea, Select } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Megaphone, PlusCircle, Mail, MessageSquare, Bell, Send } from 'lucide-react';

export const OrganizerAnnouncementsPage: React.FC = () => {
  const { announcements, events, addAnnouncement } = useApp();

  const [composerOpen, setComposerOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(events[0]?.id || '');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [audience, setAudience] = useState<'all' | 'checked_in' | 'waitlist'>('all');
  const [channels, setChannels] = useState({ email: true, sms: false, push: true });
  const [priority, setPriority] = useState<'normal' | 'urgent'>('normal');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const event = events.find(ev => ev.id === selectedEventId);
    if (!event) return;

    addAnnouncement({
      eventId: event.id,
      eventTitle: event.title,
      title,
      content,
      audience,
      priority,
      channels: Object.entries(channels).filter(([_, v]) => v).map(([k]) => k as any),
      authorName: event.organizerName,
    });

    setTitle('');
    setContent('');
    setComposerOpen(false);
  };

  return (
    <OrganizerLayout activeNav="announcements">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Broadcast Announcements Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Deliver urgent room changes, speaker updates, and calendar alerts directly to participants.
            </p>
          </div>

          <Button
            variant="primary"
            onClick={() => setComposerOpen(true)}
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            New Announcement
          </Button>
        </div>

        {/* Existing Announcements List */}
        <div className="space-y-3">
          {announcements.map(ann => (
            <div
              key={ann.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-indigo-700 font-mono">
                      {ann.eventTitle}
                    </span>
                    <Badge variant={ann.priority === 'urgent' ? 'error' : 'neutral'} size="sm">
                      {ann.priority === 'urgent' ? 'High Urgency' : 'Standard'}
                    </Badge>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">{ann.timestamp}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{ann.title}</h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{ann.content}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span className="capitalize">Audience: {ann.audience.replace('_', ' ')} attendees</span>
                <span className="flex items-center gap-1.5 font-medium text-emerald-600">
                  <Send className="w-3.5 h-3.5" />
                  <span>Delivered via Email & Push</span>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Composer Modal */}
        <Modal
          isOpen={composerOpen}
          onClose={() => setComposerOpen(false)}
          title="Compose Event Announcement"
          maxWidth="md"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Select
              label="Target Event"
              value={selectedEventId}
              onChange={e => setSelectedEventId(e.target.value)}
              options={events.map(ev => ({ label: ev.title, value: ev.id }))}
            />

            <Input
              label="Subject / Headline"
              placeholder="e.g. Schedule Update: Keynote starts 15m early"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />

            <Textarea
              label="Message Body"
              placeholder="Explain the update clearly with specific room numbers, instructions or links..."
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={4}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Select
                label="Target Audience"
                value={audience}
                onChange={e => setAudience(e.target.value as any)}
                options={[
                  { label: 'All Registered Participants', value: 'all' },
                  { label: 'Checked-in Participants Only', value: 'checked_in' },
                  { label: 'Waitlisted Applicants Only', value: 'waitlist' },
                ]}
              />

              <Select
                label="Urgency Level"
                value={priority}
                onChange={e => setPriority(e.target.value as any)}
                options={[
                  { label: 'Normal Bulletin', value: 'normal' },
                  { label: 'Urgent Alert (Banner highlight)', value: 'urgent' },
                ]}
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs font-semibold text-slate-700 block mb-2">Notification Channels</span>
              <div className="flex items-center gap-4 text-xs text-slate-600">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={channels.email}
                    onChange={e => setChannels({ ...channels, email: e.target.checked })}
                    className="rounded border-slate-300 text-indigo-600"
                  />
                  <span>Campus Email</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={channels.push}
                    onChange={e => setChannels({ ...channels, push: e.target.checked })}
                    className="rounded border-slate-300 text-indigo-600"
                  />
                  <span>In-App Alert</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={channels.sms}
                    onChange={e => setChannels({ ...channels, sms: e.target.checked })}
                    className="rounded border-slate-300 text-indigo-600"
                  />
                  <span>SMS Emergency</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setComposerOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Publish Broadcast
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </OrganizerLayout>
  );
};
