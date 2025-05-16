# Riddle App ( SET- 3 ) 

A React application that displays random riddles and allows users to manage their favorite riddles.

## Features

- Fetches random riddles from an external API
- Automatic riddle refresh every 15 seconds
- Toggle answer visibility
- Add/remove riddles to favorites
- Persistent storage using localStorage
- Error handling with user-friendly messages
- Loading indicators for better UX

## Project Structure
``` 
src/
├── components/
│   ├── Navigation.js     # Handles tab navigation
│   ├── RiddleCard.js     # Displays individual riddles
│   └── FavoritesList.js  # Manages favorite riddles
├── App.js                # Main application logic
└── App.css
```


## Technical Approach

### State Management
- Uses React's useState for local state management
- Implements useEffect for API calls and localStorage synchronization
- Centralized state handling in App.js

### Data Persistence
- Favorites stored in browser's localStorage
- Automatic state synchronization
- Persistent data across page refreshes

### Error Handling
- Comprehensive API error handling
- User-friendly error messages
- Automatic retry mechanism
- Network error recovery

### UI/UX Features
- Loading indicators during data fetching
- Responsive design for all screen sizes
- Clear visual feedback for user actions
- Intuitive navigation between random and favorite riddles

## Getting Started

1. **Clone the repository:**

    ```bash
    git clone https://github.com/Shashank-Ge/Riddle-app.git
    ```

2. **Navigate to the project directory:**

    ```bash
    cd Riddle-app
    ```

3. **Install dependencies:**

    ```bash
    npm install
    ```

4. **Start the development server:**

    ```bash
    npm start
    ```

The app will automatically open in your default browser at [http://localhost:3000](http://localhost:3000).

