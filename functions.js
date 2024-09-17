const fetch = require("node-fetch");

/**
 * Attempts to change the server's vanity URL.
 * @param {string} id - The server ID.
 * @param {string} url - The desired vanity URL.
 * @param {string} token - The bot's authentication token.
 * @returns {Promise<Object|boolean>} The result of the change operation.
 */
async function change(id, url, token) {
	const config = {
		url: `https://discord.com/api/v9/guilds/${id}/vanity-url`,
		body: { code: `${url}` },
		method: "PATCH",
		headers: {
			Accept: "*/*",
			"Content-Type": "application/json",
			Authorization: `Bot ${token}`,
		},
	};

	try {
		let req = await fetch(config.url, {
			method: config.method,
			headers: config.headers,
			body: JSON.stringify(config.body),
		});
		req = await req.json();

		if (req.message.includes("rate"))
			return { error: true, reason: 0, retry: req.retry_after }; // Reason 0: Rate limit
		if (req.message.includes("taken") || req.code === 50020)
			return { error: true, reason: 1 }; // Reason 1: Taken URL
		return true;
	} catch (err) {
		return { error: 1, msg: err.message, stack: err };
	}
}

/**
 * Checks the current vanity URL of the server.
 * @param {string} id - The server ID.
 * @param {string} token - The bot's authentication token.
 * @returns {Promise<Object>} The current URL data.
 */
async function check(id, token) {
	const config = {
		url: `https://discord.com/api/v9/guilds/${id}/vanity-url`,
		method: "GET",
		headers: {
			Accept: "*/*",
			"Content-Type": "application/json",
			Authorization: `Bot ${token}`,
		},
	};

	try {
		let req = await fetch(config.url, {
			method: config.method,
			headers: config.headers,
		});
		req = await req.json();

		return req;
	} catch (err) {
		return { error: 1, msg: err.message, stack: err };
	}
}

/**
 * Returns the current time formatted as HH:MM:SS.
 * @returns {string} The current time.
 */
function time() {
	const date = new Date();
	const hour = date.getHours();
	const minute = date.getMinutes();
	const second = date.getSeconds();
	const check = (number) => (number >= 10 ? number : `0${number}`);

	return `${check(hour)}:${check(minute)}:${check(second)}`;
}

module.exports = { change, check, time };
