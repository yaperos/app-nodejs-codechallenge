const mongoose = require('mongoose');
const { getMessage } = require('../helpers/messages');

const dbConnection = async() => {

    try {

        await mongoose.connect(process.env.DB_CONN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log(getMessage('msgConnBD'));

    } catch (error) {

        console.log(error);
        throw new Error(getMessage('msgErrorBD'));
    }
}

module.exports = {
    dbConnection
}