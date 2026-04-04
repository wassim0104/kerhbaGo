"use client";

import React, { useState, Suspense, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, MapPin, Calendar, Car, SlidersHorizontal, Map, ChevronDown, Check, Star, ShieldAlert, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

function CatalogueContent() {
  const searchParams = useSearchParams();
  const searchCity = searchParams.get("city") || "Tunis";
  const searchAgency = searchParams.get("agency");
  
  const rawStart = searchParams.get("startDate");
  const rawEnd = searchParams.get("endDate");
  const searchDate = (rawStart && rawEnd) 
    ? `${new Date(rawStart).toLocaleDateString('fr-FR', {day: 'numeric', month: 'short'})} - ${new Date(rawEnd).toLocaleDateString('fr-FR', {day: 'numeric', month: 'short'})}`
    : "24 Oct - 30 Oct";

  const searchCategory = searchParams.get("category") || "Tous Modèles";

  const [priceRange, setPriceRange] = useState(600);
  const [selectedCategory, setSelectedCategory] = useState(searchCategory);
  
  // Supabase State
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVehicles() {
      setLoading(true);
      // Fetch vehicles and join agency data
      const { data, error } = await supabase
        .from('vehicles')
        .select(`
          *,
          agencies:agency_id (name, rating, city)
        `)
        .eq('status', 'available');

      if (error) {
        console.error("Error fetching vehicles:", error);
      } else if (data) {
        setVehicles(data);
      }
      setLoading(false);
    }
    fetchVehicles();
  }, []);

  const filteredCars = vehicles.filter(c => {
    let match = c.base_price <= priceRange && 
                (selectedCategory === "Tous Modèles" || c.category === selectedCategory);
                
    if (searchAgency) {
      match = match && c.agency_id === searchAgency;
    } else {
      match = match && c.agencies?.city === searchCity;
    }
    
    return match;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* HEADER (Reusing from homepage for now, should be abstracted) */}
      <header className="sticky top-0 z-50 bg-[#0D0D0D]/90 backdrop-blur-md border-b border-[#2b2b2b]">
        <div className="container flex items-center justify-between h-20">
          <Link href="/" className="text-3xl font-heading font-extrabold tracking-tighter text-primary">
            kerhbaGo
          </Link>
          <div className="flex bg-[#1c1b1b] rounded-full p-2 items-center text-sm border border-[#2b2b2b]">
            <span className="px-4 font-semibold hidden md:block">{searchCity}</span>
            <span className="px-4 border-l border-[#2b2b2b] hidden md:block text-[#a1a1aa]">{searchDate}</span>
            <button className="bg-primary text-white rounded-full p-2 ml-2 hover:bg-[#a73a00] transition-colors">
              <Search className="w-4 h-4" />
            </button>
          </div>
          <button className="hidden md:flex items-center gap-2 text-sm font-semibold hover:text-primary transition-colors">
            Mon Espace
          </button>
        </div>
      </header>

      {/* SUB-HEADER / SORT BAR */}
      <div className="bg-[#1c1b1b] border-b border-[#2b2b2b] sticky top-20 z-40">
        <div className="container py-4 flex items-center justify-between">
          <p className="text-sm font-semibold">{loading ? '...' : filteredCars.length} véhicules disponibles</p>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-sm text-[#F4F4F2] hover:text-primary font-semibold transition-colors">
              Trier par: Recommandé <ChevronDown className="w-4 h-4" />
            </button>
            <button className="flex items-center gap-2 text-sm bg-[#2b2b2b] hover:bg-[#3f3f3f] px-4 py-2 rounded-full font-semibold transition-colors">
              <Map className="w-4 h-4" /> Carte
            </button>
          </div>
        </div>
      </div>

      <div className="container py-8 flex flex-col md:flex-row gap-8 items-start">
        {/* STICKY SIDEBAR FILTERS */}
        <aside className="w-full md:w-64 shrink-0 md:sticky md:top-40 space-y-8 bg-[#0D0D0D]">
          
          <div>
            <h3 className="text-xs uppercase tracking-widest text-[#5f5e5e] font-bold mb-4 font-sans flex items-center justify-between">
              Filtres <SlidersHorizontal className="w-4 h-4" />
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold mb-2 block">Prix maximum: {priceRange} DT/jour</label>
                <input 
                  type="range" min="50" max="1000" step="50" 
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-3">Catégorie</h4>
            <div className="space-y-2">
              {['Tous Modèles', 'Citadine', 'Compacte', 'Berline', 'SUV', 'Luxe'].map((cat) => (
                <label key={cat} onClick={() => setSelectedCategory(cat)} className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                    selectedCategory === cat ? 'bg-primary border-primary' : 'border-[#2b2b2b] bg-[#1c1b1b] group-hover:border-primary'
                  }`}>
                    <Check className={`w-3 h-3 ${selectedCategory === cat ? 'text-white' : 'text-transparent group-hover:text-white/20'}`} />
                  </div>
                  <span className={`text-sm ${selectedCategory === cat ? 'text-[#F4F4F2] font-semibold' : 'text-[#a1a1aa] group-hover:text-[#F4F4F2]'}`}>
                    {cat}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* CAR GRID */}
        <main className="flex-1 w-full">
          {loading ? (
            <div className="py-20 text-center flex flex-col items-center justify-center min-h-[400px]">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <h3 className="text-xl font-heading font-bold text-white mb-2">Recherche de véhicules...</h3>
              <p className="text-[#a1a1aa]">Connexion à la base de données en cours</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredCars.length > 0 ? filteredCars.map(car => (
                <div key={car.id} className="bg-[#1c1b1b] rounded-2xl overflow-hidden border border-[#2b2b2b] group hover:border-[#3f3f3f] transition-all flex flex-col relative">
                  
                  {/* Dynamic Pricing AI Badge */}
                  {car.current_price > car.base_price * 1.05 && (
                    <div className="absolute top-4 left-4 z-10 bg-primary text-white text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg backdrop-blur-md">
                      <ShieldAlert className="w-3 h-3" /> Demande Élevée
                    </div>
                  )}

                  {/* Status Dot */}
                  <div className="absolute top-4 right-4 z-10 bg-[#1c1b1b]/80 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-[#2b2b2b]">
                    <div className={`w-2 h-2 rounded-full ${car.status === 'available' ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
                    <span className="text-[10px] uppercase font-bold tracking-wider text-white">
                      {car.status === 'available' ? 'Disponible' : 'Indisponible'}
                    </span>
                  </div>

                  {/* Car Image */}
                  <div className="w-full aspect-[16/10] overflow-hidden bg-[#2b2b2b]">
                    <img 
                      src={car.photo_urls?.[0] || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341'} 
                      alt={car.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-xs text-[#a1a1aa] uppercase tracking-wider font-semibold">{car.category}</span>
                        <h3 className="text-xl font-heading font-bold text-white mt-1">{car.name}</h3>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold font-heading text-primary">{Math.round(car.base_price)}</span>
                        <span className="text-sm text-[#a1a1aa]"> DT/j</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-[#a1a1aa] mb-6 font-semibold">
                      <span className="capitalize">{car.transmission}</span>
                      <span className="w-1 h-1 bg-[#2b2b2b] rounded-full"></span>
                      <span>{car.seats} Places</span>
                      <span className="w-1 h-1 bg-[#2b2b2b] rounded-full"></span>
                      <span className="flex items-center text-[#F4F4F2]"><Star className="w-4 h-4 text-yellow-500 mr-1 fill-yellow-500" /> {car.agencies?.rating || "N/A"}</span>
                    </div>

                    <div className="mt-auto pt-5 border-t border-[#2b2b2b] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#2b2b2b] flex items-center justify-center font-bold text-xs uppercase">
                          {car.agencies?.name?.charAt(0) || "A"}
                        </div>
                        <span className="text-sm font-semibold">{car.agencies?.name || "Agence inconnue"}</span>
                      </div>
                      <Link 
                        href={`/voitures/${car.id}`}
                        className={`px-6 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors inline-block text-center ${
                          car.status === 'available' ? 'bg-primary text-white hover:bg-[#a73a00]' : 'bg-[#2b2b2b] text-[#5f5e5e] pointer-events-none'
                        }`}
                      >
                        {car.status === 'available' ? 'Réserver' : 'Indisponible'}
                      </Link>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="col-span-1 lg:col-span-2 py-20 text-center flex flex-col items-center">
                  <Car className="w-16 h-16 text-[#2b2b2b] mb-4" />
                  <h3 className="text-2xl font-heading font-bold text-white mb-2">Aucun véhicule trouvé</h3>
                  <p className="text-[#a1a1aa]">Aucun véhicule ne correspond à vos filtres sur {searchCity}.</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function CataloguePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-primary">
        <Car className="w-8 h-8 animate-bounce mb-4" />
        <p className="font-heading font-bold animate-pulse">Chargement kerhbaGo...</p>
      </div>
    }>
      <CatalogueContent />
    </Suspense>
  );
}
