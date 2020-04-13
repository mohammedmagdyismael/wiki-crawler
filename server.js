const express = require('express');
const bodyParser = require('body-parser');
const Joi = require('@hapi/joi');
const assert = require('assert');

const connectDB = require('./config/database/mongoAtlas') 
const swaggerSetup = require('./config/swagger')
const {bugsnagmiddleware, bugsnagClient} = require('./config/bugsnag')

const app = express();
connectDB();

app.use(express.json({extended : false}))
app.use(bugsnagmiddleware.requestHandler)
app.use(bugsnagmiddleware.errorHandler)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//bugsnagClient.notify(new Error('Test error'))
app.use('/api/sample',require('./routes/api/sample'))

app.get('/',(req,res)=>{
    try{
        bugsnagClient.notify("s")
        return res.send("Social Network APIs")
    }
    catch(e){
        bugsnagClient.notify(e)
    }  
})

const PORT = process.env.PORT || 5000;
swaggerSetup(PORT, app);
app.listen(PORT, ()=>{
    console.log(`Server Starts on Port ${PORT}`)
})