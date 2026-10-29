import React, { useState } from 'react'
import DecisionCard from './DecisionCard.jsx'
import FeedbackPanel from './FeedbackPanel.jsx'
import TutorPanel from './TutorPanel.jsx'
import { SCENARIO_INTRO, DECISIONS, computeOutcome } from '../data/scenario.js'
import './Scenario.css'

const PHASE = {
  INTRO: 'intro',
  DECISION: 'decision',
  FEEDBACK: 'feedback',
}

function StatusBadge({ status, color }) {
  const colorClass = color === 'red' ? 'badge-danger' : color === 'yellow' ? 'badge-warning' : 'badge-success'
  return <span className={`badge ${colorClass}`}><span className={`status-dot ${color}`}></span>{status}</span>
}

function Scenario({ userProfile, decisions, onDecision, onComplete }) {
  const [phase, setPhase] = useState(PHASE.INTRO)
  const [currentDecisionIndex, setCurrentDecisionIndex] = useState(0)
  const [currentFeedback, setCurrentFeedback] = useState(null)

  const currentDecision = DECISIONS[currentDecisionIndex]
  const isLastDecision = currentDecisionIndex === DECISIONS.length - 1

  const handleDecisionMade = (choice) => {
    const decision = DECISIONS[currentDecisionIndex]
    const feedback = decision.feedback[choice]
    const decisionRecord = {
      decisionId: decision.id,
      decisionNumber: decision.number,
      topic: decision.topic,
      title: decision.title,
      choice,
      optionLabel: decision.options.find((o) => o.id === choice)?.label,
      feedback,
    }
    onDecision(decisionRecord)
    setCurrentFeedback({ choice, feedback, decisionRecord })
    setPhase(PHASE.FEEDBACK)
  }

  const handleNextDecision = () => {
    if (isLastDecision) {
      // decisions state may not have last entry yet due to async setState
      // so we use currentFeedback.decisionRecord directly
      const allDecisions = [...decisions]
      if (currentFeedback?.decisionRecord) {
        const alreadyExists = allDecisions.find(
          (d) => d.decisionId === currentFeedback.decisionRecord.decisionId
        )
        if (!alreadyExists) {
          allDecisions.push(currentFeedback.decisionRecord)
        }
      }
      const outcome = computeOutcome(allDecisions)
      onComplete(outcome)
    } else {
      setCurrentDecisionIndex((i) => i + 1)
      setCurrentFeedback(null)
      setPhase(PHASE.DECISION)
    }
  }

  const handleIntroStart = () => {
    setPhase(PHASE.DECISION)
  }

  return (
    <div className="scenario-screen">
      <div className="container">
        {/* Top bar */}
        <div className="scenario-topbar">
          <div className="topbar-left">
            <span className="topbar-app-name">⚕️ SE Primer</span>
            <span className="topbar-incident text-mono text-muted">#2024-1847</span>
          </div>
          <StatusBadge status="AKTİF OLAY" color="red" />
        </div>

        {phase === PHASE.INTRO && (
          <IntroPanel intro={SCENARIO_INTRO} userProfile={userProfile} onStart={handleIntroStart} />
        )}

        {phase === PHASE.DECISION && (
          <>
            {/* Progress */}
            <div className="progress-container mt-md mb-md">
              <div className="progress-label">
                <span>Karar {currentDecision.number} / {currentDecision.total}</span>
                <span className="text-mono">{currentDecision.topic}</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${(currentDecision.number / currentDecision.total) * 100}%` }}
                />
              </div>
            </div>

            {/* Previous decisions summary */}
            {decisions.length > 0 && (
              <PreviousDecisionsSummary decisions={decisions} />
            )}

            <DecisionCard
              key={currentDecision.id}
              decision={currentDecision}
              userProfile={userProfile}
              onDecide={handleDecisionMade}
            />

            <TutorPanel
              key={currentDecision.id}
              decisionId={currentDecision.id}
              level={userProfile.level}
              hints={currentDecision.tutorHints}
            />
          </>
        )}

        {phase === PHASE.FEEDBACK && currentFeedback && (
          <>
            {/* Progress */}
            <div className="progress-container mt-md mb-md">
              <div className="progress-label">
                <span>Karar {currentDecision.number} / {currentDecision.total} — Sonuç</span>
                <span className="text-mono">{currentDecision.topic}</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${(currentDecision.number / currentDecision.total) * 100}%` }}
                />
              </div>
            </div>

            <FeedbackPanel
              decisionNumber={currentDecision.number}
              choice={currentFeedback.choice}
              feedback={currentFeedback.feedback}
              optionLabel={currentDecision.options.find((o) => o.id === currentFeedback.choice)?.label}
              isLast={isLastDecision}
              onNext={handleNextDecision}
            />
          </>
        )}
      </div>
    </div>
  )
}

function IntroPanel({ intro, userProfile, onStart }) {
  const roleGreeting = {
    backend: 'Backend Developer',
    frontend: 'Frontend Developer',
    qa: 'QA Engineer',
    swe: 'Software Engineer',
  }[userProfile.role] || 'Mühendis'

  return (
    <div className="intro-panel animate-fade-in">
      <div className="intro-alert card">
        <div className="intro-alert-header">
          <span className="status-dot red" style={{ animation: 'pulse 1.5s infinite' }}></span>
          <span className="text-mono" style={{ fontSize: '0.75rem', color: 'var(--color-danger)' }}>
            KRİTİK SİSTEM ALARMI
          </span>
        </div>
        <div className="incident-meta">
          <span className="text-muted" style={{ fontSize: '0.8rem' }}>{intro.time}</span>
          <span className="text-muted" style={{ fontSize: '0.8rem' }}>·</span>
          <span className="text-muted" style={{ fontSize: '0.8rem' }}>{intro.subtitle}</span>
        </div>
        <h2 className="intro-title mt-sm">{intro.title}</h2>
      </div>

      <div className="card mt-md">
        <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
          Hoş geldin, <strong style={{ color: 'var(--color-text-primary)' }}>{roleGreeting}</strong>.
        </p>
        <pre className="scenario-description">{intro.description}</pre>
      </div>

      <div className="system-status-grid mt-md">
        {Object.entries(intro.systemStatus).map(([key, val]) => (
          <div key={key} className="status-item card">
            <span className="status-key text-mono text-muted">{key.toUpperCase()}</span>
            <span className="status-val text-danger">{val}</span>
          </div>
        ))}
      </div>

      <button
        className="btn btn-primary btn-full mt-lg"
        onClick={onStart}
        data-testid="intro-start-button"
      >
        🔍 Olayı İncele — İlk Karar
      </button>
    </div>
  )
}

function PreviousDecisionsSummary({ decisions }) {
  return (
    <div className="prev-decisions card mb-md">
      <p className="text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
        Önceki Kararların
      </p>
      {decisions.map((d, i) => (
        <div key={d.decisionId} className="prev-decision-item">
          <span className="prev-dec-num text-mono">{d.decisionNumber}.</span>
          <span className="prev-dec-text">
            <strong>{d.topic}</strong>: {d.optionLabel}
            <span
              className="prev-dec-risk"
              style={{
                color: d.feedback.risk === 'low' ? 'var(--color-success)'
                  : d.feedback.risk === 'high' ? 'var(--color-danger)'
                  : 'var(--color-warning)',
              }}
            >
              {' '}— {d.feedback.label}
            </span>
          </span>
        </div>
      ))}
    </div>
  )
}

export default Scenario
