<?php
// Prevent any unwanted output
ob_start();

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

require_once '../../config/database.php';

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['status' => 'error', 'message' => 'Only POST method is allowed']);
    exit;
}

// Get the posted data
$data = json_decode(file_get_contents('php://input'), true);

// Validate input data
if (!isset($data['property_id']) || 
    !isset($data['user_name']) || 
    !isset($data['question'])) {
    http_response_code(400); // Bad Request
    echo json_encode(['status' => 'error', 'message' => 'Missing required fields']);
    exit;
}

try {
    // Prepare SQL statement
    $stmt = $pdo->prepare("
        INSERT INTO tickets (property_id, user_name, question) 
        VALUES (:property_id, :user_name, :question)
    ");
    
    // Bind parameters and execute
    $stmt->bindParam(':property_id', $data['property_id'], PDO::PARAM_INT);
    $stmt->bindParam(':user_name', $data['user_name'], PDO::PARAM_STR);
    $stmt->bindParam(':question', $data['question'], PDO::PARAM_STR);
    $stmt->execute();
    
    // Get the newly created ticket ID
    $ticketId = $pdo->lastInsertId();
    
    // Fetch the created ticket with property name
    $stmt = $pdo->prepare("
        SELECT t.*, p.name as property_name
        FROM tickets t
        LEFT JOIN properties p ON t.property_id = p.id
        WHERE t.id = :id
    ");
    $stmt->bindParam(':id', $ticketId, PDO::PARAM_INT);
    $stmt->execute();
    $ticket = $stmt->fetch(PDO::FETCH_ASSOC);

    // Clear any previous output
    if (ob_get_length()) ob_clean();

    // Send JSON response
    echo json_encode([
        'status' => 'success',
        'message' => 'Ticket created successfully',
        'ticket' => $ticket
    ], JSON_UNESCAPED_SLASHES);
    exit;

} catch (Exception $e) {
    if (ob_get_length()) ob_clean();
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
    exit;
}
?>
