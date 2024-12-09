# Use the official Puppeteer image
FROM ghcr.io/puppeteer/puppeteer:latest

# Set the working directory
WORKDIR /app

# Switch to root user to perform installations
USER root

# Copy package.json and package-lock.json first for better caching
COPY package*.json ./

# Add a non-root user
RUN adduser -m puppeteeruser || useradd -m puppeteeruser

# Install Node.js dependencies as root
RUN npm install --production

# Change ownership of the application files to the non-root user
RUN chown -R puppeteeruser:puppeteeruser /app

# Switch to the non-root user
USER puppeteeruser

# Copy the rest of the application code
COPY . .

# Create the public directory and ensure it's writable
RUN mkdir -p /app/public && chown -R puppeteeruser:puppeteeruser /app/public

# Expose the port the app runs on
EXPOSE 8000

# Start the application
CMD ["node", "server.js"]