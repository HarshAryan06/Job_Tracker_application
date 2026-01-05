# InterviewVault - Job Application Tracker

A comprehensive, modern web application designed to help job seekers efficiently track and manage their job applications throughout the entire hiring process. Built with Next.js 16, TypeScript, and Tailwind CSS v4.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwind-css)

## Overview

InterviewVault is a personal job application management system that allows users to track every aspect of their job search journey. From initial application submission to final offers, the application provides a centralized platform to manage applications, monitor progress, and analyze job search performance.

## Core Functionality

### Application Management

**Add New Applications**
- Record company name, job role, and location
- Set application date (defaults to current date)
- Upload and attach resume files (PDF format)
- Store job description for future reference
- Add custom notes and observations
- Set initial application status

**Track Application Status**
The system supports six distinct application statuses:
- **Applied** - Initial application submitted
- **Pending Interview** - Awaiting interview scheduling
- **Interviewing** - Currently in interview process
- **Offer Received** - Job offer obtained
- **Rejected** - Application rejected by company
- **Ghosted** - No response received from company

**Update Application Status**
- Change status at any point in the application lifecycle
- Track progression through hiring stages
- Maintain historical status changes

**Delete Applications**
- Remove applications that are no longer relevant
- Clean up duplicate or erroneous entries

### Dashboard Analytics

**Statistics Overview**
- **Total Applications** - Complete count of all tracked applications
- **Interviews** - Number of applications that reached interview stage
- **Offers** - Count of job offers received
- **Pending** - Applications awaiting interview scheduling
- **Rejected** - Applications that were declined
- **Applied** - Recently submitted applications

**Performance Metrics**
- **Interview Rate** - Percentage of applications that resulted in interviews
- **Response Rate** - Percentage of applications that received any response
- **Offer Rate** - Percentage of applications that resulted in job offers
- **Progress Ring** - Visual circular progress indicator showing interview rate

**Recent Activity**
- Display of most recent applications
- Quick access to application details
- Visual status indicators with color-coded badges

### Application List & Search

**Comprehensive List View**
- View all applications in a grid layout
- Sort by date, company, or status
- Filter by application status
- Search by company name or job role

**Advanced Search Modal**
- Global search functionality accessible from navigation
- Real-time filtering as you type
- Search across company names and job roles
- Quick navigation to application details

**Application Cards**
- Visual cards displaying key information
- Company name and role prominently displayed
- Status badges with color coding
- Location information
- Resume name indicator
- Quick access to full details

### Application Details

**Detailed View**
- Complete application information display
- Edit application status directly from details page
- View uploaded resume file
- Access job description and notes
- Delete application option
- Navigation back to list view

**Status Management**
- Dropdown selector for status updates
- Visual confirmation of status changes
- Status history tracking

### Resume Management

**Resume Upload**
- Upload PDF resume files
- Associate resumes with specific applications
- Store resume file data locally
- Track which resume version was used for each application
- Display resume name in application cards

**Resume Tracking**
- View unique resume names across applications
- Identify which applications used which resume version
- Manage multiple resume versions

### Data Persistence

**Local Storage**
- All application data stored in browser's localStorage
- Automatic save on every change
- Data persists across browser sessions
- No server or database required
- Privacy-focused (data stays on your device)

**Data Structure**
- JSON-based storage format
- Efficient data serialization
- Fast read/write operations
- Automatic data loading on application start

## User Interface Features

### Theme System

**Dark/Light Mode**
- System preference detection
- Manual theme toggle
- Smooth theme transitions
- Theme persistence across sessions
- Optimized color schemes for both modes

**Theme-Aware Components**
- All UI elements adapt to theme changes
- Proper contrast ratios maintained
- Animated icons with theme-aware colors
- Gradient effects optimized for both themes

### Responsive Design

**Mobile-First Approach**
- Optimized for mobile devices
- Bottom navigation bar for mobile
- Compact layout for small screens
- Touch-friendly interface elements

**Desktop Experience**
- Full-width layouts on larger screens
- Top navigation bar for desktop
- Enhanced spacing and typography
- Grid layouts optimized for desktop

**Adaptive Navigation**
- Mobile: Bottom dock with curved cut-out for main action
- Desktop: Top header with horizontal navigation
- Context-aware navigation elements

### Animated Components

**Interactive Icons**
- Animated GitHub icon with hover effects
- Animated home icon with house animation
- Animated magnifier/search icon
- Animated moon/sun icons for theme toggle
- Smooth transitions and hover states

**Visual Feedback**
- Hover effects on interactive elements
- Loading states with spinners
- Success/error toast notifications
- Smooth page transitions
- Animated progress indicators

## Technical Architecture

### Technology Stack

**Frontend Framework**
- Next.js 16 with App Router
- React 19 for UI components
- Server Components and Client Components separation

**Language & Type Safety**
- TypeScript 5 for type safety
- Strict type checking enabled
- Comprehensive type definitions

**Styling**
- Tailwind CSS v4 for utility-first styling
- CSS variables for theme management
- Custom animations and transitions
- Responsive design utilities

**UI Components**
- shadcn/ui component library
- Radix UI primitives for accessibility
- Custom component implementations
- Reusable component patterns

**State Management**
- React hooks for local state
- Custom hooks for application logic
- localStorage for persistence
- No external state management library

**Animations**
- Framer Motion for complex animations
- CSS transitions for simple animations
- Motion-first icon components from itshover.com

### Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                 # Dashboard/Home page
│   ├── layout.tsx               # Root layout with providers
│   ├── globals.css              # Global styles and theme variables
│   ├── add/                     # Add new application page
│   │   └── page.tsx
│   └── applications/            # Applications management
│       ├── page.tsx             # Applications list view
│       └── [id]/                # Dynamic route for application details
│           └── page.tsx
│
├── components/
│   ├── ui/                      # shadcn/ui base components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   └── ... (other UI components)
│   │
│   ├── features/                # Feature-specific components
│   │   ├── application-card.tsx # Application card display
│   │   ├── progress-ring.tsx    # Circular progress indicator
│   │   ├── stats-section.tsx    # Statistics display
│   │   ├── status-badge.tsx     # Status indicator badges
│   │   ├── search-modal.tsx     # Global search functionality
│   │   └── github-star-button.tsx # GitHub repository link
│   │
│   ├── layout/                  # Layout components
│   │   ├── header.tsx          # Desktop navigation header
│   │   ├── mobile-nav.tsx       # Mobile bottom navigation
│   │   └── logo.tsx            # Application logo component
│   │
│   └── providers/              # React context providers
│       └── theme-provider.tsx   # Theme management provider
│
├── hooks/                       # Custom React hooks
│   ├── use-applications.ts     # Application CRUD operations
│   ├── use-file-upload.ts      # File upload handling
│   ├── use-github-stars.ts     # GitHub API integration
│   └── index.ts                # Hooks exports
│
├── lib/                         # Utility functions
│   ├── storage.ts              # localStorage operations
│   ├── stats.ts                # Statistics calculations
│   └── utils.ts                # General utilities
│
└── types/                       # TypeScript type definitions
    └── index.ts                # Application types and interfaces
```

### Key Components Explained

**useApplications Hook**
- Manages application state throughout the app
- Provides CRUD operations (Create, Read, Update, Delete)
- Handles localStorage synchronization
- Returns applications array and operation functions

**Storage Module**
- Abstracts localStorage operations
- Handles JSON serialization/deserialization
- Provides type-safe storage functions
- Manages storage keys and data structure

**Stats Module**
- Calculates application statistics
- Filters applications by search term and status
- Computes performance metrics (rates, percentages)
- Provides reusable calculation functions

**Progress Ring Component**
- Animated circular progress indicator
- Displays interview rate percentage
- Smooth animation on value changes
- Gradient styling with theme support

**Search Modal Component**
- Global search functionality
- Real-time filtering
- Keyboard navigation support
- Quick access to application details

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm, yarn, or pnpm package manager
- Modern web browser with JavaScript enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/HarshAryan06/Job_Tracker_application.git
   cd Job_Tracker_application
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
# Create production build
npm run build

# Start production server
npm start
```

## Usage Guide

### Adding Your First Application

1. Click the "Add" button in navigation (or the prominent "+" button on mobile)
2. Fill in the required fields:
   - Company Name
   - Job Role/Title
   - Location (optional, defaults to "Remote")
   - Application Date (defaults to today)
   - Initial Status
   - Resume Name
3. Optionally upload a PDF resume file
4. Add job description and notes if desired
5. Click "Add Application" to save

### Tracking Application Progress

1. Navigate to "Applications" from the navigation menu
2. Find your application in the list
3. Click on the application card to view details
4. Use the status dropdown to update the application status
5. Changes are automatically saved

### Using Search

1. Click the search icon in navigation (or press keyboard shortcut)
2. Type company name or job role to filter
3. Click on any result to view full details
4. Search works across all applications

### Viewing Statistics

1. Dashboard automatically displays:
   - Total application count
   - Applications by status
   - Performance metrics (interview rate, response rate, offer rate)
   - Recent applications
2. Statistics update in real-time as you add or modify applications

## Data Management

### Data Storage

- All data is stored locally in your browser's localStorage
- Data persists across browser sessions
- No account or login required
- Data is private to your browser/device

### Data Export/Import

Currently, data export/import functionality is not implemented. All data remains in browser localStorage. To backup your data:

1. Open browser developer tools (F12)
2. Navigate to Application > Local Storage
3. Find the `jobtracker_applications` key
4. Copy the JSON data
5. Save it in a secure location

### Data Privacy

- No data is sent to external servers
- No analytics or tracking
- All processing happens locally in your browser
- You have complete control over your data

## Customization

### Theme Customization

Edit `src/app/globals.css` to customize colors:

```css
:root {
  --primary: #f97316;           /* Primary brand color */
  --background: #fafafa;        /* Light mode background */
  --foreground: #0a0a0a;        /* Light mode text */
  /* ... other variables */
}

.dark {
  --background: #0a0a0a;         /* Dark mode background */
  --foreground: #fafafa;         /* Dark mode text */
  /* ... other variables */
}
```

### Adding UI Components

This project uses shadcn/ui. Add new components:

```bash
npx shadcn@latest add [component-name]
```

### Modifying Application Statuses

Edit `src/types/index.ts` to add or modify statuses:

```typescript
export enum ApplicationStatus {
  APPLIED = 'Applied',
  // Add your custom status here
}
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Vercel will auto-detect Next.js
4. Deploy with one click

```bash
npm i -g vercel
vercel
```

### Other Platforms

The application can be deployed to any platform supporting Next.js:
- **Netlify** - Automatic builds from Git
- **AWS Amplify** - AWS hosting solution
- **Railway** - Simple deployment platform
- **Docker** - Container-based deployment

## Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create optimized production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint for code quality checks |

### Code Style

- TypeScript strict mode enabled
- ESLint configuration for code quality
- Consistent component structure
- Custom hooks for reusable logic
- Type-safe throughout

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Limitations

- Data is stored locally only (no cloud sync)
- No multi-device synchronization
- No data export/import UI (manual via dev tools)
- No user accounts or authentication
- Limited to browser storage capacity (~5-10MB)

## Future Enhancements

Potential features for future versions:
- Cloud synchronization
- Data export/import UI
- Email reminders for follow-ups
- Calendar integration
- Resume version comparison
- Application analytics and insights
- Multi-user support
- Mobile app version

## Contributing

This is a personal project, but contributions are welcome:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and not licensed for public use.

## Author

**Harsh Aryan**

- GitHub: [@HarshAryan06](https://github.com/HarshAryan06)
- Repository: [Job_Tracker_application](https://github.com/HarshAryan06/Job_Tracker_application)

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/) and [itshover.com](https://itshover.com/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)

---

**Note**: This application is designed for personal use to track job applications. All data is stored locally in your browser and is not transmitted to any external servers.
