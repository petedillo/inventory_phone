# Game Inventory Mobile App

A React Native mobile application that serves as a game companion app, connecting to a Node.js backend to manage game inventory with real-time updates using WebSockets.

## Features

- User management (create, select, delete)
- Inventory management (add, edit, delete items)
- Real-time updates via WebSockets
- Dark/light mode support
- Responsive UI for different device sizes

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- A running backend server (Node.js with Express, Socket.io)

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd mobile-inventory
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Configure environment variables
   
   Create a `.env` file in the root directory with the following variables:
   ```
   # Discord OAuth Configuration
   EXPO_PUBLIC_DISCORD_CLIENT_ID=YOUR_DISCORD_CLIENT_ID_HERE
   
   # API Configuration
   EXPO_PUBLIC_API_URL=http://YOUR_COMPUTER_IP:3000
   ```
   
   Replace `YOUR_DISCORD_CLIENT_ID_HERE` with your actual Discord client ID from the [Discord Developer Portal](https://discord.com/developers/applications).
   
   Replace `YOUR_COMPUTER_IP` with your computer's IP address.

4. Start the app
   ```bash
   npm start
   ```

5. Use the Expo Go app on your device or an emulator to run the app

### Troubleshooting

#### WebSocket Connection Issues

If you encounter WebSocket connection errors:

1. **Check your backend server URL**: Make sure you're using your computer's actual IP address, not 'localhost'
   ```bash
   # Find your IP address
   ifconfig | grep "inet " | grep -v 127.0.0.1  # macOS/Linux
   ipconfig                                      # Windows
   ```

2. **Verify network connectivity**: Ensure your device and computer are on the same network

3. **Check firewall settings**: Make sure your firewall isn't blocking connections to your backend port

4. **Verify backend configuration**: Ensure your backend is configured to accept connections from external IPs
   ```javascript
   // In your Node.js server
   const server = app.listen(3000, '0.0.0.0', () => {
     console.log('Server running on port 3000');
   });
   ```

5. **Check CORS settings**: Make sure your backend has proper CORS configuration
   ```javascript
   // In your Node.js server
   const cors = require('cors');
   app.use(cors());

   // For Socket.io
   const io = require('socket.io')(server, {
     cors: {
       origin: "*",
       methods: ["GET", "POST"]
     }
   });
   ```

#### Items Not Displaying

If items are not displaying in the inventory:

1. **Check API response structure**: The API might be returning `Items` (capital I) instead of `items` (lowercase i)

2. **Verify item creation**: Make sure items are being created successfully in the backend

3. **Check WebSocket events**: Ensure WebSocket events are being received for item updates

4. **Manual refresh**: Try using the pull-to-refresh gesture to manually refresh the inventory

## Project Structure

- `/app`: Main application screens and navigation
- `/components`: Reusable UI components
- `/context`: React Context for state management
- `/services`: API and WebSocket services
- `/constants`: App constants like colors and theme

## Technologies Used

- React Native with Expo
- React Navigation
- Axios for API requests
- Socket.io for real-time updates
- Context API for state management

## Original Expo Documentation

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

### Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

### Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
