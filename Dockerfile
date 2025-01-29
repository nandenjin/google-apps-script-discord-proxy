# Use an official Node.js runtime as a parent image
# Use an official Node.js runtime as a parent image for the build stage
FROM node:22-slim AS build

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Use a distroless image for the final stage
FROM gcr.io/distroless/nodejs22-debian12

# Set the working directory
WORKDIR /usr/src/app

# Copy the rest of the application code
COPY . .

# Copy the built application from the build stage
COPY --from=build /usr/src/app/node_modules ./node_modules

# Command to run the app
CMD ["src/index.js"]
