# Ticketing Microservices Application

Welcome to the **Ticketing Microservices Application**! This project is a comprehensive demonstration of a cloud-native, microservices-based architecture built using modern technologies and best practices. It showcases my expertise in designing, developing, and deploying scalable and maintainable distributed systems.

## Features

- **Microservices Architecture**: Each service is independently deployable and scalable.
- **Event-Driven Communication**: Services communicate asynchronously using **NATS Streaming**.
- **Authentication and Authorization**: Secure user authentication and role-based access control.
- **CI/CD Pipeline**: Automated testing, building, and deployment using **Skaffold** and Kubernetes.
- **Frontend with Next.js**: A modern, responsive UI built with **Next.js** and styled using **Tailwind CSS**.
- **Database Integration**: MongoDB for data persistence and Redis for caching.
- **Payment Processing**: Integration with **Stripe** for secure payment handling.
- **Error Handling**: Centralized error handling and custom error classes for better debugging.

## Tech Stack

### Backend

- **Node.js** with **TypeScript** for type-safe server-side development.
- **Express.js** for building RESTful APIs.
- **MongoDB** for database management.
- **Redis** for caching and message queues.
- **NATS Streaming** for event-driven architecture.
- **Stripe API** for payment processing.

### Frontend

- **Next.js** for server-side rendering and static site generation.
- **Tailwind CSS** for modern, utility-first styling.

### DevOps

- **Docker** for containerization of services.
- **Kubernetes** for orchestration and scaling.
- **Skaffold** for CI/CD pipeline automation.
- **Ingress-NGINX** for load balancing and routing.

## Project Structure

The project is organized into multiple microservices, each with its own domain logic:

- **auth**: Handles user authentication and authorization.
- **client**: The frontend application.
- **common**: Shared utilities and libraries.
- **expiration**: Manages ticket expiration logic.
- **order**: Handles order creation and management.
- **payment**: Processes payments using Stripe.
- **ticket**: Manages ticket creation and updates.

## Skills Demonstrated

- **Microservices Design**: Expertise in designing loosely coupled, highly cohesive services.
- **Cloud-Native Development**: Proficiency in Kubernetes, Docker, and CI/CD pipelines.
- **Full-Stack Development**: Experience with both backend and frontend technologies.
- **Event-Driven Systems**: Building resilient systems using message brokers like NATS.
- **Secure Development**: Implementing secure authentication and payment systems.

## How to Run

1. Clone the repository.
2. Install dependencies for each service using `npm install`.
3. Start the Kubernetes cluster and deploy services using `skaffold dev`.
4. Access the application at the configured ingress URL.

## Contact

Feel free to reach out if you have any questions or would like to discuss this project further. This project is a testament to my ability to build and manage complex systems, and I am excited to bring these skills to your team!
