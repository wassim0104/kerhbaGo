"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, ArrowRight, Loader2, KeyRound, Mail, User } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        router.push("/espace-client");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName, phone: phone }
          }
        });
        if (error) throw error;
        router.push("/espace-client");
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      setErrorMsg(err.message || "Une erreur inattendue s'est produite.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Left Banner */}
      <div className="hidden md:flex flex-col flex-1 bg-[#1c1b1b] relative overflow-hidden border-r border-[#2b2b2b]">
        <img 
          src="https://images.unsplash.com/photo-1611016186353-9af58c69a533?auto=format&fit=crop&q=80" 
          alt="Luxury Car Steering Wheel" 
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        <div className="relative z-10 p-12 mt-auto">
          <Link href="/" className="text-4xl font-heading font-extrabold tracking-tighter text-primary mb-6 inline-block">
            kerhbaGo
          </Link>
          <h1 className="text-4xl font-heading font-bold text-white mb-4">
            Prenez la route de l'excellence.
          </h1>
          <p className="text-[#a1a1aa] font-semibold max-w-sm">
            Rejoignez notre réseau exclusif et accédez à une flotte haut de gamme partout en Tunisie avec suivi GPS intelligent.
          </p>
        </div>
      </div>

      {/* Right Form Area */}
      <div className="flex-1 flex flex-col justify-center items-center py-12 px-6">
        <div className="w-full max-w-md">
          <div className="md:hidden mb-12 text-center">
            <Link href="/" className="text-4xl font-heading font-extrabold tracking-tighter text-primary">
              kerhbaGo
            </Link>
          </div>

          <h2 className="text-3xl font-heading font-bold mb-2">
            {isLogin ? "Connexion" : "Créer un compte"}
          </h2>
          <p className="text-[#a1a1aa] font-semibold text-sm mb-8">
            {isLogin ? "Heureux de vous revoir sur la route." : "Complétez vos informations pour réserver votre premier véhicule."}
          </p>

          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl text-sm font-semibold mb-6">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-5">
            {!isLogin && (
              <>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#5f5e5e]">Nom Complet</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5f5e5e]" />
                    <input 
                      type="text" 
                      required
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      className="w-full bg-[#1c1b1b] border border-[#2b2b2b] rounded-xl pl-12 pr-4 py-4 outline-none focus:border-primary text-white transition-colors" 
                      placeholder="Ex: Ahmed Ben Ali"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#5f5e5e]">Téléphone</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5f5e5e]" />
                    <input 
                      type="tel" 
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full bg-[#1c1b1b] border border-[#2b2b2b] rounded-xl pl-12 pr-4 py-4 outline-none focus:border-primary text-white transition-colors" 
                      placeholder="Ex: 55 123 456"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#5f5e5e]">Adresse Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5f5e5e]" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-[#1c1b1b] border border-[#2b2b2b] rounded-xl pl-12 pr-4 py-4 outline-none focus:border-primary text-white transition-colors" 
                  placeholder="ahmed@exemple.com"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#5f5e5e]">Mot de Passe</label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5f5e5e]" />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-[#1c1b1b] border border-[#2b2b2b] rounded-xl pl-12 pr-4 py-4 outline-none focus:border-primary text-white transition-colors" 
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary text-white font-bold uppercase py-4 rounded-xl hover:bg-[#a73a00] transition-colors flex items-center justify-center gap-2 mt-4 disabled:opacity-70"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>{isLogin ? "Se connecter" : "S'inscrire"} <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => { setIsLogin(!isLogin); setErrorMsg(""); }} 
              className="text-sm font-bold text-[#a1a1aa] hover:text-white transition-colors"
            >
              {isLogin ? "Pas de compte ? Inscrivez-vous" : "Déjà un compte ? Connectez-vous"}
            </button>
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/" className="inline-flex items-center justify-center text-xs font-bold text-[#5f5e5e] hover:text-white uppercase tracking-wider gap-2 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Retour au site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
