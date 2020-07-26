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
app.use(express.urlencoded({extended: false})) // Accept data from form
app.use(express.json()) // Accept data from AJAX call
// app.use(session({
//   cookieName: 'session',
//   secret: process.env.SESSION_SECRET,
//   duration: 30 * 60 * 1000,
//   activeDuration: 5 * 60 * 1000,
// }));


//---- routes ------//

//require auth controller
app.use('/auth', require('./controllers/auth'))
app.use('/twitter',  expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256']
}), require('./controllers/twitter'))

//catch-all route
app.get('*', (req, res) => {
  res.status(404).send({ message: 'Not Found' })
})

//
app.listen(process.env.PORT || 3000, () => {
  rowdyResults.print()
})