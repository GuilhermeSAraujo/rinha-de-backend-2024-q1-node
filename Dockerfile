FROM node:20.5.1-buster
ENV NODE_ENV=production
# Create app directory
# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json into the directory /app in the container
COPY ./src/package*.json ./

# Install the application dependencies inside the container
RUN npm install --production

# If you are building your code for production
# RUN npm ci --only=production

# Bundle the app source inside the container
COPY ./src .

# Expose port 8080 for the app to be accessible externally
EXPOSE 8080

# Define the command to run the app
CMD [ "node", "src/index.js" ]