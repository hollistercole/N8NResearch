# API Testing with PowerShell

This directory contains PowerShell scripts for testing the Research Task Navigator API endpoints.

## Running the Tests

### Prerequisites

- Windows PowerShell 5.1 or PowerShell Core 7.x
- The Next.js development server must be running (`npm run dev`)

### Steps to Run Tests

1. Make sure your Next.js server is running:
   ```
   npm run dev
   ```

2. Open a PowerShell window

3. Navigate to the project directory:
   ```powershell
   cd path\to\your\project
   ```

4. Run the test script:
   ```powershell
   .\tests\api-tests.ps1
   ```

## What's Being Tested

The test script performs these checks:

- Verifies the server is running
- Tests all API endpoints against the actual database
- Checks that ID-specific endpoints return the correct data
- Verifies filtered endpoints (e.g., subtasks by task ID)
- Tests error handling for invalid IDs
- Validates the response format and data integrity

## Test Output

The script provides detailed output with:

- Color-coded results (green for pass, red for fail)
- Count of records returned for each endpoint
- A summary table of all test results
- Overall pass/fail statistics

## Customizing Tests

You can modify the `api-tests.ps1` script to add new tests or change existing ones:

- Add a new test using the `Test-Endpoint` function
- Modify the base URL if testing on a different port
- Add more assertions to verify data integrity

## Troubleshooting

If tests fail:

1. Verify the Next.js server is running on port 3000
2. Check that database connection is working
3. Ensure table and column names match what the API expects
4. Look at specific error messages for each failed test

## Advanced Usage

### Testing in Production

To test against a production environment, change the base URL:

```powershell
$baseUrl = "https://your-production-url.com/api"
```

### Adding to CI/CD Pipeline

You can incorporate these tests into a CI/CD pipeline by:

1. Running them in a PowerShell task
2. Checking the exit code (0 for success, non-zero for failure)
3. Generating a test report from the output 