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
    $query = "SELECT * FROM properties";
    $where = [];
    $params = [];
    
    if (isset($_GET['search']) && !empty($_GET['search'])) {
        $search = "%" . $_GET['search'] . "%";
        $where[] = "(name LIKE :search OR location LIKE :search OR description LIKE :search)";
        $params[':search'] = $search;
    }
    
    if (isset($_GET['location']) && !empty($_GET['location'])) {
        $location = "%" . $_GET['location'] . "%";
        $where[] = "location LIKE :location";
        $params[':location'] = $location;
    }

    if (isset($_GET['country']) && !empty($_GET['country'])) {
        $country = $_GET['country'];
        $where[] = "country = :country";
        $params[':country'] = $country;
    }
    
    if (isset($_GET['min_price']) && is_numeric($_GET['min_price'])) {
        $where[] = "price >= :min_price";
        $params[':min_price'] = $_GET['min_price'];
    }
    
    if (isset($_GET['max_price']) && is_numeric($_GET['max_price'])) {
        $where[] = "price <= :max_price";
        $params[':max_price'] = $_GET['max_price'];
    }
    
    if (isset($_GET['min_bedrooms']) && is_numeric($_GET['min_bedrooms'])) {
        $where[] = "bedrooms >= :min_bedrooms";
        $params[':min_bedrooms'] = $_GET['min_bedrooms'];
    }
    
    if (isset($_GET['min_capacity']) && is_numeric($_GET['min_capacity'])) {
        $where[] = "capacity >= :min_capacity";
        $params[':min_capacity'] = $_GET['min_capacity'];
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
    }
    
    echo json_encode(['status' => 'success', 'properties' => $properties]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
