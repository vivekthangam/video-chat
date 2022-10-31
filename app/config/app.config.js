require('dotenv').config()
require('dotenv').config({ path: `${__dirname}\\.env.${process.env.NODE_ENV}` });

const moongoose = require("mongoose");

const InitiateMongoServer = async () =>{
    
moongoose.Promise = global.Promise;
moongoose
    .connect(process.env.MONGO_DB_CONFIG, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Mongo Db Connected")
    })
    .catch((error) => {
        console.log(error);
    });
}
module.exports = 
    InitiateMongoServer