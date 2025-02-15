<?php
require_once '../config/database.php';

// Set CORS headers first, before any output
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');
header('Content-Type: application/json; charset=UTF-8');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    // Debug logging
    error_log('Received request with params: ' . print_r($_GET, true));

    $query = "SELECT *, COALESCE(status, 'available') as status FROM properties WHERE 1=1";
    $params = [];

    // Add search filter
    if (isset($_GET['search']) && !empty($_GET['search'])) {
        $query .= " AND (name LIKE ? OR description LIKE ? OR location LIKE ?)";
        $searchTerm = "%" . $_GET['search'] . "%";
        $params = array_merge($params, [$searchTerm, $searchTerm, $searchTerm]);
    }

    // Add location filter
    if (isset($_GET['location']) && !empty($_GET['location'])) {
        $query .= " AND location LIKE ?";
        $params[] = "%" . $_GET['location'] . "%";
    }

    // Add country filter
    if (isset($_GET['country']) && !empty($_GET['country'])) {
        $query .= " AND country LIKE ?";
        $params[] = "%" . $_GET['country'] . "%";
    }

    // Add price range filter
    if (isset($_GET['min_price'])) {
        $query .= " AND price >= ?";
        $params[] = $_GET['min_price'];
    }
    if (isset($_GET['max_price'])) {
        $query .= " AND price <= ?";
        $params[] = $_GET['max_price'];
    }

    // Add bedrooms filter
    if (isset($_GET['min_bedrooms'])) {
        $query .= " AND bedrooms >= ?";
        $params[] = $_GET['min_bedrooms'];
    }

    // Add capacity filter
    if (isset($_GET['min_capacity'])) {
        $query .= " AND capacity >= ?";
        $params[] = $_GET['min_capacity'];
    }

    // Add amenities filter
    if (isset($_GET['amenities']) && !empty($_GET['amenities'])) {
        $amenitiesList = explode(',', $_GET['amenities']);
        $amenityConditions = [];
        foreach ($amenitiesList as $amenity) {
            $amenityConditions[] = "amenities LIKE ?";
            $params[] = "%$amenity%";
        }
        $query .= " AND (" . implode(" OR ", $amenityConditions) . ")";
    }

    // Add property type filter
    if (isset($_GET['property_type']) && !empty($_GET['property_type'])) {
        $query .= " AND property_type = ?";
        $params[] = $_GET['property_type'];
        error_log("Adding property type filter: " . $_GET['property_type']);
    }

    // Add country filter (exact match)
    if (isset($_GET['country_exact']) && !empty($_GET['country_exact'])) {
        $query .= " AND country = ?";
        $params[] = $_GET['country_exact'];
        error_log("Adding country filter: " . $_GET['country_exact']);
    }

    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    $properties = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Transform the results to ensure status is always set
    $properties = array_map(function($property) {
        $property['status'] = $property['status'] ?? 'available';
        return $property;
    }, $properties);

    error_log('Found ' . count($properties) . ' properties');

    echo json_encode([
        'status' => 'success',
        'count' => count($properties),
        'properties' => $properties
    ]);

} catch(Exception $e) {
    error_log('Error in properties.php: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
?>
