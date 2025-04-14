# Very Simple API Test with Added Diagnostics
# Tests just one endpoint with minimal dependencies

# Configuration
$baseUrl = "http://localhost:3000/api"

Write-Host "Testing API endpoint: $baseUrl/product-types"

try {
    # Enable verbose error details
    $ProgressPreference = 'SilentlyContinue'  # Suppress progress bar
    
    # First try a simple GET request to the base URL
    Write-Host "Checking server base URL..."
    try {
        $baseResponse = Invoke-WebRequest -Uri "http://localhost:3000" -Method Get -TimeoutSec 5
        Write-Host "  Base URL is accessible: $($baseResponse.StatusCode) $($baseResponse.StatusDescription)" -ForegroundColor Green
    } catch {
        Write-Host "  WARNING: Base URL returned error: $_" -ForegroundColor Yellow
        Write-Host "  This may be expected if the root path has no handler" -ForegroundColor Yellow
    }
    
    # Call the API endpoint 
    Write-Host "Calling API endpoint..."
    $response = Invoke-WebRequest -Uri "$baseUrl/product-types" -Method Get -TimeoutSec 10
    
    Write-Host "  Status Code: $($response.StatusCode) $($response.StatusDescription)" -ForegroundColor Cyan
    Write-Host "  Content Type: $($response.Headers["Content-Type"])" -ForegroundColor Cyan
    
    # Try to parse the JSON
    try {
        $data = $response.Content | ConvertFrom-Json
        
        # Check if the response is successful
        if ($data.status -eq "success") {
            Write-Host "  SUCCESS: API returned success status" -ForegroundColor Green
            Write-Host "  Found $($data.data.Count) product types" -ForegroundColor Green
        } 
        else {
            Write-Host "  ERROR: API returned error status: $($data.status)" -ForegroundColor Red
            Write-Host "  Error message: $($data.message)" -ForegroundColor Red
            if ($data.error) {
                Write-Host "  Error details: $($data.error)" -ForegroundColor Red
            }
        }
    } catch {
        Write-Host "  FAILED to parse JSON response" -ForegroundColor Red
        Write-Host "  Raw content:" -ForegroundColor Red
        Write-Host "-----------------------------" -ForegroundColor Red
        Write-Host $response.Content -ForegroundColor Gray
        Write-Host "-----------------------------" -ForegroundColor Red
    }
}
catch {
    Write-Host "ERROR: Failed to call API endpoint" -ForegroundColor Red
    Write-Host "Exception details: $_" -ForegroundColor Red
    
    # Try to extract more details about the error
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode.value__
        $statusDesc = $_.Exception.Response.StatusDescription
        Write-Host "Status code: $statusCode $statusDesc" -ForegroundColor Red
        
        # If it's a 500 error, try to get the response body
        if ($statusCode -eq 500) {
            try {
                $stream = $_.Exception.Response.GetResponseStream()
                $reader = New-Object System.IO.StreamReader($stream)
                $errorBody = $reader.ReadToEnd()
                Write-Host "Server error response:" -ForegroundColor Red
                Write-Host $errorBody -ForegroundColor Gray
            } catch {
                Write-Host "Could not read error response: $_" -ForegroundColor Red
            }
        }
    }
}

Write-Host "Test complete!" 