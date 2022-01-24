const mongoose = require('mongoose');
const {
    dbHost,
    dbName,
    dbPort,
    dbUser,
    dbPass
} = require('../app/config');

// Connect to Cloud Mongo
// mongoose.connect(`mongodb+srv://${dbUser}:${dbPass}@${dbHost}/${dbName}?retryWrites=true&w=majority`, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// }).then(client => {
//     console.log('Server database connected!')
// }).catch(error => console.error(error));

// Connect to Localhost Mongo
mongoose.connect(`mongodb://${dbHost}:${dbPort}/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(client => {
    console.log('Server database connected!')
}).catch(error => console.error(error));

const db = mongoose.connection;

module.exports = db;