# Use official Node.js image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the NestJS application
COPY . .

# Generate Prisma client inside the container
RUN npx prisma generate

# Expose port 3001 for NestJS
EXPOSE 3001

# Start the NestJS app and run migrations
CMD ["sh", "-c", "npx prisma migrate dev && npm run dev"]
