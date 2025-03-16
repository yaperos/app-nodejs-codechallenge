import { Request, Response, NextFunction } from 'express';
import { createLogger } from '../../../config/LogService';

const LogService = createLogger('TRX');

// Clase base de error personalizada
class AppError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

/*  Clases específicas de errores */
class NotFoundError extends AppError {
  constructor(message = "APP => Recurso no encontrado") {
    super(message, 404);
  }
}

class ValidationError extends AppError {
  constructor(message = "APP => Error de validación") {
    super(message, 400);
  }
}

class BadRequestError extends AppError {
  constructor(message = "APP => Solicitud incorrecta") {
    super(message, 400);
  }
}

class DatabaseError extends AppError {
  constructor(message = "DB => Error al guardar en DB") {
    super(message, 500); 
  }
}

class RateLimitError extends AppError {
  constructor(message = "APP => Has excedido el límite de solicitudes. Intenta más tarde.") {
    super(message, 429); 
  }
}

// Middleware de manejo de errores global
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Error interno del servidor";
  
  // Registro del error en el sistema de logs
  LogService.error(`[ERROR] ${message}`);

  res.status(statusCode).json({ error: message });
};

export { 
  AppError,
  NotFoundError,
  ValidationError,
  BadRequestError,
  DatabaseError,
  RateLimitError,
  errorHandler 
};
