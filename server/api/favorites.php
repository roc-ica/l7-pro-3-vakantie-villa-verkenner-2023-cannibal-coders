<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../config/database.php';

// Enable error logging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Get user ID from request or authentication
function getCurrentUserId() {
    // Check for user_id in query string
    if (isset($_GET['user_id']) && is_numeric($_GET['user_id'])) {
        return (int) $_GET['user_id'];
    }
    
    // Check for user_id in request body (for POST/DELETE)
    $data = json_decode(file_get_contents("php://input"), true);
    if (isset($data['user_id']) && is_numeric($data['user_id'])) {
        return (int) $data['user_id'];
    }
    
    // Check for session-based authentication (if you implement it)
    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }
    
    if (isset($_SESSION['user_id'])) {
        return (int) $_SESSION['user_id'];
    }
    
    // IMPORTANT: Return null if no valid user ID is found
    return null;
}

try {
    $userId = getCurrentUserId();
    
    // Require authentication for all favorite operations
    if ($userId === null) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Authentication required']);
        exit;
    }
    
    // Log request data
    $requestMethod = $_SERVER['REQUEST_METHOD'];
    error_log("Favorites API called with method: $requestMethod for user: $userId");

    // GET: Fetch user's favorites
    if ($requestMethod === 'GET') {
        $stmt = $pdo->prepare("
            SELECT f.id as favorite_id, f.created_at as favorited_at, p.* 
            FROM favorites f
            JOIN properties p ON f.property_id = p.id
            WHERE f.user_id = :user_id
            ORDER BY f.created_at DESC
        ");
        $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
        $stmt->execute();
        $favorites = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Fetch images for each property
        foreach ($favorites as $key => $property) {
            $imageStmt = $pdo->prepare("SELECT * FROM property_images WHERE property_id = :property_id");
            $imageStmt->bindParam(':property_id', $property['id'], PDO::PARAM_INT);
            $imageStmt->execute();
            $images = $imageStmt->fetchAll(PDO::FETCH_ASSOC);
            $favorites[$key]['images'] = $images;
            
            // Add location option if exists
            if ($property['location_option_id']) {
                $locStmt = $pdo->prepare("SELECT * FROM location_options WHERE id = :id");
                $locStmt->bindParam(':id', $property['location_option_id'], PDO::PARAM_INT);
                $locStmt->execute();
                $locationOption = $locStmt->fetch(PDO::FETCH_ASSOC);
                if ($locationOption) {
                    $favorites[$key]['location_option'] = $locationOption;
                }
            }
        }

        echo json_encode(['status' => 'success', 'favorites' => $favorites]);
    }
    
    // POST: Add a property to favorites
    else if ($requestMethod === 'POST') {
        $rawData = file_get_contents("php://input");
        error_log("Received POST data: " . $rawData);
        
        $data = json_decode($rawData, true);
        
        if (!isset($data['property_id']) || empty($data['property_id'])) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Property ID is required']);
            exit;
        }
        
        $propertyId = $data['property_id'];
        error_log("Adding property ID: $propertyId to favorites for user ID: $userId");
        
        // Verify the property exists
        $verifyStmt = $pdo->prepare("SELECT id FROM properties WHERE id = :property_id");
        $verifyStmt->bindParam(':property_id', $propertyId, PDO::PARAM_INT);
        $verifyStmt->execute();
        
        if ($verifyStmt->rowCount() === 0) {
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'Property not found']);
            exit;
        }
        
        // Check if already favorited
        $checkStmt = $pdo->prepare("SELECT id FROM favorites WHERE user_id = :user_id AND property_id = :property_id");
        $checkStmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
        $checkStmt->bindParam(':property_id', $propertyId, PDO::PARAM_INT);
        $checkStmt->execute();
        
        if ($checkStmt->rowCount() > 0) {
            error_log("Property $propertyId already in favorites for user $userId");
            echo json_encode(['status' => 'success', 'message' => 'Property already in favorites']);
            exit;
        }
        
        // Add to favorites
        $stmt = $pdo->prepare("INSERT INTO favorites (user_id, property_id) VALUES (:user_id, :property_id)");
        $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
        $stmt->bindParam(':property_id', $propertyId, PDO::PARAM_INT);
        $result = $stmt->execute();
        
        if ($result) {
            error_log("Successfully added property $propertyId to favorites for user $userId");
            echo json_encode(['status' => 'success', 'message' => 'Property added to favorites']);
        } else {
            error_log("Failed to add property $propertyId to favorites: " . print_r($stmt->errorInfo(), true));
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Failed to add to favorites']);
        }
    }
    
    // DELETE: Remove from favorites
    else if ($requestMethod === 'DELETE') {
        $rawData = file_get_contents("php://input");
        error_log("Received DELETE data: " . $rawData);
        
        $data = json_decode($rawData, true);
        
        if (!isset($data['property_id']) || empty($data['property_id'])) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Property ID is required']);
            exit;
        }
        
        $propertyId = $data['property_id'];
        error_log("Removing property ID: $propertyId from favorites for user ID: $userId");
        
        $stmt = $pdo->prepare("DELETE FROM favorites WHERE user_id = :user_id AND property_id = :property_id");
        $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
        $stmt->bindParam(':property_id', $propertyId, PDO::PARAM_INT);
        $result = $stmt->execute();
        
        if ($result) {
            $rowCount = $stmt->rowCount();
            error_log("Removed $rowCount favorite entries for property $propertyId");
            echo json_encode(['status' => 'success', 'message' => 'Property removed from favorites']);
        } else {
            error_log("Failed to remove property $propertyId from favorites: " . print_r($stmt->errorInfo(), true));
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Failed to remove from favorites']);
        }
    }
    
} catch (PDOException $e) {
    error_log("Database error in favorites.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
