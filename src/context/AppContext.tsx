import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  CollegeEvent, 
  Registration, 
  Announcement, 
  Certificate, 
  Feedback, 
  AuditLog, 
  User, 
  UserRole 
} from '../types';
import { 
  INITIAL_EVENTS, 
  INITIAL_REGISTRATIONS, 
  INITIAL_ANNOUNCEMENTS, 
  INITIAL_CERTIFICATES, 
  INITIAL_AUDIT_LOGS, 
  MOCK_USERS 
} from '../data/mockData';

export type AppView =
  | 'landing'
  | 'discover'
  | 'event-details'
  | 'about'
  | 'participant-dashboard'
  | 'my-events'
  | 'favorites'
  | 'notifications'
  | 'live-event'
  | 'certificates'
  | 'profile'
  | 'organizer-dashboard'
  | 'organizer-events'
  | 'organizer-create'
  | 'organizer-event-overview'
  | 'organizer-registrations'
  | 'organizer-announcements'
  | 'organizer-analytics'
  | 'organizer-media'
  | 'organizer-settings'
  | 'admin-dashboard'
  | 'admin-users'
  | 'admin-organizers'
  | 'admin-events'
  | 'admin-registrations'
  | 'admin-permissions'
  | 'admin-audit'
  | 'admin-settings'
  | 'access-restricted';

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}

interface AppContextType {
  currentUser: User | null;
  role: UserRole;
  currentView: AppView;
  selectedEventId: string | null;
  selectedEvent: CollegeEvent | null;
  selectedRegistration: Registration | null;
  events: CollegeEvent[];
  registrations: Registration[];
  announcements: Announcement[];
  certificates: Certificate[];
  feedbackList: Feedback[];
  auditLogs: AuditLog[];
  favoriteEventIds: string[];
  toasts: ToastMessage[];

  // Navigation & View Actions
  navigate: (view: AppView, eventId?: string) => void;
  setRole: (role: UserRole) => void;
  loginAs: (role: UserRole) => void;
  logout: () => void;
  setSelectedEventId: (id: string | null) => void;
  
  // Event Actions
  createEvent: (eventData: Partial<CollegeEvent>) => string;
  updateEvent: (id: string, updates: Partial<CollegeEvent>) => void;
  deleteEvent: (id: string) => void;
  toggleFavorite: (eventId: string) => void;

  // Registration & Check-in Actions
  registerForEvent: (params: {
    eventId: string;
    participantName: string;
    participantEmail: string;
    participantPhone: string;
    department: string;
    year: string;
    registrationType: 'individual' | 'team';
    teamName?: string;
    teamMembers?: string[];
  }) => { success: boolean; registration?: Registration; isWaitlist?: boolean };
  toggleCheckIn: (registrationId: string) => void;
  cancelRegistration: (registrationId: string) => void;
  promoteWaitlist: (registrationId: string) => void;

  // Announcements & Feedback
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'timestamp'>) => void;
  markAnnouncementAsRead: (id: string) => void;
  submitFeedback: (feedback: Omit<Feedback, 'id' | 'createdAt'>) => void;

  // Modals & UI helpers
  activeQrPassReg: Registration | null;
  setActiveQrPassReg: (reg: Registration | null) => void;
  activeFeedbackEvent: CollegeEvent | null;
  setActiveFeedbackEvent: (evt: CollegeEvent | null) => void;
  activeCertificate: Certificate | null;
  setActiveCertificate: (cert: Certificate | null) => void;
  downloadCenterOpen: boolean;
  setDownloadCenterOpen: (open: boolean) => void;
  quickAccessOpen: boolean;
  setQuickAccessOpen: (open: boolean) => void;
  calendarExportModalOpen: boolean;
  setCalendarExportModalOpen: (open: boolean) => void;
  calendarExportEvent: CollegeEvent | null;
  setCalendarExportEvent: (event: CollegeEvent | null) => void;
  searchHistory: string[];
  addSearchQuery: (query: string) => void;
  removeSearchQuery: (query: string) => void;
  clearSearchHistory: () => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authModalMode: 'signin' | 'signup' | 'forgot' | 'reset';
  setAuthModalMode: (mode: 'signin' | 'signup' | 'forgot' | 'reset') => void;
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
  dismissToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'eventflow_v1_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'currentUser');
    return saved ? JSON.parse(saved) : MOCK_USERS.participant;
  });

  const [currentView, setCurrentView] = useState<AppView>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'currentView') as AppView;
    return saved || 'landing';
  });

  const [selectedEventId, setSelectedEventId] = useState<string | null>('evt-techfest-2026');

  const [events, setEvents] = useState<CollegeEvent[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [registrations, setRegistrations] = useState<Registration[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'registrations');
    return saved ? JSON.parse(saved) : INITIAL_REGISTRATIONS;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'announcements');
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  const [certificates, setCertificates] = useState<Certificate[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'certificates');
    return saved ? JSON.parse(saved) : INITIAL_CERTIFICATES;
  });

  const [feedbackList, setFeedbackList] = useState<Feedback[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'feedback');
    return saved ? JSON.parse(saved) : [];
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'auditLogs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [favoriteEventIds, setFavoriteEventIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'favorites');
    return saved ? JSON.parse(saved) : ['evt-techfest-2026', 'evt-cultural-symphony'];
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Modals state
  const [activeQrPassReg, setActiveQrPassReg] = useState<Registration | null>(null);
  const [activeFeedbackEvent, setActiveFeedbackEvent] = useState<CollegeEvent | null>(null);
  const [activeCertificate, setActiveCertificate] = useState<Certificate | null>(null);
  const [downloadCenterOpen, setDownloadCenterOpen] = useState<boolean>(false);
  const [quickAccessOpen, setQuickAccessOpen] = useState<boolean>(false);
  const [calendarExportModalOpen, setCalendarExportModalOpen] = useState<boolean>(false);
  const [calendarExportEvent, setCalendarExportEvent] = useState<CollegeEvent | null>(null);

  // Search History state
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'searchHistory');
    return saved ? JSON.parse(saved) : ['Hackathon', 'Robotics', 'Turing Hall', 'Amphitheatre', 'AI Workshop'];
  });

  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup' | 'forgot' | 'reset'>('signin');

  // Persistence effects
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'currentUser', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'searchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'currentView', currentView);
  }, [currentView]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'registrations', JSON.stringify(registrations));
  }, [registrations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'certificates', JSON.stringify(certificates));
  }, [certificates]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'feedback', JSON.stringify(feedbackList));
  }, [feedbackList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'auditLogs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'favorites', JSON.stringify(favoriteEventIds));
  }, [favoriteEventIds]);

  const showToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const role: UserRole = currentUser ? currentUser.role : 'participant';

  const navigate = (view: AppView, eventId?: string) => {
    if (eventId) {
      setSelectedEventId(eventId);
    }
    
    // RBAC validation check
    const isOrgRoute = view.startsWith('organizer-');
    const isAdminRoute = view.startsWith('admin-');

    if (isOrgRoute && role !== 'organizer' && role !== 'admin') {
      setCurrentView('access-restricted');
      return;
    }
    if (isAdminRoute && role !== 'admin') {
      setCurrentView('access-restricted');
      return;
    }

    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loginAs = (targetRole: UserRole) => {
    const user = MOCK_USERS[targetRole];
    setCurrentUser(user);
    showToast({
      type: 'info',
      title: `Switched to ${targetRole.toUpperCase()}`,
      message: `Logged in as ${user.name} (${user.department})`,
    });

    if (targetRole === 'organizer') {
      setCurrentView('organizer-dashboard');
    } else if (targetRole === 'admin') {
      setCurrentView('admin-dashboard');
    } else {
      setCurrentView('participant-dashboard');
    }
  };

  const setRole = (newRole: UserRole) => {
    loginAs(newRole);
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentView('landing');
    showToast({
      type: 'info',
      title: 'Logged Out',
      message: 'You have been safely signed out.',
    });
  };

  const toggleFavorite = (eventId: string) => {
    setFavoriteEventIds(prev => {
      const exists = prev.includes(eventId);
      if (exists) {
        showToast({ type: 'info', title: 'Removed from Favorites' });
        return prev.filter(id => id !== eventId);
      } else {
        showToast({ type: 'success', title: 'Saved to Favorites' });
        return [...prev, eventId];
      }
    });
  };

  const registerForEvent = (params: {
    eventId: string;
    participantName: string;
    participantEmail: string;
    participantPhone: string;
    department: string;
    year: string;
    registrationType: 'individual' | 'team';
    teamName?: string;
    teamMembers?: string[];
  }) => {
    const event = events.find(e => e.id === params.eventId);
    if (!event) return { success: false };

    // Check duplicate
    const existing = registrations.find(
      r => r.eventId === params.eventId && r.participantEmail.toLowerCase() === params.participantEmail.toLowerCase() && r.status !== 'cancelled'
    );
    if (existing) {
      showToast({
        type: 'error',
        title: 'Already Registered',
        message: `You are already registered with ticket #${existing.id}`,
      });
      return { success: false, registration: existing };
    }

    const isFull = event.registeredCount >= event.capacity;
    const isWaitlist = isFull && event.allowWaitlist;

    if (isFull && !event.allowWaitlist) {
      showToast({
        type: 'error',
        title: 'Event is Full',
        message: 'Registration is closed and waitlist is not enabled for this event.',
      });
      return { success: false };
    }

    const regCount = registrations.length + 1;
    const newRegId = `EVF-2026-${String(regCount).padStart(5, '0')}`;
    const newRegistration: Registration = {
      id: newRegId,
      eventId: event.id,
      eventTitle: event.title,
      eventDate: `${event.startDate} · ${event.startTime}`,
      eventVenue: `${event.venue}, ${event.room}`,
      eventTime: `${event.startTime} - ${event.endTime}`,
      participantId: currentUser?.id || 'guest-' + Date.now(),
      participantName: params.participantName,
      participantEmail: params.participantEmail,
      participantPhone: params.participantPhone,
      department: params.department,
      year: params.year,
      registrationType: params.registrationType,
      teamName: params.teamName,
      teamMembers: params.teamMembers,
      status: isWaitlist ? 'waitlist' : 'confirmed',
      checkInStatus: 'not_checked_in',
      qrCodeHash: `EVF-QR-${Math.floor(10000 + Math.random() * 90000)}-${newRegId}`,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setRegistrations(prev => [newRegistration, ...prev]);

    // Update event counts
    setEvents(prev =>
      prev.map(e => {
        if (e.id === params.eventId) {
          return {
            ...e,
            registeredCount: isWaitlist ? e.registeredCount : e.registeredCount + 1,
            waitlistCount: isWaitlist ? e.waitlistCount + 1 : e.waitlistCount,
          };
        }
        return e;
      })
    );

    // Add Audit Log
    setAuditLogs(prev => [
      {
        id: 'log-' + Date.now(),
        action: isWaitlist ? 'Joined Waitlist' : 'New Registration',
        target: `${newRegId} (${params.participantName}) → ${event.title}`,
        user: params.participantName,
        role: 'participant',
        timestamp: new Date().toLocaleString(),
        ip: '127.0.0.1',
        status: 'success',
      },
      ...prev,
    ]);

    showToast({
      type: 'success',
      title: isWaitlist ? 'Joined Waitlist' : 'Registration Confirmed!',
      message: isWaitlist
        ? `You are in waitlist queue for ${event.title}.`
        : `Your pass #${newRegId} has been generated.`,
    });

    return { success: true, registration: newRegistration, isWaitlist };
  };

  const toggleCheckIn = (registrationId: string) => {
    setRegistrations(prev =>
      prev.map(reg => {
        if (reg.id === registrationId) {
          const newStatus = reg.checkInStatus === 'checked_in' ? 'not_checked_in' : 'checked_in';
          const timestamp = newStatus === 'checked_in' ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined;
          
          showToast({
            type: newStatus === 'checked_in' ? 'success' : 'info',
            title: newStatus === 'checked_in' ? 'Participant Checked In ✓' : 'Check-in Reverted',
            message: `${reg.participantName} (${reg.id})`,
          });

          // Log
          setAuditLogs(logs => [
            {
              id: 'log-' + Date.now(),
              action: newStatus === 'checked_in' ? 'Check-in Validated' : 'Check-in Undone',
              target: `${reg.id} (${reg.participantName})`,
              user: currentUser?.name || 'Gate Scanner',
              role: role,
              timestamp: new Date().toLocaleString(),
              ip: '10.0.8.1',
              status: 'success',
            },
            ...logs,
          ]);

          return {
            ...reg,
            checkInStatus: newStatus,
            checkInTimestamp: timestamp,
          };
        }
        return reg;
      })
    );
  };

  const cancelRegistration = (registrationId: string) => {
    const reg = registrations.find(r => r.id === registrationId);
    if (!reg) return;

    setRegistrations(prev =>
      prev.map(r => (r.id === registrationId ? { ...r, status: 'cancelled' } : r))
    );

    setEvents(prev =>
      prev.map(e => {
        if (e.id === reg.eventId) {
          return {
            ...e,
            registeredCount: Math.max(0, e.registeredCount - 1),
          };
        }
        return e;
      })
    );

    showToast({
      type: 'info',
      title: 'Registration Cancelled',
      message: `Registration ${registrationId} was cancelled.`,
    });
  };

  const promoteWaitlist = (registrationId: string) => {
    setRegistrations(prev =>
      prev.map(r => (r.id === registrationId ? { ...r, status: 'confirmed' } : r))
    );

    showToast({
      type: 'success',
      title: 'Participant Promoted',
      message: `Moved to confirmed attendees list.`,
    });
  };

  const createEvent = (eventData: Partial<CollegeEvent>): string => {
    const newId = 'evt-' + Date.now();
    const slug = (eventData.title || 'new-event')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const newEvent: CollegeEvent = {
      id: newId,
      slug,
      title: eventData.title || 'Untitled College Event',
      category: eventData.category || 'Technical',
      department: eventData.department || currentUser?.department || 'Computer Science & Engineering',
      description: eventData.description || '',
      shortDescription: eventData.shortDescription || eventData.description?.slice(0, 100) || '',
      posterUrl: eventData.posterUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&h=800&q=80',
      startDate: eventData.startDate || '2026-11-01',
      endDate: eventData.endDate || eventData.startDate || '2026-11-01',
      startTime: eventData.startTime || '10:00 AM',
      endTime: eventData.endTime || '05:00 PM',
      venue: eventData.venue || 'Campus Main Auditorium',
      building: eventData.building || 'Main Campus Hall',
      floor: eventData.floor || 'Ground Floor',
      room: eventData.room || 'Room 101',
      capacity: eventData.capacity || 100,
      registeredCount: 0,
      waitlistCount: 0,
      status: eventData.status || 'published',
      organizerName: currentUser?.name || 'Department Faculty',
      organizerDept: currentUser?.department || 'Student Council',
      organizerEmail: currentUser?.email || 'events@campus.edu',
      isRegistrationOpen: true,
      allowWaitlist: eventData.allowWaitlist ?? true,
      registrationDeadline: eventData.registrationDeadline || '2026-10-31',
      tags: eventData.tags || ['Collegiate', 'Workshop'],
      schedule: eventData.schedule || [],
      speakers: eventData.speakers || [],
      media: [],
      rating: 5.0,
      reviewCount: 0,
    };

    setEvents(prev => [newEvent, ...prev]);

    setAuditLogs(prev => [
      {
        id: 'log-' + Date.now(),
        action: 'Event Created',
        target: `${newEvent.title} (${newEvent.status})`,
        user: currentUser?.name || 'Organizer',
        role: role,
        timestamp: new Date().toLocaleString(),
        ip: '172.16.4.12',
        status: 'success',
      },
      ...prev,
    ]);

    showToast({
      type: 'success',
      title: 'Event Created Successfully!',
      message: `"${newEvent.title}" is now ${newEvent.status}.`,
    });

    return newId;
  };

  const updateEvent = (id: string, updates: Partial<CollegeEvent>) => {
    setEvents(prev =>
      prev.map(e => (e.id === id ? { ...e, ...updates } : e))
    );
    showToast({
      type: 'success',
      title: 'Event Updated',
      message: 'Changes saved successfully.',
    });
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    showToast({
      type: 'info',
      title: 'Event Removed',
    });
  };

  const addAnnouncement = (annData: Omit<Announcement, 'id' | 'timestamp'>) => {
    const newAnn: Announcement = {
      ...annData,
      id: 'ann-' + Date.now(),
      timestamp: 'Just now',
      isRead: false,
    };
    setAnnouncements(prev => [newAnn, ...prev]);
    showToast({
      type: 'success',
      title: 'Announcement Published',
      message: `Broadcasted to ${annData.audience} participants.`,
    });
  };

  const markAnnouncementAsRead = (id: string) => {
    setAnnouncements(prev =>
      prev.map(a => (a.id === id ? { ...a, isRead: true } : a))
    );
  };

  const submitFeedback = (fbData: Omit<Feedback, 'id' | 'createdAt'>) => {
    const newFb: Feedback = {
      ...fbData,
      id: 'fb-' + Date.now(),
      createdAt: new Date().toLocaleDateString(),
    };
    setFeedbackList(prev => [newFb, ...prev]);
    showToast({
      type: 'success',
      title: 'Thank You for Your Feedback!',
      message: 'Your response helps enhance college event quality.',
    });
  };

  const addSearchQuery = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setSearchHistory(prev => {
      const filtered = prev.filter(q => q.toLowerCase() !== trimmed.toLowerCase());
      return [trimmed, ...filtered].slice(0, 10);
    });
  };

  const removeSearchQuery = (query: string) => {
    setSearchHistory(prev => prev.filter(q => q.toLowerCase() !== query.toLowerCase()));
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    showToast({
      type: 'info',
      title: 'Search History Cleared',
    });
  };

  const selectedEvent = events.find(e => e.id === selectedEventId) || events[0] || null;
  const selectedRegistration = registrations.find(r => r.eventId === selectedEventId) || null;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        role,
        currentView,
        selectedEventId,
        selectedEvent,
        selectedRegistration,
        events,
        registrations,
        announcements,
        certificates,
        feedbackList,
        auditLogs,
        favoriteEventIds,
        toasts,
        navigate,
        setRole,
        loginAs,
        logout,
        setSelectedEventId,
        createEvent,
        updateEvent,
        deleteEvent,
        toggleFavorite,
        registerForEvent,
        toggleCheckIn,
        cancelRegistration,
        promoteWaitlist,
        addAnnouncement,
        markAnnouncementAsRead,
        submitFeedback,
        activeQrPassReg,
        setActiveQrPassReg,
        activeFeedbackEvent,
        setActiveFeedbackEvent,
        activeCertificate,
        setActiveCertificate,
        downloadCenterOpen,
        setDownloadCenterOpen,
        quickAccessOpen,
        setQuickAccessOpen,
        calendarExportModalOpen,
        setCalendarExportModalOpen,
        calendarExportEvent,
        setCalendarExportEvent,
        searchHistory,
        addSearchQuery,
        removeSearchQuery,
        clearSearchHistory,
        authModalOpen,
        setAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
