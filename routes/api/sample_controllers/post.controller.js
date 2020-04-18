var request = require("request");
var domParser = require("dom-parser")


function paragraphToWordBag (body, q, threshold) {
  var links = [];
  var doc = new domParser().parseFromString(body, "text/html");
  var bodyContent = doc.getElementsByTagName('body')[0].innerHTML;
  // Get All Links
  var currentPageLinks = doc.getElementsByTagName("a")
  for(var i =0; i <= currentPageLinks.length;i++){
    if(currentPageLinks[i] &&
      currentPageLinks[i].getAttribute("href")&&
      !currentPageLinks[i].getAttribute("href").includes(".jpg")&&
      !currentPageLinks[i].getAttribute("href").includes(".png")&&
      !currentPageLinks[i].getAttribute("href").includes(".gif")&&
      !currentPageLinks[i].getAttribute("href").includes(".jpeg")&&
      !currentPageLinks[i].getAttribute("href").includes(":")&&
      !currentPageLinks[i].getAttribute("href").includes("#",0)){
        if(currentPageLinks[i].getAttribute("href").includes("/",0)){
          links.push(q.protocol+"//"+q.hostname+currentPageLinks[i].getAttribute("href"));
        }else{
          links.push(currentPageLinks[i].getAttribute("href"));
        }
    }
  }
  
  // Extract pure text paragraph
  var target = bodyContent.replace(/<[^>]*>/gi, " "); // Remove html tags
  target = target.replace(/\r?\n|\r|\t/gi, " ");
  // Create word bag
  target = target.toLowerCase();
  var wordArray = target.split(" ");
  const unique = [...new Set(wordArray)]
  const excludedWords = [
    'the', 'a', 'an', 'and', 
    'he', 'she', 'it', 'its', 'they', 'you',
    'them', 'their', 'his', 'her', 'your', 'other', 'another', 'also',
    'what', 'where', 'who', 'when', 'that', 'which',
    'one', 'two', 'three', 'four', 'five', 'six', 'seven',
    'eight', 'nine', 'ten', 'hundred', 'thousand', 'million', 'from',
    'to', 'few', 'less', 'january', 'after', 'in', 'into','inside', 'out', 'with',
    'about', 'for', 'main', 'job', 'many', 'is', 'was', 'were',
    'have', 'has', 'had', 'no', 'not']
  const filterExcludedWords = unique.filter(word => {
    if(!excludedWords.includes(word) &&
     !(/\W/.test(word)) &&
     !(/\d/.test(word)) &&
     word.length > 2
     ) return word;
  })

  let list = [];
  var bagObj = {}
  filterExcludedWords.forEach(element => {
    var count = 0;
    for(var i = 0; i<= wordArray.length; i++){
      if(element === wordArray[i]){
        count = count + 1; 
      }
    }
    if (count > threshold){
      bagObj[element]=count;
      list.push({
        word: element,
        count: count,
      })
    }
  })
  let levelResultObj = {
    links:links,
    bagObj:list,
  }
  return levelResultObj
}



exports.getWiki =  async (req, res, next) => {
    try { 

      res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

      const promise1 = new Promise(function(resolve, reject) {
        var url = require('url');

        var adr = Array(req.headers.wikiurl)[0]; 
        var threshold = req.headers.thresholdoccurance;
        var depth = req.headers.depth;

        var q = url.parse(adr, true);
        request({uri:adr,},(e,rep,body)=>{
          resolve(paragraphToWordBag(body, q, threshold));
        });
      });
      let y = undefined;
      let prom1 = promise1.then(function(value) {
        return value;
      });
      y = await Promise.all([prom1]).then((v)=>{return v})
      var obj = {
        status: 200,
        data: y[0],
      }
      res.status(200).send(obj)
    } catch (err) {
      console.log(err)
      res.status(500).send('Server Error');
    }
    next()
  }