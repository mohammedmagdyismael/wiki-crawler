const express = require('express');
const bodyParser = require('body-parser'); 
var cors = require('cors')

/* const connectDB = require('./config/database/mongoAtlas')  
const {bugsnagmiddleware, bugsnagClient} = require('./config/bugsnag') */
const swaggerSetup = require('./config/swagger')
const app = express();
//app.use(cors())
/* connectDB(); */

app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*')
    next()
  })

app.use(express.json({extended : false}))
/* app.use(bugsnagmiddleware.requestHandler)
app.use(bugsnagmiddleware.errorHandler) */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//bugsnagClient.notify(new Error('Test error'))
app.use('/api/sample',require('./routes/api/sample'))

const PORT = process.env.PORT || 5000;
swaggerSetup(PORT, app);
app.listen(PORT, ()=>{
    console.log(`Server Starts on Port ${PORT}`)
})