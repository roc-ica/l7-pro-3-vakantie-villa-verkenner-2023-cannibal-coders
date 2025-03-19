<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../config/database.php';

try {
    // Build the query with potential filters
    $query = "SELECT p.*, lo.name as location_option_name 
              FROM properties p
              LEFT JOIN location_options lo ON p.location_option_id = lo.id";
    $where = [];
    $params = [];
    
    if (isset($_GET['search']) && !empty($_GET['search'])) {
        $search = "%" . $_GET['search'] . "%";
        $where[] = "(p.name LIKE :search OR p.location LIKE :search OR p.description LIKE :search)";
        $params[':search'] = $search;
    }
    
    if (isset($_GET['location']) && !empty($_GET['location'])) {
        $location = "%" . $_GET['location'] . "%";
        $where[] = "p.location LIKE :location";
        $params[':location'] = $location;
    }

    if (isset($_GET['country']) && !empty($_GET['country'])) {
        $country = $_GET['country'];
        $where[] = "p.country = :country";
        $params[':country'] = $country;
    }
    
    if (isset($_GET['min_price']) && is_numeric($_GET['min_price'])) {
        $where[] = "p.price >= :min_price";
        $params[':min_price'] = $_GET['min_price'];
    }
    
    if (isset($_GET['max_price']) && is_numeric($_GET['max_price'])) {
        $where[] = "p.price <= :max_price";
        $params[':max_price'] = $_GET['max_price'];
    }
    
    if (isset($_GET['min_bedrooms']) && is_numeric($_GET['min_bedrooms'])) {
        $where[] = "p.bedrooms >= :min_bedrooms";
        $params[':min_bedrooms'] = $_GET['min_bedrooms'];
    }
    
    if (isset($_GET['min_capacity']) && is_numeric($_GET['min_capacity'])) {
        $where[] = "p.capacity >= :min_capacity";
        $params[':min_capacity'] = $_GET['min_capacity'];
    }
    
    // Add filter for property type
    if (isset($_GET['property_type']) && !empty($_GET['property_type'])) {
        $where[] = "p.property_type = :property_type";
        $params[':property_type'] = $_GET['property_type'];
    }
    
    // Add filter for location_option_id
    if (isset($_GET['location_option_id']) && is_numeric($_GET['location_option_id'])) {
        $where[] = "p.location_option_id = :location_option_id";
        $params[':location_option_id'] = intval($_GET['location_option_id']);
    }
    
    // Add filter for amenities
    if (isset($_GET['amenities']) && !empty($_GET['amenities'])) {
        $amenitiesList = explode(',', $_GET['amenities']);
        $amenityConditions = [];
        
        foreach ($amenitiesList as $index => $amenity) {
            $paramName = ":amenity{$index}";
            $amenityConditions[] = "p.amenities LIKE {$paramName}";
            $params[$paramName] = "%{$amenity}%";
        }
        
        if (!empty($amenityConditions)) {
            $where[] = "(" . implode(" AND ", $amenityConditions) . ")";
        }
    }
    
    if (!empty($where)) {
        $query .= " WHERE " . implode(" AND ", $where);
    }
    
    $stmt = $pdo->prepare($query);
    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value);
    }
    $stmt->execute();
    
    $properties = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Get images for each property
    foreach ($properties as $key => $property) {
        $imageStmt = $pdo->prepare("SELECT * FROM property_images WHERE property_id = :property_id");
        $imageStmt->bindParam(':property_id', $property['id'], PDO::PARAM_INT);
        $imageStmt->execute();
        $images = $imageStmt->fetchAll(PDO::FETCH_ASSOC);
        $properties[$key]['images'] = $images;
        
        // Include location option data in a consistent format
        if ($property['location_option_id']) {
            $locationStmt = $pdo->prepare("SELECT * FROM location_options WHERE id = :id");
            $locationStmt->bindParam(':id', $property['location_option_id'], PDO::PARAM_INT);
            $locationStmt->execute();
            $locationOption = $locationStmt->fetch(PDO::FETCH_ASSOC);
            
            if ($locationOption) {
                $properties[$key]['location_option'] = $locationOption;
            }
        }
    }
    
    echo json_encode(['status' => 'success', 'properties' => $properties]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
