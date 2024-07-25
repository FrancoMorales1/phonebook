const mongoose = require('mongoose')
const process = require('node:process')

const connectionString = process.env.MONGO_DB_URI

mongoose
    .connect(connectionString)
    .then(() => {
        console.log('Database Connected')
    })
    .catch((err) => {
        console.error(err)
    })
