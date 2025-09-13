# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Strapi CMS application for a publishing website with content management capabilities. The application uses TypeScript and includes various content types for articles, newsletters, products, and more.

## Development Commands

```bash
# Install dependencies
npm install

# Development server with auto-reload
npm run dev
# or
npm run develop

# Production server
npm run start

# Build admin panel
npm run build

# Access Strapi console
npm run console
```

## Architecture

### Core Structure
- **Strapi v5.23.0** with TypeScript support
- **Database**: Configurable (SQLite for development, PostgreSQL for production)
- **Storage**: AWS S3 for file uploads
- **Email**: Nodemailer with SMTP configuration

### API Structure (`src/api/`)
Each API entity follows Strapi's modular structure:
- `content-types/`: Schema definitions
- `controllers/`: Business logic and endpoint handlers
- `routes/`: API route configurations
- `services/`: Reusable service layer

### Key Content Types
- **Article**: Main content articles with images, categories, and tags
- **Newsletter**: Newsletter system with drafts and email integration
- **Product**: Product catalog with reviews and feature values
- **Autosearch**: Search functionality with JSON caching for products and universal search
- **Category/Topic/Tag**: Content organization and taxonomy
- **User Activity**: User engagement tracking
- **Digital Footprint/Export History**: User data management

### Custom Controllers

The application uses custom controller implementations extending Strapi's factory controllers. Key patterns:

1. **Document API**: Uses Strapi v5's new document API (`strapi.documents()`)
2. **Population**: Custom population of relations in `find` and `findOne` methods
3. **Search JSON Generation**: Autosearch controller generates cached JSON for search functionality

Example pattern from newsletter controller:
```typescript
strapi.documents("api::newsletter.newsletter").findOne({
    documentId: id,
    populate: {
        newsletter_drafts: { fields: ["outline", "body_text"] },
        topic_id: { fields: ["title", "description"] }
    }
});
```

### Configuration

Key configuration files in `config/`:
- `database.ts`: Database connections (MySQL, PostgreSQL, SQLite)
- `plugins.ts`: Email (SMTP) and upload (AWS S3) configurations
- `middlewares.ts`: CORS, security, and middleware setup
- `cron-tasks.ts`: Scheduled jobs (newsletter tasks)

### Environment Variables

Required environment variables:
- Database: `DATABASE_CLIENT`, `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_NAME`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`
- AWS S3: `AWS_ACCESS_KEY_ID`, `AWS_ACCESS_SECRET`, `AWS_REGION`, `AWS_BUCKET`, `CDN_URL`
- Email: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USERNAME`, `SMTP_PASSWORD`, `DEFAULT_FROM_EMAIL`

### TypeScript Configuration

- Target: ES2019
- Module: CommonJS
- Output: `dist/` directory
- Includes all `.ts`, `.js`, and `src/**/*.json` files
- Excludes: `node_modules/`, `build/`, `dist/`, `.cache/`, `.tmp/`, `src/admin/`, test files