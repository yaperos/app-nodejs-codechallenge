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

    // Validar el valor de la transacción con el servicio antifraude
    const estado = await antifraudService.validateTransaction({ valor });

    // Crear la transacción en la base de datos
    const transaction = await TransactionService.createTransaction({
      accountexternaliddebit,
      accountexternalidcredit,
      transferenciatypeid,
      valor,
      estado
    });

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

    // Encuentra la transacción por su ID y actualiza el estado
    const transaction = await TransactionService.updateTransactionState(id, newState);

     //Si necesitas enviar el nuevo estado a Kafka
    await KafkaService.sendToTopic('topic_estado_transaccion', JSON.stringify({
     transactionId: id,
     newState: newState
   }));

    return res.status(200).json(transaction);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
