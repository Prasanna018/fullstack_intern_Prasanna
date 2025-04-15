# Use Nginx to serve static frontend files
FROM nginx:alpine

# Copy static files from src/ to the default Nginx public directory
COPY ./src /usr/share/nginx/html

# Expose port 3000 (for consistency)
EXPOSE 3000

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
