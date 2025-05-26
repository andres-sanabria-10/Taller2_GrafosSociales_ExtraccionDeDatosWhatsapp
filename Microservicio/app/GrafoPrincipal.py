import networkx as nx
import requests
import random
from itertools import combinations

PALETA_COLORES = [
    "red", "blue", "green", "orange", "purple", "teal", "pink", "brown", "gold", "lime",
    "navy", "orchid", "slateblue", "cadetblue", "crimson", "deeppink", "coral"
]

def construir_grafo_sin_emociones():
    response = requests.get("http://localhost:3200/api/messages/obtener")
    mensajes = response.json()

    G = nx.Graph()
    emisores = set()

    # Recopilar emisores únicos
    for mensaje in mensajes:
        emisor = mensaje.get("number")
        if emisor:
            emisores.add(emisor)

    emisores = list(emisores)

    # Asignar un color único a cada nodo
    for i, emisor in enumerate(emisores):
        color = PALETA_COLORES[i % len(PALETA_COLORES)]
        G.add_node(emisor, color=color)

    # Crear todas las aristas posibles con peso 0
    for a, b in combinations(emisores, 2):
        G.add_edge(a, b, weight=0)

    # Incrementar peso por coocurrencia (similar a emociones)
    for mensaje in mensajes:
        emisor = mensaje.get("number")
        if not emisor or emisor not in emisores:
            continue

        for otro in emisores:
            if otro != emisor and G.has_edge(emisor, otro):
                G[emisor][otro]["weight"] += 1

    # Opcional: eliminar aristas sin peso (para limpiar el grafo)
    G.remove_edges_from([(u, v) for u, v, d in G.edges(data=True) if d["weight"] == 0])

    # Exportar
    data = {
        "nodes": [
            {
                "id": n,
                "color": d["color"]
            }
            for n, d in G.nodes(data=True)
        ],
        "links": [
            {"source": u, "target": v, "weight": d["weight"]}
            for u, v, d in G.edges(data=True)
        ]
    }

    return data
