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
ENV MONGO_URI=mongodb+srv://matan:matan@cluster0.bgo3pus.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
ENV BASE_URL=https://api.tel-aviv.gov.il/parking/

# Expose the port on which your application listens
EXPOSE 4000

# Start the application
CMD [ "npm", "start" ]