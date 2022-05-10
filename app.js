const express = require('express'); 
const app = express(); 
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const cookieParser = require('cookie-parser')


const PORT = process.env.PORT || 4400;

app.use(cors());
app.options('*', cors());
app.enable('trust proxy');

app.use(cookieParser());



const bodyParser = require('body-parser');
require('dotenv/config');
 
app.use(bodyParser.json());

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
                title: "My brand",
                version: "1.0.0",
                description: "Personal Website",
            },  
            servers: [
                {

                url: 'https://my-brand-project.herokuapp.com/'
    
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
    res.send("Welcome to my-brand API");
});


//Connect to DB
mongoose.connect(process.env.DB_CONNECTION, () => 
    console.log("Now You are connect to DB!")
);


//Listern to my server
app.listen(PORT, () =>{
    console.log('Server is listerning on port : '+PORT);
});

module.exports = app