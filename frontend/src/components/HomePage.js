"use client"

import React, { useEffect, useState } from "react"
import "./HomePage.css"

const colors = [
  "#FFCDD2", "#F8BBD0", "#E1BEE7", "#D1C4E9", "#C5CAE9",
  "#BBDEFB", "#B3E5FC", "#B2EBF2", "#B2DFDB", "#C8E6C9",
  "#DCEDC8", "#F0F4C3", "#FFF9C4", "#FFECB3", "#FFE0B2",
  "#FFCCBC", "#D7CCC8", "#F5F5F5", "#CFD8DC", "#E0F7FA"
]

const userColors = {}
let colorIndex = 0

const getColorForUser = (user) => {
  if (!userColors[user]) {
    userColors[user] = colors[colorIndex % colors.length]
    colorIndex++
  }
  return userColors[user]
}

const HomePage = () => {
  const [messages, setMessages] = useState([])

  useEffect(() => {
    document.body.style.backgroundColor = "#f8f3eb"

    const fetchMessages = () => {
      fetch("http://localhost:3200/api/messages/obtener")
        .then((res) => res.json())
        .then((data) => {
          const ordered = data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
          const transformed = ordered.map((msg, index) => {
            const from = msg.number

            return {
              id: index,
              text: msg.body || "[mensaje vacío]",
              from,
              sender: msg.from.includes("g.us") ? "other" : "me",
              time: new Date(msg.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              color: getColorForUser(from),
            }
          })

          setMessages(transformed)
        })
        .catch((err) => {
          console.error("Error al obtener los mensajes:", err)
        })
    }

    fetchMessages()
    const interval = setInterval(fetchMessages, 1000) // cada segundo

    return () => {
      clearInterval(interval)
      document.body.style.backgroundColor = ""
    }
  }, [])

  return (
    <div className="chat-page-container">
      <div className="whatsapp-container">
        <div className="whatsapp-header">
          <div className="contact-info">
            <div className="contact-avatar"></div>
            <div className="contact-name">Grupo de Grafos</div>
          </div>
        </div>

        <div className="messages-container">
          <div className="chat-date">HOY</div>

          {messages.map((message) => (
            <div key={message.id} className={`message ${message.sender}`}>
              <div
                className="message-content"
                style={{ backgroundColor: message.color }}
              >
                <div className="message-from">
                  {message.from}
                </div>
                <div className="message-text">{message.text}</div>
                <div className="message-time">{message.time}</div>
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  )
}

export default HomePage
