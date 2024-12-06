# Event Planning System
This project is a full-stack application for managing an event planning system. The project consists of a frontend and a backend. Follow the steps below to set up and run the project.


## Project Structure

project-folder/
├── server/     # Backend code
├── yazlab/     # Frontend code
└── README.md   # This file


## İnstalling Dependencies

### 1. Frontend Dependencies
Navigate to the yazlab directory and install the required dependencies:

cd yazlab
npm install

### 2. Backend Dependencies
Return to the root directory and navigate to the server directory to install backend dependencies:

cd ..
cd server
npm install

## Running the Project

###1. Starting the Frontend
To start the frontend application:

cd yazlab
npm run dev

## 2. Starting the Backend
To start the backend server:

cd ..
cd server
npm start

## 3. Running the Socket.io Server
To start the Socket.io server:

node server.js



## Notes
Dependency Files: All dependencies are listed in the package.json files for both the frontend and backend. Follow the steps above to install them.
Ports: By default, the frontend runs on port 3000 and the backend on port 5000. If there are conflicts, update the port settings as needed.

## Contributing
If you would like to contribute to this project, please open a pull request or create an issue. All feedback is welcome!

