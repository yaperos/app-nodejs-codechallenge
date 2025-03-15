import { z } from 'zod';

export const CreateTransactionDTO = z.object({
  accountExternalIdDebit: z
    .string({
      required_error: "El campo 'accountExternalIdDebit' es obligatorio",
      invalid_type_error: "El campo 'accountExternalIdDebit' debe ser una cadena de texto"
    })
    .min(5, "El campo 'accountExternalIdDebit' debe tener al menos 5 caracteres"),

  accountExternalIdCredit: z
    .string({
      required_error: "El campo 'accountExternalIdCredit' es obligatorio",
      invalid_type_error: "El campo 'accountExternalIdCredit' debe ser una cadena de texto"
    })
    .min(5, "El campo 'accountExternalIdCredit' debe tener al menos 5 caracteres"),

  tranferTypeId: z
    .number({
      required_error: "El campo 'tranferTypeId' es obligatorio",
      invalid_type_error: "El campo 'tranferTypeId' debe ser un número"
    })
    .int("El campo 'tranferTypeId' debe ser un número entero")
    .positive("El campo 'tranferTypeId' debe ser un número positivo"),

  value: z
    .number({
      required_error: "El campo 'value' es obligatorio",
      invalid_type_error: "El campo 'value' debe ser un número"
    })
    .positive("El monto de la transacción debe ser mayor que cero")
    .max(100000, "El monto de la transacción no puede superar los 100,000"),
});
