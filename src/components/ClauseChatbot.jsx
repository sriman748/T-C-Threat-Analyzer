// // src/components/ClauseChatbot.jsx
// import React, { useState, useEffect } from "react";

// export default function ClauseChatbot({ clause }) {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [lastClause, setLastClause] = useState("");

//   useEffect(() => {
//     if (clause !== lastClause) {
//       setLastClause(clause);
//       setMessages([
//         { sender: "bot", text: `What would you like to know about this clause?` },
//       ]);
//       setInput("");
//     }
//   }, [clause, lastClause]);

//   const respond = (msg) => {
//     const lower = msg.toLowerCase();

//     if (
//       ["hi", "hello", "hey", "how are you", "thanks", "thank you"].some((greeting) => lower.includes(greeting))
//     ) {
//       return "Hello! I'm here to help you understand and navigate this clause. You can ask what it means, how to handle it, or how it affects your rights.";
//     }

//     if (lower.includes("gdpr") || lower.includes("privacy law") || lower.includes("data protection") || lower.includes("ccpa"))
//       return "This clause may conflict with data protection laws like GDPR or CCPA if it lacks consent or transparency.";

//     if (lower.includes("accept") || lower.includes("agree") || lower.includes("consent") || lower.includes("opt-in"))
//       return "Be cautious when giving consent. Make sure the clause is clear and fair. Consider legal tools or expert advice before accepting.";

//     if (
//       lower.includes("risk") ||
//       lower.includes("harm") ||
//       lower.includes("danger") ||
//       lower.includes("liability") ||
//       lower.includes("breach") ||
//       lower.includes("exploit")
//     )
//       return "Risks could include unauthorized access, legal liability, personal data exposure, or future misuse.";

//     if (
//       lower.includes("fight") ||
//       lower.includes("challenge") ||
//       lower.includes("refuse") ||
//       lower.includes("tackle") ||
//       lower.includes("avoid") ||
//       lower.includes("opt-out")
//     )
//       return "To fight or avoid this clause: check for opt-out options, request clarification from the company, or switch to more transparent services. Refer to resources like 'https://tosdr.org'.";

//     if (
//       lower.includes("meaning") ||
//       lower.includes("explain") ||
//       lower.includes("interpret") ||
//       lower.includes("understand") ||
//       lower.includes("define")
//     )
//       return `This clause likely means: \"${clause.slice(0, 120)}...\". For deeper understanding, consider checking with legal experts.`;

//     if (
//       lower.includes("who can help") ||
//       lower.includes("lawyer") ||
//       lower.includes("legal help") ||
//       lower.includes("legal advice") ||
//       lower.includes("attorney")
//     )
//       return "You can seek legal support from local legal aid organizations, privacy rights groups, or pro bono legal clinics. Try https://legalservicesindia.com/ or similar directories.";

//     if (
//       lower.includes("report") ||
//       lower.includes("complain") ||
//       lower.includes("violation") ||
//       lower.includes("regulator") ||
//       lower.includes("consumer rights")
//     )
//       return "You may file a complaint with your country’s data protection authority or consumer rights body if you believe this clause is unfair or illegal.";

//     return "This is a legally sensitive clause. If you feel unsure, use tools like 'Terms of Service; Didn't Read' or seek professional legal interpretation.";
//   };

//   const sendMessage = () => {
//     if (!input.trim()) return;
//     const newMessages = [
//       ...messages,
//       { sender: "user", text: input },
//       { sender: "bot", text: respond(input) },
//     ];
//     setMessages(newMessages);
//     setInput("");
//   };

//   return (
//     <div className="mt-4 bg-gray-100 p-3 rounded-md space-y-2">
//       <div className="text-xs text-gray-500 italic">💬 Assistant:</div>
//       <div className="space-y-1 max-h-32 overflow-y-auto text-sm">
//         {messages.map((m, i) => (
//           <p key={i} className={m.sender === "bot" ? "text-blue-800" : "text-black"}>
//             <strong>{m.sender === "bot" ? "🤖" : "🧑"}</strong> {m.text}
//           </p>
//         ))}
//       </div>
//       <div className="flex gap-2 mt-2">
//         <input
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//           placeholder="Ask something..."
//           className="border px-2 py-1 flex-1 rounded text-sm"
//         />
//         <button onClick={sendMessage} className="text-sm px-2 bg-blue-600 text-white rounded hover:bg-blue-700">
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }

// src/components/ClauseChatbot.jsx
import React, { useState, useEffect } from "react";

export default function ClauseChatbot({ clause }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [lastClause, setLastClause] = useState("");

  useEffect(() => {
    if (clause !== lastClause) {
      setLastClause(clause);
      setMessages([
        { sender: "bot", text: `🤖 Hello! I'm here to help you understand and navigate this clause. Ask me anything about risk, meaning, or your options.` },
      ]);
      setInput("");
    }
  }, [clause, lastClause]);

  const getLiveLegalInsight = async (clauseText) => {
    try {
      const keywords = [
        "arbitration", "data collection", "tracking", "liability",
        "sell data", "third party", "binding agreement", "forced consent",
        "indemnification", "user responsibility", "share with government",
        "no opt-out", "personal rights waiver", "class action waiver",
        "unilateral change", "bypass consent"
      ];
      const match = keywords.find(k => clauseText.toLowerCase().includes(k));
      if (match) {
        return `📚 Based on known legal issues, the clause may be related to '\${match}', which may affect your privacy or rights.`;
      } else {
        return "🔍 No legal red flags matched from known patterns. Still, use caution.";
      }
    } catch (err) {
      return "⚠️ Could not retrieve legal insight. Please try again later.";
    }
  };

  const respond = async (msg) => {
    const lower = msg.toLowerCase();

    if (["hi", "hello", "hey", "how are you", "thanks", "thank you"].some(g => lower.includes(g))) {
      return "👋 Hello! I'm here to help you understand this clause. You can ask about its meaning, risks, or how to handle it.";
    }

    if (lower.includes("meaning") || lower.includes("explain") || lower.includes("interpret") || lower.includes("understand")) {
      return `📖 This clause likely means: '\${clause.slice(0, 120)}...'. Need more help? Try asking about risk or action.`;
    }

    if (lower.includes("live insight") || lower.includes("api") || lower.includes("legal expert") || lower.includes("real advice") || lower.includes("lawyer")) {
      return await getLiveLegalInsight(clause);
    }

    if (lower.includes("risk") || lower.includes("harm") || lower.includes("liability") || lower.includes("exploit") || lower.includes("danger")) {
      return "⚠️ Risks may include misuse of your data, legal obligations you can’t revoke, or being subject to third-party data brokers.";
    }

    if (lower.includes("fight") || lower.includes("challenge") || lower.includes("opt-out") || lower.includes("avoid") || lower.includes("save") || lower.includes("protect")) {
      return "🛡️ To protect yourself, search for opt-out options, contact support to clarify terms, or use tools like https://tosdr.org/ to compare platforms with better terms.";
    }

    if (lower.includes("who can help") || lower.includes("who will help") || lower.includes("where to get help") || lower.includes("how to get help")) {
      return "🔍 You can consult legal aid services, privacy watchdogs, or organizations like EFF.org or ToS;DR for free analysis and community feedback.";
    }

    if (lower.includes("advice") || lower.includes("help me") || lower.includes("guide me")) {
      return "💡 Here's one suggestion: Always read for keywords like 'share', 'track', 'opt-out', or 'arbitration'. If any are unclear, ask or avoid agreeing.";
    }

    if (lower.includes("bye") || lower.includes("thank you") || lower.includes("thanks")) {
      return "👋 You're welcome! Stay safe and informed."
    }

    return await getLiveLegalInsight(clause);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: "user", text: input };
    setMessages(prev => [...prev, userMsg, { sender: "bot", text: "🤔 Thinking..." }]);
    const botText = await respond(input);
    setMessages(prev => [...prev.slice(0, -1), { sender: "bot", text: botText }]);
    setInput("");
  };

  return (
    <div className="mt-4 bg-gray-100 p-3 rounded-md space-y-2">
      <div className="text-xs text-gray-500 italic">💬 Assistant:</div>
      <div className="space-y-1 max-h-32 overflow-y-auto text-sm">
        {messages.map((m, i) => (
          <p key={i} className={m.sender === "bot" ? "text-blue-800" : "text-black"}>
            <strong>{m.sender === "bot" ? "🤖" : "🧑"}</strong> {m.text}
          </p>
        ))}
      </div>
      <div className="flex gap-2 mt-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask something..."
          className="border px-2 py-1 flex-1 rounded text-sm"
        />
        <button onClick={sendMessage} className="text-sm px-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Send
        </button>
      </div>
    </div>
  );
}
