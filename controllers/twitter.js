//----- controller set up ------//

//dependencies
require('dotenv').config()
const router = require('express').Router()
const Twitter = require('twitter-lite')
const cors = require('cors')

router.use(cors())



//----- routes ------//

//search for user
router.get('/user', (req, res) => {

    console.log('🌈req.user', req.user)

    const client = new Twitter({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token_key: req.user.oauth_token,
        access_token_secret: req.user.oauth_token_secret
    })

    client
        .get(`users/search`, {
            'q': 'chris+cassidy+nasa'
        })
        .then(results => {
            console.log('TWITTER USER SEARCH RESULTS 🌈', results)
        })
        .catch(err => console.log(err))
})






module.exports = router;