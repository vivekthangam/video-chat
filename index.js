const express = require("express");
const app = express();
const InitiateMongoServer = require("./app/config/app.config");


const http = require("http");
const server = http.createServer(app);
const {
    initMeetingServer
} = require("./app/utils/meeting-server");

    const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

var bodyParser = require('body-parser');
// Initiate Mongo Server
InitiateMongoServer();
initMeetingServer(server);
const createLog = (req, res, next) => {
    res.on("finish", function() {
      console.log(req.method, decodeURI(req.url), res.statusCode, res.statusMessage);
    });
    next();
  };


app.use(express.json());
app.use(bodyParser.urlencoded())
app.use(createLog);
app.get('/isAlive', (req, res) => {
    res.send("Application isAlive");
})
app.get('/', (req, res) => {
    res.send("Application isAlive");
})

app.use("/api", require("./app/routes/app.route"));


app.use(
    '/api-docs',
    swaggerUi.serve, 
    swaggerUi.setup(swaggerDocument)
  );
app.listen(process.env.PORT, function () {
    console.log("Ready to Go!!!");
})