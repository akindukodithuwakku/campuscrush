# Dashboard Components

This directory contains all the components for the Campus Crush user dashboard.

## Components Overview

### 1. DashboardNav.jsx

- **Purpose**: Main navigation sidebar for the dashboard
- **Features**:
  - Responsive sidebar with mobile menu
  - User profile display
  - Navigation between different dashboard sections
  - Logout functionality
  - Active section highlighting

### 2. DashboardOverview.jsx

- **Purpose**: Main dashboard overview with statistics and quick actions
- **Features**:
  - Welcome section with personalized greeting
  - Statistics cards (matches, likes, profile views, messages)
  - Recent matches display
  - Quick action buttons
  - Pro tips section

### 3. BrowseSection.jsx

- **Purpose**: Tinder-like swiping interface for discovering matches
- **Features**:
  - Profile card display with user information
  - Swipe gestures (like/pass)
  - Profile details (bio, interests, faculty info)
  - Action buttons (like, pass, super like)
  - Loading states and empty states

### 4. MatchesSection.jsx

- **Purpose**: Display and manage user's matches
- **Features**:
  - Tabbed interface (All, Online, Recent)
  - Search functionality
  - Match cards with last message preview
  - Online status indicators
  - Action buttons (chat, view profile)
  - Match statistics

### 5. ProfileSection.jsx

- **Purpose**: User profile management and editing
- **Features**:
  - Profile picture management
  - Editable profile information
  - Interest management (add/remove)
  - Privacy settings
  - Profile completion indicator
  - Form validation

### 6. SettingsSection.jsx

- **Purpose**: Account settings and preferences
- **Features**:
  - Tabbed settings interface
  - Notification preferences
  - Privacy settings
  - Matching preferences (age range, distance)
  - Account management (password, email)
  - Account deletion with confirmation

## Usage

The dashboard is automatically displayed after user login and profile completion. Users can navigate between different sections using the sidebar navigation.

## API Integration

All components are integrated with the backend API through the `hybridApi` service:

- Dashboard statistics
- User matches
- Potential matches for browsing
- Profile updates
- Settings management

## Responsive Design

All components are fully responsive and optimized for:

- Mobile devices (320px+)
- Tablets (768px+)
- Desktop (1024px+)

## Styling

Components use Tailwind CSS with custom color schemes:

- Primary: Pink/Red gradients
- Secondary: Blue gradients
- Accent: Orange gradients
- Romantic: Pink gradients

## Future Enhancements

- Real-time chat integration
- Push notifications
- Advanced matching algorithms
- Photo upload and management
- Video call integration
- Location-based features

