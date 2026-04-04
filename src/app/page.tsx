"use client";

import React, { useState } from "react";
import { Search, MapPin, Calendar, Car, ChevronRight, Menu, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Homepage() {
  const router = useRouter();
  const [city, setCity] = useState("Tunis");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [category, setCategory] = useState("Tous Modèles");

  const cityImages: Record<string, string> = {
    "Tunis": "https://images.unsplash.com/photo-1597204998782-bdfdfa7dcdfc?auto=format&fit=crop&q=80",
    "Sfax": "https://upload.wikimedia.org/wikipedia/commons/8/83/Sfax%2Cfa%C3%A7ades_de_l%E2%80%99immeuble.jpg",
    "Sousse": "https://images.unsplash.com/photo-1628186105307-e8f001556094?auto=format&fit=crop&q=80",
    "Monastir": "https://images.unsplash.com/photo-1647477810304-45e05459f270?auto=format&fit=crop&q=80",
    "Djerba": "https://images.unsplash.com/photo-1601666497184-e91054ceb8b5?auto=format&fit=crop&q=80"
  };

  // Restrictions de date: Aujourd'hui au mois prochain (approx 30 jours)
  const todayDate = new Date();
  const minDate = todayDate.toISOString().split("T")[0];
  const maxDateObj = new Date(todayDate);
  maxDateObj.setMonth(maxDateObj.getMonth() + 1);
  const maxDate = maxDateObj.toISOString().split("T")[0];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/voitures?city=${encodeURIComponent(city)}&startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}&category=${encodeURIComponent(category)}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-[#0D0D0D]/90 backdrop-blur-md border-b border-[#2b2b2b]">
        <div className="container flex items-center justify-between h-20">
          <Link href="/" className="text-3xl font-heading font-extrabold tracking-tighter text-primary">
            kerhbaGo
          </Link>
          <nav className="hidden md:flex gap-8">
            <Link href="/voitures" className="text-sm font-semibold hover:text-primary transition-colors">Véhicules</Link>
            <Link href="/agences" className="text-sm font-semibold hover:text-primary transition-colors">Agences</Link>
            <Link href="/offres" className="text-sm font-semibold hover:text-primary transition-colors">Offres</Link>
          </nav>
          <div className="flex gap-4 items-center">
            <button className="hidden md:flex items-center gap-2 text-sm font-semibold hover:text-primary transition-colors">
              <User className="w-5 h-5" />
              <span>Compte</span>
            </button>
            <button className="md:hidden">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80" 
            alt="Tunisian Coastal Road" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-black/30" />
        </div>

        {/* Hero Content */}
        <div className="container relative z-10 w-full pt-10">
          <h1 className="display-lg mb-8 text-center drop-shadow-lg">
            LA ROUTE <span className="text-primary">PREMIUM.</span>
          </h1>

          {/* Search Widget */}
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto bg-surface text-[#1c1b1b] p-4 lg:p-6 rounded-xl shadow-2xl flex flex-col md:flex-row gap-4 md:items-end">
            <div className="flex-1 w-full relative">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5f5e5e] mb-2">Ville de retrait</label>
              <div className="flex items-center border-b-2 border-transparent focus-within:border-primary pb-2 transition-colors">
                <MapPin className="w-5 h-5 text-primary mr-2" />
                <select 
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  className="w-full bg-transparent outline-none font-semibold text-lg cursor-pointer appearance-none"
                >
                  <option value="Tunis">Tunis</option>
                  <option value="Sfax">Sfax</option>
                  <option value="Sousse">Sousse</option>
                  <option value="Djerba">Djerba</option>
                </select>
              </div>
            </div>
            <div className="flex-[1.5] w-full relative">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5f5e5e] mb-2">Dates (Début - Fin)</label>
              <div className="flex items-center gap-2 border-b-2 border-transparent focus-within:border-primary pb-2 transition-colors">
                <Calendar className="w-5 h-5 text-primary shrink-0" />
                <input 
                  type="date" 
                  min={minDate}
                  max={maxDate}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  onClick={(e) => e.currentTarget.showPicker()}
                  required
                  className="w-full bg-transparent outline-none font-semibold text-sm uppercase cursor-pointer"
                />
                <span className="text-[#a1a1aa]">-</span>
                <input 
                  type="date" 
                  min={startDate || minDate}
                  max={maxDate}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  onClick={(e) => e.currentTarget.showPicker()}
                  required
                  className="w-full bg-transparent outline-none font-semibold text-sm uppercase cursor-pointer"
                />
              </div>
            </div>
            <div className="flex-1 w-full relative">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5f5e5e] mb-2">Catégorie</label>
              <div className="flex items-center border-b-2 border-transparent focus-within:border-primary pb-2 transition-colors">
                <Car className="w-5 h-5 text-primary mr-2" />
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-transparent outline-none font-semibold text-lg cursor-pointer appearance-none"
                >
                  <option value="Tous Modèles">Tous Modèles</option>
                  <option value="Citadine">Citadine</option>
                  <option value="Compacte">Compacte</option>
                  <option value="Berline">Berline</option>
                  <option value="SUV">SUV</option>
                  <option value="Luxe">Luxe</option>
                </select>
              </div>
            </div>
            <button 
              type="submit"
              className="btn-primary flex items-center justify-center gap-2 mt-4 md:mt-0 whitespace-nowrap"
            >
              Rechercher <ChevronRight className="w-5 h-5" />
            </button>
          </form>
        </div>
      </section>

      {/* VALUE PROP SECTION */}
      <section className="py-24 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#1c1b1b] border border-[#2b2b2b] p-8 rounded-xl hover:-translate-y-2 transition-transform duration-300">
              <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center mb-6">
                <span className="text-primary text-2xl font-bold">DT</span>
              </div>
              <h3 className="text-2xl font-heading font-bold mb-4">Prix dynamiques</h3>
              <p className="text-[#a1a1aa] leading-relaxed">
                Notre intelligence artificielle ajuste les tarifs en temps réel pour vous garantir le meilleur rapport qualité-prix.
              </p>
            </div>
            <div className="bg-[#1c1b1b] border border-[#2b2b2b] p-8 rounded-xl hover:-translate-y-2 transition-transform duration-300">
              <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center mb-6">
                <Car className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-heading font-bold mb-4">Location en 3 clics</h3>
              <p className="text-[#a1a1aa] leading-relaxed">
                Recherchez, choisissez et réservez instantanément votre véhicule. Fini la paperasse interminable.
              </p>
            </div>
            <div className="bg-[#1c1b1b] border border-[#2b2b2b] p-8 rounded-xl hover:-translate-y-2 transition-transform duration-300">
              <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center mb-6">
                <User className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-heading font-bold mb-4">IA Concierge 24/7</h3>
              <p className="text-[#a1a1aa] leading-relaxed">
                Une assistance personnalisée pour répondre à toutes vos demandes de jour comme de nuit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CITIES CAROUSEL SECTION */}
      <section className="py-20 bg-surface text-[#1c1b1b]">
        <div className="container">
          <h2 className="display-md mb-12">Destinations <br/><span className="text-primary">Populaires.</span></h2>
          <div className="flex overflow-x-auto pb-8 gap-6 hide-scrollbar snap-x">
            {["Tunis", "Sfax", "Sousse", "Monastir", "Djerba"].map((city) => (
              <Link href={`/agences?city=${encodeURIComponent(city)}`} key={city} className="min-w-[280px] md:min-w-[320px] aspect-[4/5] relative rounded-2xl overflow-hidden snap-center group cursor-pointer block">
                <img 
                  src={cityImages[city]}
                  alt={city}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <h4 className="text-3xl font-heading font-bold text-white">{city}</h4>
                  <p className="text-primary font-bold mt-2 flex items-center gap-1">Voir les agences <ChevronRight className="w-4 h-4" /></p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0D0D0D] py-16 border-t border-[#2b2b2b]">
        <div className="container grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <h2 className="text-3xl font-heading font-extrabold tracking-tighter text-primary mb-4">kerhbaGo</h2>
            <p className="text-[#a1a1aa] text-sm leading-relaxed">
              La plateforme tunisienne de location de voiture intelligente. Design premium, algorithmes de pointe.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4 uppercase tracking-wider text-xs text-[#5f5e5e]">Découvrir</h4>
            <ul className="space-y-3 text-sm text-[#F4F4F2]">
              <li><Link href="/" className="hover:text-primary transition-colors">Notre flotte</Link></li>
              <li><Link href="/" className="hover:text-primary transition-colors">Agences partenaires</Link></li>
              <li><Link href="/" className="hover:text-primary transition-colors">Tarification IA</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 uppercase tracking-wider text-xs text-[#5f5e5e]">Légal</h4>
            <ul className="space-y-3 text-sm text-[#F4F4F2]">
              <li><Link href="/" className="hover:text-primary transition-colors">Conditions générales</Link></li>
              <li><Link href="/" className="hover:text-primary transition-colors">Politique de confidentialité</Link></li>
              <li><Link href="/" className="hover:text-primary transition-colors">Remboursements</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 uppercase tracking-wider text-xs text-[#5f5e5e]">Abonnez-vous</h4>
            <p className="text-[#a1a1aa] text-sm mb-4">Recevez nos offres exclusives.</p>
            <div className="flex border-b-2 border-[#2b2b2b] pb-2 focus-within:border-primary transition-colors">
              <input type="email" placeholder="Votre email" className="bg-transparent outline-none w-full text-sm" />
              <button><ChevronRight className="text-primary w-5 h-5" /></button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
