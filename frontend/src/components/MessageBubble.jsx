import ReactMarkdown from 'react-markdown'

export default function MessageBubble({ role, content, isLoading, imageBase64, imageType }) {
  const isChef = role === 'chef'

  return (
    <div className={`message ${isChef ? 'message--chef' : 'message--user'}`}>
      {isChef && <span className="message-avatar">👨‍🍳</span>}

      <div className={`message-text ${isLoading ? 'message-text--loading' : ''}`}>
        {imageBase64 && (
          <img
            src={`data:${imageType};base64,${imageBase64}`}
            alt="Uploaded"
            className="message-image"
          />
        )}
        {isChef ? <ReactMarkdown>{content}</ReactMarkdown> : <p>{content}</p>}
      </div>

      {!isChef && <span className="message-avatar">🧑</span>}
    </div>
  )
}
