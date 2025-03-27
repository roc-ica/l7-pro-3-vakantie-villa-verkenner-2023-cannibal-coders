# Create uploads directory structure
New-Item -ItemType Directory -Path "uploads\properties" -Force

# Set full permissions for Everyone (equivalent to chmod 777)
$Acl = Get-Acl "uploads"
$AccessRule = New-Object System.Security.AccessControl.FileSystemAccessRule(
    "Everyone",
    "FullControl",
    "ContainerInherit,ObjectInherit",
    "None",
    "Allow"
)
$Acl.SetAccessRule($AccessRule)
Set-Acl "uploads" $Acl

Write-Host "Uploads directory created and permissions set"