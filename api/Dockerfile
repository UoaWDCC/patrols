# syntax = docker/dockerfile:1
# Adjust NODE_VERSION as desired
ARG NODE_VERSION=18.19.0
FROM node:${NODE_VERSION}-slim as base

LABEL fly_launch_runtime="Node.js"

# Node.js app lives here
WORKDIR /app

# Set production environment
ARG YARN_VERSION=1.22.19
RUN npm install -g yarn@$YARN_VERSION --force


# Throw-away build stage to reduce size of final image
FROM base as install 

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3 openssl

# Install node modules
COPY --link package.json yarn.lock ./
COPY prisma ./prisma/
RUN yarn install --frozen-lockfile

# Copy application code
COPY --link . .

# Define arguments for build time
ARG DATABASE_URL
ARG SUPABASE_URL
ARG SUPABASE_ANON_KEY
ARG RESEND_API_KEY
ARG GOOGLE_ENCODED_KEY

# Set build time environment variables
ENV DATABASE_URL=${DATABASE_URL}
ENV SUPABASE_URL=${SUPABASE_URL}
ENV SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
ENV RESEND_API_KEY=${RESEND_API_KEY}
ENV GOOGLE_ENCODED_KEY=${GOOGLE_ENCODED_KEY}

FROM base as build

COPY --from=install /app /app

RUN yarn run build

# Final stage for app image
FROM base

RUN apt-get update -qq && \
    apt-get install -y openssl

# Copy built application
COPY --from=build /app /app

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "yarn", "run", "start" ]
