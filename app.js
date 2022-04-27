const express = require('express'); // This is for import the packege
const app = express(); // This is for excute the package
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

app.use(cors());

app.options('*', cors());
app.enable('trust proxy');



const bodyParser = require('body-parser');
require('dotenv/config');
 
app.use(bodyParser.json());

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
                title: "My brand personal website",
                version: "1.0.0",
                description: "My brand API information",
            },  
            servers: [
                {
                url: "http://localhost:4400"
                }
            ],
    },
    apis: ["./routes/*.js"] 
};


const specs = swaggerJsDoc(options)

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs))

//Import Routes 
const postsRoute = require('./routes/posts');
app.use('/api/v1/articles', postsRoute);

const usersRoute = require('./routes/users');
app.use('/api/v1/users', usersRoute);

const messageRoute = require('./routes/messages');
app.use('/api/v1/messages', messageRoute);



//Routers
app.get('/',(req, res) => {
    res.send("Here We are!");
});


//Connect to DB
mongoose.connect(process.env.DB_CONNECTION, () => 
console.log("Now You are connect to DB!")
);



//Listern to my server
const port = 4400;
app.listen(port, () =>{
    console.log('Server is listerning on port : '+port);
});