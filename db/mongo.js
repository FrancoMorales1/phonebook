const mongoose = require('mongoose')

const connectionString = 'mongodb+srv://fullstack:fullstack@cluster0.1myvcm0.mongodb.net/franbd?retryWrites=true&w=majority&appName=Cluster0'

mongoose
    .connect(connectionString)
    .then(() => {
        console.log('Database Connected')
    })
    .catch((err) => {
        console.error(err)
    })
