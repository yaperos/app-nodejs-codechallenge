// antifraudService.js

// Servicio encargado de validar transacciones para prevenir fraudes
const antifraudService = {
  /**
   * Valida una transacción y determina si debe ser aprobada o rechazada.
   * @param {object} transactionData - Los datos de la transacción a validar.
   * @returns {string} - El estado de la transacción ('aprobado' o 'rechazado').
   * @throws {Error} - Si ocurre un error durante la validación.
   */
  validateTransaction: async (transactionData) => {
    try {
      // Implementa la lógica de validación de la transacción

      // Verifica si el valor de la transacción es mayor a $1000 para rechazarla
      if (transactionData.valor > 1000) {
        return 'rechazado'; // La transacción se rechaza si el valor es alto
      } else {
        return 'aprobado'; // La transacción se aprueba si el valor es aceptable
      }
    } catch (error) {
      console.error('Error al validar la transacción:', error);
      throw new Error('Error al validar la transacción');
    }
  },

  // Otras funciones de antifraude, si es necesario
};

// Exporta el servicio antifraude para que pueda ser utilizado en otras partes de la aplicación
module.exports = antifraudService;
