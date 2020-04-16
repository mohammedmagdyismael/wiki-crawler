const express = require('express')
const router = express.Router() 

const sampleGET = require('./sample_controllers/post.controller') 
/**
 * @swagger
 * /api/sample:
 *  post:
 *      description: post Wikipedia URL to create a word bag
 *      parameters: [
 *               {
 *                  "wikiURL": "URL"  
 *               }
 * ]
 */

router.post('/', (req,res,next)=>sampleGET.getWiki(req,res,next) );

module.exports = router;