const express = require('express')
const app = express()
const port = 3000
const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')

// API: 5 star canned dog food
app.get('/five-star-cans', function (req, res) {
  axios.get('https://www.dogfoodadvisor.com/dog-food-reviews/wet/5-star/')
    .then((response) => {
      if(response.status === 200) {
      const html = response.data
        const $ = cheerio.load(html)
        const title = $('.entry-title').text()
        let dogFoodList = []
        $('.listing-shortcode-output > li').each(function(i, elem) {
          dogFoodList[i] = {
            title: $(this).find('a').text().trim(),
            url: $(this).find('a').attr('href')
          }
        })
        res.send({ title: title, dogFoodList: dogFoodList })
      }
    },
    (error) => console.log(err)
  )
})

// Express server
app.get('/', (req, res) => res.send('Hello Doggo!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))


// don't want tubs
// .filter(function(n){ return n.toLowerCase().indexOf("tubs") === -1 })
