const morgan = require('morgan')

morgan.token('body', (req) => {
    return JSON.stringify(req.body)
})

module.exports = morgan(':method :url :response-time :body')
