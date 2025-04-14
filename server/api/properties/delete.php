<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Include database connection
require_once '../../config/database.php';

// Check if method is DELETE
if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit;
}

// Get ID from URL parameter
if (!isset($_GET['id'])) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Property ID is required']);
    exit;
}

$id = intval($_GET['id']);

try {
    // Begin transaction
    $pdo->beginTransaction();
    
    // First, check if property exists
    $checkStmt = $pdo->prepare("SELECT image_url FROM properties WHERE id = :id");
    $checkStmt->bindParam(':id', $id);
    $checkStmt->execute();
    
    if ($checkStmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Property not found']);
        exit;
    }
    
    $property = $checkStmt->fetch();
    $mainImageUrl = $property['image_url'];
    
    // Get additional images before deleting them
    $imagesStmt = $pdo->prepare("SELECT image_url FROM property_images WHERE property_id = :id");
    $imagesStmt->bindParam(':id', $id);
    $imagesStmt->execute();
    $additionalImages = $imagesStmt->fetchAll(PDO::FETCH_COLUMN);
    
    // Delete property (will cascade to property_images due to foreign key)
    $deleteStmt = $pdo->prepare("DELETE FROM properties WHERE id = :id");
    $deleteStmt->bindParam(':id', $id);
    $deleteStmt->execute();
    
    // Commit transaction
    $pdo->commit();
    
    // Try to delete the image files
    $basePath = $_SERVER['DOCUMENT_ROOT'];
    
    // Delete main image file if it's a local file
    if (strpos($mainImageUrl, '/uploads/') === 0) {
        $mainImagePath = $basePath . $mainImageUrl;
        if (file_exists($mainImagePath)) {
            @unlink($mainImagePath);
        }
    }
    
    // Delete additional image files
    foreach ($additionalImages as $imageUrl) {
        if (strpos($imageUrl, '/uploads/') === 0) {
            $imagePath = $basePath . $imageUrl;
            if (file_exists($imagePath)) {
                @unlink($imagePath);
            }
        }
    }
    
    // Return success response
    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'message' => 'Property deleted successfully'
    ]);
    
} catch (PDOException $e) {
    // Rollback transaction on error
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}
?>
