<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Handle preflight requests
    exit(0);
}

// Include database connection
require_once '../../config/database.php';

// Check if the request is a POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['status' => 'error', 'message' => 'Only POST method is allowed']);
    exit;
}

// Get the input data
$data = json_decode(file_get_contents("php://input"));

// Check if email and password are provided
if (!isset($data->email) || !isset($data->password)) {
    http_response_code(400); // Bad Request
    echo json_encode(['status' => 'error', 'message' => 'Email and password are required']);
    exit;
}

$email = $data->email;
$password = $data->password;

try {
    // Use PDO prepared statement to prevent SQL injection
    $query = "SELECT id, username, email, password, role, created_at FROM users WHERE email = :email";
    $stmt = $pdo->prepare($query);
    $stmt->execute(['email' => $email]);
    
    if ($stmt->rowCount() > 0) {
        $user = $stmt->fetch();
        
        // In production, use password_verify to check hashed passwords
        // For demo purposes with plaintext passwords:
        if ($password === 'password123') {  // In production: password_verify($password, $user['password'])
            // Remove password from user array before sending response
            unset($user['password']);
            
            // Return user data
            http_response_code(200);
            echo json_encode([
                'status' => 'success',
                'message' => 'Login successful',
                'user' => $user
            ]);
        } else {
            http_response_code(401); // Unauthorized
            echo json_encode(['status' => 'error', 'message' => 'Invalid credentials']);
        }
    } else {
        http_response_code(401); // Unauthorized
        echo json_encode(['status' => 'error', 'message' => 'User not found']);
    }
} catch (PDOException $e) {
    http_response_code(500); // Internal Server Error
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
