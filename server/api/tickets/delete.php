<?php
// Prevent any unwanted output
ob_start();

// Set headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../../config/database.php';

try {
    // Check if the request is DELETE
    if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
        throw new Exception('Only DELETE method is allowed');
    }
    
    // Get the ticket ID from the URL
    if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
        throw new Exception('Invalid or missing ticket ID');
    }
    
    $ticketId = (int)$_GET['id'];
    
    // Prepare and execute the delete query
    $stmt = $pdo->prepare("DELETE FROM tickets WHERE id = :id");
    $stmt->bindParam(':id', $ticketId, PDO::PARAM_INT);
    $stmt->execute();
    
    // Check if the ticket was actually deleted
    if ($stmt->rowCount() === 0) {
        throw new Exception("Ticket with ID {$ticketId} not found or already deleted");
    }
    
    // Clear any previous output
    if (ob_get_length()) ob_clean();
    
    // Return success response
    echo json_encode([
        'status' => 'success',
        'message' => "Ticket #{$ticketId} deleted successfully"
    ]);
    
} catch (Exception $e) {
    // Clear any previous output
    if (ob_get_length()) ob_clean();
    
    // Set error status code
    http_response_code(500);
    
    // Log the error
    error_log("Error deleting ticket: " . $e->getMessage());
    
    // Return error response
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
?>
