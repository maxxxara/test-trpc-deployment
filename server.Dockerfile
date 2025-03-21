FROM node:18-alpine as builder

WORKDIR /app

# Copy everything at once
COPY . .

# Install dependencies
RUN npm install --workspace=server --include=dev

# Build with webpack using the config file
RUN cd packages/server && mkdir -p dist && \
    npm run build && \
    cp src/data.json dist/

# Production stage
FROM node:18-alpine as production

WORKDIR /app

# Copy only what you need
COPY --from=builder /app/packages/server/dist ./packages/server/dist
COPY --from=builder /app/packages/server/package.json ./packages/server/
COPY --from=builder /app/package.json ./

# Install production dependencies only
RUN npm install --omit=dev --workspace=server

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

# Start the server
CMD ["node", "./packages/server/dist/index.js"] 