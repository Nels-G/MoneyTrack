<?php
session_set_cookie_params([
    'lifetime' => 86400,
    'path' => '/',
    'domain' => $_SERVER['HTTP_HOST'],
    'secure' => false,
    'httponly' => true,
    'samesite' => 'Lax'
]);
session_start();
header("Access-Control-Allow-Origin: http://127.0.0.1:5500");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// Réponse immédiate pour OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/database.php';

// Debug du contenu reçu
error_log("Requête reçue: " . print_r($_REQUEST, true));
error_log("Contenu POST: " . file_get_contents('php://input'));


$action = $_GET['action'] ?? $_POST['action'] ?? '';

try {
    switch ($action) {
        case 'login':
            $data = json_decode(file_get_contents("php://input"), true);
            $username = $data['username'] ?? '';
            $password = $data['password'] ?? '';
            
            // Vérification simple (à remplacer par une vraie auth)
            if ($username === 'demo' && $password === 'demo123') {
                echo json_encode([
                    'authenticated' => true,
                    'user' => ['id' => 1, 'username' => 'demo']
                ]);
            } else {
                http_response_code(401);
                echo json_encode(['error' => 'Invalid credentials']);
            }
            break;

        case 'check':
            // Simulation d'authentification
            echo json_encode([
                'authenticated' => true,
                'user' => ['id' => 1, 'username' => 'demo']
            ]);
            break;

        default:
            http_response_code(400);
            echo json_encode(['error' => 'Invalid action']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>