# Database Table Structure Checker
# This script checks the database connection and table structure to help diagnose API errors

# Import necessary modules
Add-Type -Path "C:\Program Files (x86)\MySQL\MySQL Connector NET 8.0.33\MySql.Data.dll" -ErrorAction SilentlyContinue

Write-Host "Database Table Structure Checker" -ForegroundColor Cyan
Write-Host "--------------------------------" -ForegroundColor Cyan

# If the MySQL.Data assembly isn't found, provide instructions
if (-not ([System.AppDomain]::CurrentDomain.GetAssemblies() | Where-Object { $_.FullName -like "*MySql.Data*" })) {
    Write-Host "MySQL.Data assembly not found. You need to:" -ForegroundColor Yellow
    Write-Host "1. Install MySQL Connector/NET from https://dev.mysql.com/downloads/connector/net/" -ForegroundColor Yellow
    Write-Host "2. Update the path in this script to match your installation location" -ForegroundColor Yellow
    Write-Host "3. Or run: Install-Package MySql.Data -Scope CurrentUser" -ForegroundColor Yellow
    exit
}

# Get environment variables or use defaults - matching db.ts approach
$envFile = Join-Path (Get-Location) ".env.local"
$envVars = @{}

# Try to load environment variables from .env.local if it exists
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match "^\s*([^#][^=]+)=(.*)$") {
            $envVars[$Matches[1]] = $Matches[2]
        }
    }
    Write-Host "Loaded environment variables from .env.local" -ForegroundColor Green
}

# Database connection parameters - use environment variables or defaults just like db.ts
$dbHost = if ($envVars.ContainsKey("DB_HOST")) { $envVars["DB_HOST"] } 
         elseif ($env:DB_HOST) { $env:DB_HOST } 
         else { "54.176.154.219" }

$dbPort = if ($envVars.ContainsKey("DB_PORT")) { $envVars["DB_PORT"] } 
         elseif ($env:DB_PORT) { $env:DB_PORT } 
         else { "3306" }

$dbName = if ($envVars.ContainsKey("DB_NAME")) { $envVars["DB_NAME"] } 
         elseif ($env:DB_NAME) { $env:DB_NAME } 
         else { "demo_database" }

$dbUser = if ($envVars.ContainsKey("DB_USER")) { $envVars["DB_USER"] } 
         elseif ($env:DB_USER) { $env:DB_USER } 
         else { "demo_user" }

# Password handling - follows similar approach as db.ts
function getPassword {
    # Try to get password from environment variables
    $base64Password = $null
    
    if ($envVars.ContainsKey("DB_PASSWORD_BASE64")) { 
        $base64Password = $envVars["DB_PASSWORD_BASE64"] 
    }
    elseif ($env:DB_PASSWORD_BASE64) { 
        $base64Password = $env:DB_PASSWORD_BASE64 
    }
    elseif ($envVars.ContainsKey("DB_PASSWORD")) { 
        $base64Password = $envVars["DB_PASSWORD"] 
    }
    elseif ($env:DB_PASSWORD) { 
        $base64Password = $env:DB_PASSWORD 
    }
    
    if ($base64Password) {
        try {
            # Try to decode from base64
            $bytes = [System.Convert]::FromBase64String($base64Password)
            $decodedPassword = [System.Text.Encoding]::UTF8.GetString($bytes)
            return $decodedPassword
        }
        catch {
            Write-Host "Warning: Could not decode password from base64, using as-is" -ForegroundColor Yellow
            return $base64Password
        }
    }
    
    # Default password if not in environment
    return "Password123!"
}

$dbPassword = getPassword

Write-Host "Connecting to database server: $dbHost" -ForegroundColor Cyan
Write-Host "Database: $dbName" -ForegroundColor Cyan
Write-Host "User: $dbUser" -ForegroundColor Cyan

try {
    # Create connection with settings that match db.ts
    $connectionString = "Server=$dbHost;Port=$dbPort;Database=$dbName;Uid=$dbUser;Pwd=$dbPassword;ConnectionTimeout=5"
    $connection = New-Object MySql.Data.MySqlClient.MySqlConnection($connectionString)
    
    Write-Host "Attempting connection (timeout: 5s)..." -ForegroundColor Yellow
    $connection.Open()
    
    Write-Host "Connection successful!" -ForegroundColor Green
    
    # Test a simple query
    Write-Host "`nRunning test query..." -ForegroundColor Cyan
    $testCmd = New-Object MySql.Data.MySqlClient.MySqlCommand("SELECT 1 AS test", $connection)
    $reader = $testCmd.ExecuteReader()
    $reader.Read() | Out-Null
    Write-Host "Test query result: $($reader['test'])" -ForegroundColor Green
    $reader.Close()
    
    # Get table list
    Write-Host "`nGetting table list..." -ForegroundColor Cyan
    $tablesCmd = New-Object MySql.Data.MySqlClient.MySqlCommand("SHOW TABLES", $connection)
    $reader = $tablesCmd.ExecuteReader()
    
    $tables = @()
    while ($reader.Read()) {
        $tables += $reader[0]
    }
    $reader.Close()
    
    Write-Host "Found $($tables.Count) tables:" -ForegroundColor Green
    foreach ($table in $tables) {
        Write-Host "  - $table" -ForegroundColor Gray
    }
    
    # Check each table structure
    foreach ($table in $tables) {
        Write-Host "`nChecking structure of table: $table" -ForegroundColor Cyan
        
        $describeQuery = "DESCRIBE " + $table
        $columnsCmd = New-Object MySql.Data.MySqlClient.MySqlCommand($describeQuery, $connection)
        $reader = $columnsCmd.ExecuteReader()
        
        $columns = @()
        while ($reader.Read()) {
            $column = @{
                "Field" = $reader["Field"]
                "Type" = $reader["Type"]
                "Null" = $reader["Null"]
                "Key" = $reader["Key"]
                "Default" = $reader["Default"]
                "Extra" = $reader["Extra"]
            }
            $columns += $column
            
            # Format the output
            $nullStr = if ($column["Null"] -eq "YES") { "NULL" } else { "NOT NULL" }
            $keyStr = if ($column["Key"] -eq "PRI") { "PRIMARY KEY" } elseif ($column["Key"] -eq "UNI") { "UNIQUE" } else { "" }
            $defaultStr = if ($null -ne $column["Default"]) { "DEFAULT '$($column["Default"])'" } else { "" }
            
            Write-Host "  $($column["Field"]): $($column["Type"]) $nullStr $keyStr $defaultStr $($column["Extra"])" -ForegroundColor Gray
        }
        $reader.Close()
        
        # Get row count
        $countQuery = "SELECT COUNT(*) FROM " + $table
        $countCmd = New-Object MySql.Data.MySqlClient.MySqlCommand($countQuery, $connection)
        $count = $countCmd.ExecuteScalar()
        Write-Host "  Row count: $count" -ForegroundColor Gray
        
        # Sample data (only if there are rows)
        if ($count -gt 0) {
            $sampleQuery = "SELECT * FROM " + $table + " LIMIT 1"
            $sampleCmd = New-Object MySql.Data.MySqlClient.MySqlCommand($sampleQuery, $connection)
            $reader = $sampleCmd.ExecuteReader()
            
            if ($reader.Read()) {
                Write-Host "  Sample data:" -ForegroundColor Gray
                for ($i = 0; $i -lt $reader.FieldCount; $i++) {
                    $columnName = $reader.GetName($i)
                    $value = $reader[$i]
                    $displayValue = if ($null -eq $value) { "NULL" } else { $value.ToString() }
                    Write-Host "    $columnName = $displayValue" -ForegroundColor Gray
                }
            }
            $reader.Close()
        }
    }
}
catch {
    Write-Host "ERROR: $_" -ForegroundColor Red
    Write-Host "Stack trace: $($_.Exception.StackTrace)" -ForegroundColor Red
}
finally {
    # Close the connection
    if ($connection -and $connection.State -eq 'Open') {
        $connection.Close()
        Write-Host "`nConnection closed" -ForegroundColor Cyan
    }
}

Write-Host "`nDatabase check complete" -ForegroundColor Cyan 