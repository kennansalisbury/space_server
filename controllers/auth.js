//----- controller set up ------//

//dependencies
require('dotenv').config()
const router = require('express').Router()
const Twitter = require('twitter-lite')
let jwt = require('jsonwebtoken')


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

            //send back authentication url
            res.send({url: `https://api.twitter.com/oauth/authorize?oauth_token=${response.oauth_token}`})
        }
      )
      .catch(console.error)

})

//once authenticated, user will hit this callback - TRY MAKING THE FRONT END THE CALLBACK SO THE RESPONSE IS GOING THERE?
router.post('/twitter', (req, res) => {

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

                    //issue jwt token/send to front end
                    let token = jwt.sign(userData, process.env.JWT_SECRET, {
                        expiresIn: 60 * 60
                    })
                    res.send( {token} ) 
                })
                .catch(err => console.log(err))
        })
        .catch(err => console.log(err))

})

module.exports = router;