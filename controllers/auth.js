//----- controller set up ------//

//dependencies
require('dotenv').config()
const router = require('express').Router()
const Twitter = require('twitter-lite')
let jwt = require('jsonwebtoken')


//----- routes ------//

//this route will request a token from twitter that is needed in order to request user authentication
router.get('/twitter', (req, res) => {
    
    //initiate new twitter-lite client
    const client = new Twitter({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET
    })
    
    //make request for token
    client
      .getRequestToken(process.env.TWITTER_CALLBACK_URL)
      .then(response => {
            //send back authentication url to front end with token included
            res.send({url: `https://api.twitter.com/oauth/authorize?oauth_token=${response.oauth_token}`})
        }
      )
      .catch(console.error)

})

//once authenticated, user will be redirected to "/authorizing" on the front end 
    //a post request will then be made to this route, providing the token and verifier needed to complete authentication
router.post('/twitter', (req, res) => {
    
    //initiate new twitter-lite client
    const client = new Twitter({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET
    })

    //make request for final user token
    client
        .getAccessToken({
            oauth_verifier: req.body.oauth_verifier,
            oauth_token: req.body.oauth_token
        })
        .then(response => {

            //use received user tokens to then request full user profile information to send to front end
            const userClient = new Twitter({
                consumer_key: process.env.TWITTER_CONSUMER_KEY,
                consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
                access_token_key: response.oauth_token,
                access_token_secret: response.oauth_token_secret
            })

            userClient
                .get("account/verify_credentials")
                .then(results => {
                    let userData = {
                        id: results.id,
                        name: results.name,
                        screen_name: results.screen_name,
                        location: results.location,
                        description: results.description,
                        followers_count: results.followers_count,
                        friends_count: results.friends_count,
                        profile_background_color: results.profile_background_color,
                        profile_image_url: results.profile_image_url,
                        oauth_token: response.oauth_token,
                        oauth_token_secret: response.oauth_token_secret
                    }

                    //issue jwt token
                    let token = jwt.sign(userData, process.env.JWT_SECRET, {
                        expiresIn: 60 * 15 //token expires in 15 minutes
                    })

                    //send jwt token to front end
                    res.send( {token} ) 
                })
                .catch(err => console.log(err))
        })
        .catch(err => console.log(err))

})

module.exports = router;