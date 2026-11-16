# 🛡️ CyberShield

**Power BI-Inspired Business Intelligence Dashboard for Cybersecurity**

CyberShield is a full-stack Data Analytics platform designed to analyze, visualize, and interact with cybersecurity incident data. It features a professional "Midnight Aurora" dark theme and provides deep insights into threat intelligence through dynamic charts and cross-filtering.

## 🚀 Features
- **Executive Overview:** KPI cards, Monthly Incident Trends (Line Chart), Severity Distribution (Doughnut Chart).
- **Attack Intelligence:** Top Attack Categories (Bar Chart), Stacked Severity Breakdown.
- **Geographical Analysis:** Country-wise incident distribution and Regional analysis.
- **Trend & Risk:** Weekday attack frequency and Severity trends over time.
- **Incident Explorer:** Searchable, paginated data table with advanced filtering (Severity, Country) and **CSV Export** functionality.

## 💻 Tech Stack
- **Frontend:** React.js, Vite, Tailwind CSS, Chart.js, React-Chartjs-2, Lucide React
- **Backend:** Node.js, Express.js
- **Database:** MySQL (Star Schema Data Model)

## 📊 Database Architecture
This project uses a standard **Star Schema** data model in MySQL:
- **FactIncidents:** The central fact table containing incident records.
- **DimDate, DimGeography, DimAttackType, DimSeverity, DimTargetSystem:** Dimension tables connected via foreign keys for analytical querying.
