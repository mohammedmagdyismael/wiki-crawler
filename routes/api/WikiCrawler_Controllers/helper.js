let url = require("url");
let domParser = require("dom-parser");

exports.getStringQueryParams = query => {
    let depth = 0;
    let minOccurance = 1;
    const wikiurl = query && query.wikiurl;
    if (query) {
      if (query.depth) {
        depth = Number(query.depth);
      }
      if (query.minOccurance) {
        minOccurance = Number(query.minOccurance);
      }
    } 

    return {
        depth,
        minOccurance,
        wikiurl,
    }
}

exports.getBaseUrl = urlString => {
  let baseUrl;
  try {
    const parsedURL = url.parse(urlString, true);
    baseUrl = `${parsedURL.protocol}//${parsedURL.hostname}`;
  } catch {
    baseUrl = '';
  }
  const parsedURL = url.parse(urlString, true);
  baseUrl = `${parsedURL.protocol}//${parsedURL.hostname}`;
  return baseUrl;
}

exports.convertWikiArticleToWordBag = (body, baseUrl, threshold) => {
    let links = [];
    let doc = new domParser().parseFromString(body, "text/html");
    let bodyContent = doc.getElementsByTagName('body')[0].innerHTML;
    // Get All Links
    let currentPageLinks = doc.getElementsByTagName("a")
    for(let i =0; i <= currentPageLinks.length;i++){
      if(currentPageLinks[i] &&
        currentPageLinks[i].getAttribute("href")&&
        !currentPageLinks[i].getAttribute("href").includes(".jpg")&&
        !currentPageLinks[i].getAttribute("href").includes(".png")&&
        !currentPageLinks[i].getAttribute("href").includes(".gif")&&
        !currentPageLinks[i].getAttribute("href").includes(".jpeg")&&
        !currentPageLinks[i].getAttribute("href").includes(":")&&
        !currentPageLinks[i].getAttribute("href").includes("#",0)){
          if(currentPageLinks[i].getAttribute("href").includes("/",0)){
            links.push(baseUrl+currentPageLinks[i].getAttribute("href"));
          }else{
            links.push(currentPageLinks[i].getAttribute("href"));
          }
      }
    }
    
    // Extract pure text paragraph
    let target = bodyContent.replace(/<[^>]*>/gi, " "); // Remove html tags
    target = target.replace(/\r?\n|\r|\t/gi, " ");
    // Create word bag
    target = target.toLowerCase();
    let wordArray = target.split(" ");
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
    let bagObj = {}
    filterExcludedWords.forEach(element => {
      let count = 0;
      for(let i = 0; i<= wordArray.length; i++){
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
