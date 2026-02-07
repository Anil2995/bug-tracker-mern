# Bug Tracker API Test Script
# Test authentication endpoints

Write-Host "🧪 Testing Bug Tracker API Authentication" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Server Health Check
Write-Host "Test 1: Server Health Check" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/" -UseBasicParsing
    $data = $response.Content | ConvertFrom-Json
    Write-Host "✅ Server is running!" -ForegroundColor Green
    Write-Host "   Message: $($data.message)" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "❌ Server is not running!" -ForegroundColor Red
    exit
}

# Test 2: Register New User
Write-Host "Test 2: Register New User" -ForegroundColor Yellow
$registerBody = @{
    name = "John Doe"
    email = "john@example.com"
    password = "password123"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/register" `
        -Method POST `
        -Body $registerBody `
        -ContentType "application/json" `
        -UseBasicParsing
    
    $data = $response.Content | ConvertFrom-Json
    Write-Host "✅ User registered successfully!" -ForegroundColor Green
    Write-Host "   User ID: $($data.user._id)" -ForegroundColor Gray
    Write-Host "   Name: $($data.user.name)" -ForegroundColor Gray
    Write-Host "   Email: $($data.user.email)" -ForegroundColor Gray
    Write-Host "   Role: $($data.user.role)" -ForegroundColor Gray
    Write-Host "   Token: $($data.token.Substring(0,20))..." -ForegroundColor Gray
    $global:token = $data.token
    Write-Host ""
} catch {
    Write-Host "❌ Registration failed!" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    
    # Try to get error details
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $errorBody = $reader.ReadToEnd()
        $errorData = $errorBody | ConvertFrom-Json
        Write-Host "   Details: $($errorData.error)" -ForegroundColor Red
    }
    Write-Host ""
}

# Test 3: Login
Write-Host "Test 3: Login with Credentials" -ForegroundColor Yellow
$loginBody = @{
    email = "john@example.com"
    password = "password123"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" `
        -Method POST `
        -Body $loginBody `
        -ContentType "application/json" `
        -UseBasicParsing
    
    $data = $response.Content | ConvertFrom-Json
    Write-Host "✅ Login successful!" -ForegroundColor Green
    Write-Host "   User: $($data.user.name)" -ForegroundColor Gray
    Write-Host "   Email: $($data.user.email)" -ForegroundColor Gray
    Write-Host "   Token: $($data.token.Substring(0,20))..." -ForegroundColor Gray
    $global:token = $data.token
    Write-Host ""
} catch {
    Write-Host "❌ Login failed!" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# Test 4: Get Current User (Protected Route)
Write-Host "Test 4: Get Current User (Protected Route)" -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $global:token"
    }
    
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/me" `
        -Method GET `
        -Headers $headers `
        -UseBasicParsing
    
    $data = $response.Content | ConvertFrom-Json
    Write-Host "✅ Protected route accessed successfully!" -ForegroundColor Green
    Write-Host "   User ID: $($data.user._id)" -ForegroundColor Gray
    Write-Host "   Name: $($data.user.name)" -ForegroundColor Gray
    Write-Host "   Email: $($data.user.email)" -ForegroundColor Gray
    Write-Host "   Role: $($data.user.role)" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "❌ Failed to access protected route!" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# Test 5: Invalid Login (Wrong Password)
Write-Host "Test 5: Invalid Login (Wrong Password)" -ForegroundColor Yellow
$invalidBody = @{
    email = "john@example.com"
    password = "wrongpassword"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" `
        -Method POST `
        -Body $invalidBody `
        -ContentType "application/json" `
        -UseBasicParsing
    
    Write-Host "❌ This should have failed!" -ForegroundColor Red
} catch {
    Write-Host "✅ Correctly rejected invalid credentials!" -ForegroundColor Green
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🎉 All tests completed!" -ForegroundColor Green
Write-Host ""
Write-Host "Your JWT token is stored in `$global:token" -ForegroundColor Yellow
Write-Host "You can use it for authenticated requests:" -ForegroundColor Yellow
Write-Host "  `$headers = @{ 'Authorization' = 'Bearer ' + `$global:token }" -ForegroundColor Gray
