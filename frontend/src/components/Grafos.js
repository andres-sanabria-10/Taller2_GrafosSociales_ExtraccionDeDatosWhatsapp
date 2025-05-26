import React, { useEffect, useState } from "react";
import "./Grafo.css";
import Tabla from "./Tabla";
import ForceGraph2D from "react-force-graph-2d";

const columnas = [
  { header: "ID", accessor: "id" },
  { header: "Número", accessor: "nombre" },
  { header: "Positivos", accessor: "positivos" },
  { header: "Negativos", accessor: "negativos" },
  { header: "Neutrales", accessor: "neutrales" },
  { header: "Total", accessor: "total" }
];

const columnasTotales = [
  { header: "ID", accessor: "id" },
  { header: "Número", accessor: "nombre" },
  { header: "Total de mensajes", accessor: "total" }
];

const EMOCIONES = [
  "admiration","amusement","anger","annoyance","approval","caring","confusion",
  "curiosity","desire","disappointment","disapproval","disgust","embarrassment",
  "excitement","fear","gratitude","grief","joy","love","nervousness","optimism",
  "pride","realization","relief","remorse","sadness","surprise","neutral"
];

const columnasEmocion = [
  { header: "ID", accessor: "id" },
  { header: "Número", accessor: "nombre" },
  ...EMOCIONES.map(e => ({ header: e.charAt(0).toUpperCase() + e.slice(1), accessor: e })),
  { header: "Total", accessor: "total" }
];

function Grafos() {
  const [modo, setModo] = useState("sentimiento");
  const [esGrafoPrincipal, setEsGrafoPrincipal] = useState(true);
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [rankingData, setRankingData] = useState([]);

  // 1) Grafo Principal sin emociones/sentimientos
  const fetchGrafoPrincipal = () => {
    fetch("http://localhost:5001/api/grafoSinEmociones")
      .then(res => res.json())
      .then(data => {
        setGraphData(data);
      })
      .catch(err => console.error("Error cargando grafo principal:", err));
  };

  const fetchTotales = () => {
    fetch("http://localhost:3200/api/messages/obtener")
      .then(res => res.json())
      .then(data => {
        const conteo = {};
        data.forEach(msg => {
          const numero = msg.number;
          if (!numero) return;
          conteo[numero] = (conteo[numero] || 0) + 1;
        });
        const tabla = Object.entries(conteo).map(([numero, total], i) => ({
          id: i + 1,
          nombre: numero,
          total
        }));
        setRankingData(tabla);
      })
      .catch(err => console.error("Error cargando totales:", err));
  };

  // 2) Grafo de Sentimientos o Emociones
  const fetchGraphData = modoActual => {
    const endpoint = modoActual === "sentimiento"
      ? "http://localhost:5001/api/grafo?tipo=sentimiento"
      : "http://localhost:5001/api/grafoEmociones?tipo=emocion";

    fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        setGraphData(data);
      })
      .catch(err => console.error(`Error cargando grafo ${modoActual}:`, err));
  };

  const fetchRankingData = modoActual => {
    fetch("http://localhost:3200/api/messages/obtener")
      .then(res => res.json())
      .then(data => {
        const scores = {};
        data.forEach(msg => {
          const numero = msg.number;
          const label = msg.analisis?.[modoActual]?.label;
          if (!label || !numero) return;
          if (!scores[numero]) {
            if (modoActual === "emocion") {
              scores[numero] = { total: 0 };
              EMOCIONES.forEach(e => { scores[numero][e] = 0; });
            } else {
              scores[numero] = { pos: 0, neg: 0, neu: 0, total: 0 };
            }
          }
          if (modoActual === "emocion") {
            if (scores[numero][label] !== undefined) scores[numero][label]++;
          } else {
            if (label === "POS") scores[numero].pos++;
            else if (label === "NEG") scores[numero].neg++;
            else scores[numero].neu++;
          }
          scores[numero].total++;
        });

        const finalData = Object.entries(scores).map(([numero, vals], i) => {
          const base = { id: i + 1, nombre: numero };
          if (modoActual === "emocion") {
            EMOCIONES.forEach(e => (base[e] = vals[e]));
          } else {
            base.positivos = vals.pos;
            base.negativos = vals.neg;
            base.neutrales = vals.neu;
          }
          base.total = vals.total;
          return base;
        });

        setRankingData(finalData);
      })
      .catch(err => console.error(`Error cargando datos de ${modoActual}:`, err));
  };

  // Efecto principal: carga según el modo o grafo principal
  useEffect(() => {
    if (esGrafoPrincipal) {
      fetchGrafoPrincipal();
      fetchTotales();
    } else {
      fetchGraphData(modo);
      fetchRankingData(modo);
      const intervalo = setInterval(() => fetchRankingData(modo), 1000);
      return () => clearInterval(intervalo);
    }
  }, [modo, esGrafoPrincipal]);

  return (
    <div className="grafos-container">
      <div className="grafos-main-content">
        <div className="grafos-graph-card">
          <h2 className="grafos-card-title">
            {esGrafoPrincipal
              ? "Grafo Principal"
              : `Visualización de comunidades por ${modo}`}
          </h2>
          <div className="grafos-graph-placeholder">
            <div className="grafos-placeholder-content">
              <ForceGraph2D
                graphData={graphData}
                nodeColor={node => node.color}
                nodeLabel={node =>
                  esGrafoPrincipal
                    ? `Número: ${node.id}`
                    : `Número: ${node.id} | ${modo}: ${node[modo]}`
                }
                linkColor={() => "black"}
                linkWidth={1}
                linkCanvasLabel={link => `Peso: ${link.weight}`}
                linkLabel={link => `Peso: ${link.weight}`}
                width={600}
                height={400}
              />
            </div>
          </div>
        </div>

        <div className="grafos-buttons-section">
          <button
            className="grafos-action-button"
            onClick={() => setEsGrafoPrincipal(true)}
          >
            Grafo Principal
          </button>

          <button
            className={`grafos-action-button ${
              !esGrafoPrincipal && modo === "sentimiento" ? "active" : ""
            }`}
            onClick={() => {
              setEsGrafoPrincipal(false);
              setModo("sentimiento");
            }}
          >
            📈 Detección de comunidades en sentimiento
          </button>
          <button
            className={`grafos-action-button ${
              !esGrafoPrincipal && modo === "emocion" ? "active" : ""
            }`}
            onClick={() => {
              setEsGrafoPrincipal(false);
              setModo("emocion");
            }}
          >
            📈 Detección de comunidades en emociones
          </button>
          <button className="grafos-action-button">📈 Análisis de Ironía</button>
          <button className="grafos-action-button">📈 Análisis de Toxicidad</button>
        </div>
      </div>

      {/* Tabla final */}
      <Tabla
        data={rankingData}
        columns={
          esGrafoPrincipal
            ? columnasTotales
            : modo === "emocion"
            ? columnasEmocion
            : columnas
        }
      />
    </div>
  );
}

export default Grafos;
