# The chosen-chat-room app

a personal project geared to learning websockets and real-time chats or updates

## Frontend
The front-end is a static HTML page that uses the backend API to send and receive messages.

#### The front-end is hosted here
--> https://muchubatactics.github.io/chosen-chat-app/  <--

If you clone the repo and you want to run it locally, follow the instructions below.
To run the front-end, you just need a browser. 

#### Steps to run the front-end

- Open the front-end folder
- Click on the `index.html` file to open the app in your browser

## Backend

#### Installation

- Make sure you've `docker` installed on your machine. *The rest of the dependencies will be installed in a container so you don't need to worry about them*

#### Running the app

- This app is containerized, so you can run it by running the following command in the root directory of the app

```bash
cd back-end && bash ./containerize.sh
```

This will pull the app's image from docker hub and run it in a container. The app will be running on port `3000` at a URL of `http://localhost:3000`

## NOTES

- By default, the websocket server is running on port `3000` at a URL of `http://localhost:3000`
