import { useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble'

export default function ChatWindow({ messages, isLoading }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  return (
    <div className="chat-window">
      {messages.length === 0 && (
        <p className="chat-empty">
          Tell Chef Marco what ingredients you have — or upload a photo and he will figure it out!
        </p>
      )}

      {messages.map((msg, index) => (
        <MessageBubble
          key={index}
          role={msg.role}
          content={msg.content}
          imageBase64={msg.imageBase64}
          imageType={msg.imageType}
        />
      ))}

      {isLoading && (
        <MessageBubble role="chef" content="Chef Marco is thinking..." isLoading />
      )}

      <div ref={bottomRef} />
    </div>
  )
}
