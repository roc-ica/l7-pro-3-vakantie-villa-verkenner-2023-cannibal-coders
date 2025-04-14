<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Enable error display for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once '../config/database.php';

try {
    // Test database connection
    $pdo->query("SELECT 1");
    echo json_encode(["status" => "success", "message" => "Database connection is working"]);
    
    // Check tables
    $tables = ['properties', 'users', 'favorites'];
    $tableResults = [];
    
    foreach ($tables as $table) {
        $stmt = $pdo->query("SELECT COUNT(*) as count FROM $table");
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        $tableResults[$table] = $result['count'];
    }
    
    // Check user record
    $userStmt = $pdo->query("SELECT * FROM users WHERE id = 2");
    $userExists = $userStmt->rowCount() > 0;
    
    // Check favorites
    $favoritesStmt = $pdo->query("SELECT f.id, f.user_id, f.property_id, p.name as property_name, u.username 
                                FROM favorites f 
                                JOIN properties p ON f.property_id = p.id
                                JOIN users u ON f.user_id = u.id");
    $favorites = $favoritesStmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        "status" => "success",
        "dbStatus" => "Connected",
        "tableCounts" => $tableResults,
        "user2Exists" => $userExists,
        "favorites" => $favorites
    ]);
    
} catch (PDOException $e) {
    echo json_encode([
        "status" => "error",
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>
