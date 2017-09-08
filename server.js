var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

var fs = require('fs');
var http = require('http');

app.get('/scrape', function(req, res){

  	//All the web scraping magic will happen here
	const url = 'https://emojipedia.org/activity/';

    // The structure of our request call
    // The first parameter is our URL
    // The callback function takes 3 parameters, an error, response status code and the html

    request(url, function(error, response, html){
 		// First we'll check to make sure no errors occurred when making the request

        if(!error){
            // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality

            var $ = cheerio.load(html);
            var counter = 1;

           $('.emoji-list a').filter(function() {
           		const data = $(this);
         
           		request('https://emojipedia.org' + data.attr('href'), function(error, response, html){
           			var $2 = cheerio.load(html);
       				var loaded = false;
           			$2('.vendor-image img').filter(function() {
           				if (loaded) return;
	       				const data2 = $(this);
	         
		       
						var src = data2.attr('data-cfsrc').replace('https', 'http');
					
						var srcParts = src.split('/');
						var file = fs.createWriteStream('activity/' + srcParts[srcParts.length - 1]);
						var request = http.get(src, function(response) {
						  response.pipe(file);
						});

		           		loaded = true;
		           		counter++;
           			})
           		})
           })
        }
    })

})

/*fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){

    console.log('File successfully written! - Check your project directory for the output.json file');

})*/

// Finally, we'll just send out a message to the browser reminding you that this app does not have a UI.
// res.send('Check your console!')

 
app.listen('8081')

console.log('Magic happens on port 8081');

exports = module.exports = app;


