FROM node:18-alpine as builder

WORKDIR /app

# Copy everything at once (we need both client and server for types)
COPY . .

# Install dependencies for client only
RUN npm install --include=dev

# Copy source code for client

# Build client
RUN npm run build --workspace=client

# Production stage - using nginx to serve static files
FROM nginx:alpine as production

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from builder stage
COPY --from=builder /app/packages/client/dist /usr/share/nginx/html

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"] 