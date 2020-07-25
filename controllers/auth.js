//----- controller set up ------//

//dependencies
require('dotenv').config()
const router = require('express').Router()
const Twitter = require('twitter-lite')
const axios = require('axios')
const cors = require('cors')

router.use(cors())



//----- routes ------//

//this route will be hit by the "sign in with twitter" button on the front end
router.get('/twitter', (req, res) => {
    //set up twitter client
    const client = new Twitter({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET
    })
    
    //make request for token
    client
      .getRequestToken("http://localhost:3000/auth/twitter/callback")
      .then(response => {
            //redirect to authentication url
            res.redirect(`https://api.twitter.com/oauth/authorize?oauth_token=${response.oauth_token}`)
            // axios.get(`https://api.twitter.com/oauth/authorize?oauth_token=${response.oauth_token}`)
            // .then(response => res.send(response.data))
            // .catch(err => console.log('axios error', err))

            //send back authentication url
            // res.send({url: `https://api.twitter.com/oauth/authorize?oauth_token=${response.oauth_token}`})
        }
      )
      .catch(console.error)

})

//once authenticated, user will hit this callback
router.get('/twitter/callback', (req, res) => {
    const client = new Twitter({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET
    })

    console.log('REQQUERY', req.query)

    client
        .getAccessToken({
            oauth_verifier: req.query.oauth_verifier,
            oauth_token: req.query.oauth_token
        })
        .then(response => {
            let user = {
                accTkn: response.oauth_token,
                accTknSecret: response.oauth_token_secret,
                userId: response.user_id,
                screenName: response.screen_name
                }

            res.redirect('http://localhost:3001')
        })
        .catch(err => console.log(err))

})
 

module.exports = router;