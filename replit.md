# KMRL Document Management System

## Overview

The KMRL Document Management System is a comprehensive web application designed for Kochi Metro Rail Limited to manage railway documents efficiently. The system provides four core features: document upload with AI classification, smart search capabilities, QR code scanning for maintenance job cards, and workflow management for approvals. Built with a modern React frontend and Express.js backend, the application emphasizes clean design, accessibility, and professional appearance suitable for government/enterprise use.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side is built using React 18 with TypeScript, featuring a component-based architecture organized around four main features. The UI leverages shadcn/ui components with Radix UI primitives for accessibility and consistency. State management is handled through React Query for server state and React hooks for local state. The routing system uses Wouter for lightweight client-side navigation between features.

### Backend Architecture  
The server follows a REST API pattern using Express.js with TypeScript. The application uses a modular storage abstraction (IStorage interface) that currently implements in-memory storage with synthetic data but is designed to easily switch to database persistence. API endpoints are organized by feature (documents, workflow, QR codes, stats) with proper error handling and logging middleware.

### Database Design
The schema is defined using Drizzle ORM with PostgreSQL support, featuring four main tables:
- Documents table for storing uploaded files with metadata, classification, and department routing
- Workflow items table for managing approval processes with stages and priorities  
- QR codes table for maintenance job card tracking
- Stats table for dashboard metrics and analytics

### Component Architecture
Components follow a hierarchical structure with a main Dashboard container that routes between four feature views. Each feature is self-contained with its own component, state management, and API interactions. Shared UI components are built using shadcn/ui with consistent styling through CSS variables and Tailwind classes.

### Styling System
Uses Tailwind CSS with a custom design system based on government/enterprise portals. The color palette centers around KMRL Blue (220 85% 45%) with supporting colors for different states. Typography uses Inter font with a defined scale, and the layout follows a responsive grid system with consistent spacing units.

## External Dependencies

### UI Framework
- **React 18** - Frontend framework with hooks and modern patterns
- **TypeScript** - Type safety across frontend and backend
- **Vite** - Build tool and development server with HMR

### Component Library
- **Radix UI** - Unstyled, accessible UI primitives for all interactive components
- **shadcn/ui** - Pre-styled component library built on Radix UI
- **Lucide React** - Icon library for consistent iconography

### Backend Framework
- **Express.js** - Web server framework with middleware support
- **Multer** - File upload handling middleware

### Database & ORM
- **Drizzle ORM** - Type-safe database toolkit with PostgreSQL support
- **Neon Database** - Serverless PostgreSQL database (via @neondatabase/serverless)

### State Management
- **TanStack Query** - Server state management with caching and synchronization
- **React Hook Form** - Form state management with validation

### Styling & Design
- **Tailwind CSS** - Utility-first CSS framework
- **Class Variance Authority** - Component variant management
- **clsx** - Conditional className utility

### Development Tools
- **ESBuild** - Fast JavaScript bundler for production builds
- **PostCSS** - CSS processing with Tailwind and Autoprefixer plugins