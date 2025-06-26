## Running the Project with Docker

This project is set up to run both the React client and Node.js server using Docker and Docker Compose. Below are the project-specific instructions and requirements for running the application in containers.

### Project-Specific Docker Requirements

- **Node.js Version:** Both client and server Dockerfiles use `node:22.13.1-slim` (set via `ARG NODE_VERSION=22.13.1`).
- **Dependencies:**
  - The client and server install dependencies using `npm ci` for deterministic builds.
  - The client uses a multi-stage build to produce a production-ready static build, served with the `serve` package.
  - The server installs only production dependencies (`npm ci --production`).
- **Non-root User:** Both containers create and run as a non-root user for security.

### Environment Variables

- No required environment variables are specified in the Dockerfiles or compose file by default.
- If you need to use environment variables, uncomment the `env_file` lines in the `docker-compose.yml` and provide a `.env` file in the respective `./client` or `./server` directories.

### Build and Run Instructions

1. **Ensure Docker and Docker Compose are installed.**
2. **Build and start the services:**
   ```sh
   docker compose up --build
   ```
   This will build and start both the client and server containers.

### Service Ports

- **Client (React app):**
  - Exposed on port **3000** (http://localhost:3000)
- **Server (Node.js/Express):**
  - Exposed on port **5000** (http://localhost:5000)

### Special Configuration

- Both services are connected via a custom Docker network (`app-network`).
- The client is built and served as a static site using the `serve` package.
- The server runs with `NODE_ENV=production` and increased memory limit (`NODE_OPTIONS="--max-old-space-size=4096"`).
- If you need to customize the build (e.g., add environment variables), edit the Dockerfiles or provide `.env` files as needed.

---

_This section was updated to reflect the current Docker-based setup for this project. If you have existing instructions, please ensure they are consistent with the above details._