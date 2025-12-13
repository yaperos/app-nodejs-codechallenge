# Resumen de Implementación

## Arquitectura General
- Se implementaron dos microservicios: **transaction-service** y **anti-fraud-service**.
- Ambos servicios se orquestan y despliegan usando **Docker Compose** en contenedores separados.
- Antes de iniciar cada microservicio, se ejecutan automáticamente los tests unitarios; si algún test falla, el servicio no se inicia.
- Se utiliza **PostgreSQL** como base de datos y **Kafka** para mensajería entre microservicios.

## Stack Tecnológico
- **Node.js 20**
- **TypeScript**
- **TypeORM** para acceso a base de datos
- **KafkaJS** para integración con Kafka
- **Jest** para pruebas unitarias
- **Altair** para pruebas manuales de endpoints GraphQL
- **JMeter** para pruebas de carga
- **PostgreSQL** como base de datos relacional
- **Docker Compose** para orquestación de servicios

## transaction-service
- Expone una API **GraphQL** para gestionar transacciones.
- Implementa **queries** y **mutations** en GraphQL, con sus respectivos **resolvers**.
- Utiliza **TypeORM** para persistencia de datos en PostgreSQL.
- Publica eventos a Kafka cuando se crea o actualiza una transacción.
- Implementa pruebas unitarias para los servicios principales y resolvers.

## anti-fraud-service
- Consume eventos de Kafka sobre transacciones creadas.
- Aplica lógica antifraude: rechaza transacciones mayores a $1000.
- Publica el resultado (aprobado/rechazado) en un topic de Kafka.
- Utiliza el enum `TransactionStatusName` para tipar los estados válidos.
- Implementa pruebas unitarias para la lógica de mensajería y antifraude.

## Mensajería y Comunicación
- **Kafka** se usa para comunicar ambos microservicios de forma desacoplada.
- Los eventos de transacción y de estado se envían y consumen por topics dedicados.


## Principios SOLID
- La arquitectura y los servicios de ambos microservicios fueron diseñados aplicando los principios SOLID:
	- **Responsabilidad Única:** Cada clase y módulo tiene una única responsabilidad clara (servicios de dominio, eventos, mensajería).
	- **Abierto/Cerrado:** Los servicios pueden extenderse sin modificar su código base.
	- **Sustitución de Liskov:** Las clases pueden ser extendidas sin romper contratos.
	- **Segregación de Interfaces:** Las interfaces y servicios son específicos y no fuerzan métodos innecesarios.
	- **Inversión de Dependencias:** Se favorece la separación de dependencias, permitiendo mayor mantenibilidad y testeo.

## Monitoreo
- Se integró **Kafdrop** para monitorear topics y mensajes de Kafka desde una interfaz web.


## Pruebas de rendimiento por tipo de operación

### 1. Consultas (queries GraphQL)

| Escenario                | Hilos | Peticiones totales | Tiempo promedio (ms) | Máx (ms) | % Error | Rendimiento (req/seg) |
|--------------------------|-------|--------------------|----------------------|----------|---------|----------------------|
| Carga moderada           | 10    | 200                | 4                    | 55       | 0%      | 224                  |
| Carga alta               | 100   | 2,000              | 130                  | 527      | 0%      | 579                  |
| Carga extrema            | 1,000 | 20,000             | 959                  | 7,046    | 0%      | 861                  |

- Las consultas presentan tiempos de respuesta muy bajos y alta eficiencia incluso bajo concurrencia extrema, lo que demuestra que la arquitectura es eficiente para operaciones de lectura.

### 2. Operaciones transaccionales (mutation de creación de transacción)

| Hilos | Peticiones totales | Tiempo promedio (ms) | Mediana (ms) | Máx (ms) | % Error | Rendimiento (req/seg) |
|-------|--------------------|----------------------|--------------|----------|---------|----------------------|
| 10    | 200                | 1,167                | 1,327        | 7,284    | 0%      | 8.4                  |

- La creación de transacciones es exitosa y robusta (0% error), aunque el tiempo promedio es mayor debido a la lógica de negocio, escritura en base de datos y eventos Kafka.
- El rendimiento es adecuado para pruebas locales y puede optimizarse aún más en ambientes productivos.

**Conclusión:**
- El sistema es eficiente y robusto tanto para consultas como para operaciones transaccionales, manteniendo estabilidad y sin errores bajo diferentes escenarios de carga.

Se eligió una arquitectura basada en microservicios, PostgreSQL y Kafka, probada con JMeter bajo escenarios de alta concurrencia. Esto garantiza que la solución puede manejar grandes volúmenes de lecturas y escrituras simultáneas, cumpliendo con los requisitos de robustez y escalabilidad para ambientes bancarios.

> Nota: Todos los resultados fueron obtenidos en un ambiente local de desarrollo. A pesar de ello, los indicadores de rendimiento y concurrencia son muy positivos. Con ajustes de configuración, escalabilidad y una infraestructura adecuada en un entorno productivo, la aplicación puede alcanzar o superar los estándares de rendimiento requeridos para sistemas bancarios tanto en operaciones transaccionales como de consulta.