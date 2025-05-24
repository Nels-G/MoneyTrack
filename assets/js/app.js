// Constants
const API_BASE_URL = 'http://localhost/projets/MoneyTrack';
const EXPENSE_CATEGORIES = [
    { id: 'food', label: 'Alimentation', icon: 'fas fa-utensils', color: '#ef4444' },
    { id: 'transport', label: 'Transport', icon: 'fas fa-car', color: '#f59e0b' },
    { id: 'housing', label: 'Logement', icon: 'fas fa-home', color: '#3b82f6' },
    { id: 'entertainment', label: 'Loisirs', icon: 'fas fa-gamepad', color: '#ec4899' },
    { id: 'health', label: 'Santé', icon: 'fas fa-heartbeat', color: '#10b981' },
    { id: 'education', label: 'Éducation', icon: 'fas fa-graduation-cap', color: '#6366f1' },
    { id: 'shopping', label: 'Shopping', icon: 'fas fa-shopping-bag', color: '#8b5cf6' },
    { id: 'bills', label: 'Factures', icon: 'fas fa-file-invoice', color: '#64748b' },
    { id: 'other', label: 'Autres', icon: 'fas fa-ellipsis-h', color: '#475569' }
];

const INCOME_CATEGORIES = [
    { id: 'salary', label: 'Salaire', icon: 'fas fa-money-check-alt', color: '#10b981' },
    { id: 'business', label: 'Business', icon: 'fas fa-store', color: '#3b82f6' },
    { id: 'gift', label: 'Cadeau', icon: 'fas fa-gift', color: '#ec4899' },
    { id: 'investment', label: 'Investissement', icon: 'fas fa-chart-line', color: '#f59e0b' },
    { id: 'other', label: 'Autres', icon: 'fas fa-ellipsis-h', color: '#6366f1' }
];

const DEBT_CATEGORIES = [
    { id: 'personal', label: 'Personnel', icon: 'fas fa-user-friends', color: '#f59e0b' },
    { id: 'family', label: 'Famille', icon: 'fas fa-users', color: '#3b82f6' },
    { id: 'business', label: 'Business', icon: 'fas fa-store', color: '#8b5cf6' },
    { id: 'other', label: 'Autres', icon: 'fas fa-ellipsis-h', color: '#64748b' }
];

// App State
let transactions = [];
let balanceChart = null;
let expensesChart = null;
let currentFilter = 'all';
let selectedMonth = new Date().getMonth();
let selectedYear = new Date().getFullYear();
let tags = [];
let darkMode = false;
let currentUser = null;

// DOM Elements
const domElements = {
    transactionsList: document.getElementById('transactions-list'),
    emptyState: document.getElementById('empty-state'),
    addTransactionBtn: document.getElementById('add-transaction-btn'),
    addFirstTransactionBtn: document.getElementById('add-first-transaction-btn'),
    transactionModal: document.getElementById('transaction-modal'),
    modalClose: document.getElementById('modal-close'),
    cancelTransactionBtn: document.getElementById('cancel-transaction'),
    saveTransactionBtn: document.getElementById('save-transaction'),
    transactionForm: document.getElementById('transaction-form'),
    transactionType: document.getElementById('transaction-type'),
    transactionCategory: document.getElementById('transaction-category'),
    transactionAmount: document.getElementById('transaction-amount'),
    transactionDescription: document.getElementById('transaction-description'),
    transactionDate: document.getElementById('transaction-date'),
    notification: document.getElementById('notification'),
    totalBalance: document.getElementById('total-balance'),
    monthIncome: document.getElementById('month-income'),
    monthExpenses: document.getElementById('month-expenses'),
    balanceChartEl: document.getElementById('balance-chart'),
    expensesChartEl: document.getElementById('expenses-chart'),
    expensesLegend: document.getElementById('expenses-legend'),
    tabs: document.querySelectorAll('.tab'),
    themeToggle: document.getElementById('theme-toggle'),
    monthFilter: document.getElementById('month-filter'),
    yearFilter: document.getElementById('year-filter'),
    exportJsonBtn: document.getElementById('export-json-btn'),
    exportCsvBtn: document.getElementById('export-csv-btn'),
    tagsContainer: document.getElementById('tags-container'),
    tagsInput: document.getElementById('transaction-tags'),
    debtTypeGroup: document.getElementById('debt-type-group'),
    debtPersonGroup: document.getElementById('debt-person-group'),
    debtStatusGroup: document.getElementById('debt-status-group'),
    debtTypeInput: document.getElementById('debt-type'),
    debtStatusInput: document.getElementById('debt-status'),
    debtPersonInput: document.getElementById('debt-person'),
    categoryGroup: document.getElementById('category-group')
};

// Initialize the app
async function initApp() {
    console.log("[DEBUG] Début de l'initialisation"); // <-- Ajoutez cette ligne
    checkDarkModePreference();
    setupEventListeners();
    setCurrentDate();
    populateCategories();
    populateYearFilter();
    
    try {
        console.log("[DEBUG] Vérification de l'authentification..."); // <-- Ajoutez cette ligne
        const isAuthenticated = await checkAuthStatus();
        console.log("[DEBUG] Résultat auth:", isAuthenticated); // <-- Ajoutez cette ligne
        
        if (isAuthenticated) {
            await loadData();
        } else {
            console.log("[DEBUG] Tentative de login demo..."); // <-- Ajoutez cette ligne
            const demoLogin = await login('demo', 'demo123');
            if (demoLogin) await loadData();
        }
    } catch (error) {
        console.error("[ERREUR] Initialisation:", error); // <-- Modifiez cette ligne
        showNotification('Erreur', 'Échec de l\'initialisation', 'error');
    }
    console.log("[DEBUG] Initialisation terminée"); // <-- Ajoutez cette ligne
}


// Authentication Functions
async function checkAuthStatus() {
    const url = `${API_BASE_URL}/api/auth.php?action=check`;
    console.log("[DEBUG] URL appelée:", url); // <-- Ajoutez cette ligne
    
    try {
        const response = await fetch(url, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Accept': 'application/json' }
        });
        
        console.log("[DEBUG] Réponse HTTP:", response.status); // <-- Ajoutez cette ligne
        
        if (!response.ok) {
            const text = await response.text();
            console.error("[ERREUR] Réponse API:", text); // <-- Ajoutez cette ligne
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        console.log("[DEBUG] Données reçues:", data); // <-- Ajoutez cette ligne
        return data.authenticated === true;
    } catch (error) {
        console.error("[ERREUR] checkAuthStatus:", error); // <-- Modifiez cette ligne
        return false;
    }
}

async function login(username, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                action: 'login',
                username,
                password
            }),
            credentials: 'include'
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Login failed");
        }
        
        return await response.json();
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
}
// Data Functions
async function loadData() {
    try {
        await Promise.all([
            loadTransactions(),
            loadStats()
        ]);
        initCharts();
    } catch (error) {
        console.error("Load data error:", error);
        throw error;
    }
}

async function loadTransactions() {
    try {
        const response = await fetch(
            `${API_BASE_URL}/api/transactions.php?month=${selectedMonth + 1}&year=${selectedYear}`, 
            { credentials: 'include' }
        );
        
        if (!response.ok) throw new Error("Failed to load transactions");
        
        transactions = await response.json();
        renderTransactions();
    } catch (error) {
        console.error("Error loading transactions:", error);
        throw error;
    }
}

async function loadStats() {
    try {
        console.log("[DEBUG] Chargement des statistiques...");
        const url = `${API_BASE_URL}/api/stats.php?month=${selectedMonth + 1}&year=${selectedYear}`;
        console.log("[DEBUG] URL stats:", url);
        
        const response = await fetch(url, {
            credentials: 'include',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        console.log("[DEBUG] Réponse stats:", response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error("[ERREUR] Détails réponse:", errorText);
            throw new Error(`Failed to load stats (HTTP ${response.status})`);
        }
        
        const stats = await response.json();
        console.log("[DEBUG] Stats reçues:", stats);
        updateStatsUI(stats);
    } catch (error) {
        console.error("Error loading stats:", error);
        throw error;
    }
}

async function saveTransaction(transactionData) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/transactions.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(transactionData),
            credentials: 'include'
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to save transaction");
        }
        
        return true;
    } catch (error) {
        console.error("Error saving transaction:", error);
        throw error;
    }
}

// UI Functions
function updateStatsUI(stats) {
    domElements.totalBalance.textContent = formatCurrency(stats.total_balance || 0);
    domElements.monthIncome.textContent = formatCurrency(stats.monthly_income || 0);
    domElements.monthExpenses.textContent = formatCurrency(stats.monthly_expenses || 0);
}

function renderTransactions() {
    let filteredTransactions = transactions.filter(t => {
        const date = new Date(t.date);
        return currentFilter === 'all' 
            ? date.getMonth() === selectedMonth && date.getFullYear() === selectedYear
            : t.type === currentFilter && date.getMonth() === selectedMonth && date.getFullYear() === selectedYear;
    });

    domElements.transactionsList.innerHTML = '';
    
    if (filteredTransactions.length === 0) {
        domElements.transactionsList.style.display = 'none';
        domElements.emptyState.style.display = 'flex';
        return;
    }
    
    domElements.transactionsList.style.display = 'block';
    domElements.emptyState.style.display = 'none';
    
    filteredTransactions.forEach(transaction => {
        const categories = getCategoriesForType(transaction.type);
        const category = categories.find(c => c.id === transaction.category) || categories[categories.length - 1];
        const date = new Date(transaction.date);
        const formattedDate = date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
        
        const amountClass = transaction.type === 'debt' 
            ? (transaction.debt_type === 'borrowed' ? 'debt' : 'credit')
            : transaction.type;
        
        const amountPrefix = transaction.type === 'expense' || 
                          (transaction.type === 'debt' && transaction.debt_type === 'borrowed') 
                          ? '-' : '+';

        const li = document.createElement('li');
        li.className = 'transaction-item animate__animated animate__fadeIn';
        li.innerHTML = `
            <div class="transaction-details">
                <div class="transaction-title">
                    <i class="${category.icon}" style="color: ${category.color}"></i>
                    ${transaction.description || category.label}
                    ${transaction.type === 'debt' ? `(${transaction.debt_person})` : ''}
                </div>
                <div class="transaction-meta">
                    <span><i class="far fa-calendar-alt"></i> ${formattedDate}</span>
                    <span class="category-badge">${category.label}</span>
                    ${transaction.type === 'debt' ? `<span class="badge badge-${transaction.debt_status}">${getStatusLabel(transaction.debt_status)}</span>` : ''}
                </div>
                ${transaction.tags && transaction.tags.length > 0 ? `
                <div class="transaction-tags">
                    ${transaction.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
                </div>
                ` : ''}
            </div>
            <div class="transaction-amount ${amountClass}">
                ${amountPrefix} ${formatCurrency(transaction.amount)}
            </div>
        `;
        
        domElements.transactionsList.appendChild(li);
    });
}

function getCategoriesForType(type) {
    switch(type) {
        case 'expense': return EXPENSE_CATEGORIES;
        case 'income': return INCOME_CATEGORIES;
        case 'debt': return DEBT_CATEGORIES;
        default: return [];
    }
}

function getStatusLabel(status) {
    switch(status) {
        case 'pending': return 'En attente';
        case 'paid': return 'Payé';
        case 'overdue': return 'En retard';
        default: return status;
    }
}

function formatCurrency(amount) {
    return amount.toLocaleString('fr-FR') + ' FCFA';
}

// Chart Functions
function initCharts() {
    initBalanceChart();
    initExpensesChart();
}

async function initBalanceChart() {
    try {
        console.log("[DEBUG] Chargement des données du graphique...");
        const response = await fetch(
            `${API_BASE_URL}/api/stats.php?chart=balance&month=${selectedMonth + 1}&year=${selectedYear}`,
            {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        if (!response.ok) {
            throw new Error(`Erreur HTTP! Statut: ${response.status}`);
        }

        const { dates, balances } = await response.json();
        console.log("[DEBUG] Données du graphique:", { dates, balances });

        // Formatage des dates pour l'affichage (ex: "1 Avr")
        const formattedDates = dates.map(day => 
            `${day} ${new Date(selectedYear, selectedMonth).toLocaleString('fr-FR', { month: 'short' })}`
        );

        if (balanceChart) balanceChart.destroy();

        balanceChart = new Chart(domElements.balanceChartEl, {
            type: 'line',
            data: {
                labels: formattedDates,
                datasets: [{
                    label: 'Évolution du solde',
                    data: balances,
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    borderColor: '#6366f1',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true,
                    pointRadius: balances.length > 30 ? 0 : 3, // Masque les points si trop de données
                    pointHoverRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                return `Solde: ${formatCurrency(context.raw)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: {
                            callback: (value) => formatCurrency(value)
                        }
                    }
                }
            }
        });

    } catch (error) {
        console.error("Erreur graphique:", error);
        // Solution de repli avec vos données de test
        initChartWithData(
            ["1 Avr", "5 Avr", "10 Avr", "15 Avr", "20 Avr", "25 Avr", "30 Avr"],
            [592, 553, 729, 1042, 3012, 4367, 6387]
        );
    }
}


async function initExpensesChart() {
    try {
        const response = await fetch(
            `${API_BASE_URL}/api/stats.php?chart=expenses&month=${selectedMonth + 1}&year=${selectedYear}`,
            { credentials: 'include' }
        );
        
        if (!response.ok) throw new Error("Failed to load expenses chart data");
        
        const { labels, data, colors, categories } = await response.json();
        
        if (expensesChart) expensesChart.destroy();
        
        expensesChart = new Chart(domElements.expensesChartEl, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors,
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const value = context.raw;
                                const total = data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${context.label}: ${formatCurrency(value)} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
        
        updateExpensesLegend(categories);
    } catch (error) {
        console.error("Error initializing balance chart:", error);
        // Solution de repli avec des données fictives
        const now = new Date();
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        const dates = Array.from({length: daysInMonth}, (_, i) => `${i + 1}/${now.getMonth() + 1}`);
        const balances = Array(daysInMonth).fill(0);
        
        initChartWithData(dates, balances);
    }
}

function initChartWithData(dates, balances) {
    if (balanceChart) balanceChart.destroy();
    
    balanceChart = new Chart(domElements.balanceChartEl, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Solde',
                data: balances,
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                borderColor: '#6366f1',
                borderWidth: 2,
                tension: 0.3,
                fill: true
            }]
        },
        options: getChartOptions()
    });

}

function updateExpensesLegend(categories) {
    domElements.expensesLegend.innerHTML = '';
    
    if (!categories || categories.length === 0) return;
    
    categories.forEach(cat => {
        const category = EXPENSE_CATEGORIES.find(c => c.id === cat.category) || EXPENSE_CATEGORIES[EXPENSE_CATEGORIES.length - 1];
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';
        legendItem.innerHTML = `
            <span class="color-dot" style="background-color: ${category.color}"></span>
            ${category.label}: ${formatCurrency(cat.total)}
        `;
        domElements.expensesLegend.appendChild(legendItem);
    });
}

function getChartOptions() {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return formatCurrency(context.raw);
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: false,
                ticks: {
                    callback: function(value) {
                        return formatCurrency(value);
                    }
                }
            }
        }
    };
}

// Form Functions
function populateCategories() {
    let categories = [];
    
    switch(domElements.transactionType.value) {
        case 'expense': categories = EXPENSE_CATEGORIES; break;
        case 'income': categories = INCOME_CATEGORIES; break;
        case 'debt': categories = DEBT_CATEGORIES; break;
    }
    
    domElements.transactionCategory.innerHTML = '';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.label;
        domElements.transactionCategory.appendChild(option);
    });
}

function populateYearFilter() {
    const currentYear = new Date().getFullYear();
    domElements.yearFilter.innerHTML = '';
    
    for (let year = currentYear - 5; year <= currentYear + 5; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        if (year === selectedYear) option.selected = true;
        domElements.yearFilter.appendChild(option);
    }
    
    domElements.monthFilter.value = selectedMonth;
}

function setCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    domElements.transactionDate.value = `${year}-${month}-${day}`;
    domElements.transactionDate.max = `${year}-${month}-${day}`;
}

function handleTagInput(e) {
    if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        const tag = domElements.tagsInput.value.trim();
        if (tag && !tags.includes(tag)) {
            tags.push(tag);
            renderTags();
        }
        domElements.tagsInput.value = '';
    }
}

function renderTags() {
    domElements.tagsContainer.querySelectorAll('.tag-item').forEach(tag => tag.remove());
    
    tags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = 'tag-item';
        tagElement.innerHTML = `
            ${tag}
            <span class="tag-remove" data-tag="${tag}">&times;</span>
        `;
        domElements.tagsContainer.insertBefore(tagElement, domElements.tagsInput);
    });
}

function removeTag(tagToRemove) {
    tags = tags.filter(tag => tag !== tagToRemove);
    renderTags();
}

function showNotification(title, message, type = 'success') {
    const notification = domElements.notification;
    const notificationTitle = notification.querySelector('.notification-title');
    const notificationMessage = notification.querySelector('.notification-message');
    const notificationIcon = notification.querySelector('.notification-icon');
    
    notification.className = 'notification';
    notification.classList.add(type);
    
    notificationTitle.textContent = title;
    notificationMessage.textContent = message;
    notificationIcon.className = 'notification-icon';
    
    if (type === 'success') {
        notificationIcon.classList.add('fas', 'fa-check-circle');
    } else if (type === 'error') {
        notificationIcon.classList.add('fas', 'fa-exclamation-circle');
    } else if (type === 'warning') {
        notificationIcon.classList.add('fas', 'fa-exclamation-triangle');
    }
    
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function toggleDarkMode() {
    darkMode = !darkMode;
    const themeIcon = domElements.themeToggle.querySelector('i');
    
    if (darkMode) {
        document.body.classList.add('dark-mode');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        localStorage.setItem('darkMode', 'enabled');
    } else {
        document.body.classList.remove('dark-mode');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        localStorage.setItem('darkMode', 'disabled');
    }
}

function checkDarkModePreference() {
    const savedMode = localStorage.getItem('darkMode');
    const themeIcon = domElements.themeToggle.querySelector('i');
    
    if (savedMode === 'enabled') {
        darkMode = true;
        document.body.classList.add('dark-mode');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        darkMode = false;
        document.body.classList.remove('dark-mode');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
}

function openModal() {
    domElements.transactionModal.classList.add('open');
}

function closeModal() {
    domElements.transactionModal.classList.remove('open');
    domElements.transactionForm.reset();
    setCurrentDate();
    populateCategories();
    tags = [];
    renderTags();
    
    document.querySelector('.debt-type-option[data-type="borrowed"]').classList.add('active');
    domElements.debtTypeInput.value = 'borrowed';
    
    document.querySelector('.status-option[data-status="pending"]').classList.add('active');
    domElements.debtStatusInput.value = 'pending';
    
    domElements.debtTypeGroup.style.display = 'none';
    domElements.debtPersonGroup.style.display = 'none';
    domElements.debtStatusGroup.style.display = 'none';
    domElements.categoryGroup.style.display = 'block';
}

async function saveNewTransaction() {
    if (!domElements.transactionForm.checkValidity()) {
        domElements.transactionForm.reportValidity();
        return;
    }
    
    const transactionData = {
        type: domElements.transactionType.value,
        amount: parseFloat(domElements.transactionAmount.value),
        category: domElements.transactionCategory.value,
        description: domElements.transactionDescription.value.trim(),
        date: domElements.transactionDate.value,
        tags: tags.length > 0 ? [...tags] : [],
        debt_type: domElements.transactionType.value === 'debt' ? domElements.debtTypeInput.value : null,
        debt_person: domElements.transactionType.value === 'debt' ? domElements.debtPersonInput.value.trim() : null,
        debt_status: domElements.transactionType.value === 'debt' ? domElements.debtStatusInput.value : null
    };
    
    try {
        await saveTransaction(transactionData);
        await loadData();
        closeModal();
        showNotification('Succès', 'Transaction enregistrée', 'success');
    } catch (error) {
        console.error("Error saving transaction:", error);
        showNotification('Erreur', error.message || 'Échec de l\'enregistrement', 'error');
    }
}

// Export Functions
async function exportToJson() {
    try {
        const response = await fetch(
            `${API_BASE_URL}/api/transactions.php?export=json&month=${selectedMonth + 1}&year=${selectedYear}`,
            { credentials: 'include' }
        );
        
        if (!response.ok) throw new Error("Failed to export JSON");
        
        const data = await response.json();
        const dataStr = JSON.stringify(data, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const link = document.createElement('a');
        link.setAttribute('href', dataUri);
        link.setAttribute('download', `transactions-${selectedMonth+1}-${selectedYear}.json`);
        link.click();
        
        showNotification('Export réussi', 'Transactions exportées en JSON', 'success');
    } catch (error) {
        console.error("Export JSON error:", error);
        showNotification('Erreur', 'Échec de l\'export JSON', 'error');
    }
}

async function exportToCsv() {
    try {
        const response = await fetch(
            `${API_BASE_URL}/api/transactions.php?export=csv&month=${selectedMonth + 1}&year=${selectedYear}`,
            { credentials: 'include' }
        );
        
        if (!response.ok) throw new Error("Failed to export CSV");
        
        const csv = await response.text();
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `transactions-${selectedMonth+1}-${selectedYear}.csv`);
        link.click();
        
        showNotification('Export réussi', 'Transactions exportées en CSV', 'success');
    } catch (error) {
        console.error("Export CSV error:", error);
        showNotification('Erreur', 'Échec de l\'export CSV', 'error');
    }
}

// Event Listeners
function setupEventListeners() {
    // Transaction Modal
    domElements.addTransactionBtn.addEventListener('click', openModal);
    domElements.addFirstTransactionBtn.addEventListener('click', openModal);
    domElements.modalClose.addEventListener('click', closeModal);
    domElements.cancelTransactionBtn.addEventListener('click', closeModal);
    domElements.saveTransactionBtn.addEventListener('click', saveNewTransaction);
    
    // Transaction Type Change
    domElements.transactionType.addEventListener('change', () => {
        populateCategories();
        const isDebt = domElements.transactionType.value === 'debt';
        domElements.debtTypeGroup.style.display = isDebt ? 'block' : 'none';
        domElements.debtPersonGroup.style.display = isDebt ? 'block' : 'none';
        domElements.debtStatusGroup.style.display = isDebt ? 'block' : 'none';
    });
    
    // Tabs
    domElements.tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            domElements.tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentFilter = tab.dataset.filter;
            renderTransactions();
        });
    });
    
    // Filters
    domElements.monthFilter.addEventListener('change', () => {
        selectedMonth = parseInt(domElements.monthFilter.value);
        refreshData();
    });
    
    domElements.yearFilter.addEventListener('change', () => {
        selectedYear = parseInt(domElements.yearFilter.value);
        refreshData();
    });
    
    // Theme Toggle
    domElements.themeToggle.addEventListener('click', toggleDarkMode);
    
    // Export Buttons
    domElements.exportJsonBtn.addEventListener('click', exportToJson);
    domElements.exportCsvBtn.addEventListener('click', exportToCsv);
    
    // Tags
    domElements.tagsInput.addEventListener('keydown', handleTagInput);
    domElements.tagsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('tag-remove')) {
            removeTag(e.target.dataset.tag);
        }
    });
    
    // Debt Type Selector
    document.querySelectorAll('.debt-type-option').forEach(option => {
        option.addEventListener('click', () => {
            document.querySelectorAll('.debt-type-option').forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            domElements.debtTypeInput.value = option.dataset.type;
        });
    });
    
    // Status Selector
    document.querySelectorAll('.status-option').forEach(option => {
        option.addEventListener('click', () => {
            document.querySelectorAll('.status-option').forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            domElements.debtStatusInput.value = option.dataset.status;
        });
    });
    
    // Date Validation
    domElements.transactionDate.addEventListener('change', () => {
        const today = new Date();
        const selectedDate = new Date(domElements.transactionDate.value);
        
        if (selectedDate > today) {
            showNotification('Erreur', 'Vous ne pouvez pas sélectionner une date future', 'error');
            setCurrentDate();
        }
    });
}

async function refreshData() {
    try {
        await loadData();
    } catch (error) {
        console.error("Error refreshing data:", error);
        showNotification('Erreur', 'Échec du rafraîchissement des données', 'error');
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', initApp);


