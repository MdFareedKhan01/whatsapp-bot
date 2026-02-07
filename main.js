const {MessageMedia , Client ,LocalAuth} = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const client = new Client({
    authStrategy : new LocalAuth({
        dataPath : "storedSessions"
    })
});

client.once('ready',()=>{
    console.log('Client ready !');
})
client.on('qr',(qr)=>{
    qrcode.generate(qr,{small:true});
})
function getYTThumbnail(videoId,quality="hqdefault"){
    return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
}
client.on("message_create", async (message)=>{
    if(message.body==="!help") {
        message.reply("!help : show the available commands \n!thumbnail <youtube_video_link> : get the thumbnail of a yt video \n!upcoming : get data for upcoming codeforces contests in a week\n!ping : get a reply - pong \n!loop <message(no space)> <int n> : send a repeated message for n number of times");
    }
    else if(message.body==="!ping") message.reply("pong");
    else if(message.body.split(" ")[0]==="!thumbnail"){
            const split = message.body.split(" ");
            const link = split[1];
            const link_new = link.split("/");
            const vidId = link_new[3].split("?")[0];
            const img_link = getYTThumbnail(vidId,"maxresdefault");
            const media = await MessageMedia.fromUrl(img_link);
            console.log(img_link);
            await client.sendMessage(message.from,media);
    }
    else if(message.body==="!upcoming"){
        fetch("https://codeforces.com/api/contest.list")
        .then(res=>res.json())
        .then(data=>{
            const now = Math.floor(Date.now()/1000);
            const nextWeek = now+(7*24*60*60)
            const upcoming = data.result.filter(contest=>contest.phase==="BEFORE" && contest.startTimeSeconds>=now && contest.startTimeSeconds<=nextWeek);
            upcoming.forEach(element => {
                const date = new Date(element.startTimeSeconds*1000);
                message.reply("Name : "+element.name+"\nDate : "+date.toLocaleString()+"\nDuration : "+(element.durationSeconds/60)/60+" hours");
            });
        })
    }
    else if(message.body.split(" ")[0]==="!loop"){
        let split = message.body.split(" ");
        let count = parseInt(split[2]);
        let msg = split[1];
        for(let i=1;i<=count;i++){
            await client.sendMessage(message.from,msg);
        }
    }
})
client.initialize();