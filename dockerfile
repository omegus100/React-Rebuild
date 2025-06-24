# Use the official Node.js LTS image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Set environment variables (can be overridden at runtime)
ENV PORT=5000
ENV MONGO_URI=mongodb://localhost:27017/mydatabase

# Expose the port your app runs on
EXPOSE 5000

# Start the server
CMD ["node", "index.js"]