<?php
// Prevent any unwanted output
ob_start();

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once '../config/database.php';

try {
    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
    
    if ($id <= 0) {
        throw new Exception('Invalid ID');
    }

    $stmt = $pdo->prepare("SELECT * FROM properties WHERE id = ?");
    $stmt->execute([$id]);
    $property = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$property) {
        throw new Exception("Property not found");
    }

    $stmt = $pdo->prepare("SELECT * FROM property_images WHERE property_id = ?");
    $stmt->execute([$id]);
    $images = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $property['images'] = $images;

    // Clear any previous output
    if (ob_get_length()) ob_clean();

    // Send JSON response
    echo json_encode([
        'status' => 'success',
        'property' => $property
    ], JSON_UNESCAPED_SLASHES);
    exit;

} catch (Exception $e) {
    if (ob_get_length()) ob_clean();
    http_response_code(404);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
    exit;
}
?>
