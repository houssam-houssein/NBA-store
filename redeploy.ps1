# Redeploy Script for GitHub Pages
# This script rebuilds and prepares files for deployment

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "GitHub Pages Redeployment Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Build the project
Write-Host "Step 1: Building project..." -ForegroundColor Green
Set-Location client
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed! Please check for errors." -ForegroundColor Red
    exit 1
}
Set-Location ..

Write-Host "Build completed successfully!" -ForegroundColor Green
Write-Host ""

# Step 2: Remove old docs folder
Write-Host "Step 2: Cleaning old deployment files..." -ForegroundColor Green
if (Test-Path "docs") {
    Remove-Item -Path "docs" -Recurse -Force
    Write-Host "Old docs folder removed." -ForegroundColor Yellow
} else {
    Write-Host "No old docs folder found." -ForegroundColor Yellow
}
Write-Host ""

# Step 3: Create new docs folder
Write-Host "Step 3: Creating new deployment folder..." -ForegroundColor Green
New-Item -ItemType Directory -Path "docs" -Force | Out-Null
Write-Host ""

# Step 4: Copy new files
Write-Host "Step 4: Copying files to docs folder..." -ForegroundColor Green
Copy-Item -Path "client\dist\*" -Destination "docs\" -Recurse -Force
Copy-Item -Path "client\404.html" -Destination "docs\404.html" -Force
Write-Host "Files copied successfully!" -ForegroundColor Green
Write-Host ""

# Step 5: Instructions
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Review the files in the 'docs' folder" -ForegroundColor Yellow
Write-Host "2. Run these Git commands:" -ForegroundColor Yellow
Write-Host ""
Write-Host "   git add docs/" -ForegroundColor White
Write-Host "   git commit -m 'Update deployment with latest changes'" -ForegroundColor White
Write-Host "   git push origin main" -ForegroundColor White
Write-Host ""
Write-Host "3. Go to GitHub → Settings → Pages" -ForegroundColor Yellow
Write-Host "   Make sure source is set to 'main' branch and '/docs' folder" -ForegroundColor Yellow
Write-Host ""
Write-Host "4. Wait 1-5 minutes for GitHub Pages to rebuild" -ForegroundColor Yellow
Write-Host ""
Write-Host "Deployment files are ready in the 'docs' folder!" -ForegroundColor Green

