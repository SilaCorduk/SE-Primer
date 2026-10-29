import React from 'react'
import { FINALS, DECISIONS } from '../data/scenario.js'
import './FinalScreen.css'

const RISK_MAP = {
  good: { color: 'var(--color-success)', bg: 'var(--color-success-bg)', border: 'rgba(63,185,80,0.4)' },
  warning: { color: 'var(--color-warning)', bg: 'var(--color-warning-bg)', border: 'rgba(210,153,34,0.4)' },
  bad: { color: 'var(--color-danger)', bg: 'var(--color-danger-bg)', border: 'rgba(248,81,73,0.4)' },
}

const RISK_ICON = { good: '✅', warning: '🟡', bad: '❌' }
const CHOICE_LABEL = { low: 'İyi Seçim', medium: 'Kabul Edilebilir', high: 'Riskli Seçim' }
const CHOICE_COLOR = { low: 'var(--color-success)', medium: 'var(--color-warning)', high: 'var(--color-danger)' }

function FinalScreen({ userProfile, decisions, outcome, onRestart }) {
  const final = FINALS[outcome] || FINALS['FINAL_A']
  const riskConf = RISK_MAP[final.overallRisk]

  const roleLabels = {
    backend: 'Backend Developer',
    frontend: 'Frontend Developer',
    qa: 'QA / Test Engineer',
    swe: 'Software Engineer',
  }

  return (
    <div className="final-screen" data-testid="final-screen">
      <div className="container">
        {/* Header */}
        <div className="final-topbar">
          <span className="topbar-app-name">⚕️ SE Primer</span>
          <span className="text-mono text-muted" style={{ fontSize: '0.75rem' }}>Olay Raporu</span>
        </div>

        {/* Main outcome card */}
        <div
          className="outcome-card card animate-fade-in"
          style={{ borderColor: riskConf.border, background: riskConf.bg }}
        >
          <div className="outcome-badge">
            <span style={{ fontSize: '2rem' }}>{RISK_ICON[final.overallRisk]}</span>
            <div>
              <h1 className="outcome-title">{final.title}</h1>
              <p className="outcome-subtitle" style={{ color: riskConf.color }}>{final.subtitle}</p>
            </div>
          </div>
          <p className="outcome-badge-pill" style={{ background: riskConf.bg, border: `1px solid ${riskConf.color}`, color: riskConf.color }}>
            {final.badge}
          </p>
          <p className="outcome-summary">{final.summary}</p>
        </div>

        {/* System status */}
        <div className="status-cards mt-md">
          <div className="status-card-item card">
            <p className="status-card-label text-muted">Sistem Durumu</p>
            <p className="status-card-value">{final.systemStatus}</p>
          </div>
          <div className="status-card-item card">
            <p className="status-card-label text-muted">Veri Güvenliği</p>
            <p
              className="status-card-value"
              style={{ color: final.overallRisk === 'bad' ? 'var(--color-danger)' : 'var(--color-success)' }}
            >
              {final.securityStatus}
            </p>
          </div>
        </div>

        {/* Decision review */}
        <div className="decisions-review card mt-md animate-fade-in" style={{ animationDelay: '0.15s' }}>
          <h3 className="review-title">📋 Karar Özeti</h3>
          {decisions.map((d) => (
            <div key={d.decisionId} className="review-item">
              <div className="review-item-header">
                <span className="review-num text-mono">{d.decisionNumber}.</span>
                <span className="review-topic">{d.topic}</span>
                <span
                  className="review-risk"
                  style={{ color: CHOICE_COLOR[d.feedback.risk] }}
                >
                  {CHOICE_LABEL[d.feedback.risk]}
                </span>
              </div>
              <p className="review-choice">{d.optionLabel}</p>
              <p className="review-label text-muted" style={{ fontSize: '0.8rem' }}>{d.feedback.label}</p>
            </div>
          ))}
        </div>

        {/* Lessons learned */}
        <div className="lessons card mt-md animate-fade-in" style={{ animationDelay: '0.25s' }}>
          <h3 className="lessons-title">🎓 Kazanılan Dersler</h3>
          <ul className="lessons-list">
            {final.lessons.map((lesson, i) => (
              <li key={i} className="lesson-item">
                <span className="lesson-bullet">▶</span>
                <span>{lesson}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Personalized note */}
        <div className="personal-note card mt-md" style={{ animationDelay: '0.35s' }}>
          <p className="text-muted" style={{ fontSize: '0.85rem' }}>
            <strong style={{ color: 'var(--color-text-primary)' }}>{roleLabels[userProfile.role]}</strong> olarak bu krizi yönettiniz. 
            Deneyim seviyeniz: <strong style={{ color: 'var(--color-accent)' }}>{
              { beginner: 'Yeni Başlayan', intermediate: 'Orta Seviye', experienced: 'Deneyimli' }[userProfile.level]
            }</strong>.
          </p>
        </div>

        {/* Restart */}
        <div className="final-actions mt-xl">
          <button
            className="btn btn-primary btn-full"
            onClick={onRestart}
            data-testid="restart-button"
          >
            🔄 Tekrar Oyna
          </button>
          <p className="text-muted" style={{ fontSize: '0.75rem', textAlign: 'center', marginTop: '0.5rem' }}>
            Farklı kararlar vererek farklı finallerle karşılaşabilirsin.
          </p>
        </div>
      </div>
    </div>
  )
}

export default FinalScreen
