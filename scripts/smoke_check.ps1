$base = 'https://e-commerce-6kpd.onrender.com/api/v1'
$email = "smoke$(Get-Date -UFormat %s)@example.com"
$password = 'Test1234!'
Write-Host "Registering user: $email"
try {
    $reg = Invoke-RestMethod -Uri "$base/auth/register/" -Method Post -Body (@{ username=$email; email=$email; password=$password; confirm_password=$password } | ConvertTo-Json) -ContentType 'application/json' -ErrorAction Stop
    Write-Host 'REGISTER OK'
    $access = $reg.access; $refresh = $reg.refresh
} catch {
    Write-Host "Register failed, attempting login: $($_.Exception.Message)"
    try {
        $login = Invoke-RestMethod -Uri "$base/auth/login/" -Method Post -Body (@{ username=$email; password=$password } | ConvertTo-Json) -ContentType 'application/json' -ErrorAction Stop
        Write-Host 'LOGIN OK'
        $access = $login.access; $refresh = $login.refresh
    } catch {
        Write-Host "Login failed: $($_.Exception.Message)"
        exit 1
    }
}

if (-not $access) { Write-Host 'No access token obtained'; exit 1 }
Write-Host "Access token length: $($access.Length)"

function safePrint($label, $block) {
    Write-Host "== $label =="
    try {
        $res = & $block
        if ($res -ne $null) { $res | ConvertTo-Json -Depth 6 }
    } catch {
        Write-Host "$label failed: $($_.Exception.Message)"
    }
}

safePrint 'GET /cart/' { Invoke-RestMethod -Uri "$base/cart/" -Method Get -Headers @{ Authorization = "Bearer $access" } -ErrorAction Stop }

safePrint 'POST /cart/add/' { Invoke-RestMethod -Uri "$base/cart/add/" -Method Post -Headers @{ Authorization = "Bearer $access" } -Body (@{ product_id=38; quantity=1 } | ConvertTo-Json) -ContentType 'application/json' -ErrorAction Stop }

safePrint 'POST /cart/update/' { Invoke-RestMethod -Uri "$base/cart/update/" -Method Post -Headers @{ Authorization = "Bearer $access" } -Body (@{ product_id=38; quantity=2 } | ConvertTo-Json) -ContentType 'application/json' -ErrorAction Stop }

safePrint 'GET /wishlist/' { Invoke-RestMethod -Uri "$base/wishlist/" -Method Get -Headers @{ Authorization = "Bearer $access" } -ErrorAction Stop }

safePrint 'POST /wishlist/add/' { Invoke-RestMethod -Uri "$base/wishlist/add/" -Method Post -Headers @{ Authorization = "Bearer $access" } -Body (@{ product_id=38 } | ConvertTo-Json) -ContentType 'application/json' -ErrorAction Stop }

safePrint 'POST /wishlist/remove/' { Invoke-RestMethod -Uri "$base/wishlist/remove/" -Method Post -Headers @{ Authorization = "Bearer $access" } -Body (@{ product_id=38 } | ConvertTo-Json) -ContentType 'application/json' -ErrorAction Stop }

Write-Host 'Smoke checks complete.'
