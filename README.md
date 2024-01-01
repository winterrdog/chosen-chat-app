# The chosen-chat-room app

a personal project geared to learning websockets and real-time chats or updates

## Frontend

To run the front-end, you just need a browser. The front-end is a static HTML page that uses the backend API to send and receive messages.

#### Steps to run the front-end

- Open the front-end folder
- Click on the `index.html` file to open the app in your browser

## Backend

#### Installation

```bash
npm i
```

#### Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

#### Test

```bash
# unit tests
$ npm test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## NOTES

- By default, the websocket server is running on port `3000` at a URL of `http://localhost:3000`
