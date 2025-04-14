<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: text/plain; charset=UTF-8");

echo "=== PHP Environment Information ===\n\n";

echo "Server software: " . $_SERVER['SERVER_SOFTWARE'] . "\n";
echo "PHP version: " . phpversion() . "\n";
echo "Document root: " . $_SERVER['DOCUMENT_ROOT'] . "\n\n";

echo "=== File Upload Configuration ===\n\n";
echo "upload_max_filesize: " . ini_get('upload_max_filesize') . "\n";
echo "post_max_size: " . ini_get('post_max_size') . "\n";
echo "max_file_uploads: " . ini_get('max_file_uploads') . "\n\n";

echo "=== Directory Permissions ===\n\n";
$uploadDir = '/var/www/html/uploads/properties/';

if (!file_exists($uploadDir)) {
    echo "Directory does not exist: " . $uploadDir . "\n";
    echo "Attempting to create it...\n";
    
    if (mkdir($uploadDir, 0777, true)) {
        echo "Directory created successfully!\n";
    } else {
        echo "Failed to create directory.\n";
        echo "Error: " . error_get_last()['message'] . "\n";
    }
} else {
    echo "Directory exists: " . $uploadDir . "\n";
}

echo "Is directory: " . (is_dir($uploadDir) ? 'Yes' : 'No') . "\n";
echo "Is writable: " . (is_writable($uploadDir) ? 'Yes' : 'No') . "\n";

$perms = substr(sprintf('%o', fileperms($uploadDir)), -4);
echo "Permissions: " . $perms . "\n\n";

echo "=== Testing File Creation ===\n\n";
$testFile = $uploadDir . 'test_' . time() . '.txt';
$content = 'This is a test file to verify write permissions.';

if (file_put_contents($testFile, $content) !== false) {
    echo "Successfully created test file: " . $testFile . "\n";
    echo "File content: " . file_get_contents($testFile) . "\n";
    
    // Clean up
    if (unlink($testFile)) {
        echo "Test file removed successfully.\n";
    } else {
        echo "Failed to remove test file.\n";
    }
} else {
    echo "Failed to create test file.\n";
    echo "Error: " . error_get_last()['message'] . "\n";
}

echo "\n=== Directory Contents ===\n\n";
$files = scandir('/var/www/html/uploads/');
echo "Files in /var/www/html/uploads/:\n";
foreach ($files as $file) {
    echo "- $file\n";
}

if (is_dir($uploadDir)) {
    $files = scandir($uploadDir);
    echo "\nFiles in " . $uploadDir . ":\n";
    foreach ($files as $file) {
        echo "- $file\n";
    }
}
?>
