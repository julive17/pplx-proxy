import { useState, useEffect, useRef, useCallback } from "react";

// ─── Specialty data ───────────────────────────────────────────────────────────
const ESP = {
  medicina_general:       { label:"Medicina general",             icon:"ti-stethoscope",   color:"var(--text-accent)",   bg:"var(--bg-accent)"  },
  cirugia_general:        { label:"Cirugía general",              icon:"ti-scalpel",        color:"#991b1b",              bg:"#fef2f2"            },
  ginecologia_obstetricia:{ label:"Ginecología y obstetricia",    icon:"ti-heart-handshake",color:"#9d174d",              bg:"#fdf2f8"            },
  pediatria:              { label:"Pediatría",                    icon:"ti-user-check",     color:"#166534",              bg:"#f0fdf4"            },
  anestesiologia:         { label:"Anestesiología",               icon:"ti-needle",         color:"#6b21a8",              bg:"#f5f3ff"            },
  ortopedia_traumatologia:{ label:"Ortopedia y traumatología",    icon:"ti-bone",           color:"#92400e",              bg:"#fffbeb"            },
  medicina_interna:       { label:"Medicina interna",             icon:"ti-heart-rate-monitor",color:"#155e75",           bg:"#ecfeff"            },
  medicina_familiar:      { label:"Medicina familiar",            icon:"ti-home-heart",     color:"#3f6212",              bg:"#f7fee7"            },
};

const C = [
  {id:"C01",item:"Identificación del paciente",      desc:"Nombre completo, documento de identidad, edad, fecha y hora de la atención"},
  {id:"C02",item:"Motivo de consulta",               desc:"Expresado de forma clara y específica, preferiblemente en palabras del paciente"},
  {id:"C03",item:"Historia de la enfermedad actual", desc:"Cronología, características del síntoma, evolución y síntomas acompañantes"},
  {id:"C04",item:"Antecedentes personales",          desc:"Patológicos, quirúrgicos, farmacológicos, tóxico-alérgicos"},
  {id:"C05",item:"Antecedentes familiares",          desc:"Enfermedades hereditarias o de relevancia clínica en la familia"},
  {id:"C06",item:"Examen físico",                   desc:"Signos vitales más hallazgos pertinentes al motivo de consulta"},
  {id:"C07",item:"Diagnóstico con código CIE-10",   desc:"Impresión o diagnóstico definitivo con código CIE-10 correspondiente"},
  {id:"C08",item:"Plan de manejo y tratamiento",    desc:"Conducta terapéutica: medicamentos con dosis, vía y frecuencia; procedimientos; remisiones"},
  {id:"C09",item:"Fecha y hora del registro",       desc:"Consignados de forma clara y legible en el documento"},
  {id:"C10",item:"Legibilidad, firma y sello",      desc:"Historia clínica legible, firmada y sellada por el profesional responsable"},
];

const CE = {
  medicina_general:[
    {id:"MG01",item:"Revisión por sistemas",               desc:"Evaluación de sistemas no comprometidos en el motivo de consulta"},
    {id:"MG02",item:"Medicamentos formulados completos",   desc:"Nombre, dosis, vía, frecuencia y duración del tratamiento indicado"},
    {id:"MG03",item:"Conducta y plan de seguimiento",      desc:"Control posterior, interconsulta, referencia o indicaciones al egreso"},
  ],
  cirugia_general:[
    {id:"CG01",item:"Evaluación prequirúrgica",            desc:"Riesgo anestésico-quirúrgico, paraclínicos preoperatorios, preparación"},
    {id:"CG02",item:"Consentimiento informado firmado",    desc:"Diligenciado y firmado por el paciente o acudiente y el médico"},
    {id:"CG03",item:"Nota operatoria",                    desc:"Técnica quirúrgica, hallazgos, tiempo operatorio, tipo de incisión"},
    {id:"CG04",item:"Hallazgos intraoperatorios",         desc:"Descripción detallada de los hallazgos durante el acto quirúrgico"},
    {id:"CG05",item:"Nota postoperatoria y plan",         desc:"Estado del paciente, complicaciones, analgesia y plan postquirúrgico"},
  ],
  ginecologia_obstetricia:[
    {id:"GO01",item:"Historia gineco-obstétrica",          desc:"FUM, G/P/A/C, FPP, ciclos menstruales, FUPAP, método anticonceptivo"},
    {id:"GO02",item:"Examen ginecológico",                 desc:"Especuloscopía, tacto vaginal, características del cuello y útero"},
    {id:"GO03",item:"Paraclínicos obstétricos",            desc:"Ecografía, hemograma, parcial de orina, serologías prenatales"},
    {id:"GO04",item:"Diagnóstico obstétrico completo",     desc:"Edad gestacional, presentación, situación fetal, condición materna"},
    {id:"GO05",item:"Frecuencia cardiaca fetal",           desc:"FCF y movimientos fetales registrados cuando aplica"},
    {id:"GO06",item:"Conducta obstétrica",                 desc:"Plan de parto, manejo prenatal o de la patología ginecológica"},
  ],
  pediatria:[
    {id:"PED01",item:"Datos del acudiente o responsable",  desc:"Nombre, parentesco y datos de contacto del responsable del menor"},
    {id:"PED02",item:"Historia perinatal",                 desc:"Tipo de parto, edad gestacional al nacer, peso y talla al nacimiento, complicaciones"},
    {id:"PED03",item:"Desarrollo psicomotor",              desc:"Hitos del desarrollo motor, lenguaje y socialización adecuados para la edad"},
    {id:"PED04",item:"Estado vacunal (PAI)",               desc:"Esquema de vacunación consignado y verificado según la edad del paciente"},
    {id:"PED05",item:"Evaluación nutricional y antropometría",desc:"Peso, talla y PC graficados en curvas de crecimiento; estado nutricional clasificado"},
    {id:"PED06",item:"Diagnóstico pediátrico clasificado", desc:"Diagnóstico con clasificación AIEPI u otra escala pediátrica si aplica"},
  ],
  anestesiologia:[
    {id:"ANE01",item:"Valoración preanestésica",           desc:"Clasificación ASA, evaluación de vía aérea, Mallampati, antecedentes anestésicos"},
    {id:"ANE02",item:"Consentimiento anestésico informado",desc:"Firmado por el paciente o familiar; riesgos y alternativas explicados"},
    {id:"ANE03",item:"Técnica anestésica y fármacos",      desc:"Tipo de anestesia, medicamentos con dosis y vía de administración consignados"},
    {id:"ANE04",item:"Registro intraoperatorio de parámetros",desc:"TA, FC, SpO₂, EtCO₂ y otros parámetros continuos documentados"},
    {id:"ANE05",item:"Escala de recuperación postanestésica",desc:"Aldrete u otra escala documentada al egreso de URPA"},
  ],
  ortopedia_traumatologia:[
    {id:"ORT01",item:"Mecanismo y descripción de la lesión",desc:"Cómo ocurrió el trauma o inicio de la patología musculoesquelética"},
    {id:"ORT02",item:"Examen musculoesquelético detallado",desc:"Fuerza muscular, rangos de movimiento, dolor a la palpación y movilización"},
    {id:"ORT03",item:"Evaluación neurovascular distal",    desc:"Pulsos distales, sensibilidad y fuerza motora distal a la lesión"},
    {id:"ORT04",item:"Interpretación de estudios de imagen",desc:"Lectura clínica de Rx, TAC o RMN realizada por el médico tratante"},
    {id:"ORT05",item:"Procedimiento ortopédico o quirúrgico",desc:"Reducción, inmovilización, cirugía u otro procedimiento con descripción"},
    {id:"ORT06",item:"Plan de rehabilitación y restricciones",desc:"Fisioterapia, órtesis, carga permitida, restricciones y seguimiento"},
  ],
  medicina_interna:[
    {id:"MIN01",item:"Revisión por sistemas completa",     desc:"Evaluación sistemática y detallada de todos los aparatos y sistemas"},
    {id:"MIN02",item:"Lista de problemas activos",         desc:"Problemas médicos activos identificados y jerarquizados"},
    {id:"MIN03",item:"Medicamentos con información completa",desc:"Nombre, dosis, vía, frecuencia y duración de todos los medicamentos"},
    {id:"MIN04",item:"Paraclínicos con interpretación clínica",desc:"Laboratorios e imágenes analizados clínicamente en la historia"},
    {id:"MIN05",item:"Nota de evolución estructurada (SOAP)",desc:"Seguimiento diario estructurado: subjetivo, objetivo, análisis y plan"},
  ],
  medicina_familiar:[
    {id:"FAM01",item:"Contexto familiar y social",         desc:"Funcionalidad familiar, APGAR familiar, red de apoyo social"},
    {id:"FAM02",item:"Factores de riesgo crónico y cardiovascular",desc:"Identificación y registro de FRCV y factores de riesgo modificables"},
    {id:"FAM03",item:"Tamizajes y detección temprana",     desc:"Actividades preventivas según edad, sexo y riesgo del paciente"},
    {id:"FAM04",item:"Educación al paciente y familia",    desc:"Consejería documentada: dieta, ejercicio, adherencia, signos de alarma"},
    {id:"FAM05",item:"Plan de seguimiento de condiciones crónicas",desc:"Metas terapéuticas, próximos controles y condiciones monitoreadas"},
  ],
};

function criterios(esp){
  return [...C, ...(CE[esp]||CE.medicina_general)];
}
function maxPts(esp){return criterios(esp).length*2;}
function categoria(pct){
  if(pct>=90) return {label:"Sobresaliente",color:"var(--text-success)"};
  if(pct>=75) return {label:"Óptimo",color:"var(--text-accent)"};
  if(pct>=60) return {label:"Aceptable",color:"var(--text-warning)"};
  return {label:"Deficiente",color:"var(--text-danger)"};
}

// ─── AI call ──────────────────────────────────────────────────────────────────
async function callAI(prov,key,model,sys,user){
  if(prov==="anthropic"){
    const r=await fetch("https://api.anthropic.com/v1/messages",{
      method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({model:model||"claude-sonnet-4-6",max_tokens:4096,
        system:sys,messages:[{role:"user",content:user}]})});
    const d=await r.json();
    return d.content[0].text;
  }
  if(prov==="openai"){
    const r=await fetch("https://api.openai.com/v1/chat/completions",{
      method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+key},
      body:JSON.stringify({model:model||"gpt-4o",max_tokens:4096,
        messages:[{role:"system",content:sys},{role:"user",content:user}]})});
    const d=await r.json();
    return d.choices[0].message.content;
  }
  if(prov==="perplexity"){
    const r=await fetch("https://api.perplexity.ai/chat/completions",{
      method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+key},
      body:JSON.stringify({model:model||"sonar-pro",max_tokens:4096,
        messages:[{role:"system",content:sys},{role:"user",content:user}]})});
    const d=await r.json();
    return d.choices[0].message.content;
  }
}

function parseJSON(raw){
  const s=raw.replace(/```json|```/g,"").trim();
  try{return JSON.parse(s);}catch{
    const m=s.match(/\{[\s\S]*\}/);
    if(m) return JSON.parse(m[0]);
    throw new Error("Respuesta no válida del modelo.");
  }
}

// ─── PDF loader ───────────────────────────────────────────────────────────────
let pdfjsReady=false;
function loadPDFJS(){
  return new Promise(res=>{
    if(pdfjsReady){res();return;}
    const s=document.createElement("script");
    s.src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    s.onload=()=>{
      window.pdfjsLib.GlobalWorkerOptions.workerSrc=
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      pdfjsReady=true;res();
    };
    document.head.appendChild(s);
  });
}
async function extractText(file){
  await loadPDFJS();
  const buf=await file.arrayBuffer();
  const pdf=await window.pdfjsLib.getDocument({data:buf}).promise;
  let txt="";
  for(let i=1;i<=pdf.numPages;i++){
    const pg=await pdf.getPage(i);
    const tc=await pg.getTextContent();
    txt+=tc.items.map(x=>x.str).join(" ")+"\n";
  }
  return txt;
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const CSS=`
  h2.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);}
  .ahc{font-family:var(--font-sans);max-width:900px;margin:0 auto;padding:1rem 0 3rem;}
  .hdr{display:flex;align-items:center;justify-content:space-between;
       border-bottom:0.5px solid var(--border);padding:0.75rem 0 0.75rem;margin-bottom:1.5rem;}
  .hdr-left{display:flex;align-items:center;gap:10px;}
  .hdr-logo{width:40px;height:40px;border-radius:var(--radius);background:var(--bg-accent);
            display:flex;align-items:center;justify-content:center;color:var(--text-accent);}
  .hdr-title{font-size:15px;font-weight:500;color:var(--text-primary);}
  .hdr-sub{font-size:12px;color:var(--text-muted);}
  .tabs{display:flex;gap:0;border-bottom:0.5px solid var(--border);margin-bottom:1.5rem;}
  .tab-btn{background:none;border:none;border-bottom:2px solid transparent;
           padding:8px 16px;font-size:13px;font-weight:500;color:var(--text-secondary);
           cursor:pointer;display:flex;align-items:center;gap:6px;transition:color .15s;}
  .tab-btn:hover{color:var(--text-primary);}
  .tab-btn.active{color:var(--text-accent);border-bottom-color:var(--border-accent);}
  .card{background:var(--surface-2);border:0.5px solid var(--border);
        border-radius:12px;padding:1rem 1.25rem;margin-bottom:1rem;}
  .card-title{font-size:13px;font-weight:500;color:var(--text-secondary);
              text-transform:uppercase;letter-spacing:.04em;margin-bottom:1rem;
              display:flex;align-items:center;gap:6px;}
  .prov-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:1rem;}
  .prov-btn{border:0.5px solid var(--border);border-radius:var(--radius);
            padding:8px 12px;cursor:pointer;background:var(--surface-2);
            font-size:13px;color:var(--text-secondary);transition:all .15s;text-align:left;}
  .prov-btn:hover{border-color:var(--border-strong);color:var(--text-primary);}
  .prov-btn.active{border-color:var(--border-accent);background:var(--bg-accent);
                   color:var(--text-accent);}
  .model-select{width:100%;padding:8px;border:0.5px solid var(--border);
                border-radius:var(--radius);background:var(--surface-2);
                color:var(--text-primary);font-size:13px;margin-bottom:8px;}
  .key-row{display:flex;gap:6px;align-items:center;margin-bottom:6px;}
  .key-input{flex:1;padding:7px 10px;border:0.5px solid var(--border);
             border-radius:var(--radius);background:var(--surface-2);
             color:var(--text-primary);font-size:13px;}
  .key-input:focus{outline:none;border-color:var(--border-accent);}
  .btn{border:0.5px solid var(--border-strong);border-radius:var(--radius);
       background:var(--surface-2);color:var(--text-primary);
       padding:7px 12px;font-size:13px;cursor:pointer;
       display:inline-flex;align-items:center;gap:5px;transition:all .15s;}
  .btn:hover{background:var(--surface-1);}
  .btn.primary{background:var(--fill-accent);border-color:var(--fill-accent);
               color:var(--on-accent);}
  .btn.primary:hover{background:var(--fill-accent-hover);}
  .btn:disabled{opacity:.4;cursor:not-allowed;}
  .btn-sm{padding:5px 9px;font-size:12px;}
  .drop-zone{border:1px dashed var(--border-strong);border-radius:12px;
             padding:2.5rem 1rem;text-align:center;cursor:pointer;
             transition:all .2s;color:var(--text-muted);}
  .drop-zone:hover,.drop-zone.drag{border-color:var(--border-accent);
                                   background:var(--bg-accent);}
  .file-chip{display:flex;align-items:center;gap:8px;padding:8px 10px;
             background:var(--surface-1);border:0.5px solid var(--border);
             border-radius:var(--radius);margin-bottom:6px;}
  .file-chip-name{flex:1;font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
  .file-chip-remove{cursor:pointer;color:var(--text-muted);}
  .file-chip-remove:hover{color:var(--text-danger);}
  .esp-badge{display:inline-flex;align-items:center;gap:5px;
             padding:3px 10px;border-radius:20px;font-size:12px;font-weight:500;}
  .score-cell{display:flex;gap:3px;}
  .sc-btn{width:26px;height:22px;border:0.5px solid var(--border);border-radius:4px;
          background:var(--surface-2);font-size:11px;font-weight:500;
          cursor:pointer;transition:all .15s;color:var(--text-secondary);}
  .sc-btn:hover{border-color:var(--border-strong);}
  .sc-btn.s0.active{background:#fef2f2;border-color:#fca5a5;color:#991b1b;}
  .sc-btn.s1.active{background:#fffbeb;border-color:#fcd34d;color:#92400e;}
  .sc-btn.s2.active{background:#f0fdf4;border-color:#86efac;color:#166534;}
  .obs-input{width:100%;border:0.5px solid var(--border);border-radius:4px;
             background:var(--surface-2);color:var(--text-primary);
             font-size:11px;padding:4px 6px;margin-top:3px;}
  .obs-input:focus{outline:none;border-color:var(--border-accent);}
  .result-bar{height:6px;border-radius:3px;background:var(--surface-1);margin:6px 0;}
  .result-fill{height:6px;border-radius:3px;transition:width .4s;}
  .summary-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:8px;margin-bottom:1rem;}
  .metric{background:var(--surface-1);border-radius:var(--radius);
          padding:10px 12px;text-align:center;}
  .metric-n{font-size:22px;font-weight:500;color:var(--text-primary);}
  .metric-l{font-size:11px;color:var(--text-muted);margin-top:2px;}
  .analyzing{display:flex;align-items:center;gap:8px;padding:10px;
             background:var(--bg-accent);border-radius:var(--radius);
             font-size:13px;color:var(--text-accent);margin-bottom:8px;}
  @keyframes spin{to{transform:rotate(360deg)}}
  .spin{animation:spin 1s linear infinite;display:inline-block;}
  .hc-table{width:100%;border-collapse:collapse;font-size:13px;}
  .hc-table th{font-weight:500;font-size:11px;color:var(--text-muted);
               text-transform:uppercase;letter-spacing:.04em;
               padding:6px 8px;border-bottom:0.5px solid var(--border);text-align:left;}
  .hc-table td{padding:7px 8px;border-bottom:0.5px solid var(--border);
               vertical-align:top;}
  .hc-table tr:last-child td{border-bottom:none;}
  .hc-table .id-col{color:var(--text-muted);font-size:11px;white-space:nowrap;width:48px;}
  .hc-table .item-col{font-weight:500;color:var(--text-primary);}
  .hc-table .desc-col{color:var(--text-secondary);font-size:12px;}
  .hc-table .score-col{width:90px;}
  .hc-table .obs-col{width:180px;}
  .divider{height:0.5px;background:var(--border);margin:1rem 0;}
  .hist-item{background:var(--surface-2);border:0.5px solid var(--border);
             border-radius:12px;padding:1rem 1.25rem;margin-bottom:10px;
             cursor:pointer;transition:border-color .15s;}
  .hist-item:hover{border-color:var(--border-strong);}
  .empty{text-align:center;padding:2.5rem 1rem;color:var(--text-muted);font-size:14px;}
  .dash-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:1rem;}
  @media(max-width:600px){.dash-grid{grid-template-columns:1fr;}.prov-grid{grid-template-columns:1fr;}}
  .bar-row{display:flex;align-items:center;gap:8px;margin-bottom:6px;font-size:12px;}
  .bar-track{flex:1;height:6px;background:var(--surface-1);border-radius:3px;}
  .bar-fill{height:6px;border-radius:3px;}
  .notice{font-size:12px;color:var(--text-muted);padding:6px 10px;
          background:var(--surface-1);border-radius:var(--radius);margin-bottom:8px;}
`;

// ─── Component ────────────────────────────────────────────────────────────────
export default function AuditorHC(){
  const [tab,setTab]=useState("auditoria");
  const [prov,setProv]=useState(()=>localStorage.getItem("ahc_prov")||"anthropic");
  const [keys,setKeys]=useState(()=>{
    try{return JSON.parse(localStorage.getItem("ahc_keys")||"{}");}catch{return{};}
  });
  const [models,setModels]=useState(()=>{
    try{return JSON.parse(localStorage.getItem("ahc_models")||"{}");}catch{return{};}
  });
  const [files,setFiles]=useState([]);
  const [entries,setEntries]=useState([]);
  const [analyzing,setAnalyzing]=useState(null);
  const [history,setHistory]=useState(()=>{
    try{return JSON.parse(localStorage.getItem("ahc_history")||"[]");}catch{return[];}
  });
  const [keyInput,setKeyInput]=useState({perplexity:"",openai:"",anthropic:""});
  const [keyStatus,setKeyStatus]=useState({});
  const [error,setError]=useState("");
  const fileRef=useRef();
  const dropRef=useRef();

  useEffect(()=>{
    // restore saved key inputs from saved keys
    const ki={perplexity:keys.perplexity||"",openai:keys.openai||"",anthropic:keys.anthropic||""};
    setKeyInput(ki);
  },[]);

  const saveProv=(p)=>{setProv(p);localStorage.setItem("ahc_prov",p);};
  const saveKey=(p)=>{
    const k={...keys,[p]:keyInput[p]};
    setKeys(k);localStorage.setItem("ahc_keys",JSON.stringify(k));
    setKeyStatus({...keyStatus,[p]:"saved"});
    setTimeout(()=>setKeyStatus(s=>({...s,[p]:""})),2000);
  };
  const saveModel=(p,v)=>{
    const m={...models,[p]:v};setModels(m);localStorage.setItem("ahc_models",JSON.stringify(m));
  };

  // File handling
  const addFiles=async(fileList)=>{
    setError("");
    for(const f of Array.from(fileList)){
      if(!f.name.endsWith(".pdf")){setError("Solo se aceptan archivos PDF.");continue;}
      if(files.length>=5){setError("Máximo 5 PDFs por sesión.");break;}
      try{
        const text=await extractText(f);
        setFiles(prev=>[...prev,{name:f.name,text,id:Date.now()+Math.random()}]);
      }catch(e){setError("No se pudo leer "+f.name+": "+e.message);}
    }
  };

  const removeFile=(id)=>{
    setFiles(f=>f.filter(x=>x.id!==id));
    setEntries(e=>e.filter(x=>x.fileId!==id));
  };

  // Detect specialty prompt
  function buildDetectPrompt(text){
    return `Eres un auditor médico del Hospital Departamental San Antonio de Roldanillo (HDSAR).
Analiza el siguiente texto de una historia clínica y determina la especialidad médica.

Especialidades posibles:
- medicina_general
- cirugia_general
- ginecologia_obstetricia
- pediatria
- anestesiologia
- ortopedia_traumatologia
- medicina_interna
- medicina_familiar

HISTORIA CLÍNICA (primeros 3000 caracteres):
${text.slice(0,3000)}

Responde ÚNICAMENTE con este JSON (sin markdown, sin explicaciones):
{"especialidad":"clave_especialidad","razon":"Una oración explicando por qué"}`;
  }

  function buildScorePrompt(text,esp){
    const cr=criterios(esp);
    const lista=cr.map(c=>`${c.id}: ${c.item} — ${c.desc}`).join("\n");
    return `Eres un auditor de historias clínicas del HDSAR. Evalúa la siguiente historia clínica de ${ESP[esp].label}.

Escala de calificación:
- 2 = Completo (presente y adecuadamente diligenciado)
- 1 = Incompleto (presente pero con deficiencias o datos insuficientes)
- 0 = Ausente (no se encuentra en la historia clínica)

CRITERIOS A EVALUAR:
${lista}

HISTORIA CLÍNICA:
${text.slice(0,8000)}

Responde ÚNICAMENTE con este JSON exacto (sin markdown):
{
  "calificaciones":{
    ${cr.map(c=>`"${c.id}":{"puntaje":0,"obs":""}`).join(",\n    ")}
  },
  "observacion_general":"Observación global sobre la calidad de la historia clínica"
}`;
  }

  // Analyze single file
  async function analyzeFile(file){
    setAnalyzing(file.id);
    setError("");
    try{
      const sys="Eres un auditor médico experto en calidad de historias clínicas. Responde solo con JSON válido.";
      const k=keys[prov]||"";
      const m=models[prov]||"";

      // Step 1: detect specialty
      const detRaw=await callAI(prov,k,m,sys,buildDetectPrompt(file.text));
      const det=parseJSON(detRaw);
      const esp=det.especialidad&&ESP[det.especialidad]?det.especialidad:"medicina_general";

      // Step 2: score criteria
      const scoreRaw=await callAI(prov,k,m,sys,buildScorePrompt(file.text,esp));
      const scored=parseJSON(scoreRaw);

      const califs=scored.calificaciones||{};
      const cr=criterios(esp);
      const items=cr.map(c=>({
        ...c,
        puntaje:califs[c.id]?.puntaje??0,
        obs:califs[c.id]?.obs||"",
      }));

      const total=items.reduce((a,x)=>a+x.puntaje,0);
      const max=maxPts(esp);
      const pct=Math.round(total/max*100);
      const cat=categoria(pct);

      const entry={
        id:Date.now(),fileId:file.id,name:file.name,
        especialidad:esp,espLabel:ESP[esp].label,
        items,total,max,pct,cat:cat.label,catColor:cat.color,
        observacion:scored.observacion_general||"",
        razonDeteccion:det.razon||"",
        ts:new Date().toISOString(),
      };
      setEntries(prev=>[...prev.filter(x=>x.fileId!==file.id),entry]);
    }catch(e){
      setError("Error al analizar "+file.name+": "+e.message);
    }finally{
      setAnalyzing(null);
    }
  }

  async function analyzeAll(){
    setError("");
    for(const f of files) await analyzeFile(f);
  }

  function updateScore(entryId,itemId,val){
    setEntries(prev=>prev.map(e=>{
      if(e.id!==entryId) return e;
      const items=e.items.map(i=>i.id===itemId?{...i,puntaje:val}:i);
      const total=items.reduce((a,x)=>a+x.puntaje,0);
      const pct=Math.round(total/e.max*100);
      const cat=categoria(pct);
      return {...e,items,total,pct,cat:cat.label,catColor:cat.color};
    }));
  }

  function updateObs(entryId,itemId,txt){
    setEntries(prev=>prev.map(e=>{
      if(e.id!==entryId) return e;
      return {...e,items:e.items.map(i=>i.id===itemId?{...i,obs:txt}:i)};
    }));
  }

  function saveToHistory(){
    const newH=[...history,...entries].slice(0,100);
    setHistory(newH);
    localStorage.setItem("ahc_history",JSON.stringify(newH));
    alert("Sesión guardada en el historial ("+entries.length+" historia(s)).");
  }

  function clearHistory(){
    if(confirm("¿Eliminar todo el historial?")){
      setHistory([]);localStorage.removeItem("ahc_history");
    }
  }

  // Dashboard stats
  const allRecords=[...history,...entries];
  const espCounts=allRecords.reduce((a,e)=>{a[e.especialidad]=(a[e.especialidad]||0)+1;return a;},{});
  const catCounts=allRecords.reduce((a,e)=>{a[e.cat]=(a[e.cat]||0)+1;return a;},{});
  const avgPct=allRecords.length?Math.round(allRecords.reduce((a,e)=>a+e.pct,0)/allRecords.length):0;

  const catColors={"Sobresaliente":"var(--text-success)","Óptimo":"var(--text-accent)",
                   "Aceptable":"var(--text-warning)","Deficiente":"var(--text-danger)"};

  return (
    <div className="ahc">
      <style>{CSS}</style>
      <h2 className="sr-only">Auditor de historias clínicas HDSAR — herramienta de calificación por especialidad</h2>

      {/* Header */}
      <div className="hdr">
        <div className="hdr-left">
          <div className="hdr-logo"><i className="ti ti-stethoscope" style={{fontSize:20}} aria-hidden/></div>
          <div>
            <div className="hdr-title">Auditor de historias clínicas</div>
            <div className="hdr-sub">Hospital Departamental San Antonio · Roldanillo</div>
          </div>
        </div>
        <div style={{display:"flex",gap:6}}>
          <button className="btn btn-sm" onClick={()=>window.print()}>
            <i className="ti ti-printer" aria-hidden/>Imprimir
          </button>
          {entries.length>0&&(
            <button className="btn btn-sm" onClick={saveToHistory}>
              <i className="ti ti-device-floppy" aria-hidden/>Guardar sesión
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {[["auditoria","ti-clipboard-check","Auditoría"],
          ["historial","ti-history","Historial"],
          ["dashboard","ti-chart-bar","Dashboard"]].map(([k,ic,lb])=>(
          <button key={k} className={"tab-btn"+(tab===k?" active":"")} onClick={()=>setTab(k)}>
            <i className={"ti "+ic} aria-hidden/>{lb}
          </button>
        ))}
      </div>

      {/* ── AUDITORÍA ─────────────────────────────────────────── */}
      {tab==="auditoria"&&(
        <div>
          {/* Config IA */}
          <div className="card">
            <div className="card-title"><i className="ti ti-settings" aria-hidden/>Configuración de IA</div>
            <div className="prov-grid">
              {[["anthropic","Anthropic — Claude","ti-brand-claude"],
                ["openai","OpenAI — GPT-4o","ti-brand-openai"],
                ["perplexity","Perplexity — Sonar","ti-atom"]].map(([p,lb,ic])=>(
                <button key={p} className={"prov-btn"+(prov===p?" active":"")} onClick={()=>saveProv(p)}>
                  <i className={"ti "+ic} style={{marginRight:5}} aria-hidden/>{lb}
                </button>
              ))}
            </div>

            {prov==="anthropic"&&(
              <div>
                <div className="notice"><i className="ti ti-info-circle" style={{marginRight:5}} aria-hidden/>
                  En Claude.ai la clave de Anthropic funciona automáticamente. Puedes dejar el campo vacío.
                </div>
                <select className="model-select" value={models.anthropic||"claude-sonnet-4-6"} onChange={e=>saveModel("anthropic",e.target.value)}>
                  <option value="claude-sonnet-4-6">claude-sonnet-4-6 (recomendado)</option>
                  <option value="claude-haiku-4-5-20251001">claude-haiku-4-5 (económico)</option>
                  <option value="claude-opus-4-6">claude-opus-4-6 (máxima calidad)</option>
                </select>
                <div className="key-row">
                  <input className="key-input" type="password" placeholder="sk-ant-... (opcional en Claude.ai)"
                    value={keyInput.anthropic} onChange={e=>setKeyInput(p=>({...p,anthropic:e.target.value}))}/>
                  <button className="btn btn-sm" onClick={()=>saveKey("anthropic")}>
                    {keyStatus.anthropic==="saved"?"Guardado":"Guardar"}
                  </button>
                </div>
              </div>
            )}
            {prov==="openai"&&(
              <div>
                <select className="model-select" value={models.openai||"gpt-4o"} onChange={e=>saveModel("openai",e.target.value)}>
                  <option value="gpt-4o">gpt-4o (recomendado)</option>
                  <option value="gpt-4o-mini">gpt-4o-mini (económico)</option>
                  <option value="gpt-4-turbo">gpt-4-turbo</option>
                </select>
                <div className="key-row">
                  <input className="key-input" type="password" placeholder="sk-..."
                    value={keyInput.openai} onChange={e=>setKeyInput(p=>({...p,openai:e.target.value}))}/>
                  <button className="btn btn-sm" onClick={()=>saveKey("openai")}>
                    {keyStatus.openai==="saved"?"Guardado":"Guardar"}
                  </button>
                </div>
              </div>
            )}
            {prov==="perplexity"&&(
              <div>
                <select className="model-select" value={models.perplexity||"sonar-pro"} onChange={e=>saveModel("perplexity",e.target.value)}>
                  <option value="sonar-pro">sonar-pro (recomendado)</option>
                  <option value="sonar">sonar (económico)</option>
                </select>
                <div className="key-row">
                  <input className="key-input" type="password" placeholder="pplx-..."
                    value={keyInput.perplexity} onChange={e=>setKeyInput(p=>({...p,perplexity:e.target.value}))}/>
                  <button className="btn btn-sm" onClick={()=>saveKey("perplexity")}>
                    {keyStatus.perplexity==="saved"?"Guardado":"Guardar"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Upload */}
          <div className="card">
            <div className="card-title"><i className="ti ti-file-medical" aria-hidden/>Historias clínicas (PDF)</div>
            <div
              className={"drop-zone"+(dropRef.current?.classList.contains("drag")?" drag":"")}
              ref={dropRef}
              onClick={()=>fileRef.current?.click()}
              onDragOver={e=>{e.preventDefault();e.currentTarget.classList.add("drag");}}
              onDragLeave={e=>e.currentTarget.classList.remove("drag")}
              onDrop={e=>{
                e.preventDefault();e.currentTarget.classList.remove("drag");
                addFiles(e.dataTransfer.files);
              }}
            >
              <i className="ti ti-upload" style={{fontSize:28,marginBottom:8,display:"block"}} aria-hidden/>
              <div style={{fontSize:13,fontWeight:500,color:"var(--text-primary)"}}>Arrastra PDFs aquí o haz clic para seleccionar</div>
              <div style={{fontSize:12,marginTop:4}}>Hasta 5 historias clínicas · La especialidad se detecta automáticamente</div>
            </div>
            <input ref={fileRef} type="file" accept=".pdf" multiple style={{display:"none"}}
              onChange={e=>{addFiles(e.target.files);e.target.value="";}}/>

            {files.length>0&&(
              <div style={{marginTop:10}}>
                {files.map(f=>(
                  <div key={f.id} className="file-chip">
                    <i className="ti ti-file-type-pdf" style={{color:"var(--text-danger)",flexShrink:0}} aria-hidden/>
                    <span className="file-chip-name">{f.name}</span>
                    <span style={{fontSize:11,color:"var(--text-muted)"}}>
                      {entries.find(e=>e.fileId===f.id)?
                        <span style={{color:"var(--text-success)"}}>✓ Analizado</span>:
                        analyzing===f.id?
                          <span style={{color:"var(--text-accent)"}}>Analizando…</span>:
                          "Listo"
                      }
                    </span>
                    <button className="file-chip-remove" onClick={()=>removeFile(f.id)}
                      aria-label={"Eliminar "+f.name}>
                      <i className="ti ti-x" aria-hidden/>
                    </button>
                  </div>
                ))}
                <div style={{display:"flex",gap:8,marginTop:10,flexWrap:"wrap"}}>
                  <button className="btn primary" onClick={analyzeAll} disabled={!!analyzing||files.length===0}>
                    {analyzing?
                      <><span className="spin"><i className="ti ti-loader-2" aria-hidden/></span>Analizando…</>:
                      <><i className="ti ti-cpu" aria-hidden/>Analizar todas con IA</>
                    }
                  </button>
                  {files.length<5&&(
                    <button className="btn" onClick={()=>fileRef.current?.click()}>
                      <i className="ti ti-plus" aria-hidden/>Agregar más
                    </button>
                  )}
                  <button className="btn" onClick={()=>{setFiles([]);setEntries([]);setError("");}}>
                    <i className="ti ti-trash" aria-hidden/>Limpiar todo
                  </button>
                </div>
              </div>
            )}

            {error&&(
              <div style={{marginTop:10,padding:"8px 10px",background:"var(--bg-danger)",
                           borderRadius:"var(--radius)",fontSize:13,color:"var(--text-danger)"}}>
                <i className="ti ti-alert-triangle" style={{marginRight:5}} aria-hidden/>{error}
              </div>
            )}
          </div>

          {/* Results */}
          {entries.map(entry=>{
            const espInfo=ESP[entry.especialidad]||ESP.medicina_general;
            return (
              <div key={entry.id} className="card">
                {/* Entry header */}
                <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",
                             flexWrap:"wrap",gap:8,marginBottom:"1rem"}}>
                  <div>
                    <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:4}}>
                      <span style={{fontWeight:500,fontSize:14,color:"var(--text-primary)"}}>{entry.name}</span>
                      <span className="esp-badge"
                        style={{background:espInfo.bg,color:espInfo.color}}>
                        <i className={"ti "+espInfo.icon} style={{fontSize:13}} aria-hidden/>
                        {espInfo.label}
                      </span>
                    </div>
                    {entry.razonDeteccion&&(
                      <div style={{fontSize:12,color:"var(--text-muted)"}}>{entry.razonDeteccion}</div>
                    )}
                  </div>
                  <button className="btn btn-sm"
                    onClick={()=>analyzeFile(files.find(f=>f.id===entry.fileId)||{id:"",text:"",name:""})}
                    disabled={!!analyzing}>
                    <i className="ti ti-refresh" aria-hidden/>Reanalizar
                  </button>
                </div>

                {/* Score summary */}
                <div className="summary-grid">
                  <div className="metric">
                    <div className="metric-n">{entry.total}<span style={{fontSize:13,color:"var(--text-muted)"}}>/{entry.max}</span></div>
                    <div className="metric-l">Puntaje total</div>
                  </div>
                  <div className="metric">
                    <div className="metric-n" style={{color:entry.catColor}}>{entry.pct}%</div>
                    <div className="metric-l">Porcentaje</div>
                  </div>
                  <div className="metric">
                    <div className="metric-n" style={{fontSize:16,color:entry.catColor}}>{entry.cat}</div>
                    <div className="metric-l">Calificación</div>
                  </div>
                  <div className="metric">
                    <div className="metric-n">{entry.items.filter(i=>i.puntaje===0).length}</div>
                    <div className="metric-l">Ítems ausentes</div>
                  </div>
                </div>

                <div className="result-bar">
                  <div className="result-fill" style={{
                    width:entry.pct+"%",
                    background:entry.pct>=90?"var(--fill-success)":
                               entry.pct>=75?"var(--fill-accent)":
                               entry.pct>=60?"var(--fill-warning)":"var(--fill-danger)"}}/>
                </div>

                {/* Scale legend */}
                <div style={{display:"flex",gap:12,marginBottom:"0.75rem",fontSize:11,color:"var(--text-muted)"}}>
                  <span>Escala por ítem: <strong>2</strong> completo · <strong>1</strong> incompleto · <strong>0</strong> ausente</span>
                  <span>· ≥90% Sobresaliente · ≥75% Óptimo · ≥60% Aceptable · &lt;60% Deficiente</span>
                </div>

                {/* Criteria table */}
                <div style={{overflowX:"auto"}}>
                  <table className="hc-table">
                    <thead>
                      <tr>
                        <th className="id-col">Código</th>
                        <th className="item-col">Ítem</th>
                        <th className="desc-col" style={{minWidth:180}}>Descripción</th>
                        <th className="score-col">Puntaje</th>
                        <th className="obs-col">Observación</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Common criteria separator */}
                      {entry.items.map((item,idx)=>{
                        const isFirst=idx===0;
                        const isFirstSpecific=idx===C.length;
                        return (
                          <>
                            {isFirstSpecific&&(
                              <tr key={"sep-"+entry.id}>
                                <td colSpan={5} style={{
                                  padding:"6px 8px 4px",
                                  fontSize:11,fontWeight:500,
                                  color:espInfo.color,
                                  background:espInfo.bg,
                                  borderTop:"0.5px solid var(--border)",
                                }}>
                                  <i className={"ti "+espInfo.icon} style={{marginRight:5,fontSize:12}} aria-hidden/>
                                  Criterios específicos de {espInfo.label}
                                </td>
                              </tr>
                            )}
                            {isFirst&&(
                              <tr key={"sep-c-"+entry.id}>
                                <td colSpan={5} style={{
                                  padding:"6px 8px 4px",fontSize:11,fontWeight:500,
                                  color:"var(--text-secondary)",
                                  background:"var(--surface-1)",
                                }}>
                                  Criterios comunes a todas las especialidades
                                </td>
                              </tr>
                            )}
                            <tr key={item.id}>
                              <td className="id-col">{item.id}</td>
                              <td className="item-col">{item.item}</td>
                              <td className="desc-col">{item.desc}</td>
                              <td className="score-col">
                                <div className="score-cell">
                                  {[0,1,2].map(v=>(
                                    <button key={v}
                                      className={"sc-btn s"+v+(item.puntaje===v?" active":"")}
                                      onClick={()=>updateScore(entry.id,item.id,v)}
                                      aria-label={v===0?"Ausente":v===1?"Incompleto":"Completo"}>
                                      {v}
                                    </button>
                                  ))}
                                </div>
                              </td>
                              <td className="obs-col">
                                <input className="obs-input" type="text"
                                  placeholder="Observación…" value={item.obs||""}
                                  onChange={e=>updateObs(entry.id,item.id,e.target.value)}/>
                              </td>
                            </tr>
                          </>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {entry.observacion&&(
                  <div style={{marginTop:10,padding:"10px 12px",background:"var(--surface-1)",
                               borderRadius:"var(--radius)",fontSize:13,color:"var(--text-secondary)"}}>
                    <i className="ti ti-notes" style={{marginRight:6}} aria-hidden/>
                    <strong>Observación general:</strong> {entry.observacion}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── HISTORIAL ─────────────────────────────────────────── */}
      {tab==="historial"&&(
        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div style={{fontSize:13,color:"var(--text-secondary)"}}>
              {history.length} historia(s) en el historial
            </div>
            {history.length>0&&(
              <button className="btn btn-sm" onClick={clearHistory}>
                <i className="ti ti-trash" aria-hidden/>Limpiar historial
              </button>
            )}
          </div>
          {history.length===0&&(
            <div className="empty">
              <i className="ti ti-history" style={{fontSize:32,display:"block",marginBottom:8}} aria-hidden/>
              Sin historial aún. Analiza historias y guárdalas con el botón "Guardar sesión".
            </div>
          )}
          {[...history].reverse().map(e=>{
            const espInfo=ESP[e.especialidad]||ESP.medicina_general;
            const cat=categoria(e.pct);
            return (
              <div key={e.id} className="hist-item">
                <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:6,marginBottom:6}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                    <span style={{fontWeight:500,fontSize:13}}>{e.name}</span>
                    <span className="esp-badge" style={{background:espInfo.bg,color:espInfo.color,fontSize:11}}>
                      <i className={"ti "+espInfo.icon} style={{fontSize:12}} aria-hidden/>
                      {espInfo.label}
                    </span>
                  </div>
                  <span style={{fontSize:12,color:"var(--text-muted)"}}>
                    {new Date(e.ts).toLocaleDateString("es-CO")}
                  </span>
                </div>
                <div style={{display:"flex",gap:16,fontSize:12,flexWrap:"wrap"}}>
                  <span>Puntaje: <strong>{e.total}/{e.max}</strong></span>
                  <span>Porcentaje: <strong>{e.pct}%</strong></span>
                  <span style={{color:cat.color,fontWeight:500}}>{e.cat}</span>
                  <span style={{color:"var(--text-muted)"}}>Ítems ausentes: {e.items.filter(i=>i.puntaje===0).length}</span>
                </div>
                {e.observacion&&(
                  <div style={{marginTop:6,fontSize:12,color:"var(--text-muted)"}}>{e.observacion}</div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── DASHBOARD ─────────────────────────────────────────── */}
      {tab==="dashboard"&&(
        <div>
          {allRecords.length===0&&(
            <div className="empty">
              <i className="ti ti-chart-bar" style={{fontSize:32,display:"block",marginBottom:8}} aria-hidden/>
              Sin datos aún. Analiza historias para ver las estadísticas aquí.
            </div>
          )}
          {allRecords.length>0&&(
            <>
              {/* KPIs */}
              <div className="summary-grid" style={{marginBottom:"1rem"}}>
                <div className="metric">
                  <div className="metric-n">{allRecords.length}</div>
                  <div className="metric-l">Historias auditadas</div>
                </div>
                <div className="metric">
                  <div className="metric-n" style={{color:categoria(avgPct).color}}>{avgPct}%</div>
                  <div className="metric-l">Promedio general</div>
                </div>
                <div className="metric">
                  <div className="metric-n">{allRecords.filter(e=>e.pct>=90).length}</div>
                  <div className="metric-l">Sobresalientes</div>
                </div>
                <div className="metric">
                  <div className="metric-n" style={{color:"var(--text-danger)"}}>
                    {allRecords.filter(e=>e.pct<60).length}
                  </div>
                  <div className="metric-l">Deficientes</div>
                </div>
              </div>

              <div className="dash-grid">
                {/* By specialty */}
                <div className="card">
                  <div className="card-title"><i className="ti ti-stethoscope" aria-hidden/>Por especialidad</div>
                  {Object.entries(espCounts).sort((a,b)=>b[1]-a[1]).map(([esp,cnt])=>{
                    const info=ESP[esp]||ESP.medicina_general;
                    const pct=Math.round(cnt/allRecords.length*100);
                    return (
                      <div key={esp} className="bar-row">
                        <i className={"ti "+info.icon} style={{color:info.color,width:16,flexShrink:0}} aria-hidden/>
                        <span style={{minWidth:140,color:"var(--text-primary)"}}>{info.label}</span>
                        <div className="bar-track">
                          <div className="bar-fill" style={{width:pct+"%",background:info.color}}/>
                        </div>
                        <span style={{minWidth:28,color:"var(--text-muted)",textAlign:"right"}}>{cnt}</span>
                      </div>
                    );
                  })}
                </div>

                {/* By category */}
                <div className="card">
                  <div className="card-title"><i className="ti ti-award" aria-hidden/>Por calificación</div>
                  {["Sobresaliente","Óptimo","Aceptable","Deficiente"].map(cat=>{
                    const cnt=catCounts[cat]||0;
                    const pct=allRecords.length?Math.round(cnt/allRecords.length*100):0;
                    const clr=catColors[cat]||"var(--text-muted)";
                    return (
                      <div key={cat} className="bar-row">
                        <span style={{minWidth:100,color:clr,fontWeight:500}}>{cat}</span>
                        <div className="bar-track">
                          <div className="bar-fill" style={{width:pct+"%",
                            background:cat==="Sobresaliente"?"var(--fill-success)":
                                       cat==="Óptimo"?"var(--fill-accent)":
                                       cat==="Aceptable"?"var(--fill-warning)":"var(--fill-danger)"}}/>
                        </div>
                        <span style={{minWidth:42,color:"var(--text-muted)",textAlign:"right"}}>
                          {cnt} ({pct}%)
                        </span>
                      </div>
                    );
                  })}

                  <div className="divider"/>

                  {/* Most missed items */}
                  <div style={{fontSize:12,fontWeight:500,color:"var(--text-secondary)",marginBottom:8,
                               textTransform:"uppercase",letterSpacing:".04em"}}>
                    Ítems más frecuentemente ausentes
                  </div>
                  {(()=>{
                    const counts={};
                    allRecords.forEach(e=>{
                      e.items.filter(i=>i.puntaje===0).forEach(i=>{
                        counts[i.item]=(counts[i.item]||0)+1;
                      });
                    });
                    return Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([item,cnt])=>(
                      <div key={item} className="bar-row">
                        <span style={{flex:1,color:"var(--text-primary)"}}>{item}</span>
                        <span style={{color:"var(--text-danger)",fontWeight:500}}>{cnt}</span>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
