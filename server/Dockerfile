# Base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the server code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Push schema and seed DB
RUN npx prisma db push && npm run seed

# Expose backend port
EXPOSE 3000

# Start server in dev mode
CMD ["npm", "run", "devStart"]
