<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once '../config/database.php';

try {
    $property_id = isset($_GET['property_id']) ? intval($_GET['property_id']) : 0;
    
    if ($property_id <= 0) {
        throw new Exception('Invalid property ID');
    }

    $stmt = $pdo->prepare("SELECT * FROM property_images WHERE property_id = ?");
    $stmt->execute([$property_id]);
    $images = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'status' => 'success',
        'images' => $images
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
