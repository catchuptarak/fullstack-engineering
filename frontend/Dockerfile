# Use official Node.js image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the Next.js application
COPY . .

# Expose port 3000
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "run", "dev"]
