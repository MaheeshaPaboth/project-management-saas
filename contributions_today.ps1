Write-Host "Fetching today's GitHub contributions..."
# Ensure we are in the git repository root
git rev-parse --show-toplevel > $null 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Error "Not a git repository. Please run this script from the repository root."
    exit 1
}
# Get commits since midnight (local time)
$since = (Get-Date).Date.ToString("yyyy-MM-ddTHH:mm:ss")
$commits = git log --since="$since" --pretty=format:"%h %an %ad %s" --date=short
if (-not $commits) {
    Write-Host "No contributions today."
    exit 0
}
Write-Host "Commits made today:"
$commits
Write-Host "\nTotal count: $(($commits | Measure-Object).Count)"
