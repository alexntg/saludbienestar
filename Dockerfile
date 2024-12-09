# Use official Node.js LTS (Long Term Support) image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache bash

# Copy package files first to leverage Docker cache
COPY html/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the application code
COPY html/ .

# Expose the port the app runs on
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Command to run the application
CMD ["npm", "start"]
