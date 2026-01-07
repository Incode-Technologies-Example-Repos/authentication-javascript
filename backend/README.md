# Backend 

## Usage
This Backend Server implements all the endpoints needed to run authentication verification.

### Endpoints
__________

POST `/verify`: Receives the information about a faceMatch attempt and verifies if it was correct and has not been tampered.

All the parameters needed come as the result of execution of the [Render Login](https://developer.incode.com/docs/web-sdk-reference#renderlogin) component,
you can see a full example of it's usage in [Face Authentication documentation](https://developer.incode.com/docs/face-authentication#using-the-renderlogin-for-face-authentication)

```bash
curl --location 'https://<your-ip>:5721/api/verify' \
--header 'Content-Type: application/json' \
--data '{
    "transactionId": "Transaction Id obtained at face login",
    "token": "Token obtained at face login ",
    "interviewToken": "Interview token obtained at face login",
}'
```

### Admin Token
For the approval and fetching of scores to work you will need an Admin Token, Admin tokens
require an executive user-password and have a 24 hour expiration, thus need a
more involved strategy to be generated, renewed, securely saved and shared to the app.

For this simple test just use the following cURl, and add the generated token to the `.env` file,
you will need to refresh it after 24 hours.

```bash
curl --location 'https://demo-api.incodesmile.com/executive/log-in' \
--header 'Content-Type: application/json' \
--header 'api-version: 1.0' \
--header 'x-api-key: <your-apikey>' \
--data '{
    "email": "••••••",
    "password": "••••••"
}'
```


## Prerequisites
This sample uses the global fetch API so you must use [Node 18](https://nodejs.org/en) or higher.

## Local Development

### Environment
Rename `.env.example` file to `.env.local` adding your configuration information:

```env
API_URL=https://demo-api.incodesmile.com
API_KEY=you-api-key
ADMIN_TOKEN=Needed for the verify call
```

### Using NPM
Install the depencies with `npm install` 
```bash
npm install
```

## Dependencies

* **nodejs18+**: JavaScript runtime built on Chrome's V8 JavaScript engine.
* **express**: Web server framework.
* **dotenv**: Used to access environment variables.