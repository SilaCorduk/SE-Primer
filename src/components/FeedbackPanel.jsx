import React from 'react'
import './FeedbackPanel.css'

const RISK_CONFIG = {
  low: { color: 'var(--color-success)', bg: 'var(--color-success-bg)', icon: '✅', label: 'Düşük Risk' },
  medium: { color: 'var(--color-warning)', bg: 'var(--color-warning-bg)', icon: '⚠️', label: 'Orta Risk' },
  high: { color: 'var(--color-danger)', bg: 'var(--color-danger-bg)', icon: '🔴', label: 'Yüksek Risk' },
}

function FeedbackPanel({ decisionNumber, choice, feedback, optionLabel, isLast, onNext }) {
  const riskConf = RISK_CONFIG[feedback.risk] || RISK_CONFIG.medium

  return (
    <div className="feedback-panel animate-fade-in">
      {/* Choice summary */}
      <div className="choice-summary card">
        <div className="choice-header">
          <span className="text-mono text-muted" style={{ fontSize: '0.75rem' }}>
            KARAR {decisionNumber} — SEÇİMİN
          </span>
          <div
            className="risk-badge"
            style={{ background: riskConf.bg, color: riskConf.color }}
          >
            {riskConf.icon} {feedback.label}
          </div>
        </div>
        <p className="choice-label">{optionLabel}</p>
      </div>

      {/* What happened */}
      <div className="feedback-block card mt-md" data-testid="feedback-what">
        <div className="feedback-block-header">
          <span className="feedback-block-icon">💥</span>
          <h3 className="feedback-block-title">Ne Oldu?</h3>
        </div>
        <pre className="feedback-text">{feedback.what}</pre>
      </div>

      {/* Why */}
      <div className="feedback-block card mt-md" data-testid="feedback-why">
        <div className="feedback-block-header">
          <span className="feedback-block-icon">🧠</span>
          <h3 className="feedback-block-title">Neden Oldu?</h3>
        </div>
        <pre className="feedback-text">{feedback.why}</pre>
      </div>

      {/* Next button */}
      <button
        className="btn btn-primary btn-full mt-lg"
        onClick={onNext}
        data-testid="next-decision-button"
      >
        {isLast ? '📊 Sonuçları Gör' : `➡️ Karar ${decisionNumber + 1}'e Geç`}
      </button>
    </div>
  )
}

export default FeedbackPanel
