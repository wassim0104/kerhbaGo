"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, MapPin, Navigation, History, Shield, MessageSquare, X, Send, Bot, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ClientSpacePage() {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [clientProfile, setClientProfile] = useState<any>(null);
  const router = useRouter();

  // Set chat greeting once profile is loaded
  useEffect(() => {
    if (clientProfile && messages.length === 0) {
      const firstName = clientProfile.full_name?.split(' ')[0] || 'Client';
      setMessages([{ role: 'bot', text: `Bonjour ${firstName}! Comment puis-je vous aider avec votre location ?` }]);
    }
  }, [clientProfile]);

  // Fetch real authenticated session
  useEffect(() => {
    async function initUser() {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        router.push('/login');
        return;
      }

      const userId = session.user.id;

      // Fetch Profile
      const { data: profileData } = await supabase
        .from('clients')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (profileData) {
        setClientProfile(profileData);
      } else {
        // Fallback info from Auth Provider if trigger lagged (optional)
        setClientProfile({
          full_name: session.user.user_metadata?.full_name || session.user.email,
          trust_score: 100,
          created_at: session.user.created_at
        });
      }

      // Fetch authentic reservations strictly for this user
      const { data: resData, error: resError } = await supabase
        .from('reservations')
        .select(`
          *,
          vehicles(name, photo_urls),
          agencies(name)
        `)
        .eq('client_id', userId)
        .order('created_at', { ascending: false });
      
      if (!resError && resData) {
        setReservations(resData);
      }
      
      setLoading(false);
    }
    
    initUser();
  }, [router]);

  // Logic for querying Next.js backend proxy mapped to n8n
  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text }]);
    setInput('');
    
    try {
      // Build rich context for n8n AI
      const activeReservation = reservations[0] || null;
      const userContext = {
        nom: clientProfile?.full_name || 'inconnu',
        tel: clientProfile?.phone || 'inconnu',
        trust_score: clientProfile?.trust_score || 100,
        reservation_active: activeReservation ? {
          vehicule: activeReservation.vehicles?.name || 'N/A',
          agence: activeReservation.agencies?.name || 'N/A',
          date_debut: activeReservation.start_date,
          date_fin: activeReservation.end_date,
          prix_total: activeReservation.total_price,
          statut: activeReservation.status
        } : null
      };

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: text, 
          clientId: clientProfile?.id || 'unknown',
          userContext 
        })
      });
      const data = await response.json();
      if (data.reply) {
        setMessages(prev => [...prev, { role: 'bot', text: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'bot', text: "Désolé, je ne peux pas traiter la demande." }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: "L'assistant IA est temporairement indisponible." }]);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const TRUST_SCORE = clientProfile?.trust_score || 100;
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500 stroke-green-500';
    if (score >= 60) return 'text-primary stroke-primary';
    return 'text-red-500 stroke-red-500';
  };

  const activeRes = reservations[0];
  const historyRes = reservations.slice(1);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center pb-20 md:pb-0">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-white font-heading font-bold">Chargement de votre compte...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative pb-20 md:pb-0">
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-[#0D0D0D]/90 backdrop-blur-md border-b border-[#2b2b2b]">
        <div className="container flex items-center justify-between h-20">
          <Link href="/" className="text-3xl font-heading font-extrabold tracking-tighter text-primary">
            kerhbaGo
          </Link>
          <div className="flex gap-4 items-center">
            <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-[#5f5e5e] font-semibold hover:text-red-500 transition-colors">
              Déconnexion
            </button>
            <button className="flex items-center gap-2 text-sm font-semibold hover:text-primary transition-colors ml-4">
              <User className="w-5 h-5 mx-auto" /> <span>Mon Profil</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* PROFILE & TRUST SCORE (Sidebar) */}
          <aside className="space-y-8">
            <div className="bg-[#1c1b1b] rounded-2xl p-8 border border-[#2b2b2b] text-center shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent pointer-events-none" />
              <div className="relative z-10 w-24 h-24 bg-[#2b2b2b] rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-[#0D0D0D]">
                <span className="text-4xl font-heading font-extrabold text-white">{clientProfile?.full_name?.charAt(0) || "C"}</span>
              </div>
              <h2 className="text-2xl font-heading font-bold mb-1 relative z-10">{clientProfile?.full_name || "Client KerhbaGo"}</h2>
              <p className="text-sm text-[#a1a1aa] mb-8 relative z-10">Membre depuis {new Date(clientProfile?.created_at || Date.now()).getFullYear()}</p>
              
              <div className="relative w-40 h-40 mx-auto mb-4 flex items-center justify-center z-10">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  {/* Background Circle */}
                  <path
                    className="stroke-[#2b2b2b] fill-none"
                    strokeWidth="3"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Foreground Circle */}
                  <path
                    className={`${getScoreColor(TRUST_SCORE)} fill-none transition-all duration-1000 ease-out`}
                    strokeWidth="3"
                    strokeDasharray={`${TRUST_SCORE}, 100`}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-4xl font-heading font-bold ${getScoreColor(TRUST_SCORE).split(' ')[0]}`}>{TRUST_SCORE}</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#a1a1aa]">Score</span>
                </div>
              </div>
              <p className="text-sm font-semibold mt-2">Niveau: <span className={getScoreColor(TRUST_SCORE).split(' ')[0]}>Bon</span></p>
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <div className="col-span-1 lg:col-span-2 space-y-8">
            
            {loading ? (
              <div className="py-20 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
            ) : (
              <>
                {/* ACTIVE RESERVATION */}
                {activeRes ? (
                  <section className="bg-[#1c1b1b] rounded-2xl overflow-hidden border border-primary/30 relative">
                    <div className="absolute top-0 right-0 p-4">
                      <span className="bg-primary/10 text-primary text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full border border-primary/20">
                        {activeRes.status === 'confirmed' ? 'En Cours' : 'En Attente'}
                      </span>
                    </div>
                    <div className="p-8">
                      <h3 className="text-xl font-heading font-bold mb-6 flex items-center gap-2">
                        <Navigation className="w-5 h-5 text-primary" /> Réservation Récente
                      </h3>
                      
                      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                        <div className="w-full md:w-1/3 aspect-[4/3] bg-[#2b2b2b] rounded-xl overflow-hidden shadow-lg">
                          <img 
                            src={activeRes.vehicles?.photo_urls?.[0] || "https://images.unsplash.com/photo-1549399542-7e3f8b79c341"} 
                            alt={activeRes.vehicles?.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 w-full space-y-4">
                          <div>
                            <h4 className="text-2xl font-bold font-heading">{activeRes.vehicles?.name}</h4>
                            <p className="text-[#a1a1aa] font-semibold text-sm">{activeRes.agencies?.name} - {activeRes.total_price} DT</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#2b2b2b]">
                            <div>
                              <p className="text-xs text-[#a1a1aa] uppercase font-bold tracking-wider mb-1">Début</p>
                              <p className="font-semibold text-sm">{new Date(activeRes.start_date).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <p className="text-xs text-[#a1a1aa] uppercase font-bold tracking-wider mb-1">Retour Prévu</p>
                              <p className="font-semibold text-sm text-primary">{new Date(activeRes.end_date).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <button className="w-full py-3 mt-4 bg-[#2b2b2b] hover:bg-[#3f3f3f] text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
                            <MapPin className="w-5 h-5" /> Gérer cette réservation
                          </button>
                        </div>
                      </div>
                    </div>
                  </section>
                ) : (
                  <div className="bg-[#1c1b1b] rounded-2xl border border-[#2b2b2b] p-8 text-center">
                    <p className="text-[#a1a1aa]">Aucune réservation en cours.</p>
                  </div>
                )}

                {/* HISTORY */}
                <section className="bg-[#1c1b1b] rounded-2xl border border-[#2b2b2b] p-8">
                  <h3 className="text-xl font-heading font-bold mb-6 flex items-center gap-2">
                    <History className="w-5 h-5" /> Historique des Locations
                  </h3>
                  
                  <div className="space-y-4">
                    {historyRes.length > 0 ? historyRes.map((res: any) => (
                      <div key={res.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-[#2b2b2b] rounded-xl bg-[#0D0D0D]">
                        <div className="flex items-center gap-4 mb-4 sm:mb-0">
                          <img src={res.vehicles?.photo_urls?.[0]} className="w-12 h-12 bg-[#2b2b2b] rounded-lg object-cover" />
                          <div>
                            <p className="font-bold">{res.vehicles?.name}</p>
                            <p className="text-xs font-semibold text-[#a1a1aa]">{res.agencies?.name} • {new Date(res.start_date).toLocaleDateString()} - {new Date(res.end_date).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`flex items-center gap-1 text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full border ${res.status === 'completed' ? 'text-green-500 bg-green-500/10 border-green-500/20' : 'text-[#a1a1aa] bg-[#2b2b2b] border-[#3f3f3f]'}`}>
                            <CheckCircle2 className="w-3 h-3" /> {res.status}
                          </span>
                          <p className="font-bold font-heading">{res.total_price} DT</p>
                        </div>
                      </div>
                    )) : (
                      <p className="text-sm text-[#a1a1aa]">Aucun historique.</p>
                    )}
                  </div>
                </section>
              </>
            )}
          </div>
        </div>
      </main>

      {/* FLOATING AI CHAT WIDGET */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {chatOpen && (
          <div className="bg-[#1c1b1b] border border-[#2b2b2b] rounded-2xl w-[350px] shadow-2xl mb-4 overflow-hidden flex flex-col animate-in slide-in-from-bottom-5">
            {/* Header */}
            <div className="bg-primary p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                <h4 className="font-bold font-heading">Assistant IA kerhbaGo</h4>
              </div>
              <button onClick={() => setChatOpen(false)} className="hover:bg-black/20 p-1 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Messages Area */}
            <div className="h-[300px] bg-[#0D0D0D] p-4 overflow-y-auto space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl p-3 text-sm ${msg.role === 'user' ? 'bg-[#2b2b2b] text-white rounded-tr-sm' : 'bg-primary/10 text-primary border border-primary/20 rounded-tl-sm'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Suggestions */}
            {messages[messages.length - 1]?.role === 'bot' && (
              <div className="px-4 py-2 bg-[#0D0D0D] flex gap-2 overflow-x-auto hide-scrollbar border-t border-[#2b2b2b]">
                {["Modifier ma réservation", "Prolonger (+2j)", "Annuler"].map((sug) => (
                  <button key={sug} onClick={() => handleSendMessage(sug)} className="text-xs font-bold uppercase tracking-wider text-[#a1a1aa] bg-[#1c1b1b] px-3 py-1.5 rounded-full whitespace-nowrap hover:bg-[#2b2b2b] border border-[#2b2b2b] transition-colors">
                    {sug}
                  </button>
                ))}
              </div>
            )}

            {/* Input Form */}
            <div className="p-3 border-t border-[#2b2b2b] bg-[#1c1b1b] flex items-center gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(input)}
                placeholder="Posez votre question..."
                className="flex-1 bg-[#0D0D0D] border border-[#2b2b2b] rounded-full px-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors text-white"
              />
              <button 
                onClick={() => handleSendMessage(input)}
                className="bg-primary text-white p-2 rounded-full hover:bg-[#a73a00] transition-colors disabled:opacity-50"
                disabled={!input.trim()}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* FAB Button */}
        <button 
          onClick={() => setChatOpen(!chatOpen)}
          className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${chatOpen ? 'bg-[#2b2b2b] text-white hover:scale-105' : 'bg-primary text-white hover:scale-110'}`}
        >
          {chatOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        </button>
      </div>
    </div>
  );
}
