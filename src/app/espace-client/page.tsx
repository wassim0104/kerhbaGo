"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { User, MapPin, Navigation, History, Shield, MessageSquare, X, Send, Bot, CheckCircle2 } from "lucide-react";

export default function ClientSpacePage() {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    { role: 'bot', text: "Bonjour Ahmed! Comment puis-je vous aider avec votre location ?" }
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, chatOpen]);

  // Mock send message
  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text }]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'bot', text: "L'IA n8n est connectée à l'API. Je traiterai cette demande: '" + text + "'" }]);
    }, 1000);
  };

  const TRUST_SCORE = 88;
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500 stroke-green-500';
    if (score >= 60) return 'text-primary stroke-primary';
    return 'text-red-500 stroke-red-500';
  };

  return (
    <div className="min-h-screen bg-background relative pb-20 md:pb-0">
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-[#0D0D0D]/90 backdrop-blur-md border-b border-[#2b2b2b]">
        <div className="container flex items-center justify-between h-20">
          <Link href="/" className="text-3xl font-heading font-extrabold tracking-tighter text-primary">
            kerhbaGo
          </Link>
          <div className="flex gap-4 items-center">
            <button className="flex items-center gap-2 text-sm font-semibold hover:text-primary transition-colors">
              <User className="w-5 h-5 mx-auto" /> <span>Mon Profil</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* PROFILE & TRUST SCORE (Sidebar) */}
          <aside className="space-y-8">
            <div className="bg-[#1c1b1b] rounded-2xl p-8 border border-[#2b2b2b] text-center">
              <div className="w-24 h-24 bg-[#2b2b2b] rounded-full mx-auto mb-4 flex items-center justify-center">
                <User className="w-12 h-12 text-[#5f5e5e]" />
              </div>
              <h2 className="text-2xl font-heading font-bold mb-1">Ahmed Ben Ali</h2>
              <p className="text-sm text-[#a1a1aa] mb-8">Membre depuis 2024</p>
              
              <div className="relative w-40 h-40 mx-auto mb-4 flex items-center justify-center">
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
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#a1a1aa]">Score IA</span>
                </div>
              </div>
              <p className="text-sm font-semibold mt-2">Niveau: <span className={getScoreColor(TRUST_SCORE).split(' ')[0]}>Bon</span></p>
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <div className="col-span-1 lg:col-span-2 space-y-8">
            
            {/* ACTIVE RESERVATION */}
            <section className="bg-[#1c1b1b] rounded-2xl overflow-hidden border border-primary/30 relative">
              <div className="absolute top-0 right-0 p-4">
                 <span className="bg-primary/10 text-primary text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full border border-primary/20">
                    En Cours
                 </span>
              </div>
              <div className="p-8">
                <h3 className="text-xl font-heading font-bold mb-6 flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-primary" /> Location Actuelle
                </h3>
                
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                  <div className="w-full md:w-1/3 aspect-[4/3] bg-[#2b2b2b] rounded-xl overflow-hidden shadow-lg">
                    <img 
                      src="https://images.unsplash.com/photo-1594498305007-8ec7e7428f52?auto=format&fit=crop&q=80" 
                      alt="Range Rover Evoque"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 w-full space-y-4">
                    <div>
                      <h4 className="text-2xl font-bold font-heading">Range Rover Evoque</h4>
                      <p className="text-[#a1a1aa] font-semibold text-sm">Luxury Cars Agency - Aéroport Tunis</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#2b2b2b]">
                      <div>
                        <p className="text-xs text-[#a1a1aa] uppercase font-bold tracking-wider mb-1">Début</p>
                        <p className="font-semibold text-sm">24 Oct, 10:00</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#a1a1aa] uppercase font-bold tracking-wider mb-1">Retour Prévu</p>
                        <p className="font-semibold text-sm text-primary">30 Oct, 18:00</p>
                      </div>
                    </div>
                    <button className="w-full py-3 mt-4 bg-[#2b2b2b] hover:bg-[#3f3f3f] text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
                      <MapPin className="w-5 h-5" /> Suivre au GPS en Temps Réel
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* HISTORY */}
            <section className="bg-[#1c1b1b] rounded-2xl border border-[#2b2b2b] p-8">
              <h3 className="text-xl font-heading font-bold mb-6 flex items-center gap-2">
                <History className="w-5 h-5" /> Historique des Locations
              </h3>
              
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-[#2b2b2b] rounded-xl bg-[#0D0D0D]">
                    <div className="flex items-center gap-4 mb-4 sm:mb-0">
                      <div className="w-12 h-12 bg-[#2b2b2b] rounded-lg"></div>
                      <div>
                        <p className="font-bold">Volkswagen Golf 8</p>
                        <p className="text-xs font-semibold text-[#a1a1aa]">AutoGo • 12 Sep - 15 Sep</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <span className="flex items-center gap-1 text-xs uppercase font-bold tracking-wider text-green-500 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                         <CheckCircle2 className="w-3 h-3" /> Terminé
                       </span>
                       <p className="font-bold font-heading">540 DT</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
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
