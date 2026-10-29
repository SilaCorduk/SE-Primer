import React, { useState } from 'react'
import Timer from './Timer.jsx'
import './DecisionCard.css'

function DecisionCard({ decision, userProfile, onDecide }) {
  const [selected, setSelected] = useState(null)
  const [timedOut, setTimedOut] = useState(false)
  const showTimer = userProfile.level === 'experienced'

  const handleSelect = (optionId) => {
    if (selected) return // Prevent double-click
    setSelected(optionId)
    onDecide(optionId)
  }

  const handleTimeUp = () => {
    setTimedOut(true)
  }

  return (
    <div className="decision-card card animate-fade-in" data-testid={`decision-card-${decision.number}`}>
      {/* Decision header */}
      <div className="decision-header">
        <div className="decision-meta">
          <span className="decision-topic badge badge-warning">{decision.topic}</span>
        </div>
        {showTimer && !selected && (
          <Timer seconds={60} onTimeUp={handleTimeUp} />
        )}
      </div>

      <h2 className="decision-title">{decision.title}</h2>

      {/* Situation */}
      <div className="situation-block">
        <pre className="situation-text">{decision.situation}</pre>
      </div>

      {/* Timer expired notice */}
      {timedOut && !selected && (
        <div className="timeout-notice">
          <span>⏰</span>
          <span>Süre doldu! Yine de kararını verebilirsin.</span>
        </div>
      )}

      {/* Options */}
      <div className="options-container">
        <p className="options-label text-muted">Kararını ver:</p>
        <div className="options-grid">
          <button
            className={`option-btn ${selected === 'A' ? 'selected' : ''}`}
            onClick={() => handleSelect('A')}
            disabled={!!selected}
            data-testid="decision-a"
          >
            <span className="option-icon">{decision.options[0].icon}</span>
            <span className="option-label">{decision.options[0].label}</span>
            <span className="option-desc">{decision.options[0].description}</span>
          </button>

          <button
            className={`option-btn ${selected === 'B' ? 'selected' : ''}`}
            onClick={() => handleSelect('B')}
            disabled={!!selected}
            data-testid="decision-b"
          >
            <span className="option-icon">{decision.options[1].icon}</span>
            <span className="option-label">{decision.options[1].label}</span>
            <span className="option-desc">{decision.options[1].description}</span>
          </button>
        </div>
      </div>

      {/* Level-appropriate hint for beginners */}
      {userProfile.level === 'beginner' && !selected && (
        <div className="beginner-note text-muted">
          💡 Her iki seçenek de mantıklı görünebilir. Acele etme, durumu dikkatlice değerlendir.
        </div>
      )}
    </div>
  )
}

export default DecisionCard
