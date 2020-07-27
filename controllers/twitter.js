//----- controller set up ------//

//dependencies
require('dotenv').config()
const router = require('express').Router()
const Twitter = require('twitter-lite')


//----- routes ------//

//search for user twitter profiles by name
router.post('/user', (req, res) => {

    const client = new Twitter({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token_key: req.user.oauth_token,
        access_token_secret: req.user.oauth_token_secret
    })

    client
        .get(`users/search`, {
            'q': req.body.q
        })
        .then(results => {
            //send back the top result
            res.send(results[0])
        })
        .catch(err => console.log(err))
})





module.exports = router;