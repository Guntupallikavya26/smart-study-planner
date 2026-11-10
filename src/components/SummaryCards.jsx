import React from 'react';
import { BookOpen, CheckCircle2, Clock, AlertTriangle, ArrowUpRight } from 'lucide-react';

export default function SummaryCards({ metrics, onCardClick }) {
  const cards = [
    {
      id: 'subjects',
      title: 'Total Subjects',
      value: metrics.totalSubjects,
      unit: 'Enrolled',
      subtext: '5 core engineering courses',
      icon: BookOpen,
      colorClass: 'card-indigo',
      badge: 'Active Term',
      badgeClass: 'badge-indigo',
    },
    {
      id: 'completed',
      title: 'Completed Topics',
      value: metrics.completedTopics,
      unit: 'Topics',
      subtext: '+6 completed this week',
      icon: CheckCircle2,
      colorClass: 'card-emerald',
      badge: '64% Mastered',
      badgeClass: 'badge-emerald',
    },
    {
      id: 'pending',
      title: 'Pending Topics',
      value: metrics.pendingTopics,
      unit: 'Remaining',
      subtext: '12 high priority for exams',
      icon: Clock,
      colorClass: 'card-amber',
      badge: 'Requires Focus',
      badgeClass: 'badge-amber',
    },
    {
      id: 'exams',
      title: 'Upcoming Exams',
      value: metrics.upcomingExams,
      unit: 'In next 14 days',
      subtext: 'Next: CS201 in 6 days',
      icon: AlertTriangle,
      colorClass: 'card-rose',
      badge: 'Exam Mode',
      badgeClass: 'badge-rose',
    },
  ];

  return (
    <section className="summary-cards-grid">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className={`summary-card ${card.colorClass}`}
            onClick={() => {
              if (onCardClick) onCardClick(card.id);
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                if (onCardClick) onCardClick(card.id);
              }
            }}
          >
            <div className="summary-card-header">
              <div className="summary-icon-wrapper">
                <Icon size={22} className="summary-icon" />
              </div>
              <span className={`summary-badge ${card.badgeClass}`}>
                {card.badge}
              </span>
            </div>

            <div className="summary-body">
              <h3 className="summary-title">{card.title}</h3>
              <div className="summary-value-row">
                <span className="summary-value">{card.value}</span>
                <span className="summary-unit">{card.unit}</span>
              </div>
            </div>

            <div className="summary-footer">
              <span className="summary-subtext">{card.subtext}</span>
              <ArrowUpRight size={16} className="summary-arrow" />
            </div>
          </div>
        );
      })}
    </section>
  );
}
