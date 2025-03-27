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

    // Modified query to join with location_options table
    $stmt = $pdo->prepare("
        SELECT p.*, 
               lo.id AS location_option_id, 
               lo.name AS location_option_name, 
               lo.description AS location_option_description
        FROM properties p
        LEFT JOIN location_options lo ON p.location_option_id = lo.id
        WHERE p.id = ?
    ");
    $stmt->execute([$id]);
    $property = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$property) {
        throw new Exception("Property not found");
    }

    // Extract location option data
    if ($property['location_option_id']) {
        $property['location_option'] = [
            'id' => $property['location_option_id'],
            'name' => $property['location_option_name'],
            'description' => $property['location_option_description']
        ];
        
        // Remove redundant fields from main property object
        unset($property['location_option_name']);
        unset($property['location_option_description']);
    } else {
        $property['location_option'] = null;
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
