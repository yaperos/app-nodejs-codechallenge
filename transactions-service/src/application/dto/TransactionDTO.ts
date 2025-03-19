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
});

export const LoginUserDTO = z.object ({
    username: z.string()
      .min(1, "El username es obligatorio")
      .regex(/^\S+$/, "El username no puede contener espacios"),
      password: z.string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .regex(/[A-Z]/, "La contraseña debe contener al menos una mayúscula")
      .regex(/\d/, "La contraseña debe contener al menos un número")
      .regex(/[\W_]/, "La contraseña debe contener al menos un carácter especial")
  });
