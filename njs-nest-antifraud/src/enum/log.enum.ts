// Tipo de proceso (
// 0 - Extraccion
// 1 - Muestro
// 2 - Generacion
// 3 - Envio
// 4 - Reproceso
// 5 - Otros)
// 6 - Aprobacion

export enum LogTypeEnum {
  Extraction = 0,
  Sample = 1,
  Generation = 2,
  Send = 3,
  Reprocess = 4,
  Approvement = 5,
  Rejection = 6,
  Others = 7,
}
