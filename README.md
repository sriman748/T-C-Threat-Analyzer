
# 🛡️ T&C Threat Analyzer

An interactive, AI-powered web tool that analyzes **Terms & Conditions (T&C)** and **Privacy Policies** for potential **legal and privacy risks**. Perfect for everyday users and developers who want to understand what they're agreeing to before clicking “I Agree.”

---

## 🚀 Features

- 🌐 **Live URL Analysis** – Fetch and analyze T&C content from websites
- 📊 **Risk Classification** – Highlights clauses as Low, Medium, High, or Critical risk
- 🤖 **Clause Chatbot** – Built-in assistant for each clause (works per sentence)
- 📥 **PDF Export** – Download a color-coded summary report
- 📈 **Risk Filter** – Dropdown to filter clauses by severity
- ⏫ **Smart UI** – Scroll to top, filter toggle, chatbot pane, loading indicators
- 🧠 **Built-in Legal Intelligence** – Uses known keywords to detect threat patterns
- 🛠️ **Backend Proxy** – Node.js/Express-based server with Puppeteer for full CORS-free scraping

---

## 🧰 Tech Stack

| Frontend             | Backend            |
|----------------------|--------------------|
| React.js             | Node.js + Express  |
| Tailwind CSS         | Puppeteer (scraping) |
| Framer Motion        | CORS Middleware    |
| Lucide Icons         |                    |
| jsPDF + autoTable    |                    |

---

## 🧪 Getting Started (Local Setup)

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/tnc-analyzer.git
cd tnc-analyzer
2. Install frontend dependencies
bash
Copy
Edit
npm install
npm start
Frontend runs at: http://localhost:3000

3. Setup Backend Proxy
bash
Copy
Edit
cd backend
npm install
node server.js
Backend runs at: http://localhost:5000
