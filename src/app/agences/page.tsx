"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { MapPin, Star, Building2, ChevronRight, User, Menu } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useSearchParams } from "next/navigation";

function AgenciesContent() {
  const searchParams = useSearchParams();
  const searchCity = searchParams?.get("city");

  const [agencies, setAgencies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAgencies() {
      const { data, error } = await supabase.from("agencies").select("*");
      if (!error && data) {
        setAgencies(data);
      }
      setLoading(false);
    }
    fetchAgencies();
  }, []);

  const filteredAgencies = searchCity 
    ? agencies.filter(a => a.city === searchCity) 
    : agencies;

  return (
    <div className="container py-16 text-center">
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : filteredAgencies.length === 0 ? (
        <div className="py-20 text-center">
          <h3 className="text-2xl font-bold font-heading mb-4">Aucune agence trouvée {searchCity ? `à ${searchCity}` : ''}.</h3>
          <p className="text-[#a1a1aa] mb-8">Nous n'avons pas encore de partenaire dans cette ville.</p>
          <Link href="/agences" className="bg-primary text-black font-bold py-3 px-8 rounded-full hover:bg-white transition-colors inline-block">Voir toutes les agences</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
          {filteredAgencies.map((agency) => (
            <div key={agency.id} className="bg-[#1c1b1b] border border-[#2b2b2b] rounded-xl overflow-hidden hover:border-primary transition-colors group">
              <div className="h-48 bg-[#0D0D0D] flex items-center justify-center relative overflow-hidden">
                {agency.photo_url ? (
                  <img 
                    src={agency.photo_url} 
                    alt={agency.name} 
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <Building2 className="w-16 h-16 text-[#5f5e5e] group-hover:text-primary transition-colors relative z-10" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1c1b1b] to-transparent opacity-80" />
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold font-heading">{agency.name}</h3>
                  <div className="flex items-center bg-[#2b2b2b] px-2 py-1 rounded text-xs">
                    <Star className="w-3 h-3 text-[#ffb000] mr-1" fill="#ffb000" />
                    {agency.rating?.toFixed(1) || "4.8"}
                  </div>
                </div>
                <div className="flex items-center text-[#a1a1aa] text-sm mb-4">
                  <MapPin className="w-4 h-4 mr-1 text-primary" />
                  {agency.city} — {agency.address}
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/voitures?agency=${agency.id}&city=${encodeURIComponent(agency.city)}`}
                    className="flex-1 text-center bg-[#2b2b2b] hover:bg-primary text-white py-2 rounded-lg font-semibold text-sm transition-colors flex justify-center items-center gap-1"
                  >
                    Voir les véhicules <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AgencesPage() {
  return (
    <div className="min-h-screen bg-background text-[#F4F4F2]">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-[#0D0D0D]/90 backdrop-blur-md border-b border-[#2b2b2b]">
        <div className="container flex items-center justify-between h-20">
          <Link href="/" className="text-3xl font-heading font-extrabold tracking-tighter text-primary">
            kerhbaGo
          </Link>
          <nav className="hidden md:flex gap-8">
            <Link href="/voitures" className="text-sm font-semibold hover:text-primary transition-colors">Véhicules</Link>
            <Link href="/agences" className="text-sm font-semibold text-primary transition-colors">Agences</Link>
            <Link href="/offres" className="text-sm font-semibold hover:text-primary transition-colors">Offres</Link>
          </nav>
          <div className="flex gap-4 items-center">
            <Link href="/espace-client" className="hidden md:flex items-center gap-2 text-sm font-semibold hover:text-primary transition-colors">
              <User className="w-5 h-5" />
              <span>Compte</span>
            </Link>
            <button className="md:hidden">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <div className="bg-[#1c1b1b] border-b border-[#2b2b2b]">
        <div className="container py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-black tracking-tight mb-4 uppercase">
            Nos <span className="text-primary">Agences</span>
          </h1>
          <p className="text-[#a1a1aa] max-w-2xl mx-auto">
            Découvrez notre réseau d'agences partenaires premium réparties dans toute la Tunisie. Louez la voiture idéale où que vous soyez.
          </p>
        </div>
      </div>

      <Suspense fallback={<div className="py-20 text-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div></div>}>
        <AgenciesContent />
      </Suspense>
    </div>
  );
}
