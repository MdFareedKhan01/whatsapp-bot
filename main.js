const {MessageMedia , Client ,LocalAuth} = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const fetch = (...args)=>
    import("node-fetch").then(({default : fetch})=>fetch(...args));
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
    if(message.body==="!help") message.reply("!help : show the available commands \n!thumbnail <youtube_video_link> : get the thumbnail of a yt video \n!upcoming : get data for upcoming codeforces contests in a week\n!ping : get a reply - pong");
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
})
client.initialize();