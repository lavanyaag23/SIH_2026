# 🚆 AI-Powered Automatic Block Planning for Indian Railways

> **Smart India Hackathon 2026 — SIH26027**
> **Ministry of Railways | Transportation & Logistics**

An AI-powered decision-support and optimization system designed to improve **railway maintenance block planning**, maximize **asset availability**, reduce **train-operation conflicts**, and improve utilization of available maintenance windows.

---

## 📌 Problem Statement

Railway maintenance activities across **Engineering, Traction Distribution, and Signal & Telecommunication (S&T)** departments involve multiple assets, maintenance priorities, resources, and operational constraints.

Maintenance requests and planning activities are distributed across different systems and departments. This can make it difficult to:

* Identify the most critical maintenance activities
* Coordinate maintenance activities across departments
* Utilize available block windows efficiently
* Minimize conflicts with train operations
* Reduce asset downtime
* React quickly when a planned block is shortened, delayed, or disrupted

The goal of this project is to provide an **AI-assisted automatic block planning system** that brings these factors together and recommends efficient maintenance blocks.

---

## 💡 Proposed Solution

Our solution acts as an **AI decision-support and optimization layer** over existing railway maintenance and operational workflows.

### Core Pipeline

```text
Maintenance & Asset Data
          ↓
   Asset Risk Analysis
          ↓
Maintenance Priority
          ↓
Available Block Windows
          ↓
Train & Operational Constraints
          ↓
 AI Block Success Prediction
          ↓
   Optimization Engine
          ↓
 Recommended Maintenance Block
          ↓
 Explainability + What-If Simulation
          ↓
 Recovery Recommendation
```

The system evaluates possible maintenance windows and recommends a block based on factors such as:

* Asset criticality
* Maintenance urgency
* Asset condition
* Estimated maintenance duration
* Train conflicts
* Machine availability
* Crew availability
* Block-window availability
* Historical block success
* Expected impact on asset availability

---

## 🤖 AI & Optimization

### 1. Asset Risk Prediction

A Machine Learning model evaluates asset-related information and generates a **risk score**.

Factors can include:

* Asset condition
* Asset age
* Criticality
* Previous failures
* Maintenance urgency
* Pending maintenance

**Model:** Random Forest Classifier

---

### 2. Block Success Prediction

The system estimates the probability that a proposed maintenance block can be successfully executed.

Example factors:

```text
Block Duration
Train Conflicts
Asset Risk
Maintenance Duration
Machine Availability
Crew Availability
Historical Success
```

**Output:**

```text
Block Success Probability → 0–100%
```

---

### 3. Block Optimization

The optimization engine evaluates available maintenance possibilities and selects a suitable combination of:

* Maintenance jobs
* Time windows
* Resources
* Block duration
* Operational constraints

**Optimization Technology:** Google OR-Tools

---

### 4. Explainable Recommendations

Instead of only producing a recommendation, the system explains **why a block was selected**.

Example:

```text
Recommended Block: Section A–B
Time: 02:00 AM – 04:00 AM

Success Probability: 94%

Why?
✓ Low train conflict
✓ Critical asset included
✓ Crew available
✓ Machine available
✓ Maintenance duration fits the window
```

---

## 🔄 What-If Simulation

The system allows planners to modify operational conditions and observe how the recommendation changes.

Example:

```text
Original Block Duration → 120 minutes
New Block Duration      → 90 minutes

Train Conflicts         → Increased
Resource Availability   → Reduced

        ↓

AI recalculates the block
        ↓

New success probability
        ↓

Alternative recommendation
```

This enables planners to evaluate different scenarios before finalizing a block.

---

## 🚨 Recovery Planning

Maintenance plans may be disrupted because of:

* Train priority changes
* Reduced block duration
* Resource unavailability
* Operational constraints
* Unexpected delays

The recovery module identifies an alternative future maintenance window and helps reduce the impact of the disruption.

---

## 🖥️ Dashboard

The prototype provides a centralized dashboard for railway planners.

### Command Center

Key indicators include:

* Asset Availability
* Critical Assets
* Pending Maintenance
* Available Blocks
* Train Conflicts

### Block Planning

Provides:

* Available maintenance windows
* Candidate blocks
* AI-recommended block
* Success probability
* Maintenance jobs
* Resource availability
* Train conflicts

### Asset Priority

Displays maintenance activities according to AI-generated priority/risk.

### What-If Simulation

Allows planners to change:

* Block duration
* Train conflicts
* Resource availability
* Maintenance conditions

and recalculate recommendations.

### Recovery

Provides alternative planning options when the original block is disrupted.

---

## 🏗️ System Architecture

```text
┌─────────────────────────────────────┐
│     Railway Operational Data        │
│                                     │
│ TMS │ SMMS │ TDMS │ Timetable Data │
└──────────────────┬──────────────────┘
                   ↓
        ┌─────────────────────┐
        │ Data Processing     │
        │ Pandas / Python     │
        └──────────┬──────────┘
                   ↓
        ┌─────────────────────┐
        │ AI Risk Prediction  │
        │ Random Forest       │
        └──────────┬──────────┘
                   ↓
        ┌─────────────────────┐
        │ Block Success Model │
        │ ML Prediction       │
        └──────────┬──────────┘
                   ↓
        ┌─────────────────────┐
        │ Optimization Engine │
        │ Google OR-Tools     │
        └──────────┬──────────┘
                   ↓
        ┌─────────────────────┐
        │ AI Block Planner    │
        │ + Explainability    │
        │ + What-If           │
        │ + Recovery          │
        └──────────┬──────────┘
                   ↓
        ┌─────────────────────┐
        │ Streamlit Dashboard │
        └─────────────────────┘
```

---

## 🛠️ Technology Stack

| Component            | Technology      |
| -------------------- | --------------- |
| Programming Language | Python          |
| Dashboard            | Streamlit       |
| Data Processing      | Pandas, NumPy   |
| Visualization        | Plotly          |
| Machine Learning     | Scikit-learn    |
| ML Model             | Random Forest   |
| Model Persistence    | Joblib          |
| Optimization         | Google OR-Tools |
| API Layer            | FastAPI         |
| Server               | Uvicorn         |
| Version Control      | Git & GitHub    |

---

## 📂 Project Structure

```text
SIH_2026/
│
├── Dashboard/
│   └── app.py
│
├── data/
│   └── railway_data.csv
│
├── ml/
│   ├── asset_risk.py
│   └── block_success.py
│
├── models/
│   ├── asset_model.pkl
│   └── block_model.pkl
│
├── optimization/
│   └── optimizer.py
│
├── utils/
│   └── helpers.py
│
├── requirements.txt
├── README.md
└── .gitignore
```

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/lavanyaag23/SIH_2026.git
cd SIH_2026
```

### 2. Create a virtual environment

```bash
python -m venv venv
```

### 3. Activate the virtual environment

**Windows PowerShell:**

```bash
.\venv\Scripts\Activate.ps1
```

If PowerShell activation is restricted, use the virtual environment's Python directly.

---

### 4. Install dependencies

```bash
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

---

## ▶️ Run the Dashboard

Navigate to the dashboard directory:

```bash
cd Dashboard
```

Run Streamlit:

```bash
python -m streamlit run app.py
```

The dashboard will open in your browser.

---

## 📦 Requirements

The project uses the following major Python packages:

```text
streamlit
pandas
numpy
plotly
scikit-learn
joblib
ortools
fastapi
uvicorn
```

---

## 📊 Prototype Data

The current prototype uses **synthetic railway maintenance and operational data** for development and demonstration.

The dataset can represent fields such as:

```text
Asset ID
Asset Type
Department
Section
Asset Age
Condition Score
Criticality
Failure Count
Maintenance Priority
Work Type
Estimated Duration
Block Window
Train Conflicts
Machine Availability
Crew Availability
Historical Success
```

> **Note:** The prototype does not claim access to live Indian Railways operational systems or confidential railway data.

---

## 🎯 Key Features

* ✅ AI-based asset risk prioritization
* ✅ Maintenance job prioritization
* ✅ Block success prediction
* ✅ Automatic block recommendation
* ✅ Multi-constraint optimization
* ✅ Train conflict identification
* ✅ Resource availability consideration
* ✅ Explainable AI recommendations
* ✅ What-if simulation
* ✅ Disruption recovery recommendations
* ✅ Weekly/monthly planning support
* ✅ Interactive railway planning dashboard

---

## 🌟 What Makes the Solution Different?

Existing railway systems and planning workflows provide important operational data and planning processes.

This project focuses on adding an **AI-driven decision-support and optimization layer** that can:

```text
Integrate Planning Factors
          +
Predict Risk
          +
Evaluate Block Success
          +
Optimize Constraints
          +
Explain Recommendations
          +
Simulate What-If Scenarios
          +
Suggest Recovery Plans
```

The objective is **not to replace existing railway systems**, but to support planners with intelligent recommendations and optimization.

---

## 📈 Expected Impact

The proposed system aims to support:

### 🚆 Better Train Operations

Reduced conflicts between maintenance blocks and train movement.

### 🔧 Improved Asset Availability

Critical maintenance activities can be prioritized based on risk and urgency.

### ⏱️ Better Block Utilization

Available maintenance windows can be used more efficiently.

### 🤝 Cross-Department Coordination

Multiple maintenance activities can be considered together.

### 🧠 Data-Driven Planning

Planners receive AI-supported recommendations instead of relying only on manual evaluation.

### 🔄 Faster Recovery

Alternative windows can be identified when planned maintenance is disrupted.

---

## 🔮 Future Scope

The prototype can be extended with:

* Integration with real railway information systems
* Real-time timetable and train movement data
* Real-time asset health monitoring
* Advanced predictive maintenance models
* Large-scale optimization
* GIS-based railway network visualization
* Role-based access control
* PostgreSQL/enterprise database integration
* FastAPI-based production backend
* Real-time alerts and notifications
* Deployment on railway infrastructure/cloud environment

---

## 🔐 Data & Security

The current prototype is designed for demonstration using synthetic data.

A production deployment would require:

* Secure authentication
* Role-based authorization
* Encrypted communication
* Audit logs
* Secure APIs
* Data governance
* Railway IT/security compliance
* Controlled access to operational data

---

## 📚 Research & References

1. **Indian Railways — Rolling Block Planning / JPO**
   Existing railway maintenance planning and coordination practices.

2. **Utsav Shukla (2026)**
   *Track Allocation in Indian Railways: Institutional Design, Departmental Incentives, and the Allocation of Scarce Track Time.*

3. **Smart India Hackathon 2026 — SIH26027**
   *AI-Powered Automatic Block Planning to Maximize Asset Availability for Train Operations on Indian Railways.*

4. **Prototype Dataset**
   Synthetic railway maintenance and operational data created for system development and demonstration.

---

## 👥 Team

Developed as a **Smart India Hackathon 2026** project.

### Team Responsibilities

| Area                    | Responsibility                             |
| ----------------------- | ------------------------------------------ |
| Data Engineering        | Dataset creation & preprocessing           |
| Machine Learning        | Asset risk & block success prediction      |
| Optimization            | Block scheduling & constraint optimization |
| Frontend                | Streamlit dashboard                        |
| Integration             | Connecting ML, optimization & dashboard    |
| Testing & Documentation | Validation, GitHub & presentation          |

---

## 🚀 Project Status

**Current Status:** 🚧 Prototype / SIH Development

The current version demonstrates the core concept of AI-assisted railway maintenance block planning using synthetic data.

---

## 📜 Disclaimer

This project is a **prototype developed for Smart India Hackathon 2026**.

It is not an official Indian Railways system and does not access or control live railway operations.

---

## ⭐ Acknowledgements

Developed for **Smart India Hackathon 2026** under the problem statement:

> **AI-Powered Automatic Block Planning to Maximize Asset Availability for Train Operations on Indian Railways**

---

### Built with ❤️ using Python, Machine Learning & Optimization
