<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Handle preflight requests
    exit(0);
}

// Include database connection
require_once '../../config/database.php';

// Verify if the request is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit;
}

// Get property ID from URL parameter
$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if (!$id) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Property ID is required']);
    exit;
}

// Function to sanitize input
function sanitize($input) {
    return htmlspecialchars(strip_tags(trim($input)));
}

try {
    // Check if property exists
    $stmt = $pdo->prepare("SELECT * FROM properties WHERE id = :id");
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    
    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Property not found']);
        exit;
    }
    
    $existingProperty = $stmt->fetch();
    
    // Prepare data array from POST and sanitize inputs
    $name = isset($_POST['name']) ? sanitize($_POST['name']) : $existingProperty['name'];
    $location = isset($_POST['location']) ? sanitize($_POST['location']) : $existingProperty['location'];
    $country = isset($_POST['country']) ? sanitize($_POST['country']) : $existingProperty['country'];
    $address = isset($_POST['address']) ? sanitize($_POST['address']) : $existingProperty['address'];
    $capacity = isset($_POST['capacity']) ? intval($_POST['capacity']) : $existingProperty['capacity'];
    $bedrooms = isset($_POST['bedrooms']) ? intval($_POST['bedrooms']) : $existingProperty['bedrooms'];
    $bathrooms = isset($_POST['bathrooms']) ? floatval($_POST['bathrooms']) : $existingProperty['bathrooms'];
    $price = isset($_POST['price']) ? floatval($_POST['price']) : $existingProperty['price'];
    $description = isset($_POST['description']) ? sanitize($_POST['description']) : $existingProperty['description'];
    $amenities = isset($_POST['amenities']) ? sanitize($_POST['amenities']) : $existingProperty['amenities'];
    $property_type = isset($_POST['property_type']) ? sanitize($_POST['property_type']) : $existingProperty['property_type'];
    $status = isset($_POST['status']) ? sanitize($_POST['status']) : $existingProperty['status'];
    
    // Handle location_option_id (important fix)
    $location_option_id = null;
    if (isset($_POST['location_option_id']) && $_POST['location_option_id'] !== '') {
        $location_option_id = intval($_POST['location_option_id']);
        // Debug log
        error_log("Received location_option_id: " . $_POST['location_option_id'] . " | Converted to: " . $location_option_id);
    } else {
        error_log("No location_option_id provided or empty value received");
    }
    
    // Handle the featured field
    $featured = isset($_POST['featured']) ? (int)$_POST['featured'] : 0;
    
    // Start image URL with existing value
    $image_url = $existingProperty['image_url'];
    
    // Handle main image upload if a new image is provided
    if (isset($_FILES['main_image']) && $_FILES['main_image']['error'] === 0) {
        // Use absolute path for Docker container
        $uploadDir = '/var/www/html/uploads/properties/';
        
        // Debug information
        error_log("Upload directory: " . $uploadDir);
        error_log("Directory exists: " . (is_dir($uploadDir) ? 'yes' : 'no'));
        error_log("Directory writable: " . (is_writable($uploadDir) ? 'yes' : 'no'));
        
        // Create directory if it doesn't exist
        if (!is_dir($uploadDir)) {
            if (!mkdir($uploadDir, 0777, true)) {
                error_log("Failed to create directory: " . $uploadDir);
                http_response_code(500);
                echo json_encode(['status' => 'error', 'message' => 'Failed to create upload directory']);
                exit;
            }
            // Set proper permissions
            chmod($uploadDir, 0777);
        }
        
        $fileName = time() . '_' . basename($_FILES['main_image']['name']);
        $targetFilePath = $uploadDir . $fileName;
        
        // Check if image file is an actual image
        $imageFileType = strtolower(pathinfo($targetFilePath, PATHINFO_EXTENSION));
        $validExtensions = ['jpg', 'jpeg', 'png', 'gif'];
        
        if (!in_array($imageFileType, $validExtensions)) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Only JPG, JPEG, PNG & GIF files are allowed']);
            exit;
        }
        
        // Upload the file
        if (move_uploaded_file($_FILES['main_image']['tmp_name'], $targetFilePath)) {
            // Use web path for database
            $image_url = '/uploads/properties/' . $fileName;
            error_log("File uploaded successfully to: " . $targetFilePath);
        } else {
            $error = error_get_last();
            error_log("Failed to move uploaded file to: " . $targetFilePath);
            error_log("Upload error: " . ($error ? $error['message'] : 'Unknown error'));
        }
    }
    
    // Begin transaction
    $pdo->beginTransaction();
    
    // Update property - NOW INCLUDING LOCATION_OPTION_ID AND FEATURED
    $stmt = $pdo->prepare("
        UPDATE properties SET
            name = :name,
            location = :location,
            country = :country,
            address = :address,
            capacity = :capacity,
            bedrooms = :bedrooms,
            bathrooms = :bathrooms,
            price = :price,
            description = :description,
            amenities = :amenities,
            image_url = :image_url,
            property_type = :property_type,
            status = :status,
            location_option_id = :location_option_id,
            featured = :featured,
            updated_at = NOW()
        WHERE id = :id
    ");
    
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':location', $location);
    $stmt->bindParam(':country', $country);
    $stmt->bindParam(':address', $address);
    $stmt->bindParam(':capacity', $capacity);
    $stmt->bindParam(':bedrooms', $bedrooms);
    $stmt->bindParam(':bathrooms', $bathrooms);
    $stmt->bindParam(':price', $price);
    $stmt->bindParam(':description', $description);
    $stmt->bindParam(':amenities', $amenities);
    $stmt->bindParam(':image_url', $image_url);
    $stmt->bindParam(':property_type', $property_type);
    $stmt->bindParam(':status', $status);
    $stmt->bindParam(':location_option_id', $location_option_id, PDO::PARAM_INT);
    $stmt->bindParam(':featured', $featured, PDO::PARAM_INT);
    $stmt->bindParam(':id', $id);
    
    $stmt->execute();
    
    // Handle additional images if provided
    if (isset($_FILES['additional_images']) && is_array($_FILES['additional_images']['name'])) {
        $uploadDir = '/var/www/html/uploads/properties/';
        
        // Prepare statement for multiple inserts
        $imageStmt = $pdo->prepare("
            INSERT INTO property_images (property_id, image_url, image_type, description)
            VALUES (:property_id, :image_url, 'interior', 'Additional image')
        ");
        
        // Loop through each additional image
        for ($i = 0; $i < count($_FILES['additional_images']['name']); $i++) {
            if ($_FILES['additional_images']['error'][$i] === 0) {
                $fileName = time() . '_' . $i . '_' . basename($_FILES['additional_images']['name'][$i]);
                $targetFilePath = $uploadDir . $fileName;
                
                // Check image type
                $imageFileType = strtolower(pathinfo($targetFilePath, PATHINFO_EXTENSION));
                if (in_array($imageFileType, ['jpg', 'jpeg', 'png', 'gif'])) {
                    // Upload file
                    if (move_uploaded_file($_FILES['additional_images']['tmp_name'][$i], $targetFilePath)) {
                        $additionalImageUrl = '/uploads/properties/' . $fileName;
                        
                        // Insert into database
                        $imageStmt->bindParam(':property_id', $id);
                        $imageStmt->bindParam(':image_url', $additionalImageUrl);
                        $imageStmt->execute();
                    }
                }
            }
        }
    }
    
    // Commit transaction
    $pdo->commit();
    
    // Get the updated property
    $stmt = $pdo->prepare("SELECT * FROM properties WHERE id = :id");
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    $property = $stmt->fetch();
    
    // Get property images
    $imageStmt = $pdo->prepare("SELECT * FROM property_images WHERE property_id = :property_id");
    $imageStmt->bindParam(':property_id', $id);
    $imageStmt->execute();
    $images = $imageStmt->fetchAll();
    
    // Add images to property
    $property['images'] = $images;
    
    // Return success response
    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'message' => 'Property updated successfully',
        'property' => $property
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
