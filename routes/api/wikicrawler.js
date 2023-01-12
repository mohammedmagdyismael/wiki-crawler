const express = require('express')
const router = express.Router() 
const crawlerGET = require('./WikiCrawler_Controllers/crawler_GET.controller') 
/**
 * @swagger

 *      parameters: [
*               {
*                  "wikiURL": "URL"  
*               }
 *                  ]
 */

//@route Get    /api/wikicrawler
//@desc         Post Wikipedia URL to create a word bag
//@access       Public

router.get('/', (req,res,next)=>crawlerGET.getWiki(req,res,next) );

module.exports = router;