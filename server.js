/*
  * Scraping: https://dev.to/aurelkurtula/introduction-to-web-scraping-with-nodejs-9h2
  * Axios: https://laracasts.com/discuss/channels/vue/for-loop-and-axios and https://github.com/axios/axios
*/
const express = require('express')
const app = express()
const port = 3000
const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')

// API: 5 star canned dog food
app.get('/five-star-cans', function (req, res) {
  let dogFoodDB = []
  axios.get('https://www.dogfoodadvisor.com/dog-food-reviews/wet/5-star/')
    .then((response) => {
      if (response.status === 200) {
        const htmlAll = response.data
        const $ = cheerio.load(htmlAll)
        const titleAll = $('.entry-title').text()
        let dogFoodList = []
        $('.listing-shortcode-output > li').each(function(i, elem) {
          dogFoodList[i] = {
            name: $(this).find('a').text().trim(),
            url: $(this).find('a').attr('href')
          }
        })
        return dogFoodList
      }
    }, (error) => console.log(error) )
    .then((response) => {
      let promises = []

      response.forEach(function(brand){
        promises.push(axios.get(brand.url))
      })

      axios.all(promises)
        .then((results) => {
          results.forEach((response) => {
            const html = response.data
            const $ = cheerio.load(html)
            const title = $('.entry-title').text()
            // let dogFoodBrands = []
            $('div.entry-content > ul > li').each(function(i, elem) {
              dogFoodDB.push({
                brandName: title,
                productName: $(this).text().trim(),
                url: response.config.url
              })
            })
          })
          console.log(dogFoodDB)
          res.send(dogFoodDB)
        })

    }, (error) => console.log(error) )

})

// Express server
app.get('/', (req, res) => res.send('Hello Doggo!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))


// don't want tubs
// .filter(function(n){ return n.toLowerCase().indexOf("tubs") === -1 })
