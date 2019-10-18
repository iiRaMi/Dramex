require('dotenv').config();
const discord = require('discord.js');
const Fortnite = require("fortnite-api");
const jimp = require('jimp');
const waitUntil = require('wait-until');
var images =[
    'images/statsimages/Background.png',
    'images/statsimages/PC.png',
    'images/statsimages/XboxOne.png',
    'images/statsimages/PS4.png'
]

let fortniteAPI = new Fortnite(
    [
        process.env.EMAIL,
        process.env.PASSWORD,
        process.env.EPIC_API,
        process.env.FORTNITE_API
    ],
    {
        debug: false
    }
);    

exports.run = async (bot, message, args) => {
    var jimps = [];
    if (args[0] == null || args[0] == undefined) return platform = 'pc'

    let [...user] = args.splice(1);
    platform = args[0];
    user = user.join(" ");
    fortniteAPI.login().then(() => {
        fortniteAPI
        .checkPlayer(user, platform)
        .then(stats => {
            fortniteAPI
            .getStatsBR(user, platform)
            .then(stats => {
                var ss = stats["group"]["solo"];
                var ds = stats["group"]["duo"];
                var sqs = stats["group"]["squad"];
                var ts = stats["lifetimeStats"];

                var sskd = ss["k/d"]; sskd = sskd.toString();
                var sswr = ss["win%"]; sswr = sswr.toString();
                var ssmp = ss["matches"]; ssmp = ssmp.toString();
                var sst = ss["timePlayed"]; sst = sst.toString();

                var dskd = ds["k/d"]; dskd = dskd.toString();
                var dswr = ds["win%"]; dswr = dswr.toString();
                var dsmp = ds["matches"]; dsmp = dsmp.toString();
                var dst = ds["timePlayed"]; dst = dst.toString();

                var sqskd = sqs["k/d"]; sqskd = sqskd.toString();
                var sqswr = sqs["win%"]; sqswr = sqswr.toString();
                var sqsmp = sqs["matches"]; sqsmp = sqsmp.toString();
                var sqst = sqs["timePlayed"]; sqst = sqst.toString();

                var tskd = ts["k/d"]; tskd = tskd.toString();
                var tswr = ts["win%"]; tswr = tswr.toString();
                var tsmp = ts["matches"]; tsmp = tsmp.toString();
                var tst = ts["timePlayed"]; tst = tst.toString();

                for (var i = 0; i < images.length; i++) {		
                    jimps.push(jimp.read(images[i]));
                }          
                Promise.all(jimps).then((data) => {
                    return Promise.all(jimps);
                }).then((data) => {                 
                    jimp.loadFont('fonts/font.fnt').then((font) => { 
                        jimp.loadFont(jimp.FONT_SANS_64_WHITE).then((font2) => {
                            var width = data[0].bitmap.width;

                            var x1 = width*0.13;
                            var x2 = width*0.33;
                            var x3 = width*0.53;
                            var x4 = width*0.73;

                            data[0].print(font, x1, 1075, "Solo");
                            data[0].print(font, x2, 1075, "Duo");
                            data[0].print(font, x3, 1075, "Squads");
                            data[0].print(font, x4, 1075, "Lifetime");
                            data[0].print(font, 100, 600, "Username: "+user); 

                            if (platform == 'pc') {
                                data[1].resize(300,300);
                                data[0].print(font, width*0.7, 600, "Platform: "); 
                                data[0].composite(data[1], width*0.875, 550)
                            }
                            if (platform == 'xb1') {
                                data[2].resize(300,300);
                                data[0].print(font, width*0.7, 600, "Platform: "); 
                                data[0].composite(data[2], width*0.875, 550)
                            }
                            if (platform == 'ps4') {
                                data[3].resize(300,300);
                                data[0].print(font, width*0.7, 600, "Platform: "); 
                                data[0].composite(data[3], width*0.875, 550)
                            }

                            data[0].print(font2, x1, 1375, "K/D  "+sskd);
                            data[0].print(font2, x1, 1575, "Winrate  "+sswr);
                            data[0].print(font2, x1, 1775, "Matches  "+ssmp);
                            data[0].print(font2, x1, 1975, "Playtime  "+sst);

                            data[0].print(font2, x2, 1375, "K/D  "+dskd);
                            data[0].print(font2, x2, 1575, "Winrate  "+dswr);
                            data[0].print(font2, x2, 1775, "Matches  "+dsmp);
                            data[0].print(font2, x2, 1975, "Playtime  "+dst);

                            data[0].print(font2, x3, 1375, "K/D  "+sqskd);
                            data[0].print(font2, x3, 1575, "Winrate  "+sqswr);
                            data[0].print(font2, x3, 1775, "Matches  "+sqsmp);
                            data[0].print(font2, x3, 1975, "Playtime  "+sqst);

                            data[0].print(font2, x4, 1375, "K/D  "+tskd);
                            data[0].print(font2, x4, 1575, "Winrate  "+tswr);
                            data[0].print(font2, x4, 1775, "Matches  "+tsmp);
                            data[0].print(font2, x4, 1975, "Playtime  "+tst);

                            data[0].write('final-images/'+user+'_stats.png');
 
                            waitUntil()
                            .interval(2500)
                            .times(100)
                            .condition(function(cb) {
                                process.nextTick(function() {
                                    cb(data[0].write('final-images/'+user+'_stats.png') ? true : false);
                                });
                            })
                            .done(function(result) {
                                message.channel.send('', {
                                    files: ['final-images/'+user+'_stats.png']
                                });
                            });
                        })
                    })          
                })
            }).catch(err => {
                console.log(err);
                var embed = new discord.RichEmbed()
                .setColor(0xff0000)
                .setAuthor("Error", "https://media.discordapp.net/attachments/302318511764799488/444396674790719498/Error.png?width=614&height=614")
                .setDescription("Failed to get statistics!")
                message.channel.send({embed})
            })
        }).catch(err => {
            console.log(err);
            var embed = new discord.RichEmbed()
                .setColor(0xff0000)
                .setAuthor("Error", "https://media.discordapp.net/attachments/302318511764799488/444396674790719498/Error.png?width=614&height=614")
                .setDescription("Failed to get data!")
            message.channel.send({embed})
        })
    })
}     

module.exports.help = {
    name: "fstats"
}	    