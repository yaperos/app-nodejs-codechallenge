module.exports = (sequelize, DataTypes) => {
    const Transaction = sequelize.define('Transaction', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      amount:{
        type: DataTypes.FLOAT,
        allowNull:false,
      },
      transactionStatus:{
        type: DataTypes.ENUM,
        values: ['PENDING', 'REJECTED', 'APPROVED'],
        defaultValue: 'PENDING',
      },
      tranferTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isIn: [[1, 2]]
        }
      },
      accountExternalIdDebit:{
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      }, 
      accountExternalIdCredit:{
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      createdAt:{
        type:DataTypes.DATE,
        allowNull:false,
        defaultValue: new Date()
      },
      updatedAt:{
        type:DataTypes.DATE,
        allowNull:false,
        defaultValue: new Date()
      }

    });
  
    return Transaction;
  };
  