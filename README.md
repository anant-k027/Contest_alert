# Contest Alert

A full-stack MERN web application that reminds users about upcoming competitive programming contests.

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB

### Setup

1. **Clone the repository**

2. **Server Setup**
   ```bash
   cd server
   npm install
   ```
   - Copy `server/.env.example` to `server/.env` and update the values.
   - Run the server: `npm run dev` (starts on http://localhost:5000)

3. **Client Setup**
   ```bash
   cd client
   npm install
   ```
   - Copy `client/.env.example` to `client/.env`.
   - Run the client: `npm run dev` (starts on http://localhost:5173)

The client is configured to proxy API requests (`/api`) to the backend server.
