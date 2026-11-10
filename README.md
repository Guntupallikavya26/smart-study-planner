# Smart Study Planner 🎓

A modern, responsive student study planner and progress tracking dashboard built with **React** and **Vite**.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```
Open your browser at the local URL (usually `http://localhost:5173/`).

### 3. Build for Production
```bash
npm run build
```

### 4. Run Linter
```bash
npm run lint
```

---

## 📁 Project Architecture

```
smart study planner/
├── index.html                   # HTML entry point with Plus Jakarta Sans typography
├── package.json                 # Project dependencies & scripts
├── vite.config.js               # Vite React configuration
└── src/
    ├── main.jsx                 # React root renderer
    ├── App.jsx                  # Main application state & tab switcher
    ├── index.css                # Global CSS design system, responsive styles, & tokens
    ├── App.css                  # App layout overrides
    ├── data/
    │   └── sampleData.js        # Realistic student data (subjects, tasks, exams, reviews)
    └── components/
        ├── Sidebar.jsx          # Collapsible responsive navigation sidebar
        ├── Header.jsx           # Top navbar with search, study streak, & profile
        ├── WelcomeBanner.jsx    # Personalized welcome greeting & quick actions
        ├── SummaryCards.jsx     # Summary cards for subjects, topics, and exams
        ├── DashboardView.jsx    # Main dashboard view combining all widgets
        ├── SubjectsView.jsx     # Courses breakdown & syllabus progress
        ├── StudyPlannerView.jsx # Daily time-blocked planner with task creator
        ├── ProgressTrackerView.jsx # Weekly study chart & subject mastery metrics
        └── RevisionScheduleView.jsx# Spaced repetition system (1-3-7-14 days)
```

---

## ✨ Features Included

- **Modern Student Dashboard Design**: Polished card layouts, subtle gradients, and clean typography.
- **Responsive Layout**: Adapts smoothly to mobile, tablet, and desktop screens with mobile drawer menu.
- **Sidebar Navigation**:
  - 📊 **Dashboard**: Welcome section, summary metric cards, today's schedule, exam countdowns.
  - 📚 **My Subjects**: Detailed subject cards with syllabus completion rates and instructor info.
  - 📅 **Study Planner**: Daily tasks with completion toggles, priority filters, and task creator modal.
  - 📈 **Progress Tracker**: Weekly focus hours bar chart and subject mastery breakdown.
  - 🔁 **Revision Schedule**: Scientific spaced repetition system (Round 1 to Round 4) with confidence ratings.
- **Interactive State**: Check off tasks in real-time, add new study tasks, and mark topics revised.
- **Zero Errors / Clean Code**: Tested with `oxlint` and production `vite build`.
