import { useState, useRef, useEffect } from "react";

const API = "http://localhost:8000";

const DISEASES = [
  { id: "dengue", name: "Dengue", icon: "🦟", color: "#FFF3E0", border: "#FFB74D" },
  { id: "malaria", name: "Malaria", icon: "🦟", color: "#F3E5F5", border: "#CE93D8" },
  { id: "cholera", name: "Cholera", icon: "💧", color: "#E3F2FD", border: "#64B5F6" },
  { id: "tuberculosis", name: "TB", icon: "🫁", color: "#E8F5E9", border: "#81C784" },
  { id: "typhoid", name: "Typhoid", icon: "🌡️", color: "#FFF8E1", border: "#FFD54F" },
  { id: "diarrhoea", name: "Diarrhoea", icon: "💊", color: "#E0F7FA", border: "#4DD0E1" },
  { id: "pneumonia", name: "Pneumonia", icon: "🫁", color: "#FCE4EC", border: "#F48FB1" },
  { id: "hepatitis", name: "Hepatitis", icon: "🩺", color: "#FBE9E7", border: "#FF8A65" },
  { id: "covid", name: "COVID-19", icon: "🦠", color: "#E8EAF6", border: "#7986CB" },
  { id: "leptospirosis", name: "Leptospirosis", icon: "🌊", color: "#E0F2F1", border: "#4DB6AC" },
];

const SYMPTOMS = ["Fever", "Cough", "Diarrhoea", "Headache", "Body pain", "Vomiting", "Rash", "Chills", "Breathlessness", "Jaundice"];

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display:ital@0;1&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --green: #1a6b4a; --green-light: #2d9162; --green-pale: #e8f5ee; --green-subtle: #f0faf4;
    --cream: #fafaf7; --text: #1a1a1a; --text-2: #4a4a4a; --text-3: #8a8a8a;
    --border: #e8e8e0; --white: #ffffff;
    --shadow: 0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04);
    --shadow-hover: 0 4px 24px rgba(26,107,74,0.12);
  }
  body { font-family: 'DM Sans', sans-serif; background: var(--cream); color: var(--text); min-height: 100vh; -webkit-font-smoothing: antialiased; }
  button, input, select { font-family: 'DM Sans', sans-serif; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes spin { to{transform:rotate(360deg)} }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
  @keyframes slideIn { from{opacity:0;transform:translateX(10px)} to{opacity:1;transform:translateX(0)} }
  .fade-up { animation: fadeUp 0.5s ease both; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
`;

function Spinner() {
  return <span style={{display:"inline-block",width:14,height:14,border:"2px solid #ccc",borderTop:"2px solid var(--green)",borderRadius:"50%",animation:"spin 0.7s linear infinite"}}/>;
}

function NavBar({ tab, setTab }) {
  const tabs = [
    { id: "home", label: "Home" },
    { id: "chat", label: "Ask MaitriMed" },
    { id: "symptom", label: "Symptom Check" },
    { id: "services", label: "Health Services" },
  ];
  return (
    <nav style={{background:"white",borderBottom:"1px solid var(--border)",position:"sticky",top:0,zIndex:100}}>
      <div style={{maxWidth:900,margin:"0 auto",padding:"0 24px",display:"flex",alignItems:"center",justifyContent:"space-between",height:60}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:32,height:32,background:"var(--green)",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>🌿</div>
          <span style={{fontFamily:"'DM Serif Display',serif",fontSize:20,color:"var(--green)",letterSpacing:"-0.3px"}}>MaitriMed</span>
        </div>
        <div style={{display:"flex",gap:4}}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{padding:"6px 14px",borderRadius:8,border:"none",background:tab===t.id?"var(--green-pale)":"transparent",color:tab===t.id?"var(--green)":"var(--text-2)",fontSize:13,fontWeight:tab===t.id?500:400,cursor:"pointer",transition:"all 0.15s"}}>{t.label}</button>
          ))}
        </div>
      </div>
    </nav>
  );
}

function HeroSection({ setTab }) {
  return (
    <div style={{background:"white",borderBottom:"1px solid var(--border)"}}>
      <div style={{maxWidth:900,margin:"0 auto",padding:"72px 24px 60px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:48,alignItems:"center"}}>
        <div className="fade-up">
          <div style={{display:"inline-flex",alignItems:"center",gap:6,background:"var(--green-pale)",color:"var(--green)",padding:"4px 12px",borderRadius:999,fontSize:12,fontWeight:500,marginBottom:20}}>
            <span style={{width:6,height:6,borderRadius:"50%",background:"var(--green)",display:"inline-block"}}></span>
            SIH 2025 · PS SIH25049 · Govt of Odisha
          </div>
          <h1 style={{fontFamily:"'DM Serif Display',serif",fontSize:44,lineHeight:1.15,marginBottom:16,letterSpacing:"-0.5px"}}>
            Your caring<br/><span style={{color:"var(--green)"}}>health companion</span><br/>in your language
          </h1>
          <p style={{fontSize:15,color:"var(--text-2)",lineHeight:1.75,marginBottom:28,maxWidth:380}}>
            AI-powered disease awareness for Odisha's 45 million citizens. Ask in Hindi or English, get clear answers instantly.
          </p>
          <div style={{display:"flex",gap:10}}>
            <button onClick={() => setTab("chat")} style={{padding:"12px 24px",background:"var(--green)",color:"white",border:"none",borderRadius:12,fontSize:14,fontWeight:500,cursor:"pointer",transition:"background 0.2s"}}
              onMouseEnter={e=>e.target.style.background="var(--green-light)"}
              onMouseLeave={e=>e.target.style.background="var(--green)"}>
              Ask a health question →
            </button>
            <button onClick={() => setTab("symptom")} style={{padding:"12px 24px",background:"var(--green-pale)",color:"var(--green)",border:"1px solid var(--green)",borderRadius:12,fontSize:14,fontWeight:500,cursor:"pointer"}}>
              Check symptoms
            </button>
          </div>
        </div>
        <div className="fade-up" style={{animationDelay:"0.12s"}}>
          <div style={{background:"var(--green-subtle)",borderRadius:24,padding:24,border:"1px solid var(--border)"}}>
            <div style={{fontSize:12,color:"var(--text-3)",marginBottom:12,fontWeight:500,textTransform:"uppercase",letterSpacing:"0.05em"}}>Common health topics</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:16}}>
              {DISEASES.map(d => (
                <div key={d.id} style={{background:d.color,border:`1px solid ${d.border}`,borderRadius:10,padding:"6px 12px",fontSize:12,fontWeight:500,display:"flex",alignItems:"center",gap:5}}>
                  <span style={{fontSize:13}}>{d.icon}</span>{d.name}
                </div>
              ))}
            </div>
            <div style={{padding:"12px 14px",background:"white",borderRadius:14,border:"1px solid var(--border)",display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:32,height:32,background:"var(--green)",borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0}}>🌿</div>
              <div>
                <div style={{fontSize:12,fontWeight:500,color:"var(--text)"}}>मैं MaitriMed हूं — I'm MaitriMed</div>
                <div style={{fontSize:11,color:"var(--text-3)"}}>Ask me anything about your health...</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{maxWidth:900,margin:"0 auto",padding:"0 24px 56px",display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
        {[
          {num:"45M+",label:"Citizens served in Odisha",icon:"👥"},
          {num:"10",label:"Disease knowledge areas",icon:"🏥"},
          {num:"EN + HI",label:"Bilingual support",icon:"🗣️"},
        ].map((s,i) => (
          <div key={i} className="fade-up" style={{animationDelay:`${0.2+i*0.08}s`,background:"var(--green-subtle)",border:"1px solid var(--border)",borderRadius:16,padding:"22px 20px"}}>
            <div style={{fontSize:22,marginBottom:8}}>{s.icon}</div>
            <div style={{fontFamily:"'DM Serif Display',serif",fontSize:30,color:"var(--green)",marginBottom:3}}>{s.num}</div>
            <div style={{fontSize:12,color:"var(--text-3)",lineHeight:1.5}}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChatTab() {
  const [messages, setMessages] = useState([{role:"assistant",text:"Namaste! I'm MaitriMed 🌿 — your health companion. Ask me about disease symptoms, prevention, or government health services in Hindi or English!\n\nनमस्ते! मैं MaitriMed हूं — आपका स्वास्थ्य साथी।",sources:[]}]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState("en");
  const [sessionId, setSessionId] = useState(null);
  const bottomRef = useRef(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({behavior:"smooth"}); }, [messages]);

  const send = async (text) => {
    if (!text.trim() || loading) return;
    setMessages(p => [...p, {role:"user",text}]);
    setInput(""); setLoading(true);
    try {
      const res = await fetch(`${API}/chat`, {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:text,session_id:sessionId,language:lang})});
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail);
      setSessionId(data.session_id);
      setMessages(p => [...p, {role:"assistant",text:data.answer,sources:data.sources}]);
    } catch(e) {
      setMessages(p => [...p, {role:"assistant",text:`Connection error: ${e.message}. Is the backend running on port 8000?`,sources:[],error:true}]);
    } finally { setLoading(false); }
  };

  return (
    <div style={{maxWidth:720,margin:"0 auto",padding:"32px 24px"}}>
      <div style={{marginBottom:16}}>
        <div style={{fontSize:12,color:"var(--text-3)",marginBottom:10,fontWeight:500,textTransform:"uppercase",letterSpacing:"0.05em"}}>Quick topics — tap to ask</div>
        <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
          {DISEASES.map(d => (
            <button key={d.id} onClick={() => send(`Tell me about ${d.name} — symptoms, prevention and treatment`)}
              style={{background:d.color,border:`1px solid ${d.border}`,borderRadius:10,padding:"6px 12px",fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",gap:5,fontWeight:500,color:"var(--text)",transition:"opacity 0.15s"}}
              onMouseEnter={e=>e.currentTarget.style.opacity="0.7"}
              onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
              <span style={{fontSize:14}}>{d.icon}</span>{d.name}
            </button>
          ))}
        </div>
      </div>
      <div style={{background:"white",border:"1px solid var(--border)",borderRadius:20,overflow:"hidden",boxShadow:"var(--shadow)"}}>
        <div style={{height:460,overflowY:"auto",padding:"20px 20px 8px",display:"flex",flexDirection:"column",gap:16}}>
          {messages.map((m,i) => (
            <div key={i} style={{animation:"slideIn 0.25s ease both",display:"flex",flexDirection:"column",alignItems:m.role==="user"?"flex-end":"flex-start"}}>
              {m.role==="assistant" && (
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:5}}>
                  <div style={{width:22,height:22,background:"var(--green)",borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11}}>🌿</div>
                  <span style={{fontSize:11,fontWeight:500,color:"var(--green)"}}>MaitriMed</span>
                </div>
              )}
              <div style={{maxWidth:"80%",padding:"12px 16px",background:m.role==="user"?"var(--green)":m.error?"#fff5f5":"var(--green-subtle)",color:m.role==="user"?"white":m.error?"#c0392b":"var(--text)",borderRadius:m.role==="user"?"18px 18px 4px 18px":"4px 18px 18px 18px",fontSize:14,lineHeight:1.65,whiteSpace:"pre-wrap",border:m.role==="assistant"?"1px solid var(--border)":"none"}}>
                {m.text}
              </div>
              {m.sources && m.sources.length > 0 && (
                <div style={{display:"flex",gap:5,marginTop:5,flexWrap:"wrap"}}>
                  {m.sources.map((s,si) => (
                    <span key={si} style={{fontSize:10,background:"#f0faf4",color:"var(--green)",padding:"2px 8px",borderRadius:999,border:"1px solid #c8e6d0",fontWeight:500}}>📄 {s.name}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:22,height:22,background:"var(--green)",borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11}}>🌿</div>
              <div style={{background:"var(--green-subtle)",border:"1px solid var(--border)",borderRadius:"4px 18px 18px 18px",padding:"12px 16px",display:"flex",gap:4,alignItems:"center"}}>
                {[0,1,2].map(i => <span key={i} style={{width:6,height:6,borderRadius:"50%",background:"var(--green)",display:"block",animation:`pulse 1.2s ease ${i*0.2}s infinite`}}/>)}
              </div>
            </div>
          )}
          <div ref={bottomRef}/>
        </div>
        <div style={{padding:"12px 16px",borderTop:"1px solid var(--border)",display:"flex",gap:8,alignItems:"center",background:"var(--cream)"}}>
          <select value={lang} onChange={e=>setLang(e.target.value)} style={{padding:"8px 10px",borderRadius:10,border:"1px solid var(--border)",fontSize:12,background:"white",cursor:"pointer",color:"var(--text)",flexShrink:0}}>
            <option value="en">🇮🇳 English</option>
            <option value="hi">🇮🇳 हिंदी</option>
          </select>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send(input)}
            placeholder={lang==="hi"?"अपना सवाल लिखें...":"Ask about symptoms, diseases, or health services..."}
            style={{flex:1,padding:"10px 14px",borderRadius:12,border:"1px solid var(--border)",fontSize:14,background:"white",outline:"none",color:"var(--text)"}}
          />
          <button onClick={() => send(input)} disabled={loading || !input.trim()} style={{width:40,height:40,borderRadius:12,background:input.trim()?"var(--green)":"var(--border)",color:"white",border:"none",cursor:input.trim()?"pointer":"default",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:18,transition:"background 0.2s"}}>
            {loading ? <Spinner/> : "↑"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SymptomTab() {
  const [step, setStep] = useState(1);
  const [primary, setPrimary] = useState("");
  const [duration, setDuration] = useState(1);
  const [severity, setSeverity] = useState("mild");
  const [extra, setExtra] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const urgencyStyle = {
    emergency:{bg:"#fff0f0",c:"#c0392b",border:"#ffb3b3"},
    high:{bg:"#fff5e6",c:"#d35400",border:"#ffd3a0"},
    medium:{bg:"#fffbe6",c:"#b8860b",border:"#ffe58f"},
    low:{bg:"#f0faf4",c:"#1a6b4a",border:"#b7dfca"},
  };

  const submit = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/symptom-check`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({primary_symptom:primary,duration_days:duration,severity,extra_symptoms:extra})});
      setResult(await res.json()); setStep(4);
    } catch { alert("Could not connect. Is the backend running?"); }
    finally { setLoading(false); }
  };

  const reset = () => { setStep(1); setPrimary(""); setDuration(1); setSeverity("mild"); setExtra(""); setResult(null); };

  return (
    <div style={{maxWidth:620,margin:"0 auto",padding:"32px 24px"}}>
      <div style={{marginBottom:24}}>
        <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:28,marginBottom:6}}>Symptom checker</h2>
        <p style={{fontSize:14,color:"var(--text-3)"}}>Answer 3 quick questions to get health guidance.</p>
      </div>
      <div style={{display:"flex",gap:0,marginBottom:28,background:"var(--border)",borderRadius:999,padding:3}}>
        {["Symptom","Duration","Severity","Result"].map((s,i) => (
          <div key={i} style={{flex:1,textAlign:"center",padding:"7px 4px",borderRadius:999,background:step===i+1?"white":"transparent",fontSize:12,fontWeight:step===i+1?500:400,color:step===i+1?"var(--green)":"var(--text-3)",transition:"all 0.2s",boxShadow:step===i+1?"var(--shadow)":"none"}}>{s}</div>
        ))}
      </div>
      <div style={{background:"white",border:"1px solid var(--border)",borderRadius:20,padding:28,boxShadow:"var(--shadow)",animation:"fadeUp 0.3s ease"}}>
        {step===1 && (
          <div>
            <div style={{fontSize:15,fontWeight:500,marginBottom:16}}>What is your main symptom?</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:16}}>
              {SYMPTOMS.map(s => (
                <button key={s} onClick={() => {setPrimary(s);setStep(2);}} style={{padding:"9px 16px",borderRadius:10,border:`1.5px solid ${primary===s?"var(--green)":"var(--border)"}`,background:primary===s?"var(--green-pale)":"white",color:primary===s?"var(--green)":"var(--text)",fontSize:13,cursor:"pointer",fontWeight:primary===s?500:400,transition:"all 0.15s"}}>{s}</button>
              ))}
            </div>
            <input value={primary} onChange={e=>setPrimary(e.target.value)} placeholder="Or describe your symptom..."
              style={{width:"100%",padding:"11px 14px",borderRadius:12,border:"1px solid var(--border)",fontSize:14,outline:"none"}}/>
            {primary && <button onClick={() => setStep(2)} style={{marginTop:14,padding:"11px 22px",background:"var(--green)",color:"white",border:"none",borderRadius:12,fontSize:14,cursor:"pointer",fontWeight:500}}>Continue →</button>}
          </div>
        )}
        {step===2 && (
          <div>
            <div style={{fontSize:15,fontWeight:500,marginBottom:20}}>How long have you had <em>{primary}</em>?</div>
            <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:12}}>
              <input type="range" min="1" max="30" step="1" value={duration} onChange={e=>setDuration(Number(e.target.value))} style={{flex:1,accentColor:"var(--green)"}}/>
              <span style={{fontFamily:"'DM Serif Display',serif",fontSize:32,color:"var(--green)",minWidth:80}}>{duration}<span style={{fontSize:13,color:"var(--text-3)",fontFamily:"DM Sans"}}> {duration===1?"day":"days"}</span></span>
            </div>
            <div style={{display:"flex",gap:8,marginTop:20}}>
              <button onClick={() => setStep(1)} style={{padding:"11px 18px",borderRadius:12,border:"1px solid var(--border)",background:"white",fontSize:13,cursor:"pointer"}}>← Back</button>
              <button onClick={() => setStep(3)} style={{padding:"11px 22px",background:"var(--green)",color:"white",border:"none",borderRadius:12,fontSize:14,cursor:"pointer",fontWeight:500}}>Continue →</button>
            </div>
          </div>
        )}
        {step===3 && (
          <div>
            <div style={{fontSize:15,fontWeight:500,marginBottom:16}}>How severe are your symptoms?</div>
            <div style={{display:"flex",gap:10,marginBottom:18}}>
              {["mild","moderate","severe"].map(s => (
                <button key={s} onClick={() => setSeverity(s)} style={{flex:1,padding:"16px 8px",borderRadius:14,border:`2px solid ${severity===s?"var(--green)":"var(--border)"}`,background:severity===s?"var(--green-pale)":"white",color:severity===s?"var(--green)":"var(--text-2)",fontSize:13,fontWeight:severity===s?500:400,cursor:"pointer",transition:"all 0.15s"}}>
                  <div style={{fontSize:24,marginBottom:6}}>{s==="mild"?"😌":s==="moderate"?"😣":"😰"}</div>
                  {s.charAt(0).toUpperCase()+s.slice(1)}
                </button>
              ))}
            </div>
            <input value={extra} onChange={e=>setExtra(e.target.value)} placeholder="Any other symptoms? (optional)"
              style={{width:"100%",padding:"11px 14px",borderRadius:12,border:"1px solid var(--border)",fontSize:14,outline:"none",marginBottom:16}}/>
            <div style={{display:"flex",gap:8}}>
              <button onClick={() => setStep(2)} style={{padding:"11px 18px",borderRadius:12,border:"1px solid var(--border)",background:"white",fontSize:13,cursor:"pointer"}}>← Back</button>
              <button onClick={submit} disabled={loading} style={{padding:"11px 24px",background:"var(--green)",color:"white",border:"none",borderRadius:12,fontSize:14,cursor:"pointer",fontWeight:500,display:"flex",alignItems:"center",gap:8}}>
                {loading && <Spinner/>} Get health guidance
              </button>
            </div>
          </div>
        )}
        {step===4 && result && (
          <div style={{animation:"fadeUp 0.3s ease"}}>
            {result.is_emergency && (
              <div style={{background:"#fff0f0",border:"1.5px solid #ffb3b3",borderRadius:14,padding:"14px 16px",marginBottom:16,fontSize:14,color:"#c0392b",fontWeight:500}}>🚨 {result.emergency_message}</div>
            )}
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:18}}>
              <span style={{background:urgencyStyle[result.urgency]?.bg,color:urgencyStyle[result.urgency]?.c,border:`1px solid ${urgencyStyle[result.urgency]?.border}`,padding:"4px 12px",borderRadius:999,fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em"}}>{result.urgency} urgency</span>
              <span style={{fontSize:12,color:"var(--text-3)"}}>{result.duration_note}</span>
            </div>
            {result.results.map((r,i) => (
              <div key={i} style={{background:"var(--green-subtle)",border:"1px solid var(--border)",borderRadius:16,padding:"16px 18px",marginBottom:12}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10,flexWrap:"wrap"}}>
                  <span style={{fontWeight:500,fontSize:15}}>{r.condition}</span>
                  <span style={{fontSize:10,background:r.confidence==="high"?"#e8f5ee":"#fff8e6",color:r.confidence==="high"?"var(--green)":"#b8860b",padding:"2px 8px",borderRadius:999,fontWeight:600,border:`1px solid ${r.confidence==="high"?"#b7dfca":"#ffe58f"}`}}>{r.confidence} match</span>
                  {r.has_danger_signs && <span style={{fontSize:10,background:"#fff0f0",color:"#c0392b",padding:"2px 8px",borderRadius:999,fontWeight:600,border:"1px solid #ffb3b3"}}>⚠ Danger signs</span>}
                </div>
                <p style={{fontSize:13,color:"var(--text-2)",lineHeight:1.65,marginBottom:10}}>{r.advice}</p>
                <div style={{background:"white",borderRadius:10,padding:"10px 12px",fontSize:12,color:"var(--green)",border:"1px solid var(--border)",fontWeight:500}}>🏥 {r.visit}</div>
              </div>
            ))}
            <p style={{fontSize:11,color:"var(--text-3)",marginTop:10,lineHeight:1.5}}>{result.general_advice}</p>
            <button onClick={reset} style={{marginTop:14,padding:"10px 20px",background:"var(--green)",color:"white",border:"none",borderRadius:12,fontSize:13,cursor:"pointer",fontWeight:500}}>Check again</button>
          </div>
        )}
      </div>
    </div>
  );
}

function ServicesTab() {
  const services = [
    {icon:"🏥",name:"Biju Swasthya Kalyan Yojana",short:"BSKY",desc:"Free treatment up to ₹5 lakh per family per year at empanelled hospitals.",contact:"104",color:"#e8f5ee",border:"#b7dfca"},
    {icon:"🚑",name:"108 Ambulance",short:"",desc:"Free emergency ambulance service available 24 hours a day, 7 days a week.",contact:"108",color:"#fff0f0",border:"#ffb3b3"},
    {icon:"📱",name:"Mo Swasthya",short:"",desc:"Mobile health units reaching remote and rural areas across Odisha.",contact:"104",color:"#e3f2fd",border:"#90caf9"},
    {icon:"🫁",name:"Nikshay (TB Programme)",short:"",desc:"Free TB testing and complete 6-month medicine course under government.",contact:"1800-11-6666",color:"#f3e5f5",border:"#ce93d8"},
    {icon:"🩺",name:"National Health Mission",short:"NHM",desc:"Free medicines available at all government health facilities across India.",contact:"PHC",color:"#fbe9e7",border:"#ff8a65"},
    {icon:"📞",name:"Health Helpline",short:"",desc:"Free teleconsultation available 24 hours a day. Talk to a health expert.",contact:"104",color:"#fff8e1",border:"#ffd54f"},
  ];
  return (
    <div style={{maxWidth:800,margin:"0 auto",padding:"32px 24px"}}>
      <div style={{marginBottom:28}}>
        <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:28,marginBottom:6}}>Free health services</h2>
        <p style={{fontSize:14,color:"var(--text-3)"}}>All services below are completely free for citizens of Odisha.</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:14}}>
        {services.map((s,i) => (
          <div key={i} className="fade-up" style={{animationDelay:`${i*0.06}s`,background:"white",border:"1px solid var(--border)",borderRadius:18,padding:"20px",transition:"box-shadow 0.2s",cursor:"default"}}
            onMouseEnter={e=>e.currentTarget.style.boxShadow="var(--shadow-hover)"}
            onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
              <div style={{width:44,height:44,background:s.color,border:`1px solid ${s.border}`,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{s.icon}</div>
              <div style={{background:"var(--green)",color:"white",padding:"6px 14px",borderRadius:999,fontSize:14,fontWeight:600}}>{s.contact}</div>
            </div>
            <div style={{fontWeight:500,fontSize:14,marginBottom:5}}>{s.name}{s.short&&<span style={{fontSize:11,color:"var(--text-3)",marginLeft:5}}>({s.short})</span>}</div>
            <div style={{fontSize:12,color:"var(--text-3)",lineHeight:1.6}}>{s.desc}</div>
          </div>
        ))}
      </div>
      <div style={{marginTop:20,background:"var(--green)",borderRadius:18,padding:"22px 28px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div>
          <div style={{fontFamily:"'DM Serif Display',serif",fontSize:22,color:"white",marginBottom:4}}>In an emergency?</div>
          <div style={{fontSize:13,color:"rgba(255,255,255,0.8)"}}>Call 108 for a free ambulance. Available 24/7 across Odisha.</div>
        </div>
        <div style={{fontSize:40,fontFamily:"'DM Serif Display',serif",color:"white"}}>108</div>
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("home");
  return (
    <>
      <style>{CSS}</style>
      <NavBar tab={tab} setTab={setTab}/>
      <main style={{minHeight:"calc(100vh - 60px)"}}>
        {tab==="home" && <HeroSection setTab={setTab}/>}
        {tab==="chat" && <ChatTab/>}
        {tab==="symptom" && <SymptomTab/>}
        {tab==="services" && <ServicesTab/>}
      </main>
      <footer style={{borderTop:"1px solid var(--border)",padding:"20px 24px",textAlign:"center",fontSize:12,color:"var(--text-3)",background:"white"}}>
        MaitriMed · SIH 2025 · PS SIH25049 · For awareness only · Always consult a qualified doctor · Emergency: 108
      </footer>
    </>
  );
}
