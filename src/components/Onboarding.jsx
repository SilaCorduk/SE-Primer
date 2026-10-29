import React, { useState } from 'react'
import './Onboarding.css'

const LEVELS = [
  { id: 'beginner', label: 'Yeni başladım', desc: 'SE kavramlarına yeni adım atıyorum', icon: '🌱' },
  { id: 'intermediate', label: 'Orta seviye', desc: 'Temel kavramları biliyorum', icon: '⚡' },
  { id: 'experienced', label: 'Deneyimliyim', desc: 'Üretim deneyimim var', icon: '🚀' },
]

const ROLES = [
  { id: 'backend', label: 'Backend Developer', icon: '⚙️' },
  { id: 'frontend', label: 'Frontend Developer', icon: '🎨' },
  { id: 'qa', label: 'QA / Test Engineer', icon: '🧪' },
  { id: 'swe', label: 'Software Engineer', icon: '💻' },
]

const GOALS = [
  { id: 'decisions', label: 'Doğru teknik karar vermeyi öğrenmek', icon: '🎯' },
  { id: 'testing', label: 'Test stratejilerini geliştirmek', icon: '🔬' },
  { id: 'security', label: 'Güvenli yazılım geliştirmeyi öğrenmek', icon: '🔒' },
  { id: 'architecture', label: 'Yazılım mimarisi kararlarını anlamak', icon: '🏗️' },
]

function SelectionGrid({ items, selected, onSelect, testPrefix }) {
  return (
    <div className="selection-grid">
      {items.map((item) => (
        <button
          key={item.id}
          className={`selection-item ${selected === item.id ? 'selected' : ''}`}
          onClick={() => onSelect(item.id)}
          data-testid={`${testPrefix}-${item.id}`}
          type="button"
          aria-pressed={selected === item.id}
        >
          <span className="selection-icon">{item.icon}</span>
          <span className="selection-label">{item.label}</span>
          {item.desc && <span className="selection-desc">{item.desc}</span>}
        </button>
      ))}
    </div>
  )
}

function Onboarding({ onComplete }) {
  const [level, setLevel] = useState(null)
  const [role, setRole] = useState(null)
  const [goal, setGoal] = useState(null)

  const canStart = level && role && goal

  const handleStart = () => {
    if (!canStart) return
    onComplete({ level, role, goal })
  }

  return (
    <div className="onboarding-screen">
      <div className="container">
        {/* Header */}
        <header className="onboarding-header animate-fade-in">
          <div className="app-logo">
            <span className="logo-icon">⚕️</span>
            <div>
              <h1 className="logo-title">SE Primer</h1>
              <p className="logo-subtitle">Software Engineering Simulation</p>
            </div>
          </div>
          <p className="onboarding-description">
            Gerçek bir yazılım mühendisi krizini yönet. Her kararın bir sonuç doğurur — 
            seçimlerinin yazılım mühendisliği üzerindeki etkisini keşfet.
          </p>
          <div className="scenario-teaser card">
            <div className="teaser-header">
              <span className="status-dot red"></span>
              <span className="text-mono text-muted" style={{fontSize:'0.75rem'}}>OLAY #2024-1847 — AKTİF</span>
            </div>
            <p className="teaser-text">
              "Sabah 08:14. Hastanenin randevu sistemi çöktü. 312 hasta işlem bekliyor. Nöbetçi mühendis sensin."
            </p>
          </div>
        </header>

        {/* Step 1: Level */}
        <section className="onboarding-section animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="section-header">
            <span className="section-number">01</span>
            <h2 className="section-title">Yazılım mühendisliği deneyimin nedir?</h2>
          </div>
          <SelectionGrid
            items={LEVELS}
            selected={level}
            onSelect={setLevel}
            testPrefix="level"
          />
        </section>

        {/* Step 2: Role */}
        <section className="onboarding-section animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="section-header">
            <span className="section-number">02</span>
            <h2 className="section-title">Hangi rol seni en iyi tanımlıyor?</h2>
          </div>
          <SelectionGrid
            items={ROLES}
            selected={role}
            onSelect={setRole}
            testPrefix="role"
          />
        </section>

        {/* Step 3: Goal */}
        <section className="onboarding-section animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="section-header">
            <span className="section-number">03</span>
            <h2 className="section-title">Bugün ne öğrenmek istiyorsun?</h2>
          </div>
          <SelectionGrid
            items={GOALS}
            selected={goal}
            onSelect={setGoal}
            testPrefix="goal"
          />
        </section>

        {/* CTA */}
        <div className="onboarding-cta animate-fade-in" style={{ animationDelay: '0.4s' }}>
          {!canStart && (
            <p className="cta-hint text-muted">Devam etmek için yukarıdaki tüm seçimleri yap.</p>
          )}
          <button
            className="btn btn-primary btn-full"
            onClick={handleStart}
            disabled={!canStart}
            data-testid="start-button"
          >
            🚨 Senaryoyu Başlat
          </button>
          <p className="cta-disclaimer text-muted">
            Bu simülasyonda kullanılan tüm veriler tamamen kurgusaldır.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Onboarding
