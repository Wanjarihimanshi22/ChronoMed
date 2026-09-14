# ChronoMed Healthcare Dashboard 🩺⏰

Smart medication reminders with audible alarms, circadian chronotherapy guidance, and a personalized health progress visualization dashboard.

## 🚀 How to Run Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or 20+ recommended)
- `npm` or `pnpm` or `yarn`

### Installation & Startup Steps

1. **Clone or Download the Repository**
   ```bash
   git clone <your-github-repo-url>
   cd chronomed
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start the Local Development Server**
   ```bash
   npm run dev
   ```

4. **Access the App in Your Browser**
   - Open your browser to the local address:
     👉 **[http://localhost:3000](http://localhost:3000)** (or the port specified in terminal)

---

## 🔐 Credentials for Quick Testing

You can use the **1-Click Login** buttons on the Sign In screen, or enter the demo credentials:

| Patient Name | Email | Password | Clinical Focus |
| :--- | :--- | :--- | :--- |
| **Eleanor Vance** | `eleanor.vance@chronomed.io` | `password123` | Hypertension & Lipid Regimen |
| **Himanshi Wanjari** | `wanjarihimanshi@gmail.com` | `chronomed2026` | Preventive Cardiovascular Wellness |

You can also click **"New Patient Sign Up"** to create a custom account or **"Forgot Password?"** to test the 6-digit self-service code recovery.

---

## 🌟 Key Features

1. **Sign In, Sign Out & Forgot Password**: Secure patient authentication with 6-digit code reset flow and 1-click test access.
2. **Audible Medication Alarms**: Synthesizes real-time medical chimes via the Web Audio API with Snooze (5-15 min) and Take Dose confirmation.
3. **Personalized Health Progress Dashboard**:
   - **ChronoMed Health Index (0–100)**: Real-time vitality rating calculated from adherence, blood pressure stability, hydration, and sleep.
   - **Interactive Charts**: Adherence trend line/area charts, blood pressure tracking (Systolic/Diastolic), and blood glucose levels.
   - **Hydration & Badges**: Quick-log hydration tracker (+250ml, +500ml) with streak achievements.
4. **Circadian Chronotherapy Matrix**: 24-hour biological body clock mapping prescriptions to optimal biological windows (Morning Cortisol, Midday Metabolism, Nocturnal Hepatic Synthesis).
5. **Safety & Food Interactions**: Real-time scanner flagging food/drug conflicts (e.g. Grapefruit with Statins, Potassium with ACE Inhibitors).
6. **Digital Emergency I.C.E. Card**: Quick-access medical card with blood type, allergies, emergency contacts, and printable summary.

---

## 🛠️ Build for Production

To create an optimized production build:
```bash
npm run build
npm run preview
```
