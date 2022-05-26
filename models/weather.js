const mongoose = require('mongoose')



const weatherSchema = new mongoose.Schema({
    name: String,
    main: {
        humidity: Number, // in %
        pressure: Number,// pa 
        temp: Number // convert to degree celcius
    },
    sys: {
        country: String
    },
    weather: [
        {
            main: String,  //main is the type of weather eg windy or cloudy
            description: String,
            icon: String
        }
    ],
    wind: {
        speed: Number //mph

    }
})

const Weather = mongoose.model('Weather', weatherSchema)
module.exports = Weather