const express = require('express')
const router = express.Router() 

const sampleGET = require('./sample_controllers/get.controller') 
/**
 * @swagger
 * /api/sample:
 *  get:
 *      description: post Wikipedia URL to create a word bag
 *      parameters: [
 *               {
 *                  "wikiURL": "URL"  
 *               }
 * ]
 */

router.get('/', (req,res,next)=>sampleGET.getWiki(req,res,next) );

module.exports = router;