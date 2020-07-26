//----- controller set up ------//

//dependencies
require('dotenv').config()
const router = require('express').Router()
const Twitter = require('twitter-lite')
const cors = require('cors')
let jwt = require('jsonwebtoken')
let fs = require('fs')

router.use(cors())



//----- routes ------//

//this route will request a token needed in order to request user authentication
router.get('/twitter', (req, res) => {
    //set up twitter client
    const client = new Twitter({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET
    })
    
    //make request for token
    client
      .getRequestToken(process.env.TWITTER_CALLBACK_URL)
      .then(response => {
            //redirect to authentication url
            // res.redirect(`https://api.twitter.com/oauth/authorize?oauth_token=${response.oauth_token}`)
            // axios.get(`https://api.twitter.com/oauth/authorize?oauth_token=${response.oauth_token}`)
            // .then(response => res.send(response.data))
            // .catch(err => console.log('axios error', err))

            //send back authentication url
            res.send({url: `https://api.twitter.com/oauth/authorize?oauth_token=${response.oauth_token}`})
        }
      )
      .catch(console.error)

})

//once authenticated, user will hit this callback - TRY MAKING THE FRONT END THE CALLBACK SO THE RESPONSE IS GOING THERE?
router.post('/twitter', (req, res) => {

    console.log(req.body)

    const client = new Twitter({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET
    })



    client
        .getAccessToken({
            oauth_verifier: req.body.oauth_verifier,
            oauth_token: req.body.oauth_token
        })
        .then(response => {

            //issue jwt token
            let token = jwt.sign(response, process.env.JWT_SECRET, {
                expiresIn: 60 * 60 * 8
              })
              console.log(token)
              res.send( {token} )
            //or can write to json to be fetched from another route?
              

            //add token to config 
            // res.redirect('http://localhost:3001/')
            // res.send({token})
        })
        .catch(err => console.log(err))

})

//login will check for user token in config, if there and not expired will send back; if expired, will delete
router.get('/twitter/user', (req, res) => {
    console.log('get token from config')
})

//logout will delete token from config
router.get('/twitter/logout', (req, res) => {
    console.log('remove token from config')
})



module.exports = router;