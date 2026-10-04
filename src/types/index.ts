export type UserRole = 'participant' | 'organizer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  year?: string;
  studentId?: string;
  avatar?: string;
}

export type EventCategory = 
  | 'Technical' 
  | 'Cultural' 
  | 'Sports' 
  | 'Workshop' 
  | 'Academic' 
  | 'Social';

export type EventStatus = 'draft' | 'published' | 'live' | 'completed' | 'cancelled';

export interface EventScheduleSession {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  speaker?: string;
  location: string;
  description?: string;
  isLive?: boolean;
}

export interface EventSpeaker {
  name: string;
  role: string;
  organization: string;
  bio?: string;
}

export interface EventMediaItem {
  id: string;
  title: string;
  url: string;
  type: 'image' | 'video';
  uploadedAt: string;
}

export interface CollegeEvent {
  id: string;
  slug: string;
  title: string;
  category: EventCategory;
  department: string;
  description: string;
  shortDescription: string;
  posterUrl: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  venue: string;
  building: string;
  floor: string;
  room: string;
  capacity: number;
  registeredCount: number;
  waitlistCount: number;
  status: EventStatus;
  organizerName: string;
  organizerDept: string;
  organizerEmail: string;
  isRegistrationOpen: boolean;
  allowWaitlist: boolean;
  registrationDeadline: string;
  tags: string[];
  schedule: EventScheduleSession[];
  speakers: EventSpeaker[];
  media: EventMediaItem[];
  rating: number;
  reviewCount: number;
  isFeatured?: boolean;
}

export interface Registration {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventVenue: string;
  eventTime: string;
  participantId: string;
  participantName: string;
  participantEmail: string;
  participantPhone: string;
  department: string;
  year: string;
  registrationType: 'individual' | 'team';
  teamName?: string;
  teamMembers?: string[];
  status: 'confirmed' | 'waitlist' | 'cancelled';
  checkInStatus: 'not_checked_in' | 'checked_in';
  checkInTimestamp?: string;
  qrCodeHash: string;
  createdAt: string;
}

export interface Announcement {
  id: string;
  eventId: string;
  eventTitle: string;
  title: string;
  content: string;
  audience: 'all' | 'checked_in' | 'waitlist';
  priority: 'normal' | 'urgent';
  channels: ('email' | 'sms' | 'push')[];
  timestamp: string;
  authorName: string;
  isRead?: boolean;
}

export interface Feedback {
  id: string;
  eventId: string;
  eventTitle: string;
  participantId: string;
  participantName: string;
  rating: number;
  categories: {
    sessions: number;
    organization: number;
    venue: number;
    speakers: number;
    activities: number;
  };
  comment: string;
  createdAt: string;
}

export interface Certificate {
  id: string;
  eventId: string;
  eventTitle: string;
  participantId: string;
  participantName: string;
  issueDate: string;
  certificateType: 'Merit' | 'Participation' | 'Organizer' | 'Winner';
  verifyHash: string;
  rank?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  target: string;
  user: string;
  role: UserRole;
  timestamp: string;
  ip: string;
  status: 'success' | 'warning' | 'alert';
}
