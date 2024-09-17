# URL Spammer

This project is a Discord bot designed to manage server vanity URLs. The bot checks the current vanity URL and attempts to change it to the desired URL at regular intervals.

## Prerequisites

- Node.js v16.9.0 or higher
- A Discord bot token
- Required permissions for the bot on the server

## Installation

Clone the repository:

```bash
git clone https://github.com/byigitt/url-bot.git
cd url-bot
```

Install dependencies:

```bash
npm install
```

## Configuration
Create a config.json file in the root directory and populate it with your server information:

```json
{
  "id": "your_server_id",
  "channel": "your_log_channel_id",
  "code": "desired_vanity_url",
  "role": "ping_role_id",
  "token": "your_bot_token"
}
```

## Running the bot

Start the bot using the command:

```bash
npm start
```

The bot will start monitoring the server's vanity URL and attempt to change it to the desired value as configured.

## Troubleshooting
- Rate Limits: If the bot encounters rate limits, it will pause attempts to change the URL and try again after the rate limit duration.
- Unavailable URL: If the desired URL is taken, the bot will keep retrying until it's available.

## Contributing
Feel free to open issues or submit pull requests for any bugs or improvements.

## License

This project is licensed under the ISC License.
