import { useState, useRef } from 'react'

export default function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState('')
  const [imagePreview, setImagePreview] = useState(null)
  const [imageBase64, setImageBase64] = useState(null)
  const [imageType, setImageType] = useState(null)
  const fileInputRef = useRef(null)

  function handleImageChange(e) {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target.result
      const [header, base64] = dataUrl.split(',')
      const type = header.match(/data:([^;]+)/)[1]
      setImageBase64(base64)
      setImageType(type)
      setImagePreview(dataUrl)
    }
    reader.readAsDataURL(file)
  }

  function clearImage() {
    setImageBase64(null)
    setImageType(null)
    setImagePreview(null)
    fileInputRef.current.value = ''
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!text.trim() && !imageBase64) return

    onSend({
      text: text.trim() || 'What ingredients do you see in this image? What meal can I make?',
      imageBase64,
      imageType,
    })

    setText('')
    clearImage()
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e)
    }
  }

  return (
    <form className="chat-input" onSubmit={handleSubmit}>
      {imagePreview && (
        <div className="chat-input__preview">
          <img src={imagePreview} alt="Upload preview" className="chat-input__preview-img" />
          <button type="button" className="chat-input__preview-remove" onClick={clearImage}>
            ✕
          </button>
        </div>
      )}

      <div className="chat-input__row">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="chat-input__file"
          onChange={handleImageChange}
          disabled={disabled}
        />
        <button
          type="button"
          className="chat-input__upload"
          onClick={() => fileInputRef.current.click()}
          disabled={disabled}
          title="Upload image"
        >
          📷
        </button>
        <textarea
          className="chat-input__field"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            imageBase64
              ? 'Ask about this image or press Send...'
              : 'Tell Chef Marco what ingredients you have...'
          }
          disabled={disabled}
          rows={2}
        />
        <button
          className="chat-input__send"
          type="submit"
          disabled={disabled || (!text.trim() && !imageBase64)}
        >
          Send
        </button>
      </div>
    </form>
  )
}
