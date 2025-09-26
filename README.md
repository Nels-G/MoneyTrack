# MoneyTrack

<div align="left">

![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)
![Chart.js](https://img.shields.io/badge/Chart.js-4.0+-orange.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)
![Platform](https://img.shields.io/badge/platform-web-lightgrey.svg)

**Simple and effective expense and income tracking application**

[Demo](#demo) • [Features](#features) • [Installation](#installation) • [Quick Start](#quick-start) • [Contributing](#contributing)

</div>

---

## Overview

MoneyTrack is a simple expense and income tracking application designed to help users better manage their budget and gain clear insights into their daily finances. Built with pure JavaScript and modern web technologies, it provides an intuitive interface for personal financial management.

### Why MoneyTrack?

- **Simple & Intuitive** → Clean interface for easy financial tracking
- **Visual Analytics** → Interactive charts for better insights
- **Local Storage** → Your data stays private and secure
- **No Dependencies** → Lightweight vanilla JavaScript solution
- **Instant Access** → Works directly in your browser

---

## Features

### Current Features

| Feature | Description |
|---------|-------------|
| **Transaction Management** | Add, edit, and delete expenses and income |
| **Transaction List** | View all transactions in a organized list |
| **Visual Analytics** | Charts and graphs for expense analysis |
| **Local Storage** | Automatic data persistence in browser |
| **Budget Overview** | Clear view of financial status |
| **Category Tracking** | Organize transactions by categories |

### Core Functionality

- **Add Transactions** → Record income and expenses with details
- **Edit/Delete** → Modify or remove existing transactions
- **Visual Reports** → Interactive charts powered by Chart.js
- **Data Persistence** → Automatic saving using LocalStorage

---

## Tech Stack

<div align="center">

| Technology | Purpose | Version |
|------------|---------|---------|
| ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) | Core functionality | ES6+ |
| ![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chart.js&logoColor=white) | Data visualization | 4.0+ |
| ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white) | Structure | Latest |
| ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white) | Styling | Latest |
| LocalStorage | Data persistence | Native |

</div>

---

## Installation

### Method 1: Direct Download

```bash
# Clone the repository
git clone https://github.com/nelson/MoneyTrack.git
cd MoneyTrack

# Open in browser
open index.html
```

### Method 2: Web Server

```bash
# Clone the repository
git clone https://github.com/nelson/MoneyTrack.git
cd MoneyTrack

# Start a local server (Python)
python -m http.server 8000

# Or with Node.js
npx serve .
```

### Method 3: Live Demo

Access the live version at: [MoneyTrack Demo](https://nelson.github.io/MoneyTrack)

---

## Quick Start

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- No additional installations required

### Usage Steps

1. **Open the application** in your web browser
2. **Add your first transaction**:
   - Enter amount (positive for income, negative for expense)
   - Add description
   - Select category
   - Click "Add Transaction"
3. **View your data**:
   - Check the transaction list
   - Analyze charts and graphs
   - Monitor your budget status
4. **Manage transactions**:
   - Edit existing entries
   - Delete unwanted transactions
   - Filter by categories or dates

---

## Project Structure

```
MoneyTrack/
├── index.html                   # Main application page
├── styles/
│   ├── main.css                # Main stylesheet
│   └── responsive.css          # Mobile responsive styles
├── scripts/
│   ├── app.js                  # Main application logic
│   ├── storage.js              # LocalStorage management
│   ├── charts.js               # Chart.js integration
│   └── utils.js                # Utility functions
├── assets/
│   ├── images/                 # App icons and images
│   └── favicon.ico             # Website favicon
├── README.md                   # Documentation
└── LICENSE                     # MIT License
```

---

## Screenshots

<div align="center">

### Dashboard View
![Dashboard](assets/screenshots/dashboard.png)

### Transaction Management
![Transactions](assets/screenshots/transactions.png)

### Analytics Charts
![Charts](assets/screenshots/charts.png)

</div>

---

## Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 60+ | ✅ Fully supported |
| Firefox | 55+ | ✅ Fully supported |
| Safari | 12+ | ✅ Fully supported |
| Edge | 79+ | ✅ Fully supported |
| Internet Explorer | 11 | ❌ Not supported |

---

## Frequently Asked Questions

<details>
<summary><strong>Q: Is my financial data secure?</strong></summary>

A: Yes, all data is stored locally in your browser's LocalStorage. No data is sent to external servers.
</details>

<details>
<summary><strong>Q: Can I export my data?</strong></summary>

A: Currently, data export is not available but is planned for future releases.
</details>

<details>
<summary><strong>Q: Does it work offline?</strong></summary>

A: Yes, once loaded, the application works completely offline.
</details>

<details>
<summary><strong>Q: Can I sync data across devices?</strong></summary>

A: Not currently, as data is stored locally. Cloud sync is being considered for future versions.
</details>

---

## Contributing

We welcome contributions to improve MoneyTrack!

### How to Contribute

```bash
# 1. Fork and clone the repository
git clone https://github.com/your-username/MoneyTrack.git

# 2. Create a feature branch
git checkout -b feature/your-feature-name

# 3. Make your changes and test
# Open index.html in browser to test

# 4. Commit and push
git commit -m "Add your feature"
git push origin feature/your-feature-name

# 5. Submit a pull request
```

### Areas for Contribution

- **Data Export/Import** → CSV, JSON export functionality
- **Cloud Sync** → Optional cloud storage integration
- **Mobile App** → React Native or PWA version
- **Advanced Analytics** → More chart types and insights
- **Multi-currency** → Support for different currencies
- **Themes** → Dark mode and custom themes

---

## Roadmap

### Version 2.0 (Planned)
- Data export/import functionality
- Advanced filtering and search
- Budget goals and alerts
- Recurring transactions
- Multi-currency support

### Version 2.5 (Future)
- PWA (Progressive Web App) support
- Cloud synchronization (optional)
- Advanced analytics and insights
- Mobile-first responsive design

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Author

<div align="center">

**Nelson Galley (Nels-G)**

*Building practical solutions for everyday problems*

[![GitHub](https://img.shields.io/badge/GitHub-nelson-black?style=for-the-badge&logo=github)](https://github.com/nelson)
[![Email](https://img.shields.io/badge/Email-nelsgalley@gmail.com-red?style=for-the-badge&logo=gmail)](mailto:nelsgalley@gmail.com)

*"Simplifying personal finance management, one transaction at a time."*

</div>

---

## Acknowledgments

- **Chart.js Team** → Excellent charting library
- **Web Standards Community** → LocalStorage and modern web APIs
- **Open Source Community** → Inspiration and best practices

---

<div align="center">

### Support the Project

*Find MoneyTrack useful? Consider giving it a star!*

[![GitHub stars](https://img.shields.io/github/stars/nelson/MoneyTrack?style=social)](https://github.com/nelson/MoneyTrack/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/nelson/MoneyTrack?style=social)](https://github.com/nelson/MoneyTrack/network/members)

**Ready to take control of your finances?**

[Get Started](https://nelson.github.io/MoneyTrack) • [Report Issue](https://github.com/nelson/MoneyTrack/issues) • [Contribute](https://github.com/nelson/MoneyTrack/pulls)

---

**Happy budgeting!**

</div>
