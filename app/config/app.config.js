
const moongoose = require("mongoose");
const MONGO_DB_CONFIG = {
    DB: "mongodb://localhost/meeting-app"
};

const InitiateMongoServer = async () =>{
    
moongoose.Promise = global.Promise;
moongoose
    .connect(MONGO_DB_CONFIG.DB, {
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