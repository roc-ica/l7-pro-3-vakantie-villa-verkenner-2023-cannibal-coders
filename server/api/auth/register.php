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

// Check if required fields are provided
if (!isset($data->username) || !isset($data->email) || !isset($data->password)) {
    http_response_code(400); // Bad Request
    echo json_encode(['status' => 'error', 'message' => 'Username, email and password are required']);
    exit;
}

$username = $data->username;
$email = $data->email;
$password = $data->password; // In production, hash this: password_hash($data->password, PASSWORD_DEFAULT)
$role = 'user'; // Default role for new users

try {
    // Check if email already exists
    $checkStmt = $pdo->prepare("SELECT id FROM users WHERE email = :email");
    $checkStmt->execute(['email' => $email]);
    
    if ($checkStmt->rowCount() > 0) {
        http_response_code(409); // Conflict
        echo json_encode(['status' => 'error', 'message' => 'Email is already registered']);
        exit;
    }
    
    // Insert new user
    $stmt = $pdo->prepare("INSERT INTO users (username, email, password, role, created_at) VALUES (:username, :email, :password, :role, NOW())");
    $stmt->execute([
        'username' => $username,
        'email' => $email,
        'password' => $password, // In production, use the hashed password
        'role' => $role
    ]);
    
    // Get the new user ID
    $userId = $pdo->lastInsertId();
    
    // Fetch the new user to return
    $userStmt = $pdo->prepare("SELECT id, username, email, role, created_at FROM users WHERE id = :id");
    $userStmt->execute(['id' => $userId]);
    $user = $userStmt->fetch();
    
    // Return success response
    http_response_code(201); // Created
    echo json_encode([
        'status' => 'success',
        'message' => 'User registered successfully',
        'user' => $user
    ]);
    
} catch (PDOException $e) {
    http_response_code(500); // Internal Server Error
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
