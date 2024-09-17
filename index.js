const { Intents, Client } = require("discord.js");
const { check, change, time } = require("./functions");

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const { id, channel, code, token, role } = require("./config.json");

const log = console.log;

client.on("ready", async () => {
	log("Bot is now ready to operate.");

	await client.channels.fetch(channel);
	const c = client.channels.cache.get(channel);

	let status = 0;
	let lastRate = 0;

	const urlCheckInterval = setInterval(async () => {
		if (status !== 0) return;

		const urlControl = await check(id, token);
		if (urlControl.code === code) {
			c.send(
				`\`[${time()}]\` The desired URL \`${code}\` is already set on the server. Stopping the bot. <@&${role}>`,
			);
			return clearInterval(urlCheckInterval);
		}

		if (!urlControl.error) {
			const changeControl = await change(id, code, token);
			if (!changeControl.error) {
				c.send(
					`\`[${time()}]\` Successfully changed the URL to \`${code}\`. Stopping the bot. <@&${role}>`,
				);
				return clearInterval(urlCheckInterval);
			}

			if (changeControl.reason === 0) {
				c.send(
					`\`[${time()}]\` Encountered rate limit while attempting to change URL. Retrying in \`${changeControl.retry.toFixed(
						0,
					)} seconds\`.`,
				);
				status = 1;
				lastRate = changeControl.retry;
				setTimeout(
					() => {
						status = 0;
					},
					lastRate > 200 ? (1000 * lastRate) / 5 : 1000 * lastRate,
				);
			}

			if (changeControl.reason === 1) {
				c.send(
					`\`[${time()}]\` The URL \`${code}\` is not available. Retrying...`,
				);
			}
		} else {
			c.send(
				`\`[${time()}]\` The URL \`${code}\` is available but could not be changed. Stopping the bot. Please check manually. <@&${id}>`,
			);
			return clearInterval(urlCheckInterval);
		}
	}, 1000 * 15);
});

client.login(token);
