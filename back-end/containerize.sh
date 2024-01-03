#!/usr/bin/env bash

# pull image from docker hub & run container
docker container run --detach --name chat-app -p 3000:3000 winterrdog/chat-room-app:1.1.2
