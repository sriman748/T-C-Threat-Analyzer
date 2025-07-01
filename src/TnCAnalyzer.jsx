import React, { useState, useRef, useEffect } from "react";
import { AlertTriangle, CheckCircle, AlertCircle, Loader, ArrowUpCircle } from "lucide-react";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ClauseChatbot from "./components/ClauseChatbot";

const riskKeywords = {
  low: ["cookies", "preferences", "session storage", "browser type", "analytics", "basic device info"],
  medium: [
    "location", "usage data", "email tracking", "IP address", "browser fingerprinting",
    "log data", "user behavior", "metadata", "device identifier"
  ],
  high: [
    "third parties", "data sharing", "advertising", "personal information",
    "service providers", "retargeting", "demographic profiling", "user profiling", "affiliates",
    "data monetization", "targeted marketing", "tracking pixels"
  ],
  critical: [
    "waive rights", "binding arbitration", "sell your data", "no liability", "share with government",
    "class action waiver", "irrevocable license", "subpoena compliance", "data breach liability",
    "unilateral change", "dispute resolution", "forced arbitration", "legal indemnity",
    "third-party disclosure", "explicit consent", "surveillance compliance"
  ]
};

const futureImpacts = {
  low: "Minimal impact. Mostly harmless for personalization.",
  medium: "Might lead to behavioral tracking or profiling.",
  high: "Your data might be monetized or sold to advertisers.",
  critical: "Can result in loss of privacy, legal rights, or financial risk."
};

const getRiskLevel = (text) => {
  const lcText = text.toLowerCase();
  if (riskKeywords.critical.some(k => lcText.includes(k))) return "critical";
  if (riskKeywords.high.some(k => lcText.includes(k))) return "high";
  if (riskKeywords.medium.some(k => lcText.includes(k))) return "medium";
  return "low";
};

const riskColors = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  critical: "bg-red-100 text-red-800"
};

const riskPDFColors = {
  low: [204, 255, 204],
  medium: [255, 255, 153],
  high: [255, 204, 153],
  critical: [255, 153, 153]
};

const riskIcons = {
  low: <CheckCircle className="w-4 h-4" />,
  medium: <AlertCircle className="w-4 h-4" />,
  high: <AlertTriangle className="w-4 h-4" />,
  critical: <AlertTriangle className="w-4 h-4 animate-pulse" />
};

export default function TnCAnalyzer() {
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [clauses, setClauses] = useState([]);
  const [selectedClause, setSelectedClause] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [filterRisk, setFilterRisk] = useState("all");
  const clauseContainerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const analyzeText = async (inputText) => {
    const splitClauses = inputText.match(/[^.!?\n]+[.!?]/g) || [];
    const results = splitClauses.map((clause, index) => {
      const risk = getRiskLevel(clause);
      const impact = futureImpacts[risk];
      return { id: index, clause, risk, impact };
    });
    setClauses(results);
  };

  const fetchFromURL = async () => {
    if (!url || !url.startsWith("http")) {
      alert("Please enter a valid URL that starts with http or https.");
      return;
    }

    setLoading(true);
    try {
      const proxyURL = `http://localhost:5000/fetch?url=${encodeURIComponent(url)}`;
      const response = await fetch(proxyURL);
      const html = await response.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      doc.querySelectorAll("script, style, meta, noscript, link").forEach(el => el.remove());

      const rawText = doc.body?.innerText || "";
      const filteredText = rawText.split("\n")
        .map(line => line.trim())
        .filter(line => line.length > 80 && /[a-zA-Z]{4,}/.test(line))
        .join(". ");

      if (!filteredText || filteredText.length < 100) {
        throw new Error("Extracted content is too short or blocked.");
      }

      setText(filteredText.slice(0, 10000));
      analyzeText(filteredText);
    } catch (error) {
      console.error("Fetch error:", error.message);
      alert("⚠️ Failed to fetch or parse content. It might be blocked or CORS restricted.");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("T&C Threat Analyzer Report", 14, 20);

    doc.setFontSize(12);
    const summary = {
      total: clauses.length,
      low: clauses.filter(c => c.risk === "low").length,
      medium: clauses.filter(c => c.risk === "medium").length,
      high: clauses.filter(c => c.risk === "high").length,
      critical: clauses.filter(c => c.risk === "critical").length
    };
    doc.text(`Total Clauses: ${summary.total}`, 14, 30);
    doc.text(`Low Risk: ${summary.low}`, 14, 36);
    doc.text(`Medium Risk: ${summary.medium}`, 14, 42);
    doc.text(`High Risk: ${summary.high}`, 14, 48);
    doc.text(`Critical Risk: ${summary.critical}`, 14, 54);

    const rows = clauses.map(c => [
      c.clause.length > 80 ? c.clause.slice(0, 80) + "..." : c.clause,
      c.risk.toUpperCase(),
      c.impact
    ]);

    autoTable(doc, {
      startY: 60,
      head: [["Clause", "Risk", "Impact"]],
      body: rows,
      didParseCell: function (data) {
        if (data.section === 'body' && data.column.index === 1) {
          const risk = data.cell.raw.toLowerCase();
          const color = riskPDFColors[risk];
          if (color) {
            data.cell.styles.fillColor = color;
          }
        }
      }
    });

    doc.save("tnc_analysis_report.pdf");
  };

  const summaryCounts = {
    low: clauses.filter(c => c.risk === "low").length,
    medium: clauses.filter(c => c.risk === "medium").length,
    high: clauses.filter(c => c.risk === "high").length,
    critical: clauses.filter(c => c.risk === "critical").length
  };

  const riskOptions = ["all", "low", "medium", "high", "critical"];

  return (
    <motion.div className="max-w-5xl mx-auto p-6 space-y-6 bg-gray-50 min-h-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-4xl font-extrabold text-center text-blue-800">📜 T&C Threat Analyzer</h1>
      <p className="text-center text-gray-600 text-lg">Understand the risks hidden in Terms & Conditions — sentence by sentence.</p>

      <div className="flex flex-col gap-4 bg-white p-6 rounded-xl shadow">
        <textarea
          placeholder="Paste Terms & Conditions here..."
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="resize-none border rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
        />
        <button onClick={() => analyzeText(text)} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 w-fit">Analyze Text</button>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-4">
          <input
            type="text"
            placeholder="Enter URL to fetch Terms"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 border rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
          />
          <button onClick={fetchFromURL} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Analyze URL</button>
        </div>

        {loading && (
          <div className="flex items-center gap-2 text-blue-600 mt-2 animate-pulse">
            <Loader className="w-4 h-4 animate-spin" />
            <span>Analyzing content from URL...</span>
          </div>
        )}

        {clauses.length > 0 && (
          <>
            <button onClick={downloadPDF} className="mt-4 border border-blue-600 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 w-fit">
              📄 Download PDF Report
            </button>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-sm">
              {riskOptions.slice(1).map(risk => (
                <div
                  key={risk}
                  onClick={() => setFilterRisk(risk)}
                  className={`cursor-pointer px-3 py-2 rounded-lg shadow ${riskColors[risk]} ${filterRisk === risk ? 'ring-2 ring-blue-500' : ''}`}
                >
                  {risk.charAt(0).toUpperCase() + risk.slice(1)}: {summaryCounts[risk]}
                </div>
              ))}
              <div
                onClick={() => setFilterRisk("all")}
                className={`cursor-pointer px-3 py-2 rounded-lg shadow bg-gray-100 text-gray-800 ${filterRisk === 'all' ? 'ring-2 ring-blue-500' : ''}`}
              >
                Show All
              </div>
            </div>
          </>
        )}
      </div>

      <div ref={clauseContainerRef} className="space-y-4">
        {clauses
          .filter(({ risk }) => filterRisk === "all" || risk === filterRisk)
          .map(({ id, clause, risk, impact }) => (
            <div id={`clause-${id}`} key={id} className={`${riskColors[risk]} border-l-4 shadow-md rounded-xl cursor-pointer`} onClick={() => setSelectedClause({ clause, risk, impact })}>
              <div className="flex flex-col gap-2 p-4">
                <div className="flex items-center gap-2">
                  {riskIcons[risk]}
                  <p className="font-semibold capitalize">{risk} Risk Detected</p>
                </div>
                <p className="text-sm italic">"{clause.trim()}"</p>
                <p className="text-xs font-medium mt-2">🧠 Potential Future Impact: <span className="font-normal">{impact}</span></p>
              </div>
            </div>
        ))}
      </div>

      {selectedClause && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="clause-title"
          aria-describedby="clause-desc"
          className="fixed bottom-4 right-4 w-full max-w-md bg-white p-4 rounded-xl shadow-xl border z-50"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between items-center">
            <h2 id="clause-title" className="font-semibold text-lg">Clause Explanation</h2>
            <button onClick={() => setSelectedClause(null)} className="text-sm text-gray-500 hover:text-black">Close</button>
          </div>
          <div id="clause-desc" className="mt-2">
            <p className="text-sm"><strong>Clause:</strong> {selectedClause.clause}</p>
            <p className="text-sm mt-1"><strong>Risk Level:</strong> {selectedClause.risk}</p>
            <p className="text-sm mt-1"><strong>Why It Matters:</strong> {selectedClause.impact}</p>
            <div className="mt-4">
              <ClauseChatbot clause={selectedClause.clause} risk={selectedClause.risk} />
            </div>
          </div>
        </motion.div>
      )}

      {showScrollTop && (
        <button onClick={scrollToTop} className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700">
          <ArrowUpCircle className="w-6 h-6" />
        </button>
      )}
    </motion.div>
  );
}
