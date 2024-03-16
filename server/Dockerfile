# Use an official Node.js runtime as the base image
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the project dependencies
RUN npm install

# Copy the rest of the project files to the container
COPY . .

# Set environment variables
ENV NODE_ENV=production

# Expose the port on which your application listens
EXPOSE 4000

# Start the application
CMD [ "npm", "start" ]