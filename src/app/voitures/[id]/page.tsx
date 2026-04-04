"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { 
  Loader2, ArrowLeft, Star, MapPin, Calendar, 
  Settings, Users, Fuel, ArrowRight, ShieldCheck, 
  CheckCircle2, CreditCard
} from "lucide-react";

export default function CarDetailPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Booking State
  const initialStartDate = searchParams.get("startDate") || "";
  const initialEndDate = searchParams.get("endDate") || "";
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);

  useEffect(() => {
    async function fetchVehicle() {
      if (!id) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('vehicles')
        .select(`
          *,
          agencies:agency_id (name, rating, city, address)
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error("Error fetching vehicle:", error);
      } else {
        setVehicle(data);
      }
      setLoading(false);
    }
    fetchVehicle();
  }, [id]);

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const currentDays = calculateDays();
  const totalPrice = vehicle ? currentDays * vehicle.base_price : 0;
  const deposit = vehicle ? Math.round(vehicle.base_price * 10) : 0; // standard 10x deposit

  const handleBookingStart = () => {
    // Navigate to booking flow passing data in URL or using a global store
    if (!startDate || !endDate) {
      alert("Veuillez sélectionner vos dates d'abord.");
      return;
    }
    router.push(`/reservation?vehicleId=${id}&startDate=${startDate}&endDate=${endDate}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <h3 className="text-xl font-heading font-bold text-white mb-2">Chargement du véhicule...</h3>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <h3 className="text-2xl font-heading font-bold text-white mb-4">Véhicule non trouvé</h3>
        <Link href="/voitures" className="text-primary hover:underline font-bold">Retour au catalogue</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-[#0D0D0D]/90 backdrop-blur-md border-b border-[#2b2b2b]">
        <div className="container flex items-center h-20">
          <button onClick={() => router.back()} className="mr-6 text-white hover:text-primary transition-colors flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" /> <span className="font-bold hidden sm:inline">Retour</span>
          </button>
          <Link href="/" className="text-3xl font-heading font-extrabold tracking-tighter text-primary mr-auto">
            kerhbaGo
          </Link>
        </div>
      </header>

      <div className="container mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* LEFT COLUMN: Gallery & Specs */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* Header Info */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 text-sm font-bold text-[#a1a1aa] uppercase tracking-wider">
              <span>{vehicle.category}</span>
              <span className="w-1 h-1 rounded-full bg-[#5f5e5e]"></span>
              <span className="flex items-center text-white">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
                {vehicle.agencies?.rating}
              </span>
            </div>
            <h1 className="display-lg leading-tight">{vehicle.name}</h1>
          </div>

          {/* Hero Gallery */}
          <div className="w-full aspect-[21/9] bg-[#1c1b1b] rounded-2xl overflow-hidden border border-[#2b2b2b]">
            <img 
              src={vehicle.photo_urls?.[0] || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341'} 
              alt={vehicle.name} 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Specs Grid */}
          <section className="bg-[#1c1b1b] p-6 lg:p-8 rounded-2xl border border-[#2b2b2b]">
            <h2 className="text-2xl font-heading font-bold mb-6">Spécifications</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              
              <div className="flex flex-col gap-2">
                <div className="w-10 h-10 rounded-full bg-[#2b2b2b] flex items-center justify-center text-primary">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-xs text-[#a1a1aa] uppercase font-bold tracking-wider">Places</span>
                <span className="font-semibold text-lg">{vehicle.seats}</span>
              </div>
              
              <div className="flex flex-col gap-2">
                <div className="w-10 h-10 rounded-full bg-[#2b2b2b] flex items-center justify-center text-primary">
                  <Settings className="w-5 h-5" />
                </div>
                <span className="text-xs text-[#a1a1aa] uppercase font-bold tracking-wider">Boîte</span>
                <span className="font-semibold text-lg capitalize">{vehicle.transmission}</span>
              </div>

              <div className="flex flex-col gap-2">
                <div className="w-10 h-10 rounded-full bg-[#2b2b2b] flex items-center justify-center text-primary">
                  <Fuel className="w-5 h-5" />
                </div>
                <span className="text-xs text-[#a1a1aa] uppercase font-bold tracking-wider">Carburant</span>
                <span className="font-semibold text-lg capitalize">{vehicle.fuel}</span>
              </div>

              <div className="flex flex-col gap-2">
                <div className="w-10 h-10 rounded-full bg-[#2b2b2b] flex items-center justify-center text-primary">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="text-xs text-[#a1a1aa] uppercase font-bold tracking-wider">GPS Inclus</span>
                <span className="font-semibold text-lg">{vehicle.has_gps ? 'Oui' : 'Non'}</span>
              </div>

            </div>
          </section>

          {/* Agency Info */}
          <section className="bg-surface p-6 lg:p-8 rounded-2xl flex flex-col sm:flex-row gap-6 items-center sm:items-start text-black">
            <div className="w-20 h-20 bg-background rounded-2xl flex items-center justify-center shrink-0">
              <span className="text-3xl font-heading font-extrabold text-white">{vehicle.agencies?.name?.charAt(0)}</span>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-2xl font-heading font-bold mb-1">{vehicle.agencies?.name}</h3>
              <p className="text-sm text-[#5f5e5e] font-semibold flex items-center justify-center sm:justify-start gap-1 mb-4">
                <MapPin className="w-4 h-4" /> {vehicle.agencies?.city} — {vehicle.agencies?.address}
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
                <span className="flex items-center gap-1 text-sm font-bold"><CheckCircle2 className="w-4 h-4 text-green-600" /> Agence Vérifiée</span>
                <span className="flex items-center gap-1 text-sm font-bold"><CheckCircle2 className="w-4 h-4 text-green-600" /> Support 24/7</span>
              </div>
            </div>
          </section>

        </div>

        {/* RIGHT COLUMN: Sticky Booking Panel */}
        <aside className="lg:col-span-4 w-full h-full">
          <div className="sticky top-28 bg-[#1c1b1b] p-6 rounded-2xl border border-[#2b2b2b] shadow-2xl flex flex-col gap-8">
            
            <div className="flex items-end justify-between">
              <div>
                <span className="text-3xl font-heading font-bold text-primary">{Math.round(vehicle.base_price)}</span>
                <span className="text-[#a1a1aa] font-semibold"> DT / jour</span>
              </div>
              <div className="text-sm font-bold text-green-500 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-green-500" /> Disponible
              </div>
            </div>

            {/* Dates Form */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#5f5e5e] cursor-pointer" onClick={() => { try { (document.getElementById('start-date') as HTMLInputElement | null)?.showPicker?.(); } catch(e) {} }}>Date de retrait</label>
                <div 
                  className="flex items-center border-b-2 border-[#2b2b2b] focus-within:border-primary pb-2 transition-colors cursor-pointer relative"
                  onClick={(e) => {
                    const input = document.getElementById('start-date') as HTMLInputElement;
                    if (input && 'showPicker' in input) {
                      try { input.showPicker(); } catch (err) {}
                    }
                  }}
                >
                  <Calendar className="w-5 h-5 text-primary mr-2" />
                  <input 
                    id="start-date"
                    type="date" 
                    min={new Date().toISOString().split("T")[0]}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-transparent outline-none font-semibold uppercase cursor-pointer"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#5f5e5e] cursor-pointer" onClick={() => { try { (document.getElementById('end-date') as HTMLInputElement | null)?.showPicker?.(); } catch(e) {} }}>Date de retour</label>
                <div 
                  className="flex items-center border-b-2 border-[#2b2b2b] focus-within:border-primary pb-2 transition-colors cursor-pointer relative"
                  onClick={(e) => {
                    const input = document.getElementById('end-date') as HTMLInputElement;
                    if (input && 'showPicker' in input) {
                      try { input.showPicker(); } catch (err) {}
                    }
                  }}
                >
                  <Calendar className="w-5 h-5 text-primary mr-2" />
                  <input 
                    id="end-date"
                    type="date" 
                    min={startDate || new Date().toISOString().split("T")[0]}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-transparent outline-none font-semibold uppercase cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Breakdown */}
            {currentDays > 0 ? (
              <div className="bg-[#0D0D0D] p-5 rounded-xl border border-[#2b2b2b] flex flex-col gap-3">
                <div className="flex justify-between text-sm font-semibold text-[#a1a1aa]">
                  <span>{Math.round(vehicle.base_price)} DT x {currentDays} jours</span>
                  <span>{totalPrice} DT</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-[#a1a1aa]">
                  <span>Frais de service (0%)</span>
                  <span>0 DT</span>
                </div>
                <div className="w-full h-px bg-[#2b2b2b] my-1"></div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">{totalPrice} DT</span>
                </div>
                <div className="mt-2 text-xs font-semibold text-[#5f5e5e] flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  Une caution de {deposit} DT sera demandée en agence via carte ou chèque. Non débitée à la réservation.
                </div>
              </div>
            ) : (
              <div className="text-center text-sm font-semibold text-[#a1a1aa] py-4">
                Sélectionnez vos dates pour voir le devis.
              </div>
            )}

            {/* CTA */}
            <button 
              onClick={handleBookingStart}
              className="w-full bg-primary text-white font-bold uppercase tracking-wider py-4 rounded-xl hover:bg-[#a73a00] transition-colors flex items-center justify-center gap-2"
            >
              Réserver maintenant <ArrowRight className="w-5 h-5" />
            </button>
            
            <div className="text-center text-xs text-[#5f5e5e] font-semibold flex items-center justify-center gap-2">
              <CreditCard className="w-4 h-4" /> Aucun paiement immédiat requis.
            </div>

          </div>
        </aside>

      </div>
    </div>
  );
}
