# Pacific Marine Academy - Merchant Navy Coaching Portal & Admin Panel

A modern, responsive React web application and admin management dashboard for **Pacific Marine Academy**, built with an Italian maritime aesthetic (Amalfi / Genoa / Venice harbor vibe).

## Features

- **Public Web Portal**:
  - **Home**: Dynamic hero, live animated stat counters, All-India achievers marquee, 5-step admission process, testimonials, FAQ accordion, floating action buttons.
  - **About Us**: Director's message, mission & vision, faculty roster, simulator & hostel facilities, academy milestones.
  - **Our Courses**: Filterable course cards, detailed syllabus accordions, fee breakdown, direct admission enrolment links.
  - **Admission Portal**: Multi-step wizard with real-time validation, document preview & base64 upload, generated registration ID, and printable official acknowledgement receipt.
  - **Results & Toppers**: All-India Rank showcase, year-wise filters, searchable cadet table, downloadable scorecards.
  - **Free Study Materials**: Category filters (Notes, Papers, Video Lectures), search, and lead-capture gate modal saving leads into the admin panel.
  - **Available Forms**: Downloadable institute forms (Admission, Medical Format, Scholarship, Hostel Registration).
  - **Gallery**: Masonry grid with category filters, full-screen lightbox with mobile swipe & keyboard controls.
  - **Contact**: Interactive enquiry form, direct phone/WhatsApp actions, embedded Google Maps, location & operating hours.

- **Admin Management Panel (`/admin`)**:
  - **Authentication**: Demo credentials `admin@pacificmarine.demo` / `Admin@123` with session persistence.
  - **Dashboard**: Admissions chart (Recharts), key performance stats, recent activity stream.
  - **Complete CRUD Modules**: Courses, Admissions (View, Status switcher, CSV export, Print summary), Enquiries & Leads, Results & Toppers, Study Materials, Available Forms, Photo Gallery, Student Testimonials, Faculty Roster, FAQs, Announcement Banners, and Institute Site Settings.
  - **Instant Site Sync**: Data changes in the admin panel immediately reflect across the public site via a reactive local data context.

## Tech Stack

- **Frontend**: React 18 + Vite (Plain JSX)
- **Routing**: React Router v6
- **Styling**: Tailwind CSS v3 with custom Italian Maritime solid color palette
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Analytics**: Recharts
- **Deployment Ready**: `vercel.json` included for single-page routing and caching

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

3. **Admin Panel**:
   Navigate to `http://localhost:5173/#/admin` or `http://localhost:5173/admin`.
   - **Email**: `admin@pacificmarine.demo`
   - **Password**: `Admin@123`

4. **Build for Production**:
   ```bash
   npm run build
   ```
