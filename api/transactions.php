<?php
require_once '../config/database.php';

header("Content-Type: application/json");

$method = $_SERVER['REQUEST_METHOD'];
$month = $_GET['month'] ?? date('m');
$year = $_GET['year'] ?? date('Y');

try {
    switch ($method) {
        case 'GET':
            $exportType = $_GET['export'] ?? '';
            
            if ($exportType === 'json' || $exportType === 'csv') {
                // Export des données
                $stmt = $conn->prepare("SELECT * FROM transactions 
                                      WHERE MONTH(date) = ? AND YEAR(date) = ?");
                $stmt->execute([$month, $year]);
                $transactions = $stmt->fetchAll(PDO::FETCH_ASSOC);
                
                if ($exportType === 'json') {
                    echo json_encode($transactions);
                } else {
                    header('Content-Type: text/csv');
                    header('Content-Disposition: attachment; filename="transactions.csv"');
                    
                    $output = fopen('php://output', 'w');
                    fputcsv($output, array_keys($transactions[0]));
                    foreach ($transactions as $row) {
                        fputcsv($output, $row);
                    }
                    fclose($output);
                }
            } else {
                // Récupération normale
                $stmt = $conn->prepare("SELECT * FROM transactions 
                                      WHERE MONTH(date) = ? AND YEAR(date) = ?");
                $stmt->execute([$month, $year]);
                echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
            }
            break;

        case 'POST':
            $data = json_decode(file_get_contents("php://input"), true);
            
            $stmt = $conn->prepare("INSERT INTO transactions 
                                   (user_id, type, amount, category, description, date, debt_type, debt_person, debt_status)
                                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
            
            $stmt->execute([
                1, // user_id (à remplacer par l'id réel)
                $data['type'],
                $data['amount'],
                $data['category'],
                $data['description'],
                $data['date'],
                $data['debt_type'],
                $data['debt_person'],
                $data['debt_status']
            ]);
            
            echo json_encode(['success' => true, 'id' => $conn->lastInsertId()]);
            break;

        default:
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>