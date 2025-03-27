<?php
// Prevent any unwanted output
ob_start();

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

require_once '../config/database.php';

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    // Get the posted data
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Log the received data for debugging
    error_log("Received ticket data: " . json_encode($data));
    
    // Validate input data
    if (!isset($data['property_id']) || 
        !isset($data['user_name']) || 
        !isset($data['question'])) {
        throw new Exception('Missing required fields');
    }
    
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
    
    // Clear any previous output
    if (ob_get_length()) ob_clean();

    // Send JSON response
    echo json_encode([
        'status' => 'success',
        'message' => 'Ticket created successfully',
        'ticket_id' => $ticketId
    ]);
    
} catch (Exception $e) {
    if (ob_get_length()) ob_clean();
    error_log("Error creating ticket: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
?>
