<?php
// Enable CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
 
// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}
 
// Get the image path from request
$path = isset($_GET['path']) ? $_GET['path'] : '';
 
// Basic security check - allow access to files within uploads directory
// More permissive pattern to handle various upload folder structures
if (empty($path) || !preg_match('/^\/uploads\//', $path)) {
    header('HTTP/1.1 403 Forbidden');
    echo 'Access denied - Path must be in uploads directory';
    exit;
}
 
// Construct the absolute file path
$filePath = $_SERVER['DOCUMENT_ROOT'] . $path;

// Debug information (remove in production)
error_log("Trying to access image: " . $filePath);
 
// Check if file exists
if (!file_exists($filePath)) {
    header('HTTP/1.1 404 Not Found');
    echo 'File not found: ' . $path;
    error_log("File not found: " . $filePath);
    exit;
}
 
// Get file mime type
$mimeType = mime_content_type($filePath);
if (strpos($mimeType, 'image/') !== 0) {
    header('HTTP/1.1 403 Forbidden');
    echo 'Not an image file';
    error_log("Not an image file: " . $filePath . " (type: " . $mimeType . ")");
    exit;
}
 
// Cache control
header('Cache-Control: max-age=86400'); // 24 hours
 
// Output the image with correct content type
header('Content-Type: ' . $mimeType);
readfile($filePath);
