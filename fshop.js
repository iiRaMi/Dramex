require('dotenv').config();
const discord = require('discord.js');
const request = require('request');
const jimp = require('jimp');
const rawurl = "https://fnbr.co/api/shop";
const api_key = process.env.API_KEY;
const api_url = rawurl+'?api_key='+api_key;
var localimages = ['images/Background.png', 'images/NewRow.png', 'images/Title.png'];

module.exports.run = async (bot, message, args) => { 	
	var jimps = [];
	message.reply('Generating Shop..')
	.then(msg => {
		msg.delete(5000)
	})
	request.get(api_url, {
		json: true
	}, function(err, res, body) {
		
		if (err) {
			return console.log(err);
		}
		var data = body['data'];
		var dailyArray = data['daily'];
		var featuredArray = data['featured'];
				
		for (var i = 0; i < localimages.length; i++) {		
			jimps.push(jimp.read(localimages[i]));
		}	

        for (var iDaily = 0; iDaily < dailyArray.length; iDaily++) {
			jimps.push(jimp.read(dailyArray[iDaily].images['gallery']));	
		}

		for (var i = 0; i < featuredArray.length; i++) {
			jimps.push(jimp.read(featuredArray[i].images['featured']));
		}	
		
		Promise.all(jimps).then(function(data){
			return Promise.all(jimps);
		}).then(function(data) {
			var imgspr = 4;

			var numimgs = data.length-3; 
			var ndr = Math.round((numimgs/imgspr) * 10) / 10;
			
			data[0].composite(data[0],0,0); 
			var height = data[0].bitmap.height;
			var width = data[0].bitmap.width;
			for (var i = 0; i < ndr; i++) {
				data[0].resize(width, height+data[1].bitmap.height);
				height = data[0].bitmap.height;
			}
			data[0].composite(data[1],0,data[1].bitmap.height); 
			data[0].composite(data[2],0,0);
			for (var i = 1; i< ndr; i++) {
				var ypos = (1000+data[1].bitmap.height*i)
				data[0].composite(data[1],0,ypos);
			}	
			for (var i = 3; i < (numimgs+3); i++){	
				if (i <= 6) {
					data[i].resize(900, 900);
					data[0].composite(data[i], 125+950*(i-3) ,data[2].bitmap.height)-(data[i].bitmap.height);	
				}
				if (i >= 7 && i <= 10) {
					data[i].resize(900, 900);
					data[0].composite(data[i], 125+950*(i-7) ,data[2].bitmap.height*2-data[i].bitmap.height/2);	
				}
				if (i >= 11 && i <= 14) {
					data[i].resize(900, 900);
					data[0].composite(data[i], 125+950*(i-11) ,data[2].bitmap.height*3-data[i].bitmap.height/2*2);	
				}
				if (i >= 15 && i <= 18) {
					data[i].resize(900, 900);
					data[0].composite(data[i], 125+950*(i-15) ,data[2].bitmap.height*4-data[i].bitmap.height/2*3);	
				}
				if (i >= 19 && i <= 22) {
					data[i].resize(900, 900);	
					data[0].composite(data[i], 125+950*(i-19) ,data[2].bitmap.height*5-data[i].bitmap.height/2*4);	
				}
				if (i >= 23 && i <= 26) {
					data[i].resize(900, 900);
					data[0].composite(data[i], 125+950*(i-23) ,data[2].bitmap.height*6-data[i].bitmap.height/2*5);	
				}
				if (i >= 27 && i <= 30) {
					data[i].resize(900, 900);
					data[0].composite(data[i], 125+950*(i-27) ,data[2].bitmap.height*7-data[i].bitmap.height/2*6);	
				}

			}
			data[0].write('final-images/shop.png', function() {
				message.channel.send('', {
					files: [
						"final-images/shop.png"
					]
				});
			})
		})
		.catch(err => {
			console.log(err);
		})	
	})		
}
    
module.exports.help = {
    name: "fshop"
}	    