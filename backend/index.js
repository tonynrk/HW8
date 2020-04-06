const express = require('express');
var request = require("request");
const app = express();
const port = 5000;

const NYTimes_api_key = "OQOX3GCYqAvAJ1fvPnsAID9GOCRzbTBT";

app.get('/', (req, res) => res.send('Hello World!'));


// NYTimes News

app.get('/getNYTimesNews', (req, res) => {
    let url;

    if(req.query.section === "home")
        url = "https://api.nytimes.com/svc/topstories/v2/home.json?api-key="+NYTimes_api_key;
    else
        url = "https://api.nytimes.com/svc/topstories/v2/"+ req.query.section +".json?api-key="+NYTimes_api_key;
   
    request(url,function (error, response, body){
        if(!error && response.statusCode == 200){
            let parsedBody = JSON.parse(body);
            filtered_body = filter_NYTimesNews(parsedBody,req.query.section);
            res.send(filtered_body);
        }
    }) 
});

function filter_NYTimesNews(parsedBody,section){
        news_results = parsedBody['results'];

        news_results = section !== "home" ? news_results.slice(0,10) : news_results;

        return news_results;   
}

app.get('/searchNYNews', (req,res) =>{

    let web_url = req.query.web_url;
    let url = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=web_url:("' + web_url +  '")&api-key=' + NYTimes_api_key;
    request(url,function (error, response, body){
        if(!error && response.statusCode == 200){
            let parsedBody = JSON.parse(body);
            res.send(parsedBody);
        }
    }) 
});

app.get('/queryNYNews' , (req,res) =>{
    let q = req.query.q;
    let url = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + q + '&api-key=' + NYTimes_api_key;
    request(url,function (error, response, body){
        if(!error && response.statusCode == 200){
            let parsedBody = JSON.parse(body);
            res.send(parsedBody);
        }
    }) 
});



const Guardian_api_key = "20e0b6ca-ac34-4529-b8f3-a026e7196286";

// Guardian News

app.get('/getGuardianNews', (req, res) => {
    let url;

    if(req.query.section == "home")
        url = "https://content.guardianapis.com/search?section=(sport%7Cbusiness%7Ctechnology%7Cpolitics)&api-key="+Guardian_api_key+"&show-blocks=all";
    else{
        let section = req.query.section !== "sports" ? req.query.section : "sport";

        url = "https://content.guardianapis.com/"+section+"?api-key="+Guardian_api_key+"&show-blocks=all";
    }

    request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                let parsedBody = JSON.parse(body);
                filtered_body = filter_GuardianNews(parsedBody,req.query.section);
                res.send(filtered_body);
            }
        }
    );
});

function filter_GuardianNews(parsedBody,section){
    news_results = parsedBody['response']['results'];
    news_results = section !== "home" ? news_results.slice(0,10) : news_results;
    return news_results;   
}

app.get('/searchGuardianNews', (req,res) =>{

    let id = req.query.id;
    let url = "https://content.guardianapis.com/"+id+"?api-key="+Guardian_api_key+"&show-blocks=all";

    request(url,function (error, response, body){
        if(!error && response.statusCode == 200){
            let parsedBody = JSON.parse(body);
            res.send(parsedBody);
        }
    }) 
});

app.get('/queryGuardianNews' , (req,res) =>{
    let q = req.query.q
    let url = 'https://content.guardianapis.com/search?q='+ q + '&api-key='+ Guardian_api_key +'&show-blocks=all'
    request(url,function (error, response, body){
        if(!error && response.statusCode == 200){
            let parsedBody = JSON.parse(body);
            res.send(parsedBody);
        }
    }) 
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));