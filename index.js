//---- server set up ------//

// dependencies
let express = require('express')
require('dotenv').config()
let cors = require('cors')
let morgan = require('morgan')
let rowdyLogger = require('rowdy-logger')
let expressJwt = require('express-jwt')

// instantiate app and logger
let app = express()
let rowdyResults = rowdyLogger.begin(app)

// middleware
app.use(morgan('dev'))
app.use(cors())
app.use(express.urlencoded({extended: false}))
app.use(express.json())

//---- routes ------//

//require controllers
app.use('/auth', require('./controllers/auth'))
app.use('/twitter',  expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256']
}), require('./controllers/twitter'))

//home route
app.get('/', (req, res) => {
  res.status(200).send({ message: 'Server Connected' })
})

//catch-all route
app.get('*', (req, res) => {
  res.status(404).send({ message: 'Not Found' })
})

app.listen(process.env.PORT || 3000, () => {
  rowdyResults.print()
})