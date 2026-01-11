# Stroop Lab

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![React](https://img.shields.io/badge/React-18-blue)
![Vite](https://img.shields.io/badge/Vite-5.0-646cff)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8)

**A minimal, self-hosted Stroop task playground for exploring attention and inhibition.**

> **The Stroop Effect**: A demonstration of interference in the reaction time of a task. When the name of a color (e.g., "blue", "green", or "red") is printed in a color which is not denoted by the name, naming the color of the word takes longer and is more prone to errors than when the color of the ink matches the name of the color.

---

## ✨ Features

* **Classic Protocol**: Implements standard Congruent vs. Incongruent trials.
* **Millisecond Precision**: Uses `performance.now()` for high-precision reaction time tracking.
* **Configurable**: Customize trial counts (10-100) and interference ratios (0%-100%).
* **Dual Input**: Supports both Keyboard (`R`/`G`/`B`/`Y`) and Mouse interaction.
* **Analytics**:
    * Automatic calculation of the **Stroop Effect** (Inhibition Cost).
    * Accuracy tracking.
    * Mean Response Time breakdown.
* **Privacy First**: 100% Client-side. No data is sent to any server.

---

## 🛠 Tech Stack

Designed with a focus on modern, type-safe web standards:

* **Core**: React + TypeScript
* **Build Tool**: Vite
* **Styling**: Tailwind CSS (v4)
* **State Management**: React Hooks (Local State)
* **Architecture**: Feature-based folder structure with separated Logic (Hooks) and UI.

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v18 or higher)
* npm or pnpm

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/yourusername/stroop-lab.git](https://github.com/yourusername/stroop-lab.git)
    cd stroop-lab
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run locally**
    ```bash
    npm run dev
    ```

4.  **Build for production**
    ```bash
    npm run build
    ```

---

## 🎮 How to Use

1.  **Configure**: Set your desired **Total Trials** and **Interference Ratio** on the home screen.
2.  **Start**: Press "Start Experiment".
3.  **Task**: Identify the **INK COLOR** of the word shown on screen.
    * *Example*: If the word is <span style="color:blue">**RED**</span>, the correct answer is **BLUE**.
4.  **Controls**:
    * **R**: Red
    * **G**: Green
    * **B**: Blue
    * **Y**: Yellow
5.  **Analyze**: View your Stroop Effect score at the end. A positive score (e.g., +150ms) indicates normal cognitive interference.

---

## ⚠️ Disclaimer

**Stroop Lab is for educational and demonstrative purposes only.**

* ❌ It is **NOT** a medical device.
* ❌ It is **NOT** intended for the diagnosis or treatment of ADHD, cognitive decline, or any other medical condition.
* The results provided are for self-observation and curiosity.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
