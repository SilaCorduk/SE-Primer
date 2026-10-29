import React, { useState, useEffect } from 'react'
import { getTutorHint, isTutorLive } from '../services/tutorService.js'
import './TutorPanel.css'

/**
 * TutorPanel
 * Shows Socratic hints from AI Tutor (Gemini or Mock).
 * Never reveals direct answers.
 */
function TutorPanel({ decisionId, level, hints }) {
  const [hint, setHint] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [source, setSource] = useState('mock')

  useEffect(() => {
    setHint(null)
    setIsOpen(false)
  }, [decisionId])

  const fetchHint = async () => {
    if (hint) return // Already loaded
    setLoading(true)
    try {
      const result = await getTutorHint(decisionId, level, '')
      setHint(result.text)
      setSource(result.source)
    } catch (err) {
      setHint('Şu an ipucu alınamıyor. Lütfen her iki seçeneği kendi kendine değerlendirmeye çalış.')
      setSource('mock')
    } finally {
      setLoading(false)
    }
  }

  const handleToggle = () => {
    if (!isOpen) {
      fetchHint()
    }
    setIsOpen((v) => !v)
  }

  return (
    <div className="tutor-panel mt-md" data-testid="tutor">
      <button
        className="tutor-toggle"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-controls="tutor-content"
      >
        <div className="tutor-toggle-left">
          <span className="tutor-icon">🤖</span>
          <div>
            <span className="tutor-title">AI Tutor</span>
            <span className="tutor-subtitle">Sokratik İpucu</span>
          </div>
        </div>
        <span className="tutor-chevron">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="tutor-content" id="tutor-content">
          {loading ? (
            <div className="tutor-loading">
              <span className="tutor-loading-dots">···</span>
              <span>Düşünüyorum...</span>
            </div>
          ) : (
            <>
              <div className="tutor-hint-text">{hint}</div>
              <div className="tutor-footer">
                <span className="tutor-source">
                  {source === 'gemini' ? '✨ Gemini AI' : '📦 Mock Tutor'}
                </span>
                <span className="tutor-disclaimer">Bu tutor cevabı söylemez — düşünmen için sorular sorar.</span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default TutorPanel
