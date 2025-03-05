<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../../config/database.php';

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->email) || !isset($data->password)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Missing email or password"]);
    exit;
}

try {
    // Get user by email
    $query = "SELECT id, username, email, password, created_at FROM users WHERE email = ?";
    $stmt = $pdo->prepare($query);
    $stmt->execute([$data->email]);
    
    if ($stmt->rowCount() === 0) {
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "Invalid email or password"]);
        exit;
    }

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Verify password
    if (!password_verify($data->password, $user['password'])) {
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "Invalid email or password"]);
        exit;
    }

    // Update last login timestamp
    $update_query = "UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?";
    $update_stmt = $pdo->prepare($update_query);
    $update_stmt->execute([$user['id']]);

    // Remove password from response
    unset($user['password']);

    http_response_code(200);
    echo json_encode([
        "status" => "success",
        "message" => "Login successful",
        "user" => $user
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "An error occurred during login"
    ]);
}
?>
