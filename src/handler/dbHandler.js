const mongoose = require('mongoose');

const DBUrl = process.env.DBUrl

const dbConnect = () => {
    mongoose.connect(DBUrl)
        .then(() => { console.log('Connected to MongoDB') })
        .catch((error) => console.log(error, 'Error ocurred connecting to MongoDB'));
}

module.exports = { dbConnect }