# Use official Node.js LTS image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the backend source code
COPY . .

# Build TypeScript (if needed)
RUN npm run build

# Expose backend port
EXPOSE 5000

# Start the server
CMD ["npm", "run", "start"]
