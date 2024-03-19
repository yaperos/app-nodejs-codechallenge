import {TransferTypeModel} from "../models/TransferType";

// Definir una función para inicializar los valores de TransferType
export async function initializeTransferTypes() {
    try {
      // Verificar si ya existen registros en la tabla TransferType
      const existingTransferTypes = await TransferTypeModel.find();
      if (existingTransferTypes.length === 0) {
        // Si no hay registros, inicializar los valores "Debit" y "Credit"
        await TransferTypeModel.create({ name: 'Debit' });
        await TransferTypeModel.create({ name: 'Credit' });
        console.log('Valores de TransferType inicializados exitosamente.');
      } else {
        console.log('La tabla TransferType ya contiene registros.');
      }
    } catch (error) {
      console.error('Error al inicializar valores de TransferType:', error);
    }
}
