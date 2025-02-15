
# Stage 1: Build the application
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Enable layer caching for dependencies
COPY package.json yarn.lock ./

# Install all dependencies (including devDependencies) for build
RUN yarn install --frozen-lockfile

# Copy application files
COPY . .

# Build the project
RUN yarn build

# Stage 2: Production image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install production dependencies only
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production

# Copy built assets from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Configure SSH (Alpine-specific)
RUN apk add --no-cache openssh && \
    echo "root:Docker!" | chpasswd && \
    ssh-keygen -A && \
    mkdir -p /var/run/sshd

COPY sshd_config /etc/ssh/

# Cleanup to reduce image size
RUN rm -rf /var/cache/apk/* /tmp/*

# Expose ports
EXPOSE 8080 2222

# Run SSH in background and Next.js as main process
CMD ["sh", "-c", "/usr/sbin/sshd -D & exec yarn start -p 8080"]


# # Build the Docker image
# docker build -t libraryacr.azurecr.io/next-react:nextreact8080extstorage .

# # Log in to Azure Container Registry
# az acr login --name libraryacr

# # Push the Docker image to Azure Container Registry
# docker push libraryacr.azurecr.io/next-react:nextreact8080extstorage

# # Run the Docker container
# docker run -p 8080:8080 libraryacr.azurecr.io/next-react:nextreact8080extstorage
