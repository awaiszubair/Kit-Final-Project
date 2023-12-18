const mongoose = require('mongoose')

const cityScheme = {

Cityname : {
    type:String
}

}

const cityModel = mongoose.model('City', cityScheme)
module.exports ={cityModel}