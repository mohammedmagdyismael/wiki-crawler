var request = require("request");
var domParser = require("dom-parser")


function paragraphToWordBag (body, q) {
  var links = [];
  var doc = new domParser().parseFromString(body, "text/html");
  var bodyContent = doc.getElementById("bodyContent").innerHTML;
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
  var target = bodyContent.replace(/<[^>]*>/gi, ""); // Remove html tags
  target = target.replace(/\r?\n|\r|\t/gi, "");
  // Create word bag
  target = target.toLowerCase();
  var wordArray = target.split(" ");
  const unique = [...new Set(wordArray)]
  const excludedWords = [
    'the', 'a', 'an', 'and', 
    'he', 'she', 'it', 'they', 'you',
    'them', 'their', 'his', 'her', 'your',
    'what', 'where', 'who', 'when', 'that',
    'one', 'two', 'three', 'four', 'five', 'six', 'seven',
    'eight', 'nine', 'ten', 'hundred', 'thousand', 'million', 'from',
    'to', 'few', 'less', 'january', 'after', 'in', 'into','inside',
    'about', 'for', 'main', 'job', 'many']
  const filterExcludedWords = unique.filter(word => {
    if(!excludedWords.includes(word) &&
     !(/\W/.test(word)) &&
     !(/\d/.test(word)) &&
     word.length > 2
     ) return word;
  })

  var obj = {}
  filterExcludedWords.forEach(element => {
    var count = 0;
    for(var i = 0; i<= wordArray.length; i++){
      if(element === wordArray[i]){
        count = count + 1; 
      }
    }
    obj[element]=count;
  })
  return obj
}

exports.getWiki =  async (req, res, next) => {
    try {
      const promise1 = new Promise(function(resolve, reject) {
        var url = require('url');
        var adr = req.body.wikiURL;
        var q = url.parse(adr, true);
        request({uri:adr,},(e,rep,body)=>{
          resolve(paragraphToWordBag(body, q));
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