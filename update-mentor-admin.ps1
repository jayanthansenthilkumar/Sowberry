# Update Mentor Pages
Write-Host "`n=== Updating Mentor Pages ===" -ForegroundColor Cyan

$mentorPages = @(
    "mentorDashboard.html",
    "newCourses.html",
    "newAssignments.html",
    "newEvents.html",
    "newAptitude.html",
    "newproblemSolving.html",
    "studentsProgress.html",
    "mentorDiscussion.html"
)

$headLibraries = @"
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="../assets/script/api-config.js"></script>
</head>
"@

$bodyScripts = @"
    <script src="../assets/script/mentor.js"></script>
    <script src="../assets/script/mentor-dashboard.js"></script>
</body>
"@

foreach ($page in $mentorPages) {
    $filePath = "d:\Projects\Start-Up\Sowberry\mentor\$page"
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw
        
        # Add libraries before </head> if not already added
        if ($content -notmatch 'sweetalert2') {
            $content = $content -replace '</head>', $headLibraries
        }
        
        # Add scripts before </body> if not already added
        if ($content -notmatch 'mentor-dashboard.js') {
            $content = $content -replace '</body>', $bodyScripts
        }
        
        Set-Content $filePath $content
        Write-Host "Updated: $page" -ForegroundColor Green
    }
}

Write-Host "`n=== Updating Admin Pages ===" -ForegroundColor Cyan

$adminPages = @(
    "admin.html",
    "manageStudents.html",
    "manageMentors.html",
    "coursesOverview.html",
    "performanceAnalytics.html",
    "systemReports.html",
    "adminSettings.html"
)

$adminBodyScripts = @"
    <script src="../assets/script/admin-dashboard.js"></script>
</body>
"@

foreach ($page in $adminPages) {
    $filePath = "d:\Projects\Start-Up\Sowberry\admin\$page"
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw
        
        # Add libraries before </head> if not already added
        if ($content -notmatch 'sweetalert2') {
            $content = $content -replace '</head>', $headLibraries
        }
        
        # Add scripts before </body> if not already added
        if ($content -notmatch 'admin-dashboard.js') {
            $content = $content -replace '</body>', $adminBodyScripts
        }
        
        Set-Content $filePath $content
        Write-Host "Updated: $page" -ForegroundColor Green
    }
}

Write-Host "`nAll pages updated successfully!" -ForegroundColor Green
