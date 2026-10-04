import { Certificate, Registration, CollegeEvent } from '../types';

/**
 * Triggers a browser file download from Blob
 */
export const triggerBrowserDownload = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Downloads a high-fidelity standalone printable Certificate document
 */
export const downloadCertificateDocument = (cert: Certificate) => {
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Certificate of ${cert.certificateType} - ${cert.participantName}</title>
  <style>
    @page { size: landscape; margin: 0; }
    body {
      margin: 0;
      padding: 40px;
      font-family: 'Times New Roman', Times, serif;
      background: #faf8f5;
      color: #1e293b;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      box-sizing: border-box;
    }
    .cert-frame {
      width: 100%;
      max-width: 960px;
      border: 12px double #0f172a;
      padding: 50px 40px;
      background: #ffffff;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      text-align: center;
      position: relative;
      box-sizing: border-box;
    }
    .watermark {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 140px;
      color: rgba(79, 70, 229, 0.03);
      font-weight: bold;
      pointer-events: none;
      user-select: none;
    }
    .header-sub {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 3px;
      color: #64748b;
      margin-bottom: 8px;
    }
    h1 {
      font-size: 42px;
      margin: 10px 0 20px 0;
      color: #0f172a;
      font-weight: 700;
    }
    .presented-to {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: #64748b;
      margin: 20px 0 10px 0;
    }
    .recipient {
      font-size: 38px;
      font-weight: bold;
      color: #4338ca;
      border-bottom: 2px solid #cbd5e1;
      display: inline-block;
      padding: 0 40px 10px 40px;
      margin-bottom: 20px;
    }
    .reason {
      font-size: 18px;
      line-height: 1.6;
      max-width: 700px;
      margin: 0 auto 30px auto;
      color: #334155;
    }
    .event-title {
      font-weight: bold;
      color: #0f172a;
      display: block;
      font-size: 22px;
      margin-top: 6px;
    }
    .distinction {
      display: inline-block;
      background: #fef3c7;
      color: #92400e;
      padding: 4px 16px;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 600;
      margin-top: 8px;
    }
    .footer {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    .sig-block {
      text-align: left;
    }
    .sig-line {
      width: 180px;
      height: 1px;
      background: #0f172a;
      margin-bottom: 6px;
    }
    .sig-name {
      font-family: 'Times New Roman', serif;
      font-style: italic;
      font-size: 18px;
      margin-bottom: 4px;
    }
    .sig-title {
      font-size: 11px;
      color: #64748b;
      text-transform: uppercase;
    }
    .seal-wrap {
      text-align: center;
    }
    .seal {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      border: 3px solid #b45309;
      background: #fffbeb;
      color: #b45309;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: bold;
      text-transform: uppercase;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
      margin: 0 auto 6px auto;
    }
    .verification-info {
      font-family: monospace;
      font-size: 10px;
      color: #94a3b8;
      margin-top: 25px;
      display: flex;
      justify-content: space-between;
    }
    @media print {
      body { background: white; padding: 0; }
      .cert-frame { box-shadow: none; max-width: 100%; border-width: 8px; }
      .btn-print { display: none; }
    }
    .btn-print {
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4f46e5;
      color: white;
      border: none;
      padding: 10px 18px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
    }
  </style>
</head>
<body>
  <button class="btn-print" onclick="window.print()">🖨️ Print / Save as PDF</button>

  <div class="cert-frame">
    <div class="watermark">EVENTFLOW</div>
    <div class="header-sub">Office of Student Affairs & Collegiate Event Council</div>
    <h1>Certificate of ${cert.certificateType}</h1>

    <div class="presented-to">This is proudly awarded to</div>
    <div class="recipient">${cert.participantName}</div>

    <div class="reason">
      in recognition of commendable participation and distinguished presentation during
      <span class="event-title">${cert.eventTitle}</span>
      ${cert.rank ? `<span class="distinction">Honors: ${cert.rank}</span>` : ''}
    </div>

    <div class="footer">
      <div class="sig-block">
        <div class="sig-name">Marcus Vance</div>
        <div class="sig-line"></div>
        <div class="sig-title">Faculty Advisory Lead</div>
      </div>

      <div class="seal-wrap">
        <div class="seal">VERIFIED<br>SEAL</div>
        <div style="font-size: 9px; color: #64748b; font-family: monospace;">SECURE REGISTRATION</div>
      </div>

      <div class="sig-block" style="text-align: right;">
        <div class="sig-name">Dr. Evelyn Reed</div>
        <div class="sig-line" style="margin-left: auto;"></div>
        <div class="sig-title">Dean of Student Affairs</div>
      </div>
    </div>

    <div class="verification-info">
      <span>Credential ID: ${cert.id}</span>
      <span>Date Issued: ${cert.issueDate}</span>
      <span>Verification Hash: ${cert.verifyHash}</span>
    </div>
  </div>
</body>
</html>`;

  triggerBrowserDownload(
    htmlContent,
    `EventFlow-Certificate-${cert.id}.html`,
    'text/html;charset=utf-8'
  );
};

/**
 * Downloads a standalone SVG Digital Pass Card
 */
export const downloadQRPass = (reg: Registration) => {
  const svgContent = `<svg width="400" height="600" viewBox="0 0 400 600" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Card Background -->
  <rect width="400" height="600" rx="24" fill="#0F172A"/>
  
  <!-- Header Bar -->
  <rect y="0" width="400" height="120" rx="24" fill="#1E293B"/>
  <circle cx="36" cy="40" r="16" fill="#4F46E5"/>
  <text x="36" y="45" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="white" text-anchor="middle">EF</text>
  <text x="64" y="44" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="white">EventFlow Campus Pass</text>
  <text x="360" y="44" font-family="monospace" font-size="12" font-weight="bold" fill="#38BDF8" text-anchor="end">${reg.id}</text>
  
  <text x="36" y="85" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="white">${reg.eventTitle}</text>
  <text x="36" y="104" font-family="Arial, sans-serif" font-size="12" fill="#94A3B8">${reg.department} · ${reg.year}</text>

  <!-- Pass Body White Container -->
  <rect x="24" y="140" width="352" height="340" rx="16" fill="white"/>
  
  <!-- Participant Name -->
  <text x="200" y="175" font-family="Arial, sans-serif" font-size="12" text-transform="uppercase" letter-spacing="1" fill="#64748B" text-anchor="middle">PASS HOLDER</text>
  <text x="200" y="205" font-family="Arial, sans-serif" font-size="22" font-weight="bold" fill="#0F172A" text-anchor="middle">${reg.participantName}</text>
  
  <!-- QR Code Representation -->
  <g transform="translate(100, 230)">
    <!-- 3 Finder Patterns -->
    <rect x="0" y="0" width="45" height="45" rx="6" fill="#0F172A"/>
    <rect x="8" y="8" width="29" height="29" rx="3" fill="white"/>
    <rect x="16" y="16" width="13" height="13" rx="2" fill="#4F46E5"/>

    <rect x="155" y="0" width="45" height="45" rx="6" fill="#0F172A"/>
    <rect x="163" y="8" width="29" height="29" rx="3" fill="white"/>
    <rect x="171" y="16" width="13" height="13" rx="2" fill="#4F46E5"/>

    <rect x="0" y="155" width="45" height="45" rx="6" fill="#0F172A"/>
    <rect x="8" y="163" width="29" height="29" rx="3" fill="white"/>
    <rect x="16" y="171" width="13" height="13" rx="2" fill="#4F46E5"/>

    <!-- Data matrix pixels -->
    <rect x="60" y="10" width="12" height="12" fill="#0F172A"/>
    <rect x="80" y="10" width="12" height="12" fill="#4F46E5"/>
    <rect x="100" y="10" width="12" height="12" fill="#0F172A"/>
    <rect x="125" y="10" width="12" height="12" fill="#0F172A"/>
    
    <rect x="10" y="60" width="12" height="12" fill="#0F172A"/>
    <rect x="10" y="80" width="12" height="12" fill="#4F46E5"/>
    <rect x="10" y="105" width="12" height="12" fill="#0F172A"/>
    <rect x="10" y="130" width="12" height="12" fill="#0F172A"/>

    <rect x="70" y="70" width="20" height="20" fill="#0F172A"/>
    <rect x="110" y="70" width="20" height="20" fill="#4F46E5"/>
    <rect x="90" y="100" width="20" height="20" fill="#0F172A"/>
    <rect x="130" y="110" width="20" height="20" fill="#0F172A"/>
    <rect x="70" y="130" width="20" height="20" fill="#4F46E5"/>
    
    <rect x="70" y="165" width="20" height="20" fill="#0F172A"/>
    <rect x="100" y="165" width="20" height="20" fill="#4F46E5"/>
    <rect x="135" y="165" width="20" height="20" fill="#0F172A"/>
    <rect x="165" y="165" width="20" height="20" fill="#0F172A"/>
  </g>

  <text x="200" y="460" font-family="monospace" font-size="11" fill="#64748B" text-anchor="middle">Scan for Venue Turnstile Check-in</text>

  <!-- Pass Details Footer -->
  <text x="40" y="520" font-family="Arial, sans-serif" font-size="11" fill="#94A3B8">DATE &amp; TIME</text>
  <text x="40" y="540" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="white">${reg.eventDate}</text>
  
  <text x="240" y="520" font-family="Arial, sans-serif" font-size="11" fill="#94A3B8">VENUE</text>
  <text x="240" y="540" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="white">${reg.eventVenue}</text>
  
  <text x="200" y="580" font-family="monospace" font-size="10" fill="#64748B" text-anchor="middle">Hash: ${reg.qrCodeHash}</text>
</svg>`;

  triggerBrowserDownload(
    svgContent,
    `EventFlow-Pass-${reg.id}.svg`,
    'image/svg+xml;charset=utf-8'
  );
};

/**
 * Generates direct Google Calendar Web Add URL
 */
export const getGoogleCalendarUrl = (event: CollegeEvent): string => {
  const cleanTitle = encodeURIComponent(event.title);
  const cleanDetails = encodeURIComponent(
    `${event.shortDescription || event.description}\n\nVenue: ${event.venue}, ${event.building} ${event.room}\nOfficial Portal: https://eventflow.campus.edu`
  );
  const cleanLocation = encodeURIComponent(`${event.venue}, ${event.building} ${event.room}`);
  
  // Format YYYYMMDDTHHMMSSZ or YYYYMMDD
  const startDateStr = event.startDate.replace(/-/g, '');
  const endDateStr = (event.endDate || event.startDate).replace(/-/g, '');
  const dates = `${startDateStr}T130000Z/${endDateStr}T210000Z`;

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${cleanTitle}&dates=${dates}&details=${cleanDetails}&location=${cleanLocation}`;
};

/**
 * Generates direct Outlook 365 Web Add URL
 */
export const getOutlookCalendarUrl = (event: CollegeEvent): string => {
  const cleanTitle = encodeURIComponent(event.title);
  const cleanBody = encodeURIComponent(
    `${event.shortDescription || event.description}\nVenue: ${event.venue} (${event.room})`
  );
  const cleanLocation = encodeURIComponent(`${event.venue}, ${event.building} ${event.room}`);

  return `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${cleanTitle}&body=${cleanBody}&location=${cleanLocation}&startdt=${event.startDate}T09:00:00&enddt=${event.endDate || event.startDate}T17:00:00`;
};

/**
 * Downloads a standard RFC 5545 iCalendar (.ics) file for an event
 */
export const downloadCalendarICS = (event: CollegeEvent) => {
  const cleanTitle = event.title.replace(/[,;]/g, '');
  const cleanVenue = `${event.venue}, ${event.building} ${event.room}`.replace(/[,;]/g, '');
  const cleanDesc = event.shortDescription.replace(/[\n\r]/g, ' ');

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//EventFlow College Platform//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:evf-${event.id}-${Date.now()}@campus.edu`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
    `DTSTART;VALUE=DATE:${event.startDate.replace(/-/g, '')}`,
    `DTEND;VALUE=DATE:${(event.endDate || event.startDate).replace(/-/g, '')}`,
    `SUMMARY:${cleanTitle}`,
    `DESCRIPTION:${cleanDesc}`,
    `LOCATION:${cleanVenue}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  triggerBrowserDownload(
    icsContent,
    `${event.slug || 'event'}.ics`,
    'text/calendar;charset=utf-8'
  );
};

/**
 * Downloads Full Semester / Multi-Event Calendar (.ics)
 */
export const downloadFullSemesterICS = (events: CollegeEvent[], calendarName = 'Campus-Semester-Schedule') => {
  const vevents = events.map(event => {
    const cleanTitle = event.title.replace(/[,;]/g, '');
    const cleanVenue = `${event.venue}, ${event.building} ${event.room}`.replace(/[,;]/g, '');
    const cleanDesc = (event.shortDescription || event.description).replace(/[\n\r]/g, ' ');

    return [
      'BEGIN:VEVENT',
      `UID:evf-${event.id}@campus.edu`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTSTART;VALUE=DATE:${event.startDate.replace(/-/g, '')}`,
      `DTEND;VALUE=DATE:${(event.endDate || event.startDate).replace(/-/g, '')}`,
      `SUMMARY:${cleanTitle}`,
      `DESCRIPTION:${cleanDesc}`,
      `LOCATION:${cleanVenue}`,
      'STATUS:CONFIRMED',
      'END:VEVENT'
    ].join('\r\n');
  }).join('\r\n');

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//EventFlow College Platform//EN',
    `X-WR-CALNAME:EventFlow ${calendarName}`,
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    vevents,
    'END:VCALENDAR'
  ].join('\r\n');

  triggerBrowserDownload(
    icsContent,
    `EventFlow-${calendarName}-2026.ics`,
    'text/calendar;charset=utf-8'
  );
};

/**
 * Downloads Attendee Roster CSV
 */
export const downloadRosterCSV = (registrations: Registration[], eventTitle?: string) => {
  const headers = ['Registration ID', 'Participant Name', 'Email', 'Phone', 'Department', 'Year', 'Type', 'Team Name', 'Event', 'Date', 'Status', 'Check-In Status', 'Check-In Timestamp'];
  const rows = registrations.map(r => [
    r.id,
    r.participantName,
    r.participantEmail,
    r.participantPhone,
    r.department,
    r.year,
    r.registrationType,
    r.teamName || 'N/A',
    r.eventTitle,
    r.eventDate,
    r.status,
    r.checkInStatus,
    r.checkInTimestamp || 'N/A'
  ]);

  const csvContent = [headers.join(','), ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))].join('\n');
  
  triggerBrowserDownload(
    csvContent,
    `eventflow-attendees-${eventTitle ? eventTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'all'}-${new Date().toISOString().split('T')[0]}.csv`,
    'text/csv;charset=utf-8'
  );
};

/**
 * Downloads Executive Operations Summary
 */
export const downloadOperationsReport = (events: CollegeEvent[], registrations: Registration[]) => {
  const totalSeats = events.reduce((sum, e) => sum + e.capacity, 0);
  const totalRegistered = events.reduce((sum, e) => sum + e.registeredCount, 0);
  const totalCheckedIn = registrations.filter(r => r.checkInStatus === 'checked_in').length;
  const attendanceRate = registrations.length > 0 ? Math.round((totalCheckedIn / registrations.length) * 100) : 0;

  const mdContent = `# EVENTFLOW COLLEGE OPERATIONS REPORT
Date Generated: ${new Date().toLocaleDateString()}
Campus: Collegiate Student Affairs & Event Operations

## 1. Executive Summary
- Total Scheduled Events: ${events.length}
- Overall Capacity: ${totalSeats} seats
- Total Registered Attendees: ${totalRegistered}
- Check-in Attendance Rate: ${attendanceRate}%
- Verified QR Turnstile Admissions: ${totalCheckedIn}

## 2. Event Roster Breakdown
${events.map(e => `### ${e.title}
- Category: ${e.category} | Department: ${e.department}
- Schedule: ${e.startDate} (${e.startTime} - ${e.endTime})
- Venue: ${e.venue} (${e.building} - ${e.room})
- Capacity Utilization: ${e.registeredCount} / ${e.capacity} seats (${Math.round((e.registeredCount / e.capacity) * 100)}%)
- Status: ${e.status.toUpperCase()}
`).join('\n')}

---
Generated securely via EventFlow Platform.
`;

  triggerBrowserDownload(
    mdContent,
    `EventFlow-Executive-Report-${new Date().toISOString().split('T')[0]}.md`,
    'text/markdown;charset=utf-8'
  );
};
