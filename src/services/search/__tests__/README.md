
# Search Module Tests

This directory contains tests for the search functionality modules.

## Running Tests

Since we cannot install Vitest as a dependency, we'll use a simpler approach to testing. The `runTests.ts` file contains basic validation tests that can be run using the TypeScript compiler:

```bash
# First compile the tests
npx tsc src/services/search/__tests__/runTests.ts --esModuleInterop --module commonjs

# Then run the compiled JavaScript
node src/services/search/__tests__/runTests.js
```

## Test Coverage

These tests cover the core functionality of the search modules:

- `types.ts`: Validates the SearchAnalysis type structure
- `queryProcessor.ts`: Tests natural language query processing 
- `movieScoring.ts`: Tests the movie scoring algorithm
- `movieGenerator.ts`: Tests the movie generation functionality

## Adding More Tests

When adding new tests, simply extend the runTests.ts file with additional test cases.
