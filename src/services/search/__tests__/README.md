
# Search Module Tests

This directory contains tests for the search functionality modules.

## Running Tests

Since we cannot modify package.json to add testing scripts, you can run these tests manually:

1. Install Vitest globally:
   ```
   npm install -g vitest
   ```

2. Run the tests from the project root:
   ```
   npx vitest run src/services/search/__tests__/runTests.ts
   ```

## Test Coverage

These tests cover the core functionality of the search modules:

- `types.ts`: Validates the SearchAnalysis type structure
- `queryProcessor.ts`: Tests natural language query processing 
- `movieScoring.ts`: Tests the movie scoring algorithm
- `movieGenerator.ts`: Tests the movie generation functionality

## Adding More Tests

When adding new tests, simply create additional test files in this directory with names like `moduleName.test.ts`.
