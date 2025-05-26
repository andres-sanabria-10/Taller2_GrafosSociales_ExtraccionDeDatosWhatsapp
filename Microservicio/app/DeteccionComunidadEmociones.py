from sklearn.cluster import KMeans
import numpy as np
from collections import defaultdict
from itertools import combinations
import networkx as nx
import requests

COLOR_EMOCIONES = {
    "admiration": "lavender",
    "amusement": "lightcoral",
    "anger": "red",
    "annoyance": "orangered",
    "approval": "lightgreen",
    "caring": "lightpink",
    "confusion": "teal",
    "curiosity": "lightseagreen",
    "desire": "deeppink",
    "disappointment": "slateblue",
    "disapproval": "darkred",
    "disgust": "brown",
    "embarrassment": "orchid",
    "excitement": "gold",
    "fear": "purple",
    "gratitude": "olive",
    "grief": "midnightblue",
    "joy": "yellow",
    "love": "pink",
    "nervousness": "navy",
    "optimism": "lime",
    "pride": "violet",
    "realization": "cadetblue",
    "relief": "lightblue",
    "remorse": "sienna",
    "sadness": "blue",
    "surprise": "orange",
    "neutral": "gray"
}


def construir_grafo_con_kmeans_emociones(emocion_filtrada=None, n_clusters=3):
    response = requests.get("http://localhost:3200/api/messages/obtener")
    mensajes = response.json()

    G = nx.Graph()
    emocion_por_emisor = defaultdict(list)

    # Agrupar emociones por emisor
    for mensaje in mensajes:
        emisor = mensaje.get("number")
        emocion = mensaje.get("analisis", {}).get("emocion", {}).get("label", "confusion")
        if emisor:
            emocion_por_emisor[emisor].append(emocion)

    emisores = set(emocion_por_emisor.keys())
    todas_emociones = list(COLOR_EMOCIONES.keys())

    vectores = []
    emisores_filtrados = []

    # Construir vectores de emociones normalizados por emisor
    for emisor, emociones in emocion_por_emisor.items():
        total = len(emociones)
        if total == 0:
            continue
        vector = [emociones.count(e) / total for e in todas_emociones]
        vectores.append(vector)
        emisores_filtrados.append(emisor)

    # Aplicar K-Means
    kmeans = KMeans(n_clusters=n_clusters, random_state=42)
    grupos = kmeans.fit_predict(np.array(vectores))

    # Agregar nodos con atributos
    for i, emisor in enumerate(emisores_filtrados):
        emociones = emocion_por_emisor[emisor]
        emocion_dominante = max(set(emociones), key=emociones.count)
        color = COLOR_EMOCIONES.get(emocion_dominante, "gray")
        G.add_node(emisor,
                   emocion=emocion_dominante,
                   color=color,
                   grupo_kmeans=int(grupos[i]))

    # Agregar aristas con peso inicial 0
    for a, b in combinations(emisores_filtrados, 2):
        G.add_edge(a, b, weight=0)

    # Aumentar peso de las aristas por coocurrencia
    for mensaje in mensajes:
        emisor = mensaje.get("number")
        emocion = mensaje.get("analisis", {}).get("emocion", {}).get("label", "confusion")
        if not emisor or emisor not in emisores_filtrados:
            continue

        if emocion_filtrada and emocion != emocion_filtrada:
            continue

        for otro in emisores_filtrados:
            if otro != emisor and G.has_edge(emisor, otro):
                G[emisor][otro]["weight"] += 1

    # Eliminar aristas sin peso
    G.remove_edges_from([(u, v) for u, v, d in G.edges(data=True) if d["weight"] == 0])

    # Exportar en formato JSON
    data = {
        "nodes": [
            {
                "id": n,
                "emocion": d["emocion"],
                "color": d["color"],
                "grupo_kmeans": d["grupo_kmeans"]
            }
            for n, d in G.nodes(data=True)
        ],
        "links": [
            {"source": u, "target": v, "weight": d["weight"]}
            for u, v, d in G.edges(data=True)
        ]
    }

    return data
