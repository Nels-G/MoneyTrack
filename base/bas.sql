-- Création de la base de données
CREATE DATABASE IF NOT EXISTS finance_tracker;
USE finance_tracker;

-- Table des utilisateurs (simplifiée pour l'authentification)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des transactions (principale table du système)
CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type ENUM('income', 'expense') NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    debt_type VARCHAR(20),
    debt_person VARCHAR(100),
    debt_status VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insertion de l'utilisateur de démo (compatible avec auth.php)
INSERT INTO users (username, password_hash) VALUES 
('demo', '$2y$10$ExempleDeHashPourDemo123'); -- Remplacez par un vrai hash bcrypt

-- Index pour optimiser les requêtes fréquentes
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_type ON transactions(type);