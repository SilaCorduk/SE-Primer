import React, { useState, useEffect, useRef } from 'react'
import './Timer.css'

/**
 * Timer component for 'experienced' level users.
 * Shows countdown. When time is up, calls onTimeUp().
 * App does NOT lock — user can still decide.
 */
function Timer({ seconds = 60, onTimeUp }) {
  const [timeLeft, setTimeLeft] = useState(seconds)
  const [expired, setExpired] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current)
          setExpired(true)
          onTimeUp?.()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(intervalRef.current)
  }, [])

  const percentage = (timeLeft / seconds) * 100
  const isUrgent = timeLeft <= 15

  return (
    <div className={`timer ${isUrgent ? 'urgent' : ''} ${expired ? 'expired' : ''}`} data-testid="timer">
      <div className="timer-circle">
        <svg viewBox="0 0 36 36" className="timer-svg">
          <circle
            cx="18" cy="18" r="15.9"
            fill="none"
            stroke="var(--color-border)"
            strokeWidth="2.5"
          />
          <circle
            cx="18" cy="18" r="15.9"
            fill="none"
            stroke={expired ? 'var(--color-danger)' : isUrgent ? 'var(--color-warning)' : 'var(--color-accent)'}
            strokeWidth="2.5"
            strokeDasharray="100"
            strokeDashoffset={100 - percentage}
            strokeLinecap="round"
            style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <span className="timer-value">{expired ? '✗' : timeLeft}</span>
      </div>
      <span className="timer-label">{expired ? 'Süre doldu' : 'saniye'}</span>
    </div>
  )
}

export default Timer
