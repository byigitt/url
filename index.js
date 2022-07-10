const { Intents, Client } = require('discord.js')
const { check, change, time } = require('./functions')

const client = new Client({ intents: [ Intents.FLAGS.GUILDS ]})
const { id, channel, code, token, role } = require('./config.json')

const log = console.log

client.on('ready', async () => {
  log("Ready") 
  await client.channels.fetch(channel)
  const c = client.channels.cache.get(channel)
 
  let status = 0, lastrate = 0;
  const url = setInterval(async () => {
    if (status !== 0) return; // stop/start 

    let urlControl = await check(id, code, token)
    if (urlControl.code == code) {
      c.send(`\`[${time()}]\` İstenilen URL olan \`${code}\` ile şu anda sunucuda bulunan URL aynı. Bot durduruluyor. <@&${role}>`);
      return clearInterval(url);
    };

    if (!urlControl.error) {
      let changeControl = await change(id, code, token)

      if (!changeControl.error) {
        c.send(`\`[${time()}]\` URL, başarılı bir şekilde \`${code}\` olarak değiştirildi. Bot durduruluyor. <@&${role}>`);
        return clearInterval(url);
      } else {
        if (changeControl.reason == 0) {
          // rate limit, we'll wait
          c.send(`\`[${time()}]\` URL denerken rate limite yakalandık, bekliyoruz. Ratelimit süresi: \`${changeControl.retry.toFixed(0)} saniye\``);
          status = 1; lastrate = changeControl.retry;
          setTimeout(() => { status = 0 }, lastrate > 200 ? (1000 * lastrate) / 5 : 1000 * lastrate);
        }

        if (changeControl.reason == 1) {
          // taken code
          c.send(`\`[${time()}]\` \`${code}\` adlı URL ne yazık ki müsait değil. Tekrar denenecek. `)
        }
      };
    } else {
      c.send(`\`[${time()}]\` \`${code}\` adlı URL müsait fakat değiştirilemedi. Bot durduruluyor. Lütfen manual bir şekilde kontrol yapın/değiştirin. <@&${id}>`);
      return clearInterval(url);
    }
  }, 1000 * 15) // 15 saniye, 15 yerine istediğiniz süreyi saniye türünden değiştirebilirsiniz :)
})

client.login(token)
