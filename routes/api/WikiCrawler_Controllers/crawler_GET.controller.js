let request = require("request");
let { getBaseUrl, convertWikiArticleToWordBag, getStringQueryParams } = require("./helper");

const getWikiPageContent = async (wikiurl, minOccurance) => {
  let payload = {
    bagObj: [],
    links: [wikiurl],
  };

  const baseUrl = getBaseUrl(wikiurl);
  if (baseUrl) {
    await new Promise(function(resolve, reject) {          
      request({uri:wikiurl,},(e,rep,body)=>{
        resolve(convertWikiArticleToWordBag(body, baseUrl, minOccurance));
      });
    }).then(value => {
      payload.bagObj = [...value.bagObj];
      payload.links = [...value.links];
    }); 
  }

  return payload;
}

exports.getWiki =  async (req, res, next) => {
    const { depth, minOccurance, wikiurl} = getStringQueryParams(req.query);

    let payload = {
      bagObj: [],
      links: [wikiurl],
    };

    try { 
      let depthUrls = [wikiurl]
      for (let i=0; i < depth; i += 1) {
        let tempUrlsList = [];
        for (let j = 0; j < 3; j += 1) {
          const pageContent = await getWikiPageContent(depthUrls[0], minOccurance);
          payload.bagObj = [...payload.bagObj, ...pageContent.bagObj];
          payload.links = [...payload.links, ...pageContent.links]; 
          tempUrlsList = [...tempUrlsList, ...pageContent.links];
        }
        depthUrls = tempUrlsList;
      }

      res.status(200).send({
        status: 200,
        data: {
          ...payload,
        },
      })
    } catch (err) {
      console.log(err)
      res.status(500).send('Server Error');
    }
    next()
  }