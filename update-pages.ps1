# PowerShell script to add backend integration to HTML pages

$studentPages = @(
    "myGrades.html",
    "myProgress.html", 
    "aptitudeTests.html",
    "codingPractice.html",
    "codeEditor.html",
    "studyMaterial.html",
    "learningGames.html"
)

$headLibraries = @"
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="../assets/script/api-config.js"></script>
</head>
"@

$bodyScripts = @"
    <script src="../assets/script/students.js"></script>
    <script src="../assets/script/student-dashboard.js"></script>
</body>
"@

foreach ($page in $studentPages) {
    $filePath = "d:\Projects\Start-Up\Sowberry\students\$page"
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw
        
        # Add libraries before </head>
        $content = $content -replace '</head>', $headLibraries
        
        # Add scripts before </body> (if not already added)
        if ($content -notmatch 'student-dashboard.js') {
            $content = $content -replace '</body>', $bodyScripts
        }
        
        Set-Content $filePath $content
        Write-Host "Updated: $page" -ForegroundColor Green
    }
}

Write-Host "`nStudent pages updated successfully!" -ForegroundColor Cyan
