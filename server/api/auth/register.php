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

// Validate input
if (!isset($data->username) || !isset($data->email) || !isset($data->password)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Missing required fields"]);
    exit;
}

// Validate email format
if (!filter_var($data->email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid email format"]);
    exit;
}

// Validate password length
if (strlen($data->password) < 6) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Password must be at least 6 characters long"]);
    exit;
}

// Validate username length
if (strlen($data->username) < 3) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Username must be at least 3 characters long"]);
    exit;
}

try {
    // Check if email already exists
    $check_email = "SELECT id FROM users WHERE email = ?";
    $stmt = $pdo->prepare($check_email);
    $stmt->execute([$data->email]);

    if ($stmt->rowCount() > 0) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Email already registered"]);
        exit;
    }

    // Check if username already exists
    $check_username = "SELECT id FROM users WHERE username = ?";
    $stmt = $pdo->prepare($check_username);
    $stmt->execute([$data->username]);

    if ($stmt->rowCount() > 0) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Username already taken"]);
        exit;
    }

    // Hash password
    $hashed_password = password_hash($data->password, PASSWORD_DEFAULT);

    // Insert new user
    $query = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    $stmt = $pdo->prepare($query);
    $stmt->execute([$data->username, $data->email, $hashed_password]);

    if ($stmt->rowCount() > 0) {
        $user_id = $pdo->lastInsertId();
        $user_query = "SELECT id, username, email, created_at FROM users WHERE id = ?";
        $user_stmt = $pdo->prepare($user_query);
        $user_stmt->execute([$user_id]);
        $user = $user_stmt->fetch(PDO::FETCH_ASSOC);

        http_response_code(201);
        echo json_encode([
            "status" => "success",
            "message" => "User registered successfully",
            "user" => $user
        ]);
    } else {
        throw new Exception("Failed to create user");
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Database error occurred"
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}
?>
