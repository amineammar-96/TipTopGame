# Use the official Node.js image as the base image
FROM node:20

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY ["package.json", "package-lock.json","./"]

# Install dependencies
RUN npm i --save --legacy-peer-deps

# Copy the rest of the application code to the container
COPY . ./

# Build the Next.js app
RUN npm run build

# Expose the port that the app will run on
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
