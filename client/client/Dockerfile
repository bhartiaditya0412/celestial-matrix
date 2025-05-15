# Base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the client code
COPY . .

# Expose Vite frontend port
EXPOSE 5173

# Start Vite dev server
CMD ["npm", "run", "dev"]
