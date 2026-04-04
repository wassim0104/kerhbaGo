"use client";

import React from "react";
import Link from "next/link";
import { User, Menu, Tag, Calendar, Zap, ChevronRight, CheckCircle2 } from "lucide-react";

export default function OffresPage() {
  const offers = [
    {
      id: "weekend",
      title: "Évasion Weekend",
      description: "Profitez de nos tarifs réduits du vendredi midi au lundi matin.",
      icon: <Calendar className="w-10 h-10 text-primary" />,
      benefits: ["-15% sur les SUV", "Kilométrage illimité", "Assurance premium incluse"],
      price: "À partir de 120 TND / jour",
      highlight: false
    },
    {
      id: "long-term",
      title: "Location Longue Durée",
      description: "La solution idéale pour vos besoins professionnels ou personnels sur plus de 30 jours.",
      icon: <Zap className="w-10 h-10 text-[#F4F4F2]" />,
      benefits: ["Entretien inclus", "Véhicule de remplacement", "Flexibilité totale"],
      price: "Sur devis",
      highlight: true
    },
    {
      id: "early-bird",
      title: "Early Bird Promo",
      description: "Réservez 30 jours à l'avance et bénéficiez de réductions exclusives.",
      icon: <Tag className="w-10 h-10 text-primary" />,
      benefits: ["-20% sur la facture totale", "Annulation gratuite", "Surclassement garanti"],
      price: "-20% immédiat",
      highlight: false
    }
  ];

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
            <Link href="/agences" className="text-sm font-semibold hover:text-primary transition-colors">Agences</Link>
            <Link href="/offres" className="text-sm font-semibold text-primary transition-colors">Offres</Link>
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
      <div className="bg-[#1c1b1b] border-b border-[#2b2b2b] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/10 to-transparent pointer-events-none" />
        <div className="container py-20 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-heading font-black tracking-tight mb-4 uppercase">
            Nos <span className="text-primary">Offres</span> Exclusives
          </h1>
          <p className="text-[#a1a1aa] max-w-2xl mx-auto text-lg hover:text-white transition-colors">
            Découvrez nos forfaits pensés pour s'adapter à toutes vos envies de mobilité, que ce soit pour le weekend ou pour le mois entier.
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="container py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {offers.map((offer) => (
            <div 
              key={offer.id} 
              className={`border rounded-2xl p-8 flex flex-col transition-transform hover:-translate-y-2 ${
                offer.highlight 
                  ? "bg-primary border-primary text-white shadow-2xl shadow-primary/20" 
                  : "bg-[#1c1b1b] border-[#2b2b2b] hover:border-primary"
              }`}
            >
              <div className="mb-6">{offer.icon}</div>
              <h3 className="text-2xl font-bold font-heading mb-3">{offer.title}</h3>
              <p className={`mb-8 ${offer.highlight ? "text-white/80" : "text-[#a1a1aa]"}`}>
                {offer.description}
              </p>
              
              <div className="flex-1">
                <ul className="space-y-4 mb-8">
                  {offer.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className={`w-5 h-5 shrink-0 ${offer.highlight ? "text-white" : "text-primary"}`} />
                      <span className="text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto pt-6 border-t border-white/10">
                <p className="text-xl font-bold mb-4">{offer.price}</p>
                <Link
                  href="/voitures"
                  className={`w-full py-3 rounded-xl font-bold flex justify-center items-center gap-2 transition-all ${
                    offer.highlight
                      ? "bg-white text-primary hover:bg-[#F4F4F2]"
                      : "bg-[#2b2b2b] text-white hover:bg-primary"
                  }`}
                >
                  Profiter de l'offre <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
