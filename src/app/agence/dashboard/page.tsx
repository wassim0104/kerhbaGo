"use client";

import React, { useState, useEffect } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { LayoutDashboard, Car, TrendingUp, AlertTriangle, AlertCircle, Clock, CheckCircle2, ChevronRight, User, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

// STATIC FORECAST (AI Placeholder)
const FORECAST_DATA = [
  { day: "1", demand: 40, event: "" }, { day: "5", demand: 55, event: "" }, 
  { day: "10", demand: 80, event: "Vacances +35%" }, { day: "15", demand: 90, event: "Aïd +42%" },
  { day: "20", demand: 60, event: "" }, { day: "25", demand: 50, event: "" },
  { day: "30", demand: 65, event: "" }
];

export default function AgencyDashboard() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      // Fetch vehicles for the agency (mocking agency ID since no auth)
      const { data: vData } = await supabase
        .from('vehicles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      const { data: rData } = await supabase
        .from('reservations')
        .select(`*, clients(full_name)`)
        .order('created_at', { ascending: false });

      if (vData) setVehicles(vData);
      if (rData) setReservations(rData);
      setLoading(false);
    }
    loadDashboard();
  }, []);

  const totalRevenue = reservations.reduce((sum, r) => sum + r.total_price, 0);
  const activeRentals = reservations.filter(r => r.status === 'confirmed' || r.status === 'pending').length;
  const fleetUtilization = vehicles.length > 0 ? Math.round((vehicles.filter(v => v.status === 'rented').length / vehicles.length) * 100) : 0;

  // Simple day-based revenue chart grouping
  const REVENUE_DATA = [
    { name: "Lun", revenue: Math.round(totalRevenue * 0.1) }, 
    { name: "Mar", revenue: Math.round(totalRevenue * 0.2) }, 
    { name: "Mer", revenue: Math.round(totalRevenue * 0.15) },
    { name: "Jeu", revenue: Math.round(totalRevenue * 0.1) }, 
    { name: "Ven", revenue: Math.round(totalRevenue * 0.3) }, 
    { name: "Sam", revenue: Math.round(totalRevenue * 0.05) },
    { name: "Dim", revenue: Math.round(totalRevenue * 0.1) },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-[#0D0D0D] border-r border-[#2b2b2b] hidden md:flex flex-col sticky top-0 h-screen">
        <div className="h-20 flex items-center px-6 border-b border-[#2b2b2b]">
          <Link href="/" className="text-2xl font-heading font-extrabold tracking-tighter text-primary">
            kerhbaGo <span className="text-xs uppercase text-[#a1a1aa] ml-2 font-sans tracking-widest">Agency</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/agence/dashboard" className="flex items-center gap-3 px-4 py-3 bg-[#1c1b1b] text-white rounded-xl font-semibold border border-[#2b2b2b]">
            <LayoutDashboard className="w-5 h-5 text-primary" /> Tableau de Bord
          </Link>
          <Link href="/agence/flotte" className="flex items-center gap-3 px-4 py-3 text-[#5f5e5e] hover:text-[#F4F4F2] hover:bg-[#1c1b1b] rounded-xl font-semibold transition-colors">
            <Car className="w-5 h-5" /> Ma Flotte
          </Link>
          <Link href="/agence/alertes" className="flex items-center gap-3 px-4 py-3 text-[#5f5e5e] hover:text-[#F4F4F2] hover:bg-[#1c1b1b] rounded-xl font-semibold transition-colors">
            <AlertTriangle className="w-5 h-5" /> Alertes <div className="ml-auto bg-primary text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">3</div>
          </Link>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto">
        {/* HEADER */}
        <header className="h-20 bg-[#0D0D0D] border-b border-[#2b2b2b] flex items-center justify-between px-8 sticky top-0 z-40">
          <h1 className="text-xl font-heading font-bold">Vue d'ensemble</h1>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#1c1b1b] border border-[#2b2b2b] flex items-center justify-center cursor-pointer">
              <User className="w-5 h-5 text-[#a1a1aa]" />
            </div>
          </div>
        </header>

        <div className="p-8">
          {/* KPIs ROW */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-[#1c1b1b] p-6 rounded-2xl border border-[#2b2b2b]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#5f5e5e]">Revenus (Global)</h3>
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <p className="text-3xl font-heading font-bold">{totalRevenue} <span className="text-lg text-[#a1a1aa]">DT</span></p>
            </div>
            
            <div className="bg-[#1c1b1b] p-6 rounded-2xl border border-[#2b2b2b]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#5f5e5e]">Utilisation Flotte</h3>
                <Car className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-3xl font-heading font-bold">{fleetUtilization}<span className="text-lg text-[#a1a1aa]">%</span></p>
            </div>

            <div className="bg-[#1c1b1b] p-6 rounded-2xl border border-[#2b2b2b]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#5f5e5e]">Locations Imminentes</h3>
                <CheckCircle2 className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-3xl font-heading font-bold">{activeRentals}</p>
            </div>

            <div className="bg-[#1c1b1b] p-6 rounded-2xl border border-[#2b2b2b] border-l-4 border-l-red-500">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#5f5e5e]">Retards Probables</h3>
                <AlertCircle className="w-5 h-5 text-red-500" />
              </div>
              <p className="text-3xl font-heading font-bold text-red-500">0</p>
            </div>
          </div>

          {/* CHARTS GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Revenue Line Chart */}
            <div className="bg-[#1c1b1b] p-6 rounded-2xl border border-[#2b2b2b]">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-heading font-bold">Revenus (Simulation)</h2>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-full">Semaine</span>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={REVENUE_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2b2b2b" vertical={false} />
                    <XAxis dataKey="name" stroke="#5f5e5e" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#5f5e5e" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1c1b1b', border: '1px solid #2b2b2b', borderRadius: '0.5rem', color: '#fff' }} 
                      itemStyle={{ color: '#ff5c00' }}
                    />
                    <Line type="monotone" dataKey="revenue" stroke="#ff5c00" strokeWidth={3} dot={{ r: 4, fill: '#ff5c00', strokeWidth: 0 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Demand Forecast Bar Chart */}
            <div className="bg-[#1c1b1b] p-6 rounded-2xl border border-[#2b2b2b]">
               <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-heading font-bold flex items-center gap-2">
                  Prévision Demande <ShieldAlert className="w-4 h-4 text-primary" />
                </h2>
                <span className="text-xs text-[#a1a1aa]">IA n8n Forecast</span>
              </div>
              <div className="h-64 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={FORECAST_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2b2b2b" vertical={false} />
                    <XAxis dataKey="day" stroke="#5f5e5e" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#5f5e5e" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                       contentStyle={{ backgroundColor: '#1c1b1b', border: '1px solid #2b2b2b', borderRadius: '0.5rem', color: '#fff' }} 
                       cursor={{ fill: '#2b2b2b' }}
                    />
                    <Bar dataKey="demand" fill="#ff5c00" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* FLEET TABLE */}
          <div className="bg-[#1c1b1b] rounded-2xl border border-[#2b2b2b] overflow-hidden">
            <div className="p-6 border-b border-[#2b2b2b] flex justify-between items-center">
              <h2 className="text-lg font-heading font-bold">État Réel de la Flotte (Top 10)</h2>
              <Link href="/agence/flotte" className="text-sm font-semibold text-primary flex items-center">Voir tout <ChevronRight className="w-4 h-4" /></Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#2b2b2b]/50 border-b border-[#2b2b2b]">
                    <th className="p-4 text-xs uppercase tracking-wider text-[#5f5e5e] font-bold">Véhicule</th>
                    <th className="p-4 text-xs uppercase tracking-wider text-[#5f5e5e] font-bold">Tarif Base</th>
                    <th className="p-4 text-xs uppercase tracking-wider text-[#5f5e5e] font-bold">Locataire</th>
                    <th className="p-4 text-xs uppercase tracking-wider text-[#5f5e5e] font-bold">Statut Supabase</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2b2b2b]">
                  {vehicles.map((car, idx) => (
                    <tr key={idx} className="hover:bg-[#2b2b2b]/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={car.photo_urls?.[0]} className="w-10 h-10 rounded-md object-cover border border-[#3f3f3f]" />
                          <div>
                            <p className="font-bold text-[#F4F4F2]">{car.name}</p>
                            <p className="text-xs text-[#a1a1aa]">ID: {car.id.slice(0, 8)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-bold text-sm text-[#F4F4F2]">{Math.round(car.base_price)} DT</td>
                      <td className="p-4 font-semibold text-sm text-[#F4F4F2]">-</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider border
                          ${car.status === 'available' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                            car.status === 'rented' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 
                            'bg-orange-500/10 text-orange-500 border-orange-500/20'}`}>
                          {car.status === 'available' ? 'Disponible' : car.status === 'rented' ? 'En Location' : 'Maintenance'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
