const fetch = require('node-fetch')

async function change (id, url, token) {
	const config = {
		url: `https://discord.com/api/v9/guilds/${id}/vanity-url`,
		body: {
			code: `${url}`
		},
		method: 'PATCH',
		headers: {
			"Accept": "*/*",
			"Content-Type": "application/json",
			"Authorization": `Bot ${token}`
		}
	}

	try {
		let req = await fetch(config.url, { method: config.method, headers: config.headers, body: JSON.stringify(config.body) }) 
		req = await req.json();
		
		if (req.message.includes("rate")) return { error: true, reason: 0, retry: req.retry_after } // reason 0: rate limit
		if (req.message.includes("taken") || req.code == 50020) return { error: true, reason: 1 } // reason 1: taken
		return true
	} catch (err) {
		if (err) return { error: 1, msg: err.message, stack: err }
	}
}

async function check (id, token) {
	const config = {
		url: `https://discord.com/api/v9/guilds/${id}/vanity-url`,
		method: 'GET',
		headers: {
			"Accept": "*/*",
			"Content-Type": "application/json",
			"Authorization": `Bot ${token}`
		}
	}

	try {
		let req = await fetch(config.url, { method: config.method, headers: config.headers }) 
		req = await req.json();

		if (req) return req
	} catch (err) {
		if (err) return { error: 1, msg: err.message, stack: err }
	}
}

function time () {
	const date = new Date();
	const hour = date.getHours(), minute = date.getMinutes(), second = date.getSeconds();
	const check = (number) => { return number >= 10 ? number : "0" + number };

	return `${check(hour)}:${check(minute)}:${check(second)}`
};

module.exports = { change, check, time }
