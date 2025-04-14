<?php
require_once '../config/database.php';

header('Content-Type: application/json');

try {
    $stmt = $pdo->query('SELECT * FROM hero_images ORDER BY created_at DESC');
    $heroImages = $stmt->fetchAll();

    echo json_encode([
        'success' => true,
        'data' => [
            'heroImages' => $heroImages,
            'popularLocations' => ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Gold Coast']
        ]
    ]);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Failed to fetch hero images: ' . $e->getMessage()
    ]);
}
