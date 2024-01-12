# Transaction Service

This project is set up to use TypeScript, ESLint (following Airbnb's style rules), Prettier for code formatting, and `nyc` for code coverage.

## Development Environment Setup

### Prerequisites

- Node.js (recommended version: 14.x or higher)
- npm (comes with Node.js)

# Running the Application Locally

npm run start:dev

# Linting and Formatting ( ESLint )

npx eslint .

# Prettier

npx prettier --write .

# Running ESLint and Prettier on VS Code Save

{
"editor.codeActionsOnSave": {
"source.fixAll.eslint": true
},
"eslint.validate": ["javascript", "javascriptreact", "typescript", "typescriptreact"]
}

# Testing and Code Coverage

npm test

# Code Coverage

npm run coverage

This will generate a coverage report in the terminal and also create a more detailed HTML report in the coverage directory.
