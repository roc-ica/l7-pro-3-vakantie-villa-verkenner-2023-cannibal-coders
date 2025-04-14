<?php
header('Content-Type: application/json');

try {
    $pdo = new PDO('mysql:host=db;dbname=vakantie_vila', 'user', 'password');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Run some simple queries
    $userCount = $pdo->query('SELECT COUNT(*) FROM users')->fetchColumn();
    $propertyCount = $pdo->query('SELECT COUNT(*) FROM properties')->fetchColumn();
    
    echo json_encode([
        'status' => 'ok',
        'database' => 'connected',
        'counts' => [
            'users' => $userCount,
            'properties' => $propertyCount
        ]
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
    exit(1);
}
