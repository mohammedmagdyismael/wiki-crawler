var request = require("request");
var domParser = require("dom-parser");
var helper = require("./helper");
var url = require("url");

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
    bagObj:list,
    links:links,
  }
  return levelResultObj
}



exports.getWiki =  async (req, res, next) => {
    var { wikiurl, thresholdoccurance, depth } = req.headers;
    var accumulatedData = {
      bagObj: [],
      links: [wikiurl],
    };

    try { 

      for (var i=0; i < depth; i++) {
        for (var j = 0; j < 20; j++) {
          const promise1 = new Promise(function(resolve, reject) {
            var parsedURL = url.parse(wikiurl, true);
            request({uri:wikiurl,},(e,rep,body)=>{
              resolve(paragraphToWordBag(body, parsedURL, thresholdoccurance));
            });
          });
          let y;
          let prom1 = promise1.then(function(value) {
            return value;
          });
          y = await Promise.all([prom1]).then((v)=>{return v});

          accumulatedData.bagObj = [...accumulatedData.bagObj, ...y[0].bagObj];
          accumulatedData.links = [...accumulatedData.links, ...y[0].links];
        }
      }


      var obj = {
        status: 200,
        data: {
          ...accumulatedData,
        },
      }

      res.status(200).send(obj)
    } catch (err) {
      console.log(err)
      res.status(500).send('Server Error');
    }
    next()
  }