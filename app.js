if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}


const express = require('express')
const app = express()
const path = require('path')
const axios = require('axios')

const mongoose = require('mongoose')
app.use(express.static('public'))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
const Weather = require('./models/weather')




app.use(express.urlencoded({ extended: true }))

//base url: 

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/weatherApp'

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!")
    })
    .catch(err => {
        console.log("OH NO, MONGO ERROR!")
        console.log(err)
    })

// const catchAsync = (fn) => {
//     return (req, res, next) => {
//         fn(req, res, next).catch(e => next(e))
//     }
// }


app.get('/', (req, res) => {
    res.render('home')
})

app.get('/weather', async (req, res) => {
    const data = await Weather.find({})
    const inCelcius = ((data[0].main.temp) - 273).toFixed(1)
    res.render('weather', { data, inCelcius })
    console.log(data)
})

app.post('/weather', async (req, res) => {
    const { city } = req.body
    await Weather.deleteMany({})
    const response = await axios.get(` https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.API_KEY}`)
        .then(async (response) => {
            const weather = response.data
            await new Weather(weather).save()
            res.redirect('/weather')
        })
        .catch(e => {
            console.log(e)
            res.redirect('/')
        })

})
const port = process.env.PORT || 3000

app.listen(3000, () => {
    console.log(`Server is listening on port ${port}`)
})




