<?php
require_once '../config/database.php';

// Headers CORS
header("Access-Control-Allow-Origin: http://127.0.0.1:5500");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Répondre immédiatement aux requêtes OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    // Récupération des paramètres
    $month = isset($_GET['month']) ? (int)$_GET['month'] : (int)date('m');
    $year = isset($_GET['year']) ? (int)$_GET['year'] : (int)date('Y');
    $chartType = isset($_GET['chart']) ? $_GET['chart'] : null;

    // Validation des paramètres
    if ($month < 1 || $month > 12 || $year < 2000 || $year > 2100) {
        http_response_code(400);
        echo json_encode(['error' => 'Paramètres month/year invalides']);
        exit();
    }

    // Statistiques de base (pour le header)
    if ($chartType === null) {
        // Revenus du mois
        $stmt = $conn->prepare("
            SELECT COALESCE(SUM(amount), 0) 
            FROM transactions 
            WHERE type = 'income' 
            AND MONTH(date) = ? 
            AND YEAR(date) = ?
        ");
        $stmt->execute([$month, $year]);
        $monthlyIncome = $stmt->fetchColumn();

        // Dépenses du mois
        $stmt = $conn->prepare("
            SELECT COALESCE(SUM(amount), 0) 
            FROM transactions 
            WHERE type = 'expense' 
            AND MONTH(date) = ? 
            AND YEAR(date) = ?
        ");
        $stmt->execute([$month, $year]);
        $monthlyExpenses = $stmt->fetchColumn();

        echo json_encode([
            'total_balance' => $monthlyIncome - $monthlyExpenses,
            'monthly_income' => $monthlyIncome,
            'monthly_expenses' => $monthlyExpenses
        ]);
    }
    // Données pour le graphique d'évolution du solde
    elseif ($chartType === 'balance') {
        // Requête optimisée pour MySQL (utilise les fenêtres SQL)
        $stmt = $conn->prepare("
            SELECT 
                DAY(date) as day,
                SUM(SUM(CASE 
                    WHEN type = 'income' THEN amount 
                    ELSE -amount 
                END)) OVER (ORDER BY date) as balance
            FROM transactions
            WHERE MONTH(date) = ? AND YEAR(date) = ?
            GROUP BY DAY(date)
            ORDER BY day
        ");
        $stmt->execute([$month, $year]);
        $dailyBalances = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Formatage des données pour Chart.js
        $dates = array_column($dailyBalances, 'day');
        $balances = array_column($dailyBalances, 'balance');

        // Remplissage des jours manquants (pour une courbe continue)
        $daysInMonth = cal_days_in_month(CAL_GREGORIAN, $month, $year);
        $completeBalances = [];
        $lastKnownBalance = 0;

        for ($day = 1; $day <= $daysInMonth; $day++) {
            $key = array_search($day, $dates);
            if ($key !== false) {
                $lastKnownBalance = $balances[$key];
            }
            $completeBalances[] = $lastKnownBalance;
        }

        echo json_encode([
            'dates' => range(1, $daysInMonth),
            'balances' => $completeBalances
        ]);
    }
    // Données pour le graphique des dépenses par catégorie
    elseif ($chartType === 'expenses') {
        $stmt = $conn->prepare("
            SELECT 
                category,
                SUM(amount) as total,
                COUNT(*) as count
            FROM transactions
            WHERE type = 'expense' 
            AND MONTH(date) = ? 
            AND YEAR(date) = ?
            GROUP BY category
            ORDER BY total DESC
        ");
        $stmt->execute([$month, $year]);
        $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            'labels' => array_column($categories, 'category'),
            'data' => array_column($categories, 'total'),
            'categories' => $categories
        ]);
    }
    else {
        http_response_code(400);
        echo json_encode(['error' => 'Type de graphique non supporté']);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur de base de données: ' . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}