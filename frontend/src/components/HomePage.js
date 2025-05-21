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

const getDateLabel = (dateStr) => {
  const today = new Date()
  const msgDate = new Date(dateStr)

  const isToday = today.toDateString() === msgDate.toDateString()

  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)
  const isYesterday = yesterday.toDateString() === msgDate.toDateString()

  if (isToday) return "HOY"
  if (isYesterday) return "AYER"

  return msgDate.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  })
}

const HomePage = () => {
  const [messages, setMessages] = useState([])
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [analysisData, setAnalysisData] = useState(null)

  const handleSelectMessage = (message) => {
    setSelectedMessage(message)
    setAnalysisData(null)

    fetch(`http://localhost:3200/api/messages/${message._id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.analisis) {
          setAnalysisData(data); // Asumes que viene directamente con los análisis
        } else {
          setAnalysisData({ error: "No se pudo analizar el mensaje" });
        }
      })
      .catch((error) => {
        console.error(error);
        setAnalysisData({ error: "Ocurrió un error al analizar el mensaje" });
      });


  }

  useEffect(() => {
    document.body.style.backgroundColor = "#f8f3eb"

    const fetchMessages = () => {
      fetch("http://localhost:3200/api/messages/obtener")
        .then((res) => res.json())
        .then((data) => {
          const ordered = data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))

          let lastDate = null
          const finalMessages = []

          ordered.forEach((msg, index) => {
            const from = msg.number
            const dateObj = new Date(msg.timestamp)
            const dateKey = dateObj.toISOString().split("T")[0]

            if (lastDate !== dateKey) {
              finalMessages.push({
                type: "date",
                date: dateKey,
              })
              lastDate = dateKey
            }

            finalMessages.push({
              type: "message",
              id: index,
              text: msg.body || "[mensaje vacío]",
              from,
              sender: msg.from.includes("g.us") ? "other" : "me",
              time: dateObj.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              color: getColorForUser(from),
            })
          })

          setMessages(finalMessages)
        })
        .catch((err) => {
          console.error("Error al obtener los mensajes:", err)
        })
    }

    fetchMessages()
    const interval = setInterval(fetchMessages, 1000)

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
          {messages.map((message, index) => {
            if (message.type === "date") {
              return (
                <div key={`date-${index}`} className="chat-date">
                  {getDateLabel(message.date)}
                </div>
              )
            }

            return (
              <div
                key={message.id}
                className={`message ${message.sender}`}
                onClick={() => handleSelectMessage(message)}
                style={{ cursor: "pointer" }}
              >
                <div
                  className="message-content"
                  style={{ backgroundColor: message.color }}
                >
                  <div className="message-from">{message.from}</div>
                  <div className="message-text">{message.text}</div>
                  <div className="message-time">{message.time}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Panel lateral de análisis */}
      {selectedMessage && (
        <div
          className="analysis-box"
          style={{

            right: "20px",
            top: "20px",
            width: "300px",
            border: "2px solid #333",
            borderRadius: "10px",
            padding: "1rem",
            backgroundColor: "#fff",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h3>Análisis del mensaje</h3>
          <p><strong>Texto:</strong> {selectedMessage.text}</p>
          {analysisData ? (
            analysisData.error ? (
              <p style={{ color: "red" }}>{analysisData.error}</p>
            ) : (
              <>
                <p><strong>Sentimiento:</strong> {analysisData.analisis?.sentimiento?.label} ({analysisData.analisis?.sentimiento?.score})</p>
                <p><strong>Emoción:</strong> {analysisData.analisis?.emocion?.label} ({analysisData.analisis?.emocion?.score})</p>
                <p><strong>Ironía:</strong> {analysisData.analisis?.ironia?.label}</p>
                <p><strong>Traducción:</strong> {analysisData.analisis?.texto_traducido}</p>
                <p><strong>Toxicidad:</strong></p>
                <ul>
                  {analysisData.analisis?.toxicidad?.map((tox, idx) => (
                    <li key={idx}>{tox.label}: {tox.score}</li>
                  ))}
                </ul>
              </>
            )
          ) : (
            <p>Cargando análisis...</p>
          )}
        </div>
      )}
    </div>
  )
}

export default HomePage
