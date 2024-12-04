# How to set the Backend environment variables

Copy the `sample.env` to `.env` on the backend folder and edit the values if necessary.

### Env Variables:

1. **PORT**:
   - Example: **`PORT=5000`**
   - Usage: Specifies the port where the web server will listen for incoming requests. For instance, in a Node.js application, you might configure the server to listen on port 5000 with **`app.listen(process.env.PORT || 5000);`**.
2. **BASE_URL**:
   - Example: **`BASE_URL='http://localhost:5000'`**
   - Usage: Defines the base URL of the application. This can be useful for generating absolute URLs within the application or for configuring external services to communicate with the application.
3. **DATABASE_URL**:
   - Example: \*\*`DATABASE_URL='postgres://myuser:mypassword@localhost:5433/web-time-machine'`\*\*
   - Usage: Contains the connection URL for the PostgreSQL database used by the application. It typically includes the username, password (hidden here), host, port, and database name.
4. **DATABASE_URL_NON_POOLING**:
   - Example: \*\*`DATABASE_URL_NON_POOLING='postgres://myuser:mypassword@localhost:5433/web-time-machine'`\*\*
   - Usage: Contains the connection URL for the PostgreSQL database used by the migrations. It typically includes the username, password (hidden here), host, port, and database name.
5. **BCRYPT_SALT**:
   - Example: **`BCRYPT_SALT=10`**
   - Usage: Specifies the cost factor or salt value used in the Bcrypt hashing algorithm for securely hashing passwords. In this case, the salt value is "10".
6. **CRYPTO_SALT**:
   - Example: **`CRYPTO_SALT=1a9af5a9ebe7853`**
   - Usage: A salt value used in cryptographic operations to add entropy and enhance security.
7. **CRYPTO_KEY**:
   - Example: **`CRYPTO_KEY=4ff64f746022599`**
   - Usage: Contains a cryptographic key used for encryption or decryption operations.
8. **JWT_ACCESS_SECRET**:
   - Example: **`JWT_ACCESS_SECRET=d5e3719e-c66b-4504-9b10-6b5a4a678ffb`**
   - Usage: Secret key used to sign and verify JWT access tokens for user authentication.
9. **JWT_ACCESS_EXPIRATION**:
   - Example: **`JWT_ACCESS_EXPIRATION=1d`**
   - Usage: Specifies the expiration time for JWT access tokens. In this case, "1d" indicates a validity period of one day.
10. **JWT_REFRESH_SECRET**:
    - Example: **`JWT_REFRESH_SECRET=0f0d7c71-f0a0-421f-a0c4-9152072281b5`**
    - Usage: Secret key used to sign and verify JWT refresh tokens, typically used for refreshing expired access tokens.
11. **JWT_REFRESH_EXPIRATION**:
    - Example: **`JWT_REFRESH_EXPIRATION=1d`**
    - Usage: Specifies the expiration time for JWT refresh tokens. In this case, "1d" indicates a validity period of one day.
12. **JWT_PARTIAL_SECRET**:
    - Example: **`JWT_PARTIAL_SECRET=0f0d7c71-f0a0-421f-a0c4-9152072281b5`**
    - Usage: It seems to be another secret key related to JWT, but its specific usage is not clear from the provided context.
13. **EMAIL_URI**:
    - Example: **`EMAIL_URI='smtps://mail@gmail.com:password@smtp.gmail.com'`**
    - Usage: SMTP mailer.
14. **OPENAI_ACCESS_TOKEN**: To obtain a token, first, you need to create an account [here](https://auth0.openai.com/u/signup/identifier?state=hKFo2SBMLTJkWUFpa2dVWlBrTDdrTjdxbEp2ZGt6RmZBakdvbKFur3VuaXZlcnNhbC1sb2dpbqN0aWTZIEhleHE1SGYzQkdpMjhDM3d3dnFVZERmamF6TVpTMEpGo2NpZNkgRFJpdnNubTJNdTQyVDNLT3BxZHR3QjNOWXZpSFl6d0Q). Then, you can generate and get the access token [here](https://platform.openai.com/account/api-keys)
    - Example: **`OPENAI_ACCESS_TOKEN=sk-70s0d030f0thg043whsGsjBNV62skUiFz1LoPMm34BtrEs1I`**
    - Usage: Access token to use OpenAI's models.
15. **AVOID_DOMAIN_LIST**:
    - Example: **`AVOID_DOMAIN_LIST='localhost, www.webtm.io, webtm.vercel.app'`**
    - Usage: Specifies the domains list to avoid to track.
16. **CRON_SECRET**:
    - Example: **`CRON_SECRET=4b2cfcf5-cf24-4fa7-b5d0-80920e3ff9ea`**
    - Usage: Used to secure recurring endpoints executed by scheduled tasks (cron jobs). The `CRON_SECRET` value is extracted from the bearer token in the backend and validated to authorize access to these endpoints. This environment variable is set in Vercel and sent in cron requests to securely authenticate the process.
17. **DISCORD_LOG_WEBHOOK_URL**:
    - Example: **`DISCORD_LOG_WEBHOOK_URL=https://discord.com/api/webhooks/your_webhook_url`**
    - Usage: The URL for the Discord webhook where logs will be sent. This should be the URL of the webhook in the Discord channel where you want to receive log messages.
18. **DISCORD_LOG**:
    - Example: **`DISCORD_LOG=true`**
    - Usage: Enables or disables sending standard log messages to Discord. Set to `true` to activate or `false` to deactivate.
19. **DISCORD_ERROR**:
    - Example: **`DISCORD_ERROR=true`**
    - Usage: Enables or disables sending error messages to Discord. Set to `true` to send error logs to the specified Discord channel.
20. **DISCORD_WARN**:
    - Example: **`DISCORD_WARN=true`**
    - Usage: Enables or disables sending warning messages to Discord. Set to `true` to send warning logs to the specified Discord channel.
21. **DISCORD_DEBUG**:
    - Example: **`DISCORD_DEBUG=true`**
    - Usage: Enables or disables sending debug messages to Discord. Set to `true` to activate debug log messages in the Discord channel.
22. **DISCORD_VERBOSE**:
    - Example: **`DISCORD_VERBOSE=true`**
    - Usage: Enables or disables sending verbose messages to Discord. Set to `true` to send verbose logs to the Discord channel.

You will also need to set this env variables as secrets on your GitHub repository for the db migrations GitHub action to work properly.
