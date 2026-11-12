# BookApp

Web application to manage books, categories, authors and publishers.
Built with Node.js, Express, Handlebars, Sequelize and Bootstrap (MVC).

## Requirements

- Node.js 18 or newer
- MySQL (only for the QA environment)

## Installation

```bash
npm install
```

## Environments

The app has two environments. Each one reads its own file in the project root.

| Environment | Command | Env file | Database |
|---|---|---|---|
| development | `npm run dev` | `.env.development` | SQLite (`database/bookapp.sqlite`) |
| qa | `npm run qa` | `.env.qa` | MySQL |

`cross-env` sets `NODE_ENV` and `dotenv` loads the matching file.

### Setup

1. Copy `.env.example` to `.env.development` and `.env.qa`.
2. **development:** keep `DB_DIALECT=sqlite` and `DB_STORAGE=database/bookapp.sqlite`.
3. **qa:** set `DB_DIALECT=mysql` and fill in `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER` and `DB_PASSWORD`.
4. **qa:** create the database once before the first run:

```sql
CREATE DATABASE bookapp_qa CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Tables are created automatically on startup (`sequelize.sync()`).
The app starts at http://localhost:8080.

## Project structure

```
config/        environment loading and Sequelize connection
context/       AppContext: models, relations and database access
models/        Sequelize models
controllers/   request handling
routes/        URL mapping
views/         Handlebars views (layouts/layout.hbs)
public/        Bootstrap and static files
database/      local SQLite file (not versioned)
```

## Features

- Home: book list with search by title and filter by one or more categories.
- Book detail page.
- CRUD for books, categories, authors and publishers, with delete confirmation.
- Categories, authors and publishers with associated books cannot be deleted.