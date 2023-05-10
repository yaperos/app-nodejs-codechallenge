# App NodeJs Code Challenge

## Description

Solucion al reto técnico

###  Implemented microservices
| Name| Description | 
| --- | --- |
| ms-transaction | api rest que expose el servicio de guardar y detalle de una transaccion, consume el topico de antrifraude |
| ms-antrifraude | consume el topico que produce el ms-transaction donde valida si se acepta o rechaza dicha transaccion|

## Setup
```bash
  docker-compose up
```

## Owners
- Rulman Ferro