# Use the official Puppeteer image
FROM ghcr.io/puppeteer/puppeteer:latest

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Switch to root user if necessary
USER root

# Add a non-root user
RUN adduser -m puppeteeruser || useradd -m puppeteeruser

# Create the public directory and ensure it's writable
RUN mkdir -p /app/public && chown -R puppeteeruser:puppeteeruser /app/public

# Change ownership of the application files
RUN chown -R puppeteeruser:puppeteeruser /app/public

# Switch to the non-root user
USER puppeteeruser

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Start the application
CMD ["node", "server.js"]