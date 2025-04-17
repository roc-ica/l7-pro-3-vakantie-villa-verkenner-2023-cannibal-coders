<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');
 
// Get the image URL from the request
$imageUrl = isset($_GET['url']) ? $_GET['url'] : '';
 
if (empty($imageUrl)) {
    header('HTTP/1.1 400 Bad Request');
    echo json_encode(['error' => 'Image URL is required']);
    exit;
}
 
// Decode URL if it's encoded
$imageUrl = urldecode($imageUrl);
 
// Handle local file URLs - if the URL points to our own server,
// we should access the file directly rather than via HTTP
$serverHost = $_SERVER['HTTP_HOST'];
if (strpos($imageUrl, $serverHost) !== false || strpos($imageUrl, '/uploads/') === 0) {
    // Extract the local path
    $localPath = parse_url($imageUrl, PHP_URL_PATH);
    if ($localPath && file_exists($_SERVER['DOCUMENT_ROOT'] . $localPath)) {
        $imageData = file_get_contents($_SERVER['DOCUMENT_ROOT'] . $localPath);
        $contentType = mime_content_type($_SERVER['DOCUMENT_ROOT'] . $localPath);
       
        header('Content-Type: ' . $contentType);
        echo $imageData;
        exit;
    }
}
 
// Generate a cache filename based on the URL
$cacheDir = __DIR__ . '/uploads/cache/';
if (!is_dir($cacheDir)) {
    mkdir($cacheDir, 0777, true);
}
$cacheFile = $cacheDir . md5($imageUrl);
 
// Check if the image is already cached
if (file_exists($cacheFile) && (time() - filemtime($cacheFile) < 86400)) { // 24 hour cache
    $imageData = file_get_contents($cacheFile);
    $contentType = mime_content_type($cacheFile);
} else {
    // Initialize cURL
    $ch = curl_init();
   
    // Set cURL options
    curl_setopt($ch, CURLOPT_URL, $imageUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
   
    // Add proper referrer to help bypass some restrictions
    curl_setopt($ch, CURLOPT_REFERER, 'https://www.google.com/');
   
    // Set additional headers that might help with access
    $headers = [
        'Accept: image/webp,image/apng,image/*,*/*;q=0.8',
        'Accept-Language: en-US,en;q=0.9',
        'Cache-Control: no-cache'
    ];
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
   
    // Execute cURL
    $imageData = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
   
    // Check for cURL errors
    if (curl_errno($ch)) {
        $error = curl_error($ch);
        curl_close($ch);
       
        // Try an alternative method - file_get_contents with stream context
        $context = stream_context_create([
            'http' => [
                'method' => 'GET',
                'header' => "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36\r\n" .
                           "Accept: image/webp,image/apng,image/*,*/*;q=0.8\r\n" .
                           "Referer: https://www.google.com/\r\n"
            ],
            'ssl' => [
                'verify_peer' => false,
                'verify_peer_name' => false,
            ],
        ]);
       
        $imageData = @file_get_contents($imageUrl, false, $context);
        if ($imageData !== false) {
            // Determine content type
            $contentType = '';
            foreach ($http_response_header as $header) {
                if (strpos(strtolower($header), 'content-type:') === 0) {
                    $contentType = trim(substr($header, 13));
                    break;
                }
            }
           
            // Cache the image from fallback method
            file_put_contents($cacheFile, $imageData);
        } else {
            // Both methods failed
            header('HTTP/1.1 404 Not Found');
            echo json_encode(['error' => 'Failed to fetch image: ' . $error]);
            exit;
        }
    } else {
        // Close cURL
        curl_close($ch);
       
        // Check if the request was successful
        if ($httpCode !== 200 || empty($imageData)) {
            header('HTTP/1.1 404 Not Found');
            echo json_encode(['error' => 'Failed to fetch image: HTTP ' . $httpCode]);
            exit;
        }
       
        // Cache the image
        file_put_contents($cacheFile, $imageData);
    }
}
 
// If we got here but don't have a content type, try to detect it
if (empty($contentType)) {
    $contentType = mime_content_type($cacheFile);
   
    // If still empty, use a default
    if (empty($contentType)) {
        $contentType = 'image/jpeg';
    }
}
 
// Send the image
header('Content-Type: ' . $contentType);
echo $imageData;
?>
