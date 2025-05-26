from sklearn.cluster import KMeans
import numpy as np
from collections import defaultdict
from itertools import combinations
import networkx as nx
import requests

def construir_grafo_con_kmeans_sentimientos(sentimiento_filtrado=None, n_clusters=3):
    response = requests.get("http://localhost:3200/api/messages/obtener")
    mensajes = response.json()

    G = nx.Graph()
    sentimiento_por_emisor = defaultdict(list)

    # Agrupar sentimientos por emisor
    for mensaje in mensajes:
        emisor = mensaje.get("number")
        sentimiento = mensaje.get("analisis", {}).get("sentimiento", {}).get("label", "NEU")
        if emisor:
            sentimiento_por_emisor[emisor].append(sentimiento)

    emisores = set(sentimiento_por_emisor.keys())
    mapa_color = {"POS": "green", "NEG": "red", "NEU": "gray"}

    vectores = []
    emisores_filtrados = []

    # Construir vectores [POS, NEG, NEU] normalizados
    for emisor, sentimientos in sentimiento_por_emisor.items():
        total = len(sentimientos)
        if total == 0:
            continue
        pos = sentimientos.count("POS") / total
        neg = sentimientos.count("NEG") / total
        neu = sentimientos.count("NEU") / total
        vectores.append([pos, neg, neu])
        emisores_filtrados.append(emisor)

    # Aplicar K-Means sobre los vectores
    kmeans = KMeans(n_clusters=n_clusters, random_state=42)
    grupos = kmeans.fit_predict(np.array(vectores))

    # Agregar nodos con atributos
    for i, emisor in enumerate(emisores_filtrados):
        sentimientos = sentimiento_por_emisor[emisor]
        sentimiento_dominante = max(set(sentimientos), key=sentimientos.count)
        color = mapa_color.get(sentimiento_dominante, "gray")
        G.add_node(emisor,
                   sentimiento=sentimiento_dominante,
                   color=color,
                   grupo_kmeans=int(grupos[i]))

    # Agregar aristas ponderadas
    for a, b in combinations(emisores_filtrados, 2):
        G.add_edge(a, b, weight=0)

    for mensaje in mensajes:
        emisor = mensaje.get("number")
        sentimiento = mensaje.get("analisis", {}).get("sentimiento", {}).get("label", "NEU")
        if not emisor or emisor not in emisores_filtrados:
            continue

        if sentimiento_filtrado and sentimiento != sentimiento_filtrado:
            continue

        for otro in emisores_filtrados:
            if otro != emisor and G.has_edge(emisor, otro):
                G[emisor][otro]["weight"] += 1

    G.remove_edges_from([(u, v) for u, v, d in G.edges(data=True) if d["weight"] == 0])

    # Formato JSON exportable para frontend
    data = {
        "nodes": [
            {
                "id": n,
                "sentimiento": d["sentimiento"],
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
