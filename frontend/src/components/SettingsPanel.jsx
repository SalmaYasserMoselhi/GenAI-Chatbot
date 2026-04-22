const VERBOSITY_OPTIONS = ['Concise', 'Detailed']

function creativityLabel(temperature) {
  if (temperature <= 0.3) return 'Strict'
  if (temperature <= 0.7) return 'Balanced'
  return 'Creative'
}

export default function SettingsPanel({ temperature, onTemperatureChange, verbosity, onVerbosityChange }) {
  return (
    <div className="settings">
      <div className="settings__item">
        <label className="settings__label">
          Creativity
          <span className="settings__value">{creativityLabel(temperature)}</span>
        </label>
        <input
          type="range"
          className="settings__slider"
          min="0"
          max="1.2"
          step="0.1"
          value={temperature}
          onChange={(e) => onTemperatureChange(parseFloat(e.target.value))}
        />
      </div>

      <div className="settings__item">
        <span className="settings__label">Response length</span>
        <div className="settings__toggle">
          {VERBOSITY_OPTIONS.map((option) => (
            <button
              key={option}
              className={`settings__toggle-btn ${verbosity === option ? 'active' : ''}`}
              onClick={() => onVerbosityChange(option)}
              type="button"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
