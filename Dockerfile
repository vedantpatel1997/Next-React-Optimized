# # Use an official Node.js runtime as a parent image
# FROM node:20

# # Set the working directory in the container
# WORKDIR /app

# # Copy package.json and install dependencies
# COPY package.json yarn.lock ./
# RUN yarn install

# # Copy the rest of the app
# COPY . .

# # Build the Next.js app
# RUN yarn build

# # Expose port 3000
# EXPOSE 8080

# # Run the app
# CMD ["yarn", "start"]





# Why is this optimized?
# Uses Alpine → Base image is node:20-alpine, which is much smaller than node:20.
# Multi-stage build → Avoids unnecessary files (e.g., devDependencies, cache).
# Only copies required files → Reduces the final image size significantly.
# Runs with the correct port (8080) → Ensures your container works as expected.

# Use a smaller base image
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files first (better caching)
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy rest of the application
COPY . .

# Build the Next.js app
RUN yarn build

# Use a lightweight runtime image
# FROM node:20-alpine

# # Set working directory
# WORKDIR /app

# # Copy only the necessary files from builder
# COPY --from=builder /app/package.json /app/yarn.lock ./
# COPY --from=builder /app/.next .next
# COPY --from=builder /app/public public
# COPY --from=builder /app/node_modules node_modules

# Expose the new port
EXPOSE 8080

# Run the app on port 8080
CMD ["yarn", "start", "-p", "8080"]
