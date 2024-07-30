# Stage 1: Build React app
FROM node:14 AS build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# Stage 2: Serve the app with an Express server
FROM node:14

WORKDIR /app

# Copy the package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the build directory from the previous stage
COPY --from=build /app/build ./build

# Copy the server code and the database file
COPY server.js ./
COPY ledgerDB.sqlite ./

# Expose port
EXPOSE 3000

# Command to run the app
CMD ["node", "server.js"]
