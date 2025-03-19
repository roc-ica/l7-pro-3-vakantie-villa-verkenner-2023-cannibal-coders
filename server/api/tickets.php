<?php
// Prevent any unwanted output
ob_start();

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once '../config/database.php';

try {
    $stmt = $pdo->prepare("
        SELECT t.*, p.name as property_name
        FROM tickets t
        LEFT JOIN properties p ON t.property_id = p.id
        ORDER BY t.created_at DESC
    ");
    $stmt->execute();
    $tickets = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Clear any previous output
    if (ob_get_length()) ob_clean();

    // Send JSON response
    echo json_encode([
        'status' => 'success',
        'tickets' => $tickets
    ], JSON_UNESCAPED_SLASHES);
    exit;

} catch (Exception $e) {
    if (ob_get_length()) ob_clean();
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
    exit;
}
?>
