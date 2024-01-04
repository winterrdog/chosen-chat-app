FROM    node:current-alpine3.19@sha256:9b54d010b382f0ef176dc93cd829bd4f2a905092b260746b3999aa824c9b7121

LABEL   author="winterrdog"
LABEL   description="backend for chat room app. Written in NestJS using TypeScript/Node.js"

# set app directory
ARG     APP_DIR=/usr/src/app

# set environment variables
ENV     NODE_ENV=production

# create directory in container img for app code
RUN     mkdir -p ${APP_DIR}

# for security, set node user to own app directory
# copy app code into its production directory( /usr/src/app ) as node user
COPY    --chown=node:node . ${APP_DIR}

# set working directory
WORKDIR ${APP_DIR}

# install nestjs cli and production dependencies
RUN     npm i -g @nestjs/cli && npm ci --only=production && npm run build

# expose port 3000
EXPOSE  3000

# set user to non-root
USER    node

# entry point into container
ENTRYPOINT ["node", "dist/main"]
