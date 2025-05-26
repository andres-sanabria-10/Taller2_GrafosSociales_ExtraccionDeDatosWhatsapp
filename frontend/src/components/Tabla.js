import React from "react";

function Tabla({ data, columns }) {
  return (
    <div className="grafos-table-card">
      <div className="grafos-table-header">
        <h2 className="grafos-card-title">Datos Tabulares</h2>
      </div>
      <div className="grafos-table-container">
        <table className="grafos-data-table">
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col.accessor}>{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                {columns.map(col => (
                  <td key={col.accessor}>{row[col.accessor]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


export default Tabla;
