// frontend/src/app/page.js
"use client";

import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { 
  Tractor, Sprout, AlertTriangle, MapPin, Wind, Droplets, 
  Plane, BrainCircuit, CheckCircle2, Activity, Lock, User, 
  Beef, Warehouse, DollarSign, TrendingUp, Thermometer,
  Truck, Wrench, MessageCircle, Send, X, Terminal, Camera,
  Bell, Calendar, Leaf, Sun, Cloud, CloudRain,
  LayoutDashboard, Wallet, Package, Users, PieChart, 
  ArrowUpRight, ArrowDownRight, Menu, Search, Download,
  FileText, Syringe, Ruler, Battery, Settings, Sliders, Globe, RefreshCw, Power,
  Maximize, Minimize, Unlock, Mic, Siren, Flame
} from 'lucide-react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Legend
} from 'recharts';

// --- MAPA DINÂMICO ---
const FarmMap = dynamic(() => import('../components/FarmMap'), { 
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-zinc-900 animate-pulse rounded-3xl flex items-center justify-center text-zinc-500">Carregando Satélite...</div>
});

// --- TOAST (NOTIFICAÇÕES) ---
const Toast = ({ message, type, onClose }) => {
  useEffect(() => { const timer = setTimeout(onClose, type === 'emergency' ? 8000 : 3000); return () => clearTimeout(timer); }, [onClose, type]);
  return (
    <div className={`fixed top-4 right-4 z-[100] flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border backdrop-blur-md animate-in slide-in-from-right duration-300 ${
      type === 'success' ? 'bg-green-900/90 border-green-500/50 text-green-100' : 
      type === 'emergency' ? 'bg-red-900/95 border-red-500 text-white animate-pulse' :
      'bg-blue-900/90 border-blue-500/50 text-blue-100'
    }`}>
      {type === 'success' ? <CheckCircle2 className="h-6 w-6 text-green-400" /> : 
       type === 'emergency' ? <Siren className="h-6 w-6 text-white animate-bounce" /> :
       <Activity className="h-6 w-6 text-blue-400" />}
      <div>
          <h4 className="font-bold text-sm">{type === 'success' ? 'Sucesso' : type === 'emergency' ? 'ALERTA DE EMERGÊNCIA' : 'Sistema Ativo'}</h4>
          <p className="text-xs opacity-90">{message}</p>
      </div>
    </div>
  );
};

// --- MODAL DE DETALHES ---
const DetailModal = ({ item, type, onClose }) => {
    if (!item) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
            <div className="bg-zinc-900 border border-zinc-700 rounded-3xl w-full max-w-lg p-6 shadow-2xl relative animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white bg-zinc-800 p-2 rounded-full transition-colors"><X size={20}/></button>
                <div className="flex items-center gap-4 mb-6 border-b border-zinc-800 pb-4">
                    <div className={`p-4 rounded-full ${type === 'machine' ? 'bg-purple-500/20 text-purple-400' : 'bg-orange-500/20 text-orange-400'}`}>
                        {type === 'machine' ? <Tractor size={32}/> : <Beef size={32}/>}
                    </div>
                    <div>
                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{type === 'machine' ? 'Maquinário Pesado' : 'Registro Animal'}</span>
                        <h2 className="text-2xl font-black text-white">{item.name || item.tag}</h2>
                        <p className="text-sm text-zinc-400">{item.type || item.location}</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                    {type === 'machine' ? (
                        <>
                            <div className="bg-black/40 p-3 rounded-xl border border-white/5"><div className="text-zinc-500 text-xs flex items-center gap-1 mb-1"><Thermometer size={12}/> Temp. Motor</div><div className="text-white font-bold">92°C <span className="text-green-500 text-[10px]">OK</span></div></div>
                            <div className="bg-black/40 p-3 rounded-xl border border-white/5"><div className="text-zinc-500 text-xs flex items-center gap-1 mb-1"><Droplets size={12}/> Nível Óleo</div><div className="text-white font-bold">78%</div></div>
                            <div className="bg-black/40 p-3 rounded-xl border border-white/5"><div className="text-zinc-500 text-xs flex items-center gap-1 mb-1"><Activity size={12}/> Pressão Pneus</div><div className="text-white font-bold">32 PSI</div></div>
                            <div className="bg-black/40 p-3 rounded-xl border border-white/5"><div className="text-zinc-500 text-xs flex items-center gap-1 mb-1"><Battery size={12}/> Bateria</div><div className="text-green-400 font-bold">Saudável</div></div>
                        </>
                    ) : (
                        <>
                            <div className="bg-black/40 p-3 rounded-xl border border-white/5"><div className="text-zinc-500 text-xs flex items-center gap-1 mb-1"><Ruler size={12}/> Ganho Diário</div><div className="text-white font-bold">1.2 kg/dia</div></div>
                            <div className="bg-black/40 p-3 rounded-xl border border-white/5"><div className="text-zinc-500 text-xs flex items-center gap-1 mb-1"><Syringe size={12}/> Última Vacina</div><div className="text-white font-bold">12/OUT/25</div></div>
                            <div className="bg-black/40 p-3 rounded-xl border border-white/5"><div className="text-zinc-500 text-xs flex items-center gap-1 mb-1"><FileText size={12}/> Linhagem</div><div className="text-white font-bold">Nelore P.O.</div></div>
                            <div className="bg-black/40 p-3 rounded-xl border border-white/5"><div className="text-zinc-500 text-xs flex items-center gap-1 mb-1"><Activity size={12}/> Batimentos</div><div className="text-green-400 font-bold">Normal</div></div>
                        </>
                    )}
                </div>
                <div className="flex gap-3">
                    <button className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded-xl font-bold text-sm transition-colors border border-white/5">Histórico</button>
                    <button onClick={onClose} className="flex-1 bg-green-600 hover:bg-green-500 text-white py-3 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-green-900/20">Fechar Ficha</button>
                </div>
            </div>
        </div>
    );
};

// --- MODAL DE CONFIGURAÇÕES ---
const SettingsModal = ({ onClose, onSave, onLock }) => {
    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
            <div className="bg-zinc-900 border border-zinc-700 rounded-3xl w-full max-w-md p-8 shadow-2xl relative animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white bg-zinc-800 p-2 rounded-full transition-colors"><X size={20}/></button>
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Settings className="text-green-500"/> Configurações do Sistema</h3>
                <div className="space-y-6">
                    <div>
                        <label className="text-zinc-400 text-xs font-bold uppercase mb-2 block flex items-center gap-2"><RefreshCw size={12}/> Intervalo de Atualização</label>
                        <select className="w-full bg-black/40 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-green-500 transition-colors">
                            <option>Tempo Real (5s)</option>
                            <option>Rápido (30s)</option>
                            <option>Normal (1min)</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-zinc-400 text-xs font-bold uppercase mb-2 block flex items-center gap-2"><Sliders size={12}/> Sensibilidade de Alertas (IA)</label>
                        <input type="range" className="w-full accent-green-500 h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer" />
                        <div className="flex justify-between text-[10px] text-zinc-500 mt-1"><span>Baixa</span><span>Média</span><span>Alta</span></div>
                    </div>
                    <div>
                        <label className="text-zinc-400 text-xs font-bold uppercase mb-2 block flex items-center gap-2"><Globe size={12}/> Idioma da Interface</label>
                        <div className="flex gap-2">
                            <button className="flex-1 bg-green-600/20 border border-green-500/50 text-green-400 py-2 rounded-lg text-sm font-bold">Português</button>
                            <button className="flex-1 bg-zinc-800 border border-zinc-700 text-zinc-400 py-2 rounded-lg text-sm hover:bg-zinc-700">English</button>
                        </div>
                    </div>
                </div>
                <div className="mt-8 pt-6 border-t border-zinc-800 flex justify-between items-center">
                    <button onClick={onLock} className="text-blue-400 text-xs font-bold flex items-center gap-1 hover:text-blue-300"><Lock size={12}/> Bloquear Tela</button>
                    <button onClick={onSave} className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-green-900/20 transition-all">Salvar</button>
                </div>
            </div>
        </div>
    );
};

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loadingLogin, setLoadingLogin] = useState(false);
  
  // NAVEGAÇÃO E SIDEBAR
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // MODAIS E FEATURES NOVAS
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const [data, setData] = useState(null);
  const [sensorHistory, setSensorHistory] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [irrigating, setIrrigating] = useState(false);
  const [flying, setFlying] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [weather, setWeather] = useState({ temp: 28, humidity: 62, condition: 'Limpo' });
  
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [notificationsList, setNotificationsList] = useState([
      { time: '10:42', text: 'Umidade do solo abaixo de 30% no Setor Norte.', type: 'alert' },
      { time: '09:15', text: 'Trator JD-8R iniciou operação de plantio.', type: 'info' },
      { time: '08:00', text: 'Relatório diário gerado com sucesso.', type: 'success' },
  ]);

  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([{ sender: 'ai', text: 'Olá! Sou a IA da Fazenda. Como posso ajudar?' }]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef(null);
  const [systemLogs, setSystemLogs] = useState([]);

  // DADOS FINANCEIROS E ESTOQUE
  const financialData = [
      { month: 'Jan', receita: 45000, despesa: 22000 },
      { month: 'Fev', receita: 38000, despesa: 25000 },
      { month: 'Mar', receita: 52000, despesa: 20000 },
      { month: 'Abr', receita: 61000, despesa: 28000 },
      { month: 'Mai', receita: 55000, despesa: 24000 },
      { month: 'Jun', receita: 48000, despesa: 21000 },
  ];

  const stockData = [
      { item: 'Sementes Soja 55i', qtd: 80, unit: 'Sacos', status: 'Bom' },
      { item: 'Fertilizante NPK', qtd: 20, unit: 'Toneladas', status: 'Baixo' },
      { item: 'Defensivo Glyphos', qtd: 45, unit: 'Litros', status: 'Médio' },
      { item: 'Diesel S10', qtd: 1500, unit: 'Litros', status: 'Bom' },
  ];

  const teamData = [
      { name: 'João Silva', role: 'Gerente Operacional', status: 'Em Campo' },
      { name: 'Maria Souza', role: 'Agrônoma', status: 'Escritório' },
      { name: 'Carlos Lima', role: 'Operador de Máquinas', status: 'Em Campo' },
  ];

  // PERSISTÊNCIA DE SESSÃO (CORRIGIDO: NÃO loga sozinho, apenas preenche o nome)
  useEffect(() => {
    const savedUser = localStorage.getItem('agroTechUser');
    if (savedUser) {
        setLoginUser(savedUser);
        // setIsLoggedIn(true); <--- REMOVIDO PARA NÃO PULAR O LOGIN
    }
  }, []);

  // ATALHOS DE TECLADO
  useEffect(() => {
    const handleKeyDown = (e) => {
        if (!isLoggedIn || isLocked) return;
        if (e.key === '1') setActiveTab('dashboard');
        if (e.key === '2') setActiveTab('finance');
        if (e.key === '3') setActiveTab('stock');
        if (e.key === '4') setActiveTab('team');
        if (e.key === 'Escape') {
            setSelectedItem(null);
            setShowSettings(false);
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLoggedIn, isLocked]);

  const addLog = (action, details) => {
    const timestamp = new Date().toLocaleTimeString();
    setSystemLogs(prev => [{ time: timestamp, action, details }, ...prev].slice(0, 5));
  };

  const showToast = (msg, type = 'success') => {
    setNotification({ message: msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleExportData = () => {
    addLog('EXPORT', 'Dados financeiros exportados para CSV');
    showToast('Download do relatório CSV iniciado...', 'success');
  };

  const handleSaveSettings = () => {
      setShowSettings(false);
      addLog('CONFIG', 'Configurações de sistema atualizadas');
      showToast('Preferências salvas com sucesso!', 'success');
  };
  
  const toggleFullScreen = () => {
      if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen();
          setIsFullScreen(true);
      } else {
          if (document.exitFullscreen) {
              document.exitFullscreen();
              setIsFullScreen(false);
          }
      }
  };

  // BOTÃO DE PÂNICO
  const handleEmergencyProtocol = () => {
      addLog('EMERGÊNCIA', 'Protocolo de segurança acionado!');
      showToast('PROTOCOLO DE EMERGÊNCIA INICIADO. EQUIPES NOTIFICADAS.', 'emergency');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoadingLogin(true);
    setTimeout(() => {
      if (loginUser.length > 0) {
        setIsLoggedIn(true);
        localStorage.setItem('agroTechUser', loginUser);
        addLog('LOGIN', `Usuário ${loginUser} acessou o sistema`);
        showToast(`Bem-vindo, ${loginUser}! Conectando à Fazenda 360º...`, 'success');
      } else {
        alert("Preencha o usuário!");
        setLoadingLogin(false);
      }
    }, 1500);
  };

  const handleUnlock = (e) => {
      e.preventDefault();
      setIsLocked(false);
      addLog('LOGIN', 'Sistema desbloqueado pelo usuário');
  };

  // COMANDO DE VOZ
  const handleVoiceCommand = () => {
      if (isListening) return;
      setIsListening(true);
      setTimeout(() => {
          setChatInput("Como está a previsão de colheita?");
          setIsListening(false);
          setTimeout(() => {
            const simulatedEvent = { preventDefault: () => {} };
            handleSendMessage(simulatedEvent, "Como está a previsão de colheita?");
          }, 500);
      }, 2000);
  };

  const handleSendMessage = (e, forcedMessage = null) => {
    e && e.preventDefault();
    const messageToSend = forcedMessage || chatInput;
    if (!messageToSend.trim()) return;
    setChatMessages(prev => [...prev, { sender: 'user', text: messageToSend }]);
    setChatInput('');
    addLog('IA CHAT', `Pergunta: ${messageToSend.substring(0, 20)}...`);
    setTimeout(() => {
        let reply = "Não entendi. Pode repetir?";
        const lower = messageToSend.toLowerCase();
        if (lower.includes('soja') || lower.includes('plantacao') || lower.includes('colheita')) reply = "A Soja no Setor Norte está saudável. Colheita prevista para Março.";
        else if (lower.includes('trator') || lower.includes('maquina')) reply = "O Trator JD-8R está operando, mas a Colheitadeira precisa de manutenção.";
        else if (lower.includes('financeiro') || lower.includes('lucro')) reply = "O lucro líquido deste mês está projetado em R$ 35.000.";
        else reply = "Processando sua solicitação... Tudo parece normal na fazenda.";
        setChatMessages(prev => [...prev, { sender: 'ai', text: reply }]);
    }, 1000);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // --- REQUISIÇÃO REAL COM AXIOS (BACKEND) ---
  useEffect(() => {
    if (!isLoggedIn) return;
    
    const fetchData = async () => {
        try {
            // CONECTA NO BACKEND
            const response = await axios.get('/api/dashboard');
            setData(response.data);

            // Mock visual do histórico (apenas para o gráfico ficar bonito)
            const mockHistory = Array.from({ length: 10 }, (_, i) => ({
                time: `${10 + i}:00`,
                value: Math.floor(Math.random() * (60 - 40 + 1) + 40)
            }));
            setSensorHistory(mockHistory);
            
            setLoading(false);
        } catch (error) {
            console.error("Erro Fatal:", error);
            showToast("Erro ao conectar com API. Verifique o console.", "emergency");
            setLoading(false);
        }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Atualiza a cada 30s
    return () => clearInterval(interval);

  }, [isLoggedIn]);

  // TELA DE LOGIN INICIAL
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center relative bg-black font-sans">
        <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/farm-hero.jpg')" }}></div>
        <div className="absolute inset-0 z-0 bg-black/70 backdrop-blur-sm"></div>
        <div className="relative z-10 w-full max-w-md p-8 bg-zinc-900/60 border border-zinc-700 backdrop-blur-xl rounded-3xl shadow-2xl animate-in fade-in zoom-in duration-500">
          <div className="flex justify-center mb-6"><div className="bg-green-500/20 p-4 rounded-full border border-green-500/30"><Tractor className="h-10 w-10 text-green-500" /></div></div>
          <h2 className="text-3xl font-bold text-center text-white mb-1">AgroTech 360º</h2>
          <p className="text-zinc-400 text-center mb-8 text-sm">Sistema Integrado de Gestão Rural</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2"><label className="text-xs font-bold text-zinc-500 uppercase ml-1">Usuário</label><div className="flex items-center bg-black/40 border border-zinc-700 rounded-xl px-4 py-3 focus-within:border-green-500 transition-colors"><User className="h-5 w-5 text-zinc-500 mr-3" /><input type="text" placeholder="admin" className="bg-transparent border-none outline-none text-white w-full" value={loginUser} onChange={(e) => setLoginUser(e.target.value)} /></div></div>
            <div className="space-y-2"><label className="text-xs font-bold text-zinc-500 uppercase ml-1">Senha</label><div className="flex items-center bg-black/40 border border-zinc-700 rounded-xl px-4 py-3 focus-within:border-green-500 transition-colors"><Lock className="h-5 w-5 text-zinc-500 mr-3" /><input type="password" placeholder="••••••" className="bg-transparent border-none outline-none text-white w-full" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} /></div></div>
            <button type="submit" disabled={loadingLogin} className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-xl shadow-lg mt-4 disabled:opacity-50 flex justify-center items-center gap-2">{loadingLogin ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'ACESSAR SISTEMA'}</button>
          </form>
        </div>
      </div>
    );
  }
  
  // TELA DE BLOQUEIO (LOCK SCREEN)
  if (isLocked) {
      return (
        <div className="min-h-screen flex items-center justify-center relative bg-black font-sans z-[200]">
            <div className="absolute inset-0 z-0 bg-cover bg-center blur-sm transform scale-105" style={{ backgroundImage: "url('/images/farm-bg.jpg')" }}></div>
            <div className="absolute inset-0 z-0 bg-black/80"></div>
            <div className="relative z-10 flex flex-col items-center animate-in zoom-in duration-300">
                <div className="mb-8 text-center">
                    <h1 className="text-6xl font-black text-white mb-2">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</h1>
                    <p className="text-zinc-400 font-medium">{new Date().toLocaleDateString([], {weekday: 'long', day:'numeric', month:'long'})}</p>
                </div>
                <div className="bg-zinc-900/60 p-8 rounded-3xl border border-zinc-700 backdrop-blur-xl w-80">
                    <div className="flex justify-center mb-6">
                         <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center border-2 border-green-500 p-1"><User size={40} className="text-white"/></div>
                    </div>
                    <h3 className="text-center text-white font-bold text-xl mb-6">Olá, {loginUser}</h3>
                    <form onSubmit={handleUnlock}>
                        <div className="flex items-center bg-black/50 border border-zinc-600 rounded-xl px-4 py-3 mb-4 focus-within:border-green-500">
                            <Lock size={16} className="text-zinc-400 mr-2"/>
                            <input type="password" placeholder="Senha para desbloquear" className="bg-transparent outline-none text-white text-sm w-full" />
                        </div>
                        <button type="submit" className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"><Unlock size={16}/> Desbloquear</button>
                    </form>
                </div>
            </div>
        </div>
      );
  }

  if (loading) return <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-green-500 font-mono gap-4"><Tractor className="animate-bounce h-12 w-12"/> CARREGANDO FAZENDA...</div>;

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans flex overflow-hidden">
      {notification && <Toast message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
      
      {/* MODAIS */}
      <DetailModal item={selectedItem} type={selectedType} onClose={() => setSelectedItem(null)} />
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} onSave={handleSaveSettings} onLock={() => { setShowSettings(false); setIsLocked(true); }} />}

      {/* === SIDEBAR RETRÁTIL === */}
      <aside className={`fixed inset-y-0 left-0 z-50 bg-black border-r border-zinc-800 flex flex-col justify-between transition-all duration-300 ${isSidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full opacity-0 lg:opacity-100 lg:w-0 lg:translate-x-0 overflow-hidden'}`}>
          <div className="w-64"> 
            <div className="h-20 flex items-center px-6 border-b border-zinc-800">
                <Tractor className="h-8 w-8 text-green-500" />
                <span className="ml-3 font-bold text-xl">AGRO<span className="text-green-500">TECH</span></span>
            </div>
            <nav className="mt-6 space-y-2 px-2">
                <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-green-600 text-white shadow-lg shadow-green-900/20' : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'}`}>
                    <LayoutDashboard size={22} />
                    <span className="font-medium">Visão Geral <span className="text-[10px] opacity-50 ml-2 border border-white/20 px-1 rounded">1</span></span>
                </button>
                <button onClick={() => setActiveTab('finance')} className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${activeTab === 'finance' ? 'bg-green-600 text-white shadow-lg shadow-green-900/20' : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'}`}>
                    <Wallet size={22} />
                    <span className="font-medium">Financeiro <span className="text-[10px] opacity-50 ml-2 border border-white/20 px-1 rounded">2</span></span>
                </button>
                <button onClick={() => setActiveTab('stock')} className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${activeTab === 'stock' ? 'bg-green-600 text-white shadow-lg shadow-green-900/20' : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'}`}>
                    <Package size={22} />
                    <span className="font-medium">Estoque <span className="text-[10px] opacity-50 ml-2 border border-white/20 px-1 rounded">3</span></span>
                </button>
                <button onClick={() => setActiveTab('team')} className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${activeTab === 'team' ? 'bg-green-600 text-white shadow-lg shadow-green-900/20' : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'}`}>
                    <Users size={22} />
                    <span className="font-medium">Equipe <span className="text-[10px] opacity-50 ml-2 border border-white/20 px-1 rounded">4</span></span>
                </button>

                {/* BOTÃO DE PÂNICO */}
                <div className="mt-8 pt-4 border-t border-zinc-800">
                    <button onClick={handleEmergencyProtocol} className="w-full flex items-center gap-4 p-3 rounded-xl text-red-400 hover:bg-red-900/20 hover:text-red-200 transition-colors animate-pulse">
                        <Siren size={22} />
                        <span className="font-bold text-sm">EMERGÊNCIA</span>
                    </button>
                </div>
            </nav>
          </div>
          
          <div className="p-4 border-t border-zinc-800 w-64 cursor-pointer hover:bg-zinc-900 transition-colors group" onClick={() => setShowSettings(true)}>
              <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700 text-green-500 font-bold group-hover:border-green-500 transition-colors">A</div>
                  <div>
                      <p className="text-sm font-bold text-white flex items-center gap-2">Admin <Settings size={12} className="text-zinc-500"/></p>
                      <p className="text-xs text-zinc-500">Fazenda 360º</p>
                  </div>
              </div>
          </div>
      </aside>

      {/* === ÁREA DE CONTEÚDO === */}
      <main className={`flex-1 relative overflow-y-auto h-screen bg-zinc-950 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
        <div className="fixed inset-0 z-0 opacity-15 bg-cover bg-center pointer-events-none" style={{ backgroundImage: "url('/images/farm-bg.jpg')" }}></div>
        
        {/* HEADER SUPERIOR */}
        <div className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                    <Menu size={24} />
                </button>
                <h2 className="text-xl font-bold text-white capitalize flex items-center gap-2 hidden md:flex">
                    {activeTab === 'dashboard' && <><LayoutDashboard className="text-green-500"/> Visão Geral</>}
                    {activeTab === 'finance' && <><Wallet className="text-green-500"/> Gestão Financeira</>}
                    {activeTab === 'stock' && <><Package className="text-green-500"/> Estoque e Insumos</>}
                    {activeTab === 'team' && <><Users className="text-green-500"/> Recursos Humanos</>}
                </h2>
            </div>

            {/* BUSCA GLOBAL */}
            <div className="hidden md:flex items-center bg-zinc-900 border border-zinc-700 rounded-full px-4 py-2 w-96 mx-4 focus-within:border-green-500 transition-colors">
                <Search size={16} className="text-zinc-500 mr-3" />
                <input type="text" placeholder="Buscar tratores, animais ou setores..." className="bg-transparent border-none outline-none text-sm text-white w-full" />
            </div>

            <div className="flex items-center gap-4">
                 <button onClick={toggleFullScreen} className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full hidden sm:block">
                     {isFullScreen ? <Minimize size={20}/> : <Maximize size={20}/>}
                 </button>

                 {/* SINO DE NOTIFICAÇÃO */}
                 <div className="relative">
                        <button onClick={() => setShowNotifDropdown(!showNotifDropdown)} className="bg-black/40 p-2 rounded-full border border-white/5 hover:bg-zinc-800 transition-colors relative">
                            <Bell className="w-5 h-5 text-zinc-300" />
                            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-black"></span>
                        </button>
                        {showNotifDropdown && (
                            <div className="absolute top-12 right-0 w-80 bg-zinc-900/95 border border-zinc-700 rounded-xl shadow-2xl p-4 z-50 backdrop-blur-xl animate-in fade-in slide-in-from-top-2">
                                <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2"><Bell size={14} className="text-green-500"/> Notificações Recentes</h4>
                                <div className="space-y-3">
                                    {notificationsList.map((notif, idx) => (
                                        <div key={idx} className="flex gap-3 items-start border-b border-zinc-800 pb-2 last:border-0 last:pb-0">
                                            <div className={`mt-1 w-2 h-2 rounded-full ${notif.type === 'alert' ? 'bg-red-500' : notif.type === 'info' ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                                            <div>
                                                <p className="text-xs text-zinc-300 leading-snug">{notif.text}</p>
                                                <span className="text-[10px] text-zinc-500">{notif.time}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                 </div>
                 <div className="text-right hidden md:block">
                     <div className="text-xs font-bold text-white">{new Date().toLocaleDateString()}</div>
                     <div className="text-[10px] text-zinc-400 flex items-center gap-1 justify-end"><Cloud size={10}/> {weather.temp}°C</div>
                 </div>
            </div>
        </div>

        {/* CONTEÚDO DAS ABAS */}
        <div className="p-6 pb-24 relative z-10">

            {/* === ABA 1: DASHBOARD === */}
            {activeTab === 'dashboard' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                    {/* TICKER */}
                    <div className="bg-green-900/20 border border-green-500/10 rounded-xl py-2 px-4 overflow-hidden">
                        <div className="flex items-center gap-8 text-xs font-mono font-bold tracking-widest text-green-400">
                            <span className="flex items-center gap-2"><DollarSign size={12}/> SOJA: R$ {data?.market?.soy_price}</span>
                            <span className="flex items-center gap-2"><DollarSign size={12}/> MILHO: R$ {data?.market?.corn_price}</span>
                            <span className="flex items-center gap-2"><DollarSign size={12}/> ARROBA: R$ {data?.market?.cattle_price}</span>
                        </div>
                    </div>

                    {/* KPI CARDS */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-zinc-900/60 backdrop-blur-xl border border-white/5 p-6 rounded-2xl shadow-xl border-l-4 border-l-green-500">
                           <p className="text-zinc-400 text-xs font-bold uppercase">Plantações</p><h3 className="text-2xl font-bold text-white mt-1">{data?.crops?.length} <span className="text-sm font-normal text-zinc-500">Hectares</span></h3>
                        </div>
                        <div className="bg-zinc-900/60 backdrop-blur-xl border border-white/5 p-6 rounded-2xl shadow-xl border-l-4 border-l-orange-500">
                           <p className="text-zinc-400 text-xs font-bold uppercase">Rebanho</p><h3 className="text-2xl font-bold text-orange-500 mt-1">{data?.livestock?.length || 0} <span className="text-sm font-normal text-zinc-500">Cabeças</span></h3>
                        </div>
                        <div className="bg-zinc-900/60 backdrop-blur-xl border border-white/5 p-6 rounded-2xl shadow-xl border-l-4 border-l-yellow-500">
                           <p className="text-zinc-400 text-xs font-bold uppercase">Alertas</p><h3 className="text-2xl font-bold text-yellow-500 mt-1">{data?.active_alerts} <span className="text-sm font-normal text-zinc-500">Críticos</span></h3>
                        </div>
                        <div className="bg-zinc-900/60 backdrop-blur-xl border border-white/5 p-6 rounded-2xl shadow-xl border-l-4 border-l-purple-500">
                           <p className="text-zinc-400 text-xs font-bold uppercase">Maquinário</p><h3 className="text-2xl font-bold text-purple-400 mt-1">{data?.machinery?.filter(m => m.status === 'Operando').length} <span className="text-sm font-normal text-zinc-500">Operando</span></h3>
                        </div>
                    </div>

                    {/* PREVISÃO E ESG */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-zinc-900/70 backdrop-blur-xl border border-white/5 p-6 rounded-3xl shadow-2xl">
                            <h2 className="text-lg font-bold flex items-center gap-2 mb-6 text-white"><Calendar className="text-blue-400" /> Previsão Semanal</h2>
                            <div className="grid grid-cols-5 gap-2 text-center">
                                {[
                                    { day: 'SEG', icon: <Sun className="text-yellow-500 mx-auto mb-2"/>, max: '31°', min: '19°' },
                                    { day: 'TER', icon: <Cloud className="text-zinc-400 mx-auto mb-2"/>, max: '28°', min: '20°' },
                                    { day: 'QUA', icon: <CloudRain className="text-blue-400 mx-auto mb-2"/>, max: '24°', min: '18°' },
                                    { day: 'QUI', icon: <CloudRain className="text-blue-400 mx-auto mb-2"/>, max: '22°', min: '17°' },
                                    { day: 'SEX', icon: <Sun className="text-yellow-500 mx-auto mb-2"/>, max: '29°', min: '18°' }
                                ].map((d, i) => (
                                    <div key={i} className="bg-black/30 rounded-xl p-3 border border-white/5 hover:bg-white/5 transition-colors">
                                        <span className="text-xs font-bold text-zinc-500 block mb-2">{d.day}</span>
                                        {d.icon}
                                        <div className="text-sm font-bold text-white">{d.max}</div>
                                        <div className="text-xs text-zinc-500">{d.min}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-zinc-900/70 backdrop-blur-xl border border-white/5 p-6 rounded-3xl shadow-2xl flex items-center justify-between relative overflow-hidden">
                            <div className="relative z-10">
                                <h2 className="text-lg font-bold flex items-center gap-2 mb-2 text-white"><Leaf className="text-green-500" /> Score ESG</h2>
                                <p className="text-xs text-zinc-400 mb-6 max-w-[200px]">Índice de sustentabilidade baseado em baixa emissão de carbono e uso de água.</p>
                                <div className="space-y-3">
                                    <div>
                                    <div className="flex justify-between text-xs font-bold text-zinc-300 mb-1"><span>Carbono Zero</span><span>92%</span></div>
                                    <div className="w-48 h-1.5 bg-zinc-700 rounded-full"><div className="h-full bg-green-500 rounded-full" style={{width: '92%'}}></div></div>
                                    </div>
                                    <div>
                                    <div className="flex justify-between text-xs font-bold text-zinc-300 mb-1"><span>Gestão Hídrica</span><span>85%</span></div>
                                    <div className="w-48 h-1.5 bg-zinc-700 rounded-full"><div className="h-full bg-blue-500 rounded-full" style={{width: '85%'}}></div></div>
                                    </div>
                                </div>
                            </div>
                            <div className="relative z-10 mr-4">
                                <div className="w-32 h-32 rounded-full border-8 border-zinc-800 flex items-center justify-center relative">
                                    <div className="absolute inset-0 border-8 border-green-500 rounded-full border-t-transparent border-l-transparent rotate-45"></div>
                                    <div className="text-center">
                                        <span className="text-4xl font-black text-white block">87</span>
                                        <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Excelente</span>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute right-0 top-0 h-full w-1/2 bg-green-500/10 blur-3xl rounded-full"></div>
                        </div>
                    </div>

                    {/* MAPA + TELEMETRIA */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-zinc-900/70 backdrop-blur-xl border border-white/5 p-1 rounded-3xl shadow-2xl h-[400px]">
                        <div className="absolute top-4 left-6 z-10 bg-black/60 px-3 py-1 rounded backdrop-blur text-xs font-bold text-white border border-white/10">📡 SATÉLITE VIVO</div>
                        <FarmMap />
                        </div>
                        <div className="bg-zinc-900/70 backdrop-blur-xl border border-white/5 p-6 rounded-3xl shadow-2xl h-[400px] flex flex-col">
                        <div className="flex justify-between items-center mb-4"><h2 className="text-lg font-bold flex items-center gap-2"><Activity className="text-green-500" /> Umidade do Solo</h2><span className="text-xs bg-green-900/30 text-green-400 px-2 py-1 rounded border border-green-500/20 animate-pulse">LIVE</span></div>
                        <div className="flex-1 w-full"><ResponsiveContainer width="100%" height="100%"><AreaChart data={sensorHistory}><defs><linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/><stop offset="95%" stopColor="#22c55e" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} /><XAxis dataKey="time" stroke="#666" fontSize={10} tickLine={false} axisLine={false} /><YAxis stroke="#666" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} /><Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #333' }} itemStyle={{ color: '#22c55e' }} /><Area type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" /></AreaChart></ResponsiveContainer></div>
                        </div>
                    </div>

                    {/* FROTA (CLICÁVEL) */}
                    <div>
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white"><Truck className="text-purple-500" /> Gestão de Frota e Maquinário (Clique para Detalhes)</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {data?.machinery?.map((machine) => (
                                <div onClick={() => { setSelectedItem(machine); setSelectedType('machine'); }} key={machine.id} className="bg-zinc-900/70 backdrop-blur-xl border border-white/5 p-6 rounded-2xl hover:border-purple-500/50 transition-all cursor-pointer group hover:bg-zinc-900">
                                    <div className="flex justify-between items-start mb-4">
                                        <div><h3 className="font-bold text-lg text-white group-hover:text-purple-400 transition-colors">{machine.name}</h3><p className="text-xs text-zinc-400">{machine.type}</p></div>
                                        <div className={`px-3 py-1 rounded-full text-xs font-bold ${machine.status === 'Operando' ? 'bg-green-500/20 text-green-400' : machine.status === 'Manutenção' ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-zinc-500/20 text-zinc-400'}`}>{machine.status}</div>
                                    </div>
                                    <div className="mt-4">
                                        <div className="flex justify-between text-xs text-zinc-400 mb-1"><span>Combustível</span><span>{machine.fuel}%</span></div>
                                        <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden"><div className={`h-full rounded-full ${machine.fuel < 20 ? 'bg-red-500' : 'bg-purple-500'}`} style={{ width: `${machine.fuel}%` }}></div></div>
                                    </div>
                                    <div className="mt-4 flex items-center gap-2 text-xs text-zinc-500"><Wrench size={12}/> Próxima revisão: {machine.next_maintenance}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* PECUÁRIA E SILOS (CLICÁVEL) */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 bg-zinc-900/70 backdrop-blur-xl border border-white/5 p-6 rounded-3xl shadow-xl">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white"><Beef className="text-orange-500" /> Pecuária Inteligente (Clique para Detalhes)</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {data?.livestock?.map((animal) => (
                                    <div onClick={() => { setSelectedItem(animal); setSelectedType('animal'); }} key={animal.id} className="bg-black/20 p-4 rounded-2xl flex items-center justify-between border border-white/5 hover:border-orange-500/50 transition-all cursor-pointer group hover:bg-black/40">
                                        <div className="flex items-center gap-4"><div className={`p-3 rounded-full ${animal.status === 'Saudável' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}><Beef size={24}/></div><div><h4 className="font-bold text-lg group-hover:text-orange-400 transition-colors">{animal.tag}</h4><p className="text-xs text-zinc-500">Peso: {animal.weight}kg • {animal.location}</p></div></div>
                                        <div className={`px-3 py-1 rounded-full text-xs font-bold ${animal.status === 'Saudável' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400 animate-pulse'}`}>{animal.status}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-zinc-900/70 backdrop-blur-xl border border-white/5 p-6 rounded-3xl shadow-xl">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white"><Warehouse className="text-blue-500" /> Nível dos Silos</h2>
                            <div className="flex justify-around items-end h-[200px] mt-8 gap-4">
                                {data?.silos?.map((silo, idx) => (
                                    <div key={idx} className="flex flex-col items-center w-full group">
                                        <div className="relative w-full bg-zinc-800 rounded-t-xl overflow-hidden border border-zinc-700 h-[150px]"><div className={`absolute bottom-0 left-0 w-full transition-all duration-1000 ${silo.current/silo.capacity > 0.7 ? 'bg-green-500' : 'bg-blue-500'}`} style={{ height: `${(silo.current/silo.capacity)*100}%` }}><div className="absolute inset-0 bg-white/10 animate-pulse"></div></div><div className="absolute bottom-2 w-full text-center font-bold text-white drop-shadow-md text-sm">{Math.round((silo.current/silo.capacity)*100)}%</div></div>
                                        <div className="mt-3 text-center"><p className="font-bold text-xs text-white truncate">{silo.type}</p><p className="text-[10px] text-zinc-500 flex items-center justify-center gap-1"><Thermometer size={8}/> {silo.temp}°C</p></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* CÂMERAS */}
                    <div>
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white"><Camera className="text-zinc-400" /> Monitoramento Patrimonial</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                { loc: 'Portão Principal', img: 'https://images.unsplash.com/photo-1472141521881-95d0e87e2e39?q=80&w=600&auto=format&fit=crop' },
                                { loc: 'Curral A (Gado)', img: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?q=80&w=600&auto=format&fit=crop' },
                                { loc: 'Galpão de Máquinas', img: 'https://images.unsplash.com/photo-1536294528186-b48e36474e82?q=80&w=600&auto=format&fit=crop' }
                            ].map((cam, idx) => (
                                <div key={idx} className="relative rounded-xl overflow-hidden border border-zinc-700 shadow-xl group cursor-pointer h-56 bg-black">
                                    <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded animate-pulse z-20">● LIVE</div>
                                    <div className="absolute bottom-2 left-2 text-white text-xs font-mono font-bold z-20 bg-black/60 px-2 rounded backdrop-blur-sm">{cam.loc}</div>
                                    <div className="absolute inset-0 bg-green-500/20 z-10 pointer-events-none mix-blend-overlay"></div> 
                                    <img src={cam.img} alt="CCTV" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-80 grayscale brightness-75 contrast-125" />
                                    <div className="absolute inset-0 bg-[url('/images/scanline.png')] opacity-10 pointer-events-none mix-blend-overlay bg-cover z-20"></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CENTRO DE OPERAÇÕES */}
                    <div>
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white border-l-4 border-green-500 pl-4"><Tractor className="text-green-500" /> Centro de Operações</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className={`p-6 rounded-2xl border backdrop-blur-md transition-all ${irrigating ? 'bg-blue-900/20 border-blue-500/50' : 'bg-zinc-900/80 border-zinc-700/50 hover:border-blue-500/50'}`}>
                            <div className="flex justify-between items-start mb-4"><div><h3 className="font-bold text-lg text-white">Irrigação</h3><p className="text-sm text-zinc-400">Setor Norte</p></div><Droplets className={`h-8 w-8 text-blue-400 transition-all ${irrigating ? 'animate-[spin_3s_linear_infinite]' : ''}`} /></div>
                            <button onClick={() => { setIrrigating(!irrigating); addLog('COMANDO', irrigating ? 'Irrigação Desligada' : 'Irrigação Ativada (Setor Norte)'); showToast(irrigating ? 'Sistema desligado.' : 'Iniciando bombas hidráulicas...', 'info'); }} className={`w-full py-3 rounded-lg text-sm font-bold shadow-lg ${irrigating ? 'bg-red-500/20 text-red-400' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}>{irrigating ? 'PARAR SISTEMA' : 'ATIVAR AGORA'}</button>
                        </div>
                        <div className="bg-zinc-900/80 backdrop-blur-md p-6 rounded-2xl border border-zinc-700/50 hover:border-orange-500/50 transition-all">
                            <div className="flex justify-between items-start mb-4"><div><h3 className="font-bold text-lg text-white">Drone Scout</h3><p className="text-sm text-zinc-400">Patrulha Aérea</p></div><Plane className={`h-8 w-8 text-orange-400 ${flying ? 'animate-pulse' : ''}`} /></div>
                            <button onClick={() => { setFlying(true); addLog('COMANDO', 'Drone enviado para patrulha'); showToast('Iniciando plano de voo...', 'info'); setTimeout(() => setFlying(false), 5000); }} disabled={flying} className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-bold text-sm shadow-lg disabled:opacity-50">{flying ? 'EM VOO...' : 'INICIAR VOO'}</button>
                        </div>
                        <div className="bg-zinc-900/80 backdrop-blur-md p-6 rounded-2xl border border-zinc-700/50 hover:border-purple-500/50 transition-all">
                            <div className="flex justify-between items-start mb-4"><div><h3 className="font-bold text-lg text-white">Agro AI</h3><p className="text-sm text-zinc-400">Análise Preditiva</p></div><BrainCircuit className={`h-8 w-8 text-purple-400 ${analyzing ? 'animate-pulse' : ''}`} /></div>
                            <button onClick={() => { setAnalyzing(true); addLog('IA', 'Solicitação de Análise Preditiva'); setTimeout(() => {setAnalyzing(false); showToast('Relatório Financeiro Gerado', 'success')}, 3000); }} disabled={analyzing} className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-bold text-sm shadow-lg disabled:opacity-50">{analyzing ? 'PROCESSANDO...' : 'GERAR ANÁLISE'}</button>
                        </div>
                        </div>
                    </div>
                    
                    {/* STATUS CULTURAS */}
                    <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white"><CheckCircle2 className="text-green-500"/> Status das Culturas</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {data?.crops?.map((crop) => (
                            <div key={crop.id} className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5 hover:bg-black/40 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${crop.status === 'Saudável' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{crop.status === 'Saudável' ? <Sprout size={20} /> : <AlertTriangle size={20} />}</div>
                                <div><h4 className="font-bold">{crop.name}</h4><p className="text-xs text-zinc-500">Colheita: {new Date(crop.expected_harvest_date).toLocaleDateString()}</p></div>
                            </div>
                            <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide ${crop.status === 'Saudável' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>{crop.status}</span>
                            </div>
                        ))}
                        </div>
                    </div>
                </div>
            )}

            {/* === ABA 2: FINANCEIRO === */}
            {activeTab === 'finance' && (
                <div className="animate-in fade-in slide-in-from-right duration-500 space-y-8">
                    <div className="flex justify-between items-center">
                        <h3 className="text-2xl font-bold text-white">Resumo Financeiro</h3>
                        <button onClick={handleExportData} className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors shadow-lg shadow-green-900/20">
                            <Download size={16} /> Exportar CSV
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-zinc-900/60 p-6 rounded-2xl border border-white/5">
                            <h4 className="text-zinc-400 text-sm font-bold uppercase">Receita Total</h4>
                            <p className="text-3xl font-black text-white mt-2 flex items-center gap-2">R$ 299.000 <ArrowUpRight className="text-green-500"/></p>
                        </div>
                        <div className="bg-zinc-900/60 p-6 rounded-2xl border border-white/5">
                            <h4 className="text-zinc-400 text-sm font-bold uppercase">Despesas</h4>
                            <p className="text-3xl font-black text-white mt-2 flex items-center gap-2">R$ 140.000 <ArrowDownRight className="text-red-500"/></p>
                        </div>
                        <div className="bg-zinc-900/60 p-6 rounded-2xl border border-white/5">
                            <h4 className="text-zinc-400 text-sm font-bold uppercase">Lucro Líquido</h4>
                            <p className="text-3xl font-black text-green-500 mt-2">R$ 159.000</p>
                        </div>
                    </div>

                    <div className="bg-zinc-900/60 p-6 rounded-3xl border border-white/5 h-[400px]">
                        <h3 className="font-bold text-white mb-6">Fluxo de Caixa (Semestral)</h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={financialData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                <XAxis dataKey="month" stroke="#666" />
                                <YAxis stroke="#666" />
                                <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #333' }} />
                                <Legend />
                                <Bar dataKey="receita" name="Receita" fill="#22c55e" radius={[4,4,0,0]} />
                                <Bar dataKey="despesa" name="Despesa" fill="#ef4444" radius={[4,4,0,0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* === ABA 3: ESTOQUE === */}
            {activeTab === 'stock' && (
                <div className="animate-in fade-in slide-in-from-right duration-500">
                    <div className="bg-zinc-900/60 border border-white/5 rounded-3xl overflow-hidden">
                        <div className="p-6 border-b border-zinc-800"><h3 className="font-bold text-white">Controle de Insumos</h3></div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-black/30 text-zinc-400 text-xs uppercase">
                                    <tr>
                                        <th className="px-6 py-4">Item</th>
                                        <th className="px-6 py-4">Quantidade</th>
                                        <th className="px-6 py-4">Unidade</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Ação</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm divide-y divide-zinc-800">
                                    {stockData.map((item, i) => (
                                        <tr key={i} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 font-bold text-white">{item.item}</td>
                                            <td className="px-6 py-4 text-zinc-300">{item.qtd}</td>
                                            <td className="px-6 py-4 text-zinc-500">{item.unit}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${item.status === 'Bom' ? 'bg-green-500/20 text-green-400' : item.status === 'Baixo' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{item.status}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button className="text-blue-400 hover:text-blue-300 text-xs font-bold border border-blue-500/30 px-3 py-1 rounded hover:bg-blue-500/10">Repor</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

             {/* === ABA 4: EQUIPE === */}
             {activeTab === 'team' && (
                <div className="animate-in fade-in slide-in-from-right duration-500 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teamData.map((member, i) => (
                        <div key={i} className="bg-zinc-900/60 border border-white/5 p-6 rounded-2xl flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-white">{member.name.charAt(0)}</div>
                            <div>
                                <h4 className="font-bold text-white">{member.name}</h4>
                                <p className="text-xs text-zinc-400">{member.role}</p>
                                <div className="mt-2 flex items-center gap-2 text-xs text-green-400">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> {member.status}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* === LOGS DO SISTEMA (FIXO NO RODAPÉ DE TODAS AS ABAS) === */}
            <div className="mt-12 bg-black border border-zinc-800 rounded-xl p-6 font-mono text-xs shadow-2xl">
                <h4 className="text-green-500 font-bold mb-4 flex items-center gap-2"><Terminal size={14}/> SYSTEM_LOGS // AUDITORIA EM TEMPO REAL</h4>
                <div className="space-y-2">
                    {systemLogs.length === 0 && <p className="text-zinc-600">Aguardando atividades...</p>}
                    {systemLogs.map((log, idx) => (
                        <div key={idx} className="flex gap-4 border-b border-zinc-900 pb-2 animate-in slide-in-from-left duration-300">
                            <span className="text-zinc-500">[{log.time}]</span>
                            <span className={`font-bold ${log.action === 'COMANDO' ? 'text-blue-400' : log.action === 'IA' ? 'text-purple-400' : log.action === 'EMERGÊNCIA' ? 'text-red-500' : 'text-green-400'}`}>{log.action}</span>
                            <span className="text-zinc-300">{log.details}</span>
                        </div>
                    ))}
                </div>
            </div>

        </div>

        {/* CHATBOT */}
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {chatOpen && (
                <div className="bg-zinc-900 border border-zinc-700 shadow-2xl rounded-2xl w-80 h-96 mb-4 flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
                    <div className="bg-green-700 p-4 flex justify-between items-center"><h4 className="font-bold text-white flex items-center gap-2"><BrainCircuit size={18}/> Assistente IA</h4><button onClick={() => setChatOpen(false)}><X size={18} className="text-white hover:text-red-300"/></button></div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-black/40">
                        {chatMessages.map((msg, i) => (
                            <div key={i} className={`p-3 rounded-xl text-sm max-w-[80%] ${msg.sender === 'user' ? 'bg-green-600 text-white self-end ml-auto' : 'bg-zinc-800 text-zinc-300 self-start'}`}>{msg.text}</div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>
                    <form onSubmit={handleSendMessage} className="p-3 border-t border-zinc-700 bg-zinc-900 flex gap-2 items-center">
                        <button type="button" onClick={handleVoiceCommand} className={`p-2 rounded-lg text-white transition-all ${isListening ? 'bg-red-500 animate-pulse' : 'bg-zinc-800 hover:bg-zinc-700'}`}>
                            <Mic size={18} />
                        </button>
                        <input type="text" placeholder={isListening ? "Ouvindo..." : "Pergunte sobre a fazenda..."} className="flex-1 bg-black/50 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:border-green-500 outline-none" value={chatInput} onChange={(e) => setChatInput(e.target.value)} disabled={isListening} />
                        <button type="submit" className="bg-green-600 hover:bg-green-500 p-2 rounded-lg text-white"><Send size={18}/></button>
                    </form>
                </div>
            )}
            <button onClick={() => setChatOpen(!chatOpen)} className="bg-green-600 hover:bg-green-500 text-white p-4 rounded-full shadow-[0_0_20px_rgba(22,163,74,0.5)] transition-transform active:scale-95 flex items-center gap-2 font-bold">
                {chatOpen ? <X size={24}/> : <MessageCircle size={24}/>}
                {!chatOpen && <span className="mr-2">Precisa de ajuda?</span>}
            </button>
        </div>
      </main>
    </div>
  );
}