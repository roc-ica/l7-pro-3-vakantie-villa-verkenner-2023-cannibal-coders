<?php
require_once '../config/database.php';

header('Content-Type: application/json');

try {
    $stmt = $conn->query("SELECT 1");
    echo json_encode([
        'status' => 'success',
        'message' => 'Database connection successful'
    ]);
} catch(PDOException $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Database connection failed: ' . $e->getMessage()
    ]);
}
// <!-- hallo, team als je niet weet hoe je df in de database kan test m ff met het http://localhost:8000/api/test.php -->
?> 