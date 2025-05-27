import numpy as np
from collections import Counter
import requests
def obtener_usuarios_ausentes():
    response = requests.get("http://localhost:3200/api/messages/obtener")
    mensajes = response.json()

    # Contar mensajes por número
    conteo = Counter()
    for mensaje in mensajes:
        numero = mensaje.get("number")
        if numero:
            conteo[numero] += 1

    if not conteo:
        return []

    # Ordenamos y sacamos los valores de mensajes enviados
    cantidades = np.array(list(conteo.values()))

    # Calcular el primer cuartil
    q1 = np.percentile(cantidades, 25)

    # Filtrar usuarios que estén por debajo del Q1
    ausentes = [numero for numero, cant in conteo.items() if cant < q1]

    return ausentes
