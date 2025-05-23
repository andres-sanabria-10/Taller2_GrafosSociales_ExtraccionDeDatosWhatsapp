import React from "react";
import "./Grafo.css";

function Grafos() {
  // Datos de ejemplo para la tabla
  const tableData = Array.from({ length: 20 }).map((_, i) => ({
    id: i + 1,
    nombre: `Elemento ${i + 1}`,
    valor: Math.floor(Math.random() * 1000),
    estado: ["Activo", "Pendiente", "Completado"][Math.floor(Math.random() * 3)],
    fecha: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleDateString(),
  }));

  return (
    <div className="grafos-container">
      <div className="grafos-main-content">
        {/* Área principal para el grafo */}
        <div className="grafos-graph-card">
          <h2 className="grafos-card-title">Visualización de Datos</h2>
          <div className="grafos-graph-placeholder">
            <div className="grafos-placeholder-content">
              <div className="grafos-placeholder-icon">📊</div>
              <p>Área para el grafo</p>
            </div>
          </div>
        </div>

        {/* Sección de botones a la derecha con margen */}
        <div className="grafos-buttons-section">
          <button className="grafos-action-button">📊 Gráfico de Barras</button>
          <button className="grafos-action-button">📈 Gráfico Lineal</button>
          <button className="grafos-action-button">🥧 Gráfico Circular</button>
          <button className="grafos-action-button">🔍 Filtrar Datos</button>
          <button className="grafos-action-button">⬇️ Exportar</button>
          <button className="grafos-action-button">📤 Compartir</button>
          <button className="grafos-action-button">⚙️ Configuración</button>
        </div>
      </div>

      {/* Tabla con scroll en la parte inferior */}
      <div className="grafos-table-card">
        <div className="grafos-table-header">
          <h2 className="grafos-card-title">Datos Tabulares</h2>
        </div>
        <div className="grafos-table-container">
          <table className="grafos-data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Valor</th>
                <th>Estado</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.nombre}</td>
                  <td>{row.valor}</td>
                  <td>{row.estado}</td>
                  <td>{row.fecha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Grafos;
