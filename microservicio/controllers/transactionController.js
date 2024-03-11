const Joi = require('joi');
const KafkaService = require('../services/kafka.service');
const TransactionService = require('../services/transaction.service');
const antifraudService = require('../services/antifraud.service');

// Definir el esquema de validación utilizando Joi
const transactionSchema = Joi.object({
  accountexternaliddebit: Joi.string().required().messages({
    'string.empty': 'El campo accountexternaliddebit no puede estar vacío',
    'any.required': 'El campo accountexternaliddebit es requerido'
  }),
  accountexternalidcredit: Joi.string().required().messages({
    'string.empty': 'El campo accountexternalidcredit no puede estar vacío',
    'any.required': 'El campo accountexternalidcredit es requerido'
  }),
  transferenciatypeid: Joi.number().required().messages({
    'number.base': 'El campo transferenciatypeid debe ser un número',
    'any.required': 'El campo transferenciatypeid es requerido'
  }),
  valor: Joi.number().required().max(1000).messages({
    'number.base': 'El campo valor debe ser un número',
    'number.max': 'El valor de la transacción debe ser igual o inferior a 1000',
    'any.required': 'El campo valor es requerido'
  })
});

// Función para validar los datos de entrada
const validateTransactionData = (data) => {
  return transactionSchema.validate(data, { abortEarly: false });
};
exports.createTransaction = async (req, res) => {
  try {

    // Validar los datos de entrada
    const { error, value } = validateTransactionData(req.body);

    if (error) {
      const errorMessage = error.details.map(detail => detail.message);
      return res.status(400).json({ message: errorMessage });
    }

    // Crear la transacción en la base de datos
    const { accountexternaliddebit, accountexternalidcredit, transferenciatypeid, valor } = value;
   
    // Validar el valor de la transacción con el servicio antifraude
    const estado = await antifraudService.validateTransaction({ valor });

    // Establecer el estado inicial como "pendiente"
    const estadoInicial = 'pendiente';

    // Crear la transacción en la base de datos
    const transaction = await TransactionService.createTransaction({
      accountexternaliddebit,
      accountexternalidcredit,
      transferenciatypeid,
      valor,
      estado: estadoInicial // Estado inicial como "pendiente"
    });

    // Registrar la transacción en los logs
    console.log('Transacción creada exitosamente:', transaction);


    // Enviar mensaje a un tema de Kafka
    await KafkaService.sendToTopic('nombre_del_tema', JSON.stringify(transaction));

    return res.status(201).json(transaction);
  } catch (error) {
    console.error('Error al procesar la transacción:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Endpoint para obtener una transacción por ID
exports.getTransaction = async (req, res) => {
  try {
    const transaction = await TransactionService.getTransactionById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    return res.status(200).json(transaction);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Endpoint para actualizar el estado de una transacción
exports.updateTransactionState = async (req, res) => {
  try {
    const { id } = req.params;
    const { newState } = req.body; // Supongamos que el nuevo estado se envía en el cuerpo de la solicitud
    console.log(`Actualizando estado de transacción para ID ${id} a ${newState}`);

    // Encuentra la transacción por su ID y actualiza el estado
    const transaction = await TransactionService.updateTransactionState(id, newState);

     // enviar el nuevo estado a Kafka
    await KafkaService.sendToTopic('topic_estado_transaccion', JSON.stringify({
     transactionId: id,
     newState: newState
   }));

   return res.status(200).json(transaction);
  } catch (error) {
    console.error('Error al actualizar el estado de la transacción:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};
