<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");

echo json_encode([
    'status' => 'success',
    'message' => 'API is working',
    'available_endpoints' => [
        'GET /api/properties.php' => 'List all properties',
        'GET /api/properties.php?id=1' => 'Get property with ID 1',
        'POST /api/properties/create.php' => 'Create a new property',
        'POST /api/properties/update.php?id=1' => 'Update property with ID 1',
        'DELETE /api/properties/delete.php?id=1' => 'Delete property with ID 1',
        'GET /api/debug.php' => 'Check server configuration'
    ]
]);
?>
