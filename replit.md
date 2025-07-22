# Social Media Management Platform

## Overview

This is a comprehensive social media management platform built with modern web technologies. The application provides AI-powered content creation, social media scheduling, analytics tracking, and account management across multiple platforms (Instagram, Facebook, TikTok, Twitter).

## User Preferences

Preferred communication style: Simple, everyday language.

## Project Status

✅ **COMPLETED** - AI-powered social media marketing assistant fully functional (July 18, 2025)

### Recent Changes
- Built complete social media management platform with React/TypeScript frontend
- Integrated OpenAI GPT-4o for caption generation and DALL-E 3 for image creation
- Created comprehensive dashboard with analytics, stats, and upcoming posts
- Implemented content creator with preview and scheduling features
- Added connected accounts management and user settings
- Fixed CSS compatibility issues and ensured smooth operation
- Successfully tested AI content generation with real OpenAI API integration
- Added Instagram Business API integration with OAuth connection flow
- Implemented real account connection system with proper authentication
- Fixed content preview issue - generated images and captions now display properly
- Added mobile-responsive design with collapsible sidebar for better mobile experience
- Implemented touch-friendly interface with proper mobile spacing and typography
- **NEW**: Added "Loadshedding Solutions" niche with daily prompts system focused on Noshedding.co.za
- **NEW**: Implemented daily prompt rotation (Solution Sunday, Tech Tuesday, Watt Wednesday, etc.)
- **NEW**: Enhanced AI content generation with South African context and Noshedding.co.za integration
- **NEW**: Added today's prompt display in content creator with automatic form population
- **NEW**: Removed all mock/demo data - system now uses only real authenticated accounts
- **NEW**: Daily prompts only show when "Loadshedding Solutions" niche is selected
- **LATEST**: Project completely cleaned and ready for GitHub deployment (July 22, 2025)
- **LATEST**: Fixed critical Dialog component error that was breaking the frontend
- **LATEST**: Resolved all merge conflicts throughout the codebase (storage.ts, routes.ts, schema.ts)
- **LATEST**: Enhanced daily prompts with engaging, non-redundant content
- **LATEST**: Added entertaining questions, real product showcases, and static practical tips
- **LATEST**: Integrated actual noshedding.co.za products with prices and detailed explanations
- **LATEST**: Fixed account persistence system - accounts save properly until manually deleted
- **LATEST**: Removed all secrets and sensitive information from codebase for secure deployment
- **LATEST**: Server running successfully with all API endpoints operational
- **LATEST**: Integrated Netlify PostgreSQL database with complete schema migration
- **LATEST**: Successfully seeded database with 7 Loadshedding Solutions daily prompts
- **LATEST**: Converted from in-memory storage to persistent PostgreSQL database
- **LATEST**: Fixed Instagram connection to work with real access tokens

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Library**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for client-side routing
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Development**: Hot reload with Vite integration in development mode

## Key Components

### Database Schema
Located in `shared/schema.ts`, the application uses the following main tables:
- **Users**: User profiles with niche preferences and posting frequency
- **Social Accounts**: Connected social media accounts with platform-specific data
- **Posts**: Content posts with scheduling, status tracking, and analytics
- **Content Generation**: AI-generated content history and prompts
- **Analytics**: Performance metrics and engagement data
- **Daily Prompts**: Pre-configured daily content prompts by niche and day of week
  - Loadshedding Solutions niche with 7 daily categories
  - Automated rotation: Solution Sunday, Monday Forecast, Tech Tuesday, Watt Wednesday, Tips Thursday, Feature Friday, Saturday Polls

### Authentication & Authorization
- User authentication system with password-based login
- Session-based authentication using PostgreSQL sessions

### AI Integration
- **OpenAI Integration**: GPT-4o model for content generation and DALL-E 3 for image creation
- **Content Types**: Caption generation, hashtag suggestions, and image generation
- **Customization**: Niche-specific content with tone and platform optimization
- **Loadshedding Solutions Specialization**: 
  - South African context awareness (Eskom, Stage 6, etc.)
  - Noshedding.co.za product integration
  - Practical solutions focus (WiFi, lighting, food preservation)
  - Community-building tone variations

### Content Management
- **Multi-platform Support**: Instagram, Facebook, TikTok, Twitter
- **Scheduling System**: Future post scheduling with status tracking
- **Content Creator**: AI-powered content generation with preview
- **Analytics Tracking**: Engagement metrics and performance monitoring

## Data Flow

1. **User Authentication**: Users log in and maintain session state
2. **Content Creation**: Users input prompts → AI generates content → Preview and scheduling
3. **Social Account Management**: Users connect social accounts → Platform-specific posting
4. **Analytics Collection**: Post performance data → Dashboard visualization
5. **Data Persistence**: All data stored in PostgreSQL with Drizzle ORM

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **drizzle-orm**: Type-safe database operations
- **openai**: AI content generation
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI components
- **tailwindcss**: Utility-first CSS framework

### Development Dependencies
- **vite**: Build tool and development server
- **typescript**: Type safety
- **@replit/vite-plugin-***: Replit-specific development tools

## Deployment Strategy

### Development
- **Local Development**: Vite dev server with hot reload
- **Environment Variables**: DATABASE_URL, OPENAI_API_KEY
- **Database**: Drizzle migrations with `npm run db:push`

### Production
- **Build Process**: Vite builds client + esbuild bundles server
- **Server**: Node.js with Express serving both API and static files

### Architecture Benefits
- **Full-stack TypeScript**: Shared types and validation schemas
- **Modern React**: Concurrent features and optimized performance
- **Type-safe Database**: Drizzle ORM prevents runtime SQL errors
- **Scalable UI**: Radix UI components with customizable styling
- **AI-powered**: OpenAI integration for intelligent content creation

### Key Design Decisions
- **Monorepo Structure**: Shared code between client/server in `/shared`
- **Component-driven UI**: Reusable components with consistent styling
- **Server-side Sessions**: PostgreSQL sessions for better security
- **Mock Data**: Demo user system for easy testing and development
- **Platform Agnostic**: Support for multiple social media platforms