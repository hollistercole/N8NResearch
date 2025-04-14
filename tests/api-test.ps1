# Fixed API Test Script
# Tests each endpoint individually against the correct table names

# Configuration
$baseUrl = "http://localhost:3000/api"

Write-Host "Starting API Tests for Research Task Navigator..." -ForegroundColor Yellow
Write-Host "Using correct table names: Task, SubTask, Product, ProductTypeRef, Attachments" -ForegroundColor Yellow

# Helper function for testing an API endpoint
function Test-ApiEndpoint {
    param (
        [string]$Name,
        [string]$Endpoint
    )

    Write-Host "`n----------------------------------------------" -ForegroundColor Cyan
    Write-Host "Testing: $Name" -ForegroundColor Cyan
    Write-Host "URL: $Endpoint" -ForegroundColor Cyan
    Write-Host "----------------------------------------------" -ForegroundColor Cyan

    try {
        # Make the API request
        $response = Invoke-WebRequest -Uri $Endpoint -Method Get -TimeoutSec 10
        
        Write-Host "Status: $($response.StatusCode) $($response.StatusDescription)" -ForegroundColor Green
        
        # Try to parse the JSON response
        try {
            $data = $response.Content | ConvertFrom-Json
            
            if ($data.status -eq "success") {
                if ($data.data -is [Array]) {
                    Write-Host "Success! Found $($data.data.Count) items" -ForegroundColor Green
                } else {
                    Write-Host "Success! Received data" -ForegroundColor Green
                }
                return $data.data
            } else {
                Write-Host "API returned error status: $($data.status)" -ForegroundColor Red
                Write-Host "Error message: $($data.message)" -ForegroundColor Red
                return $null
            }
        } catch {
            Write-Host "Failed to parse JSON response:" -ForegroundColor Red
            Write-Host $response.Content -ForegroundColor Gray
            return $null
        }
    }
    catch {
        Write-Host "Request failed: $_" -ForegroundColor Red
        
        if ($_.Exception.Response) {
            $statusCode = $_.Exception.Response.StatusCode.value__
            Write-Host "Status code: $statusCode" -ForegroundColor Red
            
            # For 500 errors, try to get more details
            if ($statusCode -eq 500) {
                try {
                    $streamReader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
                    $errorContent = $streamReader.ReadToEnd()
                    $streamReader.Close()
                    
                    Write-Host "Error details:" -ForegroundColor Red
                    Write-Host $errorContent -ForegroundColor Gray
                } catch {
                    Write-Host "Could not read error details: $_" -ForegroundColor Red
                }
            }
        }
        
        return $null
    }
}

# Test 1: Product Types (using ProductTypeRef table)
$productTypes = Test-ApiEndpoint -Name "Product Types" -Endpoint "$baseUrl/product-types"

# Remember an ID if available
$productTypeId = $null
if ($productTypes -and $productTypes.Count -gt 0) {
    $productTypeId = $productTypes[0].product_type_id
    
    # If we have an ID, test the individual product type endpoint
    if ($productTypeId) {
        Test-ApiEndpoint -Name "Product Type by ID" -Endpoint "$baseUrl/product-types/$productTypeId"
    }
}

# Test 2: Tasks (using Task table)
$tasks = Test-ApiEndpoint -Name "Tasks" -Endpoint "$baseUrl/tasks"

# Remember an ID if available
$taskId = $null
if ($tasks -and $tasks.Count -gt 0) {
    $taskId = $tasks[0].task_id
    
    # If we have an ID, test the individual task endpoint
    if ($taskId) {
        Test-ApiEndpoint -Name "Task by ID" -Endpoint "$baseUrl/tasks/$taskId"
    }
}

# Test 3: Subtasks (using SubTask table)
$subtasks = Test-ApiEndpoint -Name "Subtasks" -Endpoint "$baseUrl/subtasks"

# Remember an ID if available
$subtaskId = $null
if ($subtasks -and $subtasks.Count -gt 0) {
    $subtaskId = $subtasks[0].subtask_id
    
    # If we have an ID, test the individual subtask endpoint
    if ($subtaskId) {
        Test-ApiEndpoint -Name "Subtask by ID" -Endpoint "$baseUrl/subtasks/$subtaskId"
    }
}

# Test 4: Products (using Product table)
$products = Test-ApiEndpoint -Name "Products" -Endpoint "$baseUrl/products"

# Remember an ID if available
$productId = $null
if ($products -and $products.Count -gt 0) {
    $productId = $products[0].product_id
    
    # If we have an ID, test the individual product endpoint
    if ($productId) {
        Test-ApiEndpoint -Name "Product by ID" -Endpoint "$baseUrl/products/$productId"
    }
}

# Test 5: Attachments (using Attachments table)
$attachments = Test-ApiEndpoint -Name "Attachments" -Endpoint "$baseUrl/attachments"

# Remember an ID if available
$attachmentId = $null
if ($attachments -and $attachments.Count -gt 0) {
    $attachmentId = $attachments[0].attachment_id
    
    # If we have an ID, test the individual attachment endpoint
    if ($attachmentId) {
        Test-ApiEndpoint -Name "Attachment by ID" -Endpoint "$baseUrl/attachments/$attachmentId"
    }
}

# Test filtered endpoints if we have IDs
if ($taskId) {
    Test-ApiEndpoint -Name "Subtasks by Task ID" -Endpoint "$baseUrl/subtasks?task_id=$taskId"
}

if ($subtaskId) {
    Test-ApiEndpoint -Name "Products by Subtask ID" -Endpoint "$baseUrl/products?subtask_id=$subtaskId"
    Test-ApiEndpoint -Name "Attachments by Subtask ID" -Endpoint "$baseUrl/attachments?subtask_id=$subtaskId"
}

Write-Host "`n----------------------------------------------" -ForegroundColor Yellow
Write-Host "All tests completed" -ForegroundColor Yellow
Write-Host "----------------------------------------------" -ForegroundColor Yellow 