import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/common/ToastContainer';
import { QRPassModal } from './components/modals/QRPassModal';
import { FeedbackModal } from './components/modals/FeedbackModal';
import { CertificateModal } from './components/modals/CertificateModal';
import { AuthModal } from './components/modals/AuthModal';
import { DownloadCenterModal } from './components/modals/DownloadCenterModal';
import { QuickAccessModal } from './components/modals/QuickAccessModal';
import { CalendarExportModal } from './components/modals/CalendarExportModal';

// Public Views
import { LandingPage } from './views/LandingPage';
import { DiscoverEventsPage } from './views/DiscoverEventsPage';
import { EventDetailsPage } from './views/EventDetailsPage';

// Participant Views
import { ParticipantDashboard } from './views/participant/ParticipantDashboard';
import { MyEventsPage } from './views/participant/MyEventsPage';
import { FavoritesPage } from './views/participant/FavoritesPage';
import { NotificationsPage } from './views/participant/NotificationsPage';
import { LiveEventPage } from './views/participant/LiveEventPage';
import { CertificatesPage } from './views/participant/CertificatesPage';

// Organizer Views
import { OrganizerDashboard } from './views/organizer/OrganizerDashboard';
import { OrganizerEventsPage } from './views/organizer/OrganizerEventsPage';
import { CreateEventWizard } from './views/organizer/CreateEventWizard';
import { OrganizerEventOverview } from './views/organizer/OrganizerEventOverview';
import { OrganizerRegistrationsPage } from './views/organizer/OrganizerRegistrationsPage';
import { OrganizerAnnouncementsPage } from './views/organizer/OrganizerAnnouncementsPage';
import { OrganizerAnalyticsPage } from './views/organizer/OrganizerAnalyticsPage';
import { OrganizerMediaPage } from './views/organizer/OrganizerMediaPage';
import { OrganizerSettingsPage } from './views/organizer/OrganizerSettingsPage';

// Admin Views
import { AdminDashboard } from './views/admin/AdminDashboard';
import { AdminUsersPage } from './views/admin/AdminUsersPage';
import { AdminEventsPage } from './views/admin/AdminEventsPage';
import { AdminAuditPage } from './views/admin/AdminAuditPage';

// Common
import { AccessRestrictedPage } from './views/common/AccessRestrictedPage';

const AppContent: React.FC = () => {
  const { 
    currentView, 
    downloadCenterOpen, 
    setDownloadCenterOpen,
    quickAccessOpen,
    setQuickAccessOpen,
    calendarExportModalOpen,
    setCalendarExportModalOpen,
  } = useApp();

  const renderCurrentView = () => {
    switch (currentView) {
      // Public views
      case 'landing':
        return <LandingPage />;
      case 'discover':
        return <DiscoverEventsPage />;
      case 'event-details':
        return <EventDetailsPage />;

      // Participant views
      case 'participant-dashboard':
      case 'profile':
        return <ParticipantDashboard />;
      case 'my-events':
        return <MyEventsPage />;
      case 'favorites':
        return <FavoritesPage />;
      case 'notifications':
        return <NotificationsPage />;
      case 'live-event':
        return <LiveEventPage />;
      case 'certificates':
        return <CertificatesPage />;

      // Organizer views
      case 'organizer-dashboard':
        return <OrganizerDashboard />;
      case 'organizer-events':
        return <OrganizerEventsPage />;
      case 'organizer-create':
        return <CreateEventWizard />;
      case 'organizer-event-overview':
        return <OrganizerEventOverview />;
      case 'organizer-registrations':
        return <OrganizerRegistrationsPage />;
      case 'organizer-announcements':
        return <OrganizerAnnouncementsPage />;
      case 'organizer-analytics':
        return <OrganizerAnalyticsPage />;
      case 'organizer-media':
        return <OrganizerMediaPage />;
      case 'organizer-settings':
        return <OrganizerSettingsPage />;

      // Admin views
      case 'admin-dashboard':
      case 'admin-settings':
      case 'admin-permissions':
        return <AdminDashboard />;
      case 'admin-users':
      case 'admin-organizers':
        return <AdminUsersPage />;
      case 'admin-events':
      case 'admin-registrations':
        return <AdminEventsPage />;
      case 'admin-audit':
        return <AdminAuditPage />;

      // Fallback & restricted
      case 'access-restricted':
        return <AccessRestrictedPage />;

      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white">
      {/* 1-Row 3-Zone Top Bar Contract */}
      <Navbar />

      {/* Main View Area */}
      <main className="flex-1">
        {renderCurrentView()}
      </main>

      {/* Website Institutional Footer */}
      {!currentView.startsWith('organizer-') && !currentView.startsWith('admin-') && (
        <Footer />
      )}

      {/* Collegiate Website Global Modals */}
      <QuickAccessModal
        isOpen={quickAccessOpen}
        onClose={() => setQuickAccessOpen(false)}
      />
      <CalendarExportModal
        isOpen={calendarExportModalOpen}
        onClose={() => setCalendarExportModalOpen(false)}
      />
      <QRPassModal />
      <FeedbackModal />
      <CertificateModal />
      <DownloadCenterModal
        isOpen={downloadCenterOpen}
        onClose={() => setDownloadCenterOpen(false)}
      />
      <AuthModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
