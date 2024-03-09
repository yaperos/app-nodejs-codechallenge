const KafkaService = require('../services/kafka.service');
const TransactionService = require('../services/transaction.service');
const antifraudService = require('../services/antifraud.service');

exports.createTransaction = async (req, res) => {
  try {
    // Extraer datos del cuerpo de la solicitud
    const { accountexternaliddebit, accountexternalidcredit, transferenciatypeid, valor } = req.body;

    // Verificar la presencia y validez de los campos requeridos
    if (!accountexternaliddebit || !accountexternalidcredit || !transferenciatypeid || !valor) {
      return res.status(400).json({ message: 'Todos los campos son requeridos: accountexternaliddebit, accountexternalidcredit, transferenciatypeid, valor' });
    }

    // Validar el valor de la transacción
    if (valor > 1000) {
      // Rechazar transacciones con valor superior a 1000
      return res.status(400).json({ message: 'El valor de la transacción debe ser igual o inferior a 1000' });
    }


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
    console.error(error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

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
