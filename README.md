# ParkingPark

**ParkingPark** is a smart parking management system designed to optimize parking space usage through real-time data and automation. The system offers intuitive interfaces for administrators and users, enabling efficient management of parking spaces, bookings, and overall facility control.

## Features

- **Find the Closest Parking**: Users can quickly locate the nearest available parking spaces using real-time data, making it easier to find parking in busy areas.
- **View All Parking Status**: Displays the status of all nearby parking spaces, showing which spots are available or occupied in real-time, helping users make informed decisions.
- **User Authentication**: Secure login system for both users and administrators, ensuring that only authorized individuals can access and manage the system.
- **Responsive Design**: The system is designed to be accessible and functional on desktop and mobile devices, providing a seamless experience across different platforms.


## Technologies

- **Backend:** 
  - **Node.js:** RESTful API development.
  - **MongoDB:** Database management.

- **Frontend:**
  - **React.JS:** Dynamic and responsive user interface.

- **Security:**
  - **Firebase Auth:** Authentication and authorization.

- **Deployment:**
  - **Docker:** Containerized application.

- **Version Control:**
  - **Git:** Source code management.

## Installation

1. **Clone the repository:**
   ```
   git clone https://github.com/matanew1/ParkingPark.git
   cd ParkingPark
   ```
2. **Backend Setup:**
   Ensure PostgreSQL is installed and running.
   Please update the `application.properties` with your PostgreSQL configuration.
   Build and run the Spring Boot application:
   ```
   ./mvnw spring-boot:run
   ```
3. **Frontend Setup:**
   Navigate to the frontend directory:
   ```
   cd frontend
   ```
   Install dependencies and run the React application:
   ```
   npm install
   npm start
   ```
4. **Docker Deployment:**
   Ensure Docker is installed and running.
   Build and start the containers:
   ```
   docker-compose up --build
   ```
# Usage
 - Access the application at http://localhost:3000 for the frontend.
 - Admin dashboard and APIs are available through the Spring Boot backend at http://localhost:8080.

   

  

   
