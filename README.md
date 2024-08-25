# ParkingPark

**ParkingPark** is a smart parking management system designed to optimize parking space usage through real-time data and automation. The system offers intuitive interfaces for administrators and users, enabling efficient management of parking spaces, bookings, and overall facility control.

## Features

- **Real-time Space Monitoring:** Track available parking spaces in real-time.
- **Booking Management:** Users can book parking spaces in advance.
- **Admin Dashboard:** Manage parking facility, view reports, and control access.
- **User Authentication:** Secure login system for users and administrators.
- **Responsive Design:** Accessible on both desktop and mobile devices.

## Technologies

- **Backend:** 
  - **Spring Boot:** RESTful API development.
  - **Hibernate:** ORM for database interaction.
  - **Postgresql:** Database management.

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

   

  

   
