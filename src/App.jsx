import React, { useState, useCallback } from 'react'
import Onboarding from './components/Onboarding.jsx'
import Scenario from './components/Scenario.jsx'
import FinalScreen from './components/FinalScreen.jsx'
import './styles/global.css'

// App-level screens
const SCREENS = {
  ONBOARDING: 'onboarding',
  SCENARIO: 'scenario',
  FINAL: 'final',
}

function App() {
  const [screen, setScreen] = useState(SCREENS.ONBOARDING)
  const [userProfile, setUserProfile] = useState(null)
  const [decisions, setDecisions] = useState([]) // Array of { decisionId, choice, option }
  const [finalOutcome, setFinalOutcome] = useState(null)

  const handleOnboardingComplete = useCallback((profile) => {
    setUserProfile(profile)
    setDecisions([])
    setFinalOutcome(null)
    setScreen(SCREENS.SCENARIO)
  }, [])

  const handleDecision = useCallback((decision) => {
    setDecisions((prev) => [...prev, decision])
  }, [])

  const handleScenarioComplete = useCallback((outcome) => {
    setFinalOutcome(outcome)
    setScreen(SCREENS.FINAL)
  }, [])

  const handleRestart = useCallback(() => {
    setUserProfile(null)
    setDecisions([])
    setFinalOutcome(null)
    setScreen(SCREENS.ONBOARDING)
  }, [])

  return (
    <div className="app-root">
      {screen === SCREENS.ONBOARDING && (
        <Onboarding onComplete={handleOnboardingComplete} />
      )}
      {screen === SCREENS.SCENARIO && (
        <Scenario
          userProfile={userProfile}
          decisions={decisions}
          onDecision={handleDecision}
          onComplete={handleScenarioComplete}
        />
      )}
      {screen === SCREENS.FINAL && (
        <FinalScreen
          userProfile={userProfile}
          decisions={decisions}
          outcome={finalOutcome}
          onRestart={handleRestart}
        />
      )}
    </div>
  )
}

export default App
