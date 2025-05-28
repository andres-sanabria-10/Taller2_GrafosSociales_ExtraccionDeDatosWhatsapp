"use client"

import React, { useEffect, useState } from "react"
import "./HomePage.css"

const colors = [
 "#A2D2FF", // celeste claro vibrante
  "#83C5BE", // verde agua medio
  "#BFD7EA", // azul nube
  "#AED9E0", // turquesa muy suave
  "#B4D4C6", // verde menta suave
  "#B1D0E0", // azul claro elegante
  "#A0C1B8", // verde seco claro
  "#C7DAD4", // gris verdoso frío
  "#A3C4BC", // gris con verde claro
  "#B2DFDB", // turquesa pastel saturado (más brillante)
  "#C1DBE3", // azul niebla
  "#B9D6D3", // verde mar suave
  "#B3D9C4", // verde campo claro
  "#B8E0D2", // verde mar medio
  "#CDEDF6", // azul cielo suave
  "#C6E2DD", // verde pálido vibrante
  "#D0EBE8", // aqua claro
  "#C9E4DE", // jade claro
  "#CCE2CB", // verde claro saturado
  "#CEDFD9", // gris verdoso
  "#A7C5BD", // verde musgo suave
  "#B5DAD9", // azul/verde muy equilibrado
  "#C2E7D9", // verde agua
  "#C4D7E0", // azul grisáceo elegante
  "#B9CDD2", // azul humo
  "#B0D9E2", // azul hielo claro
  "#C3E0E5", // azul con gris
  "#ABC8C7", // azul petróleo suave
  "#D2F0F4", // aqua brillante
  "#B3CCC5", // verde cemento
  "#D0E8E0", // verde frío
  "#B6D9D2", // verde fresco
  "#B9D0D6", // azul mar
  "#B4D4D1", // verde oceánico
  "#BBDDE2"  // azul gris claro
]

const userColors = {}
let colorIndex = 0
//funcion de asignacion de colores para el usuario
const getColorForUser = (user) => {
  if (!userColors[user]) {
    userColors[user] = colors[colorIndex % colors.length]
    colorIndex++
  }
  return userColors[user]
}
//la funcion que muestra la fecha
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
    console.log("Mensaje seleccionado:", message)

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
              _id: msg._id,
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
