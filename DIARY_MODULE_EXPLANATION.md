# Bidii Diary Module - Complete Explanation

## Overview
The **Diary Module** is a digital assignment and homework management system that creates a seamless connection between teachers and learners. It replaces the traditional paper diary with an intelligent, organized platform where teachers can send assignments to students, track completion, and maintain a clear record of all academic tasks.

---

## Module Identity

### Visual Design Language
Following Bidii's established design system:

- **Primary Color**: `#2e796d` (Teal green - represents growth and learning)
- **Accent Color**: `#e8a928` (Gold - highlights important assignments)
- **Background**: `#f5f0e6` (Warm cream - easy on the eyes for extended reading)
- **Text Primary**: `#202b3e` (Deep navy - professional and readable)
- **Text Secondary**: `#68707c` (Muted gray - for supporting information)
- **Card Background**: `rgba(250,247,239,.85)` with subtle backdrop blur
- **Border Radius**: `1rem` for cards, `999px` for buttons (rounded pill shape)

### Typography
- **Headings**: `Bricolage Grotesque` - sans-serif, bold
- **Body Text**: `Bricolage Grotesque` - readable and modern
- **Emphasis/Special**: `Fraunces` - serif font for important titles
- **Meta Information**: `DM Mono` - monospace for dates, codes, status labels

---

## Icon System

The Diary module uses **Lucide Icons** (matching the site's existing icon library) with consistent styling:

```tsx
// Core Diary Icons
import {
  BookOpen,        // Main diary/assignment icon
  Calendar,        // Due dates and scheduling
  CheckCircle2,    // Completed assignments
  Clock,           // Pending/time-related
  Send,            // Send assignment action
  FileText,        // Document/assignment content
  Paperclip,       // Attachments
  Users,           // Class/group assignments
  AlertCircle,     // Overdue warnings
  Edit3,           // Edit assignment
  Trash2,          // Delete assignment
  Download,        // Download attachments
  Eye,             // View assignment
  MessageSquare,   // Comments/feedback
  Star,            // Featured/important assignments
  Filter,          // Filter assignments
  Search,          // Search functionality
  Bell,            // Notifications
  TrendingUp,      // Progress tracking
  Award,           // Excellent work badge
} from 'lucide-react';
```

**Icon Styling Standards**:
- Size: `20-24px` for main actions, `16-18px` for inline elements
- Stroke Width: `1.7` for consistency with site design
- Color: Inherits from parent or uses semantic colors (green for complete, gold for pending, red for overdue)

---

## User Interface Components

### 1. Teacher Dashboard View

```
┌─────────────────────────────────────────────────────────────┐
│  📚 Diary                                    🔍 Search  🔔    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │    72    │  │    18    │  │     5    │  │    94    │   │
│  │ Active   │  │ Due This │  │ Overdue  │  │Complete% │   │
│  │Assignments│  │  Week    │  │          │  │This Term │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ➕ Create New Assignment                             │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  Filters: [All Classes ▼] [All Subjects ▼] [This Week ▼]   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 📄 Mathematics Worksheet: Quadratic Equations       │   │
│  │ CLASS: Form 3 East  │  📅 Due: Mon, 15 May         │   │
│  │ 👥 28 students  ✅ 22 submitted  ⏰ 6 pending        │   │
│  │ [View Details] [Send Reminder] [Download Submissions]│   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 📖 English Literature: Character Analysis Essay     │   │
│  │ CLASS: Form 4 North │  📅 Due: Wed, 17 May         │   │
│  │ 👥 31 students  ✅ 15 submitted  ⏰ 16 pending       │   │
│  │ [View Details] [Send Reminder] [Download Submissions]│   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

**Key Visual Elements**:
- **Stats Cards**: Light cream background (`#faf7ef`), subtle shadow, with large numbers in teal
- **Assignment Cards**: White/cream gradient, rounded corners (1rem), hover effect (lift 2px)
- **Status Indicators**: 
  - Green checkmark for submitted (✅ `#2e796d`)
  - Gold clock for pending (⏰ `#e8a928`)
  - Red alert for overdue (🔴 `#c94b3c`)
- **Action Buttons**: Navy background (`#202b3e`), rounded pill shape, hover transforms

---

### 2. Create Assignment Interface

```
┌─────────────────────────────────────────────────────────────┐
│  ← Back to Diary                  Create New Assignment      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Assignment Title *                                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ e.g. Chapter 5 Review Questions                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  Subject *                Learning Area                      │
│  ┌─────────────┐          ┌─────────────┐                  │
│  │Mathematics ▼│          │  Algebra   ▼│                  │
│  └─────────────┘          └─────────────┘                  │
│                                                               │
│  Assign To *                                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ✓ Form 3 East (28 students)                         │   │
│  │ □ Form 3 West (26 students)                         │   │
│  │ □ Form 3 North (30 students)                        │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  Instructions & Description                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Solve all problems from Exercise 5.2 on pages      │   │
│  │ 87-89. Show your working clearly. Pay special      │   │
│  │ attention to factoring techniques.                 │   │
│  │                                                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  Due Date *              Due Time                            │
│  ┌─────────────┐        ┌─────────┐                        │
│  │ Mon, 15 May │        │ 08:00  │                         │
│  └─────────────┘        └─────────┘                        │
│                                                               │
│  Attachments (Optional)                                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 📎 [Click to upload or drag files here]            │   │
│  │    Supported: PDF, DOC, DOCX, JPG, PNG (max 10MB)  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ⭐ Mark as Important   📢 Send Notification Immediately     │
│  □                      □                                    │
│                                                               │
│  [Cancel]  [Save as Draft]  [📤 Send Assignment]            │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

**Visual Features**:
- **Form Fields**: Light border (`#d9cdb8`), focus state with teal outline (`#2e796d`), smooth transitions
- **Dropdown Selectors**: Custom styled with chevron icon, hover states
- **Checkbox Groups**: Large touch targets, animated checkmarks
- **Text Areas**: Resizable, minimum 4 lines, clear placeholder text
- **Upload Zone**: Dashed border when empty, solid when file present, drag-drop highlight effect
- **Primary Action**: "Send Assignment" button in navy with send icon, prominent placement

---

### 3. Student View - Assignment List

```
┌─────────────────────────────────────────────────────────────┐
│  📚 My Assignments                           🔔 3 new         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Quick Stats                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │    12    │  │     8    │  │    4     │                  │
│  │ Pending  │  │Due This  │  │ Complete │                  │
│  │          │  │  Week    │  │This Week │                  │
│  └──────────┘  └──────────┘  └──────────┘                  │
│                                                               │
│  [⚠️ Overdue (2)] [⏰ Due Soon (5)] [📋 All] [✅ Completed]  │
│                                                               │
│  ⚠️ OVERDUE                                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 🔴 Mathematics: Algebra Problem Set                 │   │
│  │ 📅 Was due: Mon, 8 May  │  Overdue by: 4 days      │   │
│  │ Mr. Omondi  │  Form 3 East                          │   │
│  │ [View Assignment] [Submit Now]                       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  📌 DUE SOON                                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ⭐ 📖 English: Character Analysis Essay              │   │
│  │ 📅 Due: Tomorrow, 14 May at 08:00                   │   │
│  │ Mrs. Atieno  │  Form 3 East  │  📎 2 attachments    │   │
│  │ [View Details] [Start Work]                          │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 🧪 Chemistry: Lab Report - Titration                │   │
│  │ 📅 Due: Fri, 19 May at 14:00  │  3 days left        │   │
│  │ Mr. Kamau  │  Form 3 East  │  📎 1 attachment       │   │
│  │ [View Details] [Submit Work]                         │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

**Student Interface Features**:
- **Priority-Based Sorting**: Overdue first (red), then due soon (gold), then regular (teal)
- **Clear Visual Hierarchy**: Status banners with bold colors, time indicators prominent
- **Star Icons**: Important assignments marked by teacher appear with ⭐ gold star
- **Countdown Timers**: "3 days left", "Due tomorrow" in human-readable format
- **Quick Actions**: Large, clear buttons for viewing and submitting
- **Attachment Indicators**: Paperclip icon with count when files are included

---

### 4. Assignment Detail View (Student)

```
┌─────────────────────────────────────────────────────────────┐
│  ← Back to Assignments                                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ⭐ Mathematics: Quadratic Equations Worksheet               │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 👨‍🏫 Mr. Omondi  │  Form 3 East  │  📅 Mon, 15 May    │   │
│  │ Posted: Wed, 10 May at 10:30                        │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  📋 Instructions                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Complete all questions from Exercise 5.2 on pages   │   │
│  │ 87-89 of your Mathematics textbook. Show all your   │   │
│  │ working steps clearly. Pay special attention to     │   │
│  │ factoring techniques we covered in class on Monday. │   │
│  │                                                      │   │
│  │ Remember to:                                         │   │
│  │ • Write your name and admission number              │   │
│  │ • Use pencil for graphs                             │   │
│  │ • Check your answers using the discriminant         │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  📎 Attachments from Teacher                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 📄 Exercise_5.2_Questions.pdf (2.3 MB)             │   │
│  │ [📥 Download] [👁️ Preview]                          │   │
│  │                                                      │   │
│  │ 📊 Factoring_Reference_Guide.pdf (1.1 MB)          │   │
│  │ [📥 Download] [👁️ Preview]                          │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ⏰ Due: Monday, 15 May 2026 at 08:00 (2 days left)         │
│                                                               │
│  ──────────────────────────────────────────────────────     │
│                                                               │
│  📤 Your Submission                                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Status: 📝 Not submitted yet                        │   │
│  │                                                      │   │
│  │ Upload your completed work:                         │   │
│  │ ┌─────────────────────────────────────────────┐    │   │
│  │ │ 📎 Drag and drop files here or click to     │    │   │
│  │ │    browse                                    │    │   │
│  │ │    (PDF, DOC, DOCX, JPG, PNG - max 10MB)    │    │   │
│  │ └─────────────────────────────────────────────┘    │   │
│  │                                                      │   │
│  │ Add a note to your teacher (optional):              │   │
│  │ ┌─────────────────────────────────────────────┐    │   │
│  │ │ e.g., "I found question 7 challenging..."   │    │   │
│  │ └─────────────────────────────────────────────┘    │   │
│  │                                                      │   │
│  │           [📤 Submit Assignment]                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

**Detail View Features**:
- **Clear Header**: Assignment title with importance indicator, teacher name, date
- **Instructions Card**: Large, readable text area with proper formatting
- **Attachment Section**: File cards with size, preview and download options
- **Due Date Indicator**: Prominent countdown with color coding (green if >3 days, gold if 1-3 days, red if <1 day)
- **Submission Area**: Clear upload zone with drag-drop, progress indicator during upload
- **Optional Comment**: Text area for student to communicate with teacher

---

### 5. Teacher: Review Submissions

```
┌─────────────────────────────────────────────────────────────┐
│  ← Back to Diary                                             │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Mathematics: Quadratic Equations Worksheet                  │
│  Form 3 East  │  Due: Mon, 15 May at 08:00                  │
│                                                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │    28    │  │    24    │  │     4    │  │   86%    │   │
│  │  Total   │  │Submitted │  │ Pending  │  │Completion│   │
│  │ Students │  │          │  │          │  │   Rate   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                               │
│  [✅ Submitted (24)] [⏰ Pending (4)] [📊 Analytics]         │
│  [📥 Download All] [📧 Send Reminder to Pending]            │
│                                                               │
│  ✅ SUBMITTED STUDENTS                                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Akinyi, Grace                                       │   │
│  │ 📅 Submitted: Sun, 14 May at 18:45 (Early)         │   │
│  │ 📎 Math_Worksheet_Grace.pdf (3.2 MB)               │   │
│  │ 💬 "I double-checked all my answers"                │   │
│  │ [👁️ View Work] [📥 Download] [✍️ Add Feedback]     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Ochieng, David                                      │   │
│  │ 📅 Submitted: Mon, 15 May at 07:30 (On time)       │   │
│  │ 📎 Quadratic_Solutions_David.pdf (2.8 MB)          │   │
│  │ [👁️ View Work] [📥 Download] [✍️ Add Feedback]     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ⏰ PENDING STUDENTS                                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Wanjiku, Mary  │  No submission yet                 │   │
│  │ [📧 Send Reminder] [💬 Add Note]                    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

**Review Interface Features**:
- **Overview Stats**: At-a-glance completion metrics with percentage
- **Submission Timeline**: Shows early, on-time, or late submission status
- **Student Messages**: Optional comments from students displayed
- **Bulk Actions**: Download all submissions, send reminders to all pending
- **Individual Actions**: View work, download, provide feedback per student
- **Status Grouping**: Submitted students first, then pending, makes tracking easier

---

## Image Assets & Icons

### Recommended Illustrations
Following Bidii's warm, professional design style:

1. **Empty State Illustrations**:
   - Teacher with no assignments yet: Illustration of teacher at desk with calendar
   - Student with no pending work: Illustration of student with completed checklist, celebration elements
   - Color palette: Teal (`#2e796d`), Gold (`#e8a928`), Cream (`#f5f0e6`)

2. **Success States**:
   - Assignment sent successfully: Paper airplane icon with motion trails
   - Assignment submitted: Checkmark with confetti elements
   - All assignments complete: Trophy or award badge with "Well done!" message

3. **Feature Illustrations** (for marketing/help sections):
   - Teacher sending assignment: Illustrated teacher with digital device, papers floating
   - Student receiving notification: Phone with notification bell, diary icon
   - Progress tracking: Dashboard with graphs, completion indicators

### Icon Usage Guidelines

```tsx
// Semantic Color Mapping
const iconColors = {
  success: '#2e796d',      // Green teal - completed, successful
  warning: '#e8a928',      // Gold - pending, attention needed
  danger: '#c94b3c',       // Red - overdue, error
  neutral: '#68707c',      // Gray - general information
  primary: '#202b3e',      // Navy - main actions
};

// Icon Size Standards
const iconSizes = {
  small: 16,              // Inline text, small buttons
  medium: 20,             // Standard buttons, list items
  large: 24,              // Headers, featured elements
  xl: 32,                 // Empty states, major sections
};
```

---

## Typography Hierarchy

```css
/* Diary Module Typography */
.diary-title {
  font-family: var(--app-font-serif); /* Fraunces */
  font-size: 2.8rem;
  font-weight: 600;
  letter-spacing: -0.04em;
  color: #202b3e;
}

.diary-section-header {
  font-family: var(--app-font-sans); /* Bricolage Grotesque */
  font-size: 1.4rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: #202b3e;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  color: #2e796d;
  margin-bottom: 12px;
}

.diary-assignment-title {
  font-family: var(--app-font-sans);
  font-size: 1.15rem;
  font-weight: 600;
  color: #202b3e;
  line-height: 1.4;
}

.diary-meta-info {
  font-family: var(--app-font-mono); /* DM Mono */
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #68707c;
}

.diary-body-text {
  font-family: var(--app-font-sans);
  font-size: 1rem;
  line-height: 1.65;
  color: #536071;
}

.diary-status-badge {
  font-family: var(--app-font-mono);
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
```

---

## Status Badge System

Visual indicators for assignment states:

```tsx
// Status Badge Components
const StatusBadge = {
  Overdue: {
    bg: '#fef2f2',
    text: '#c94b3c',
    border: '#fecaca',
    icon: <AlertCircle size={14} />,
    label: 'OVERDUE'
  },
  DueSoon: {
    bg: '#fffbeb',
    text: '#d97706',
    border: '#fed7aa',
    icon: <Clock size={14} />,
    label: 'DUE SOON'
  },
  Pending: {
    bg: '#fef9f5',
    text: '#e8a928',
    border: '#f4dbb8',
    icon: <Clock size={14} />,
    label: 'PENDING'
  },
  Submitted: {
    bg: '#f0fdf4',
    text: '#2e796d',
    border: '#bbf7d0',
    icon: <CheckCircle2 size={14} />,
    label: 'SUBMITTED'
  },
  Completed: {
    bg: '#eff6ff',
    text: '#2563eb',
    border: '#bfdbfe',
    icon: <Award size={14} />,
    label: 'COMPLETED'
  },
  Draft: {
    bg: '#f9fafb',
    text: '#6b7280',
    border: '#d1d5db',
    icon: <FileText size={14} />,
    label: 'DRAFT'
  }
};
```

---

## Animation & Interactions

Following Bidii's smooth, professional animations:

### Hover Effects
```css
/* Button Hover - Lift and color shift */
.diary-button {
  transition: transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1),
              background-color 0.2s ease,
              box-shadow 0.2s ease;
}

.diary-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(32, 43, 62, 0.12);
}

/* Card Hover - Subtle lift */
.diary-card {
  transition: transform 0.3s ease,
              box-shadow 0.3s ease;
}

.diary-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 40px rgba(32, 43, 62, 0.1);
}
```

### Entry Animations
```css
/* Reveal on scroll (matching site pattern) */
.diary-reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.72s ease,
              transform 0.72s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.diary-reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Stagger delays for lists */
.diary-card:nth-child(1) { transition-delay: 0.06s; }
.diary-card:nth-child(2) { transition-delay: 0.12s; }
.diary-card:nth-child(3) { transition-delay: 0.18s; }
```

### Loading States
```css
/* Skeleton loading with shimmer */
.diary-skeleton {
  background: linear-gradient(
    90deg,
    #f5f0e6 0%,
    #faf7ef 50%,
    #f5f0e6 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

---

## Mobile Responsive Design

### Breakpoints
```css
/* Following Bidii's responsive patterns */
.diary-container {
  width: min(1160px, calc(100% - 48px));
  margin-inline: auto;
}

/* Tablet: 768px - 1023px */
@media (max-width: 1023px) {
  .diary-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .diary-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Mobile: < 768px */
@media (max-width: 767px) {
  .diary-title {
    font-size: 2rem;
  }
  
  .diary-stats {
    grid-template-columns: 1fr;
  }
  
  .diary-card {
    padding: 20px;
  }
  
  /* Stack buttons vertically on mobile */
  .diary-actions {
    flex-direction: column;
    gap: 12px;
  }
  
  .diary-actions button {
    width: 100%;
  }
}
```

---

## Notification System

### In-App Notifications
```
┌─────────────────────────────────────────┐
│ 🔔 New Assignment                       │
│ Mathematics: Algebra Problem Set        │
│ Due: Monday, 15 May at 08:00           │
│ [View Now]  [Dismiss]                  │
└─────────────────────────────────────────┘
```

### Notification Types:
1. **New Assignment Posted**: Blue info style
2. **Due Date Reminder**: Gold warning style (24 hours before)
3. **Overdue Alert**: Red urgent style
4. **Submission Received** (for teachers): Green success style
5. **Feedback Added** (for students): Teal info style

### Notification Bell Component
- Badge count on bell icon in header
- Dropdown panel with recent notifications
- "Mark all as read" action
- Link to full notification center

---

## Accessibility Features

Following WCAG 2.1 AA standards:

### Color Contrast
- All text meets minimum 4.5:1 contrast ratio
- Interactive elements meet 3:1 contrast
- Status colors tested for color-blind users

### Keyboard Navigation
```
Tab Order:
1. Main navigation
2. Search/Filter controls
3. Primary action buttons (Create Assignment)
4. Assignment cards (in chronological order)
5. Secondary actions within cards
6. Footer links

Shortcuts:
- Ctrl/Cmd + K: Quick search
- Esc: Close modals/dropdowns
- Enter: Activate focused button/link
- Space: Toggle checkboxes
```

### Screen Reader Support
```html
<!-- Semantic HTML with ARIA labels -->
<section aria-labelledby="diary-assignments">
  <h2 id="diary-assignments">Your Assignments</h2>
  
  <div role="status" aria-live="polite">
    12 pending assignments
  </div>
  
  <button aria-label="Create new assignment">
    <PlusIcon aria-hidden="true" />
    New Assignment
  </button>
</section>
```

### Focus Indicators
```css
*:focus-visible {
  outline: 3px solid #e8a928;
  outline-offset: 4px;
  border-radius: 4px;
}
```

---

## Data Flow & Integration

### Connection Points
The Diary module integrates seamlessly with existing Bidii modules:

```
📚 Diary Module
    ├──→ 🎓 Academics: Links to CBC learning areas & strands
    ├──→ 👥 People: Teacher & student records
    ├──→ 📊 Attendance: Correlates submission rates with attendance
    ├──→ 💬 Communication: Sends notifications via SMS/email
    ├──→ 📈 Analytics: Tracks completion rates, trends
    └──→ 🤖 Soma AI: Generates assignment descriptions, analyzes patterns
```

### Sample Data Structure
```typescript
interface Assignment {
  id: string;
  title: string;
  subject: string;
  learningArea?: string;
  strand?: string;
  teacherId: string;
  teacherName: string;
  classes: string[];  // Array of class IDs
  students: string[]; // Array of student IDs
  description: string;
  attachments: Attachment[];
  dueDate: Date;
  dueTime: string;
  isImportant: boolean;
  status: 'draft' | 'published' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submittedAt: Date;
  files: File[];
  studentNote?: string;
  teacherFeedback?: string;
  status: 'pending' | 'submitted' | 'reviewed';
  submissionStatus: 'early' | 'on-time' | 'late';
}

interface Attachment {
  id: string;
  filename: string;
  fileSize: number;
  fileType: string;
  url: string;
  uploadedAt: Date;
}
```

---

## Soma AI Integration

The Diary module can be queried through Bidii's Soma AI assistant. Teachers and administrators can ask questions about diary data and receive insights based on the information they have access to.

### What Soma Can Do with Diary Data

1. **Query Assignment Status**
   ```
   Teacher asks: "Which students haven't submitted the mathematics 
                  assignment due today?"
   
   Soma responds: "4 students from Form 3 East have not submitted:
   - Wanjiku, Mary
   - Kamau, John
   - Otieno, Peter
   - Njeri, Faith"
   ```

2. **Analyze Patterns**
   ```
   Teacher asks: "What's the average submission rate for my Form 3 classes?"
   
   Soma responds: "Form 3 East: 86% completion rate
   Form 3 West: 78% completion rate
   Form 3 North: 91% completion rate
   
   Based on 24 assignments this term."
   ```

3. **Find Trends**
   ```
   Principal asks: "Which classes have the lowest assignment 
                    completion rates this month?"
   
   Soma responds: "Form 2 West has 72% completion, followed by 
   Form 3 West at 78%. Both show lower submission rates on 
   Friday-due assignments."
   ```

4. **Answer Questions**
   ```
   Teacher asks: "How many overdue assignments does David Ochieng have?"
   
   Soma responds: "David Ochieng has 2 overdue assignments:
   - Chemistry: Lab Report (3 days overdue)
   - English: Essay Draft (1 day overdue)"
   ```

**Important Note**: Soma provides information and analysis based on existing diary records. Teachers still manually create assignments, write feedback, and make all educational decisions. Soma helps you understand the data—you remain in charge of the actions.

---

## Feature Marketing Card

When presenting the Diary module on the Bidii website, it would appear as:

```tsx
{
  title: 'Diary',
  copy: 'Send assignments to the right learners. Track who submitted, who needs a nudge, and keep the learning conversation flowing.',
  icon: BookOpen,
  tone: 'gold-card',
  screen: 'Assignment tracker',
  detail: '24 of 28 students submitted on time',
  image: diaryScreenshot  // Screenshot showing assignment dashboard
}
```

### Marketing Copy for Website

**Section: The Diary Module**

**Headline**: No more lost homework. No more guessing.

**Subheading**: The digital diary that keeps teachers and learners on the same page.

**Description**: 
Send assignments to a class, a group, or individual learners. Students see what's due, when it's due, and what they need to do. Teachers see who submitted, who's struggling, and where to follow up. Everything in one organized, accessible place that respects the rhythm of learning.

**Visual**: Screenshot showing:
- Teacher view with assignment cards
- Completion statistics (24/28 submitted)
- Color-coded status indicators
- Clean, organized interface

---

## Implementation Checklist

When building the Diary module, ensure:

✅ **Visual Consistency**
- [ ] Uses Bidii color palette exactly
- [ ] Follows typography hierarchy (Bricolage Grotesque, Fraunces, DM Mono)
- [ ] Matches button styles and hover effects
- [ ] Implements reveal animations on scroll
- [ ] Uses Lucide icons with consistent sizing

✅ **Functionality**
- [ ] Teachers can create, edit, delete assignments
- [ ] Multi-class and individual student assignment
- [ ] File attachment support (upload/download)
- [ ] Due date/time selection with validation
- [ ] Student submission with optional comments
- [ ] Teacher review and feedback system
- [ ] Status tracking (pending, submitted, reviewed)
- [ ] Filtering and search capabilities

✅ **Accessibility**
- [ ] Keyboard navigation works fully
- [ ] Screen reader announcements implemented
- [ ] Color contrast meets WCAG AA standards
- [ ] Focus indicators visible and clear
- [ ] Form fields properly labeled
- [ ] Error messages descriptive and helpful

✅ **Responsive Design**
- [ ] Mobile-first approach
- [ ] Touch-friendly tap targets (44x44px minimum)
- [ ] Readable text sizes on small screens
- [ ] Appropriate breakpoints (768px, 1024px)
- [ ] No horizontal scrolling

✅ **Integration**
- [ ] Links to student/teacher records
- [ ] Connects with CBC academic structure
- [ ] Notification system integration
- [ ] Communication module for reminders
- [ ] Soma AI can query diary data for insights

✅ **Performance**
- [ ] Lazy loading for long assignment lists
- [ ] Optimized image sizes
- [ ] Efficient data fetching
- [ ] Loading states for async operations
- [ ] Error handling and retry logic

---

## Summary

The **Diary Module** embodies Bidii's core philosophy: making school management simple, connected, and human. By combining:

- **Clean, warm visual design** (cream, teal, gold color scheme)
- **Intuitive iconography** (Lucide icons for universal understanding)
- **Clear status indicators** (color-coded badges and progress metrics)
- **Smooth interactions** (gentle animations, hover effects)
- **AI-queryable data** (Soma can analyze patterns and answer questions)
- **Seamless integration** (connects with all Bidii modules)

The Diary module creates a dignified, efficient way for teachers to assign work and track progress, while giving students a clear, manageable view of their responsibilities. It's not just a homework tracker—it's a learning management tool that respects everyone's time and maintains the human connection at the center of education.

---

**Built with perseverance. Designed for modern Kenyan schools. Ready for the CBC era.**

*"The details that make a school day move."* — Bidii Diary Module
