import { useState, useCallback } from 'react'
import ChatWindow from './components/ChatWindow'
import ChatInput from './components/ChatInput'
import SettingsPanel from './components/SettingsPanel'
import { sendMessage } from './api/chat'

const SESSION_ID = crypto.randomUUID()

export default function App() {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [temperature, setTemperature] = useState(0.7)
  const [verbosity, setVerbosity] = useState('Detailed')

  const handleSend = useCallback(async ({ text, imageBase64, imageType }) => {
    setError(null)
    setMessages((prev) => [...prev, { role: 'user', content: text, imageBase64, imageType }])
    setIsLoading(true)

    try {
      const reply = await sendMessage({ sessionId: SESSION_ID, message: text, temperature, verbosity, imageBase64, imageType })
      setMessages((prev) => [...prev, { role: 'chef', content: reply }])
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [temperature, verbosity])

  return (
    <div className="app">
      <header className="app-header">
        <span className="app-header__logo">👨‍🍳</span>
        <div>
          <h1 className="app-header__title">Chef Marco</h1>
          <p className="app-header__subtitle">Your personal AI chef assistant</p>
        </div>
      </header>

      <div className="app-body">
        <SettingsPanel
          temperature={temperature}
          onTemperatureChange={setTemperature}
          verbosity={verbosity}
          onVerbosityChange={setVerbosity}
        />

        <ChatWindow messages={messages} isLoading={isLoading} />

        {error && <p className="app-error">{error}</p>}

        <ChatInput onSend={handleSend} disabled={isLoading} />
      </div>
    </div>
  )
}
