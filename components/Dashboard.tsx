
import React, { useState, useMemo } from 'react';
import { Extinguisher, ExtinguisherStatus } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface DashboardProps {
  data: Extinguisher[];
}

export const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const [filterLocation, setFilterLocation] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const locations = useMemo(() => {
    const locs = Array.from(new Set(data.map(e => e.location))).sort();
    return locs;
  }, [data]);

  const statuses = Object.values(ExtinguisherStatus);

  const filteredData = useMemo(() => {
    return data.filter(e => {
      const matchLocation = filterLocation === 'all' || e.location === filterLocation;
      const matchStatus = filterStatus === 'all' || e.status === filterStatus;
      return matchLocation && matchStatus;
    });
  }, [data, filterLocation, filterStatus]);

  const total = filteredData.length;
  const expired = filteredData.filter(e => e.status === ExtinguisherStatus.EXPIRED).length;
  const operational = filteredData.filter(e => e.status === ExtinguisherStatus.OPERATIONAL).length;
  const maintenance = filteredData.filter(e => e.status === ExtinguisherStatus.MAINTENANCE).length;
  const soon = filteredData.filter(e => e.status === ExtinguisherStatus.NEEDS_REPLACEMENT).length;

  const chartData = [
    { name: `Operacionais (${operational})`, value: operational, color: '#10B981' },
    { name: `Fora de Prazo (${expired})`, value: expired, color: '#EF4444' },
    { name: `Manutenção (${maintenance})`, value: maintenance, color: '#F59E0B' },
    { name: `Subst. Breve (${soon})`, value: soon, color: '#6366F1' },
  ].filter(item => item.value > 0);

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = 25 + innerRadius + (outerRadius - innerRadius);
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="#475569" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-[11px] font-bold">
        {`${value} un.`}
      </text>
    );
  };

  return (
    <div className="space-y-6">
      {/* Barra de Filtros da Base de Dados */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 items-end">
        <div className="flex-1 w-full sm:w-auto">
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Localização</label>
          <select 
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500/20"
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
          >
            <option value="all">Todas as Localizações</option>
            {locations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
        <div className="flex-1 w-full sm:w-auto">
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Estado do Equipamento</label>
          <select 
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500/20"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Todos os Estados</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
        <button 
          onClick={() => { setFilterLocation('all'); setFilterStatus('all'); }}
          className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-red-600 transition-colors"
        >
          Limpar Filtros
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Total Filtrado" value={total} color="bg-blue-50 text-blue-700 border-blue-100" />
        <StatCard label="Operacionais" value={operational} color="bg-emerald-50 text-emerald-700 border-emerald-100" />
        <StatCard label="Alertas Críticos" value={expired} color="bg-rose-50 text-rose-700 border-rose-100" />
        <StatCard label="Substituição" value={soon} color="bg-indigo-50 text-indigo-700 border-indigo-100" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold mb-6 text-slate-800">Distribuição por Tipologia de Estado</h3>
          <div className="h-72 flex-grow">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={90}
                    paddingAngle={6}
                    dataKey="value"
                    label={renderCustomLabel}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} Equipamentos`, 'Quantidade']} />
                  <Legend verticalAlign="bottom" height={40} iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 italic">
                Sem dados para os filtros selecionados
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6 text-slate-800">Equipamentos Críticos em Alerta</h3>
          <div className="space-y-4">
            {filteredData.filter(e => e.status !== ExtinguisherStatus.OPERATIONAL).slice(0, 5).map(e => (
              <div key={e.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 group hover:border-slate-300 transition-colors">
                <div>
                  <p className="font-bold text-slate-800">{e.code} - {e.location}</p>
                  <p className="text-[11px] text-slate-500">
                    Alocado a: <span className="font-semibold text-slate-700">{e.assignedEquipment || 'Geral'}</span>
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1 italic font-medium">Data Limite: {e.expiryDate}</p>
                </div>
                <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-tight ${
                  e.status === ExtinguisherStatus.EXPIRED ? 'bg-red-100 text-red-700' : 
                  e.status === ExtinguisherStatus.MAINTENANCE ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'
                }`}>
                  {e.status}
                </span>
              </div>
            ))}
            {filteredData.filter(e => e.status !== ExtinguisherStatus.OPERATIONAL).length === 0 && (
              <div className="text-center text-slate-400 py-12">
                <p className="font-medium">Frota 100% Operacional</p>
                <p className="text-xs mt-1">Todos os equipamentos estão em conformidade com as normas.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, color }: { label: string, value: number, color: string }) => (
  <div className={`p-6 rounded-xl border ${color} flex flex-col shadow-sm transition-transform hover:scale-[1.02]`}>
    <span className="text-xs font-bold opacity-70 uppercase tracking-wider">{label}</span>
    <span className="text-4xl font-black mt-1">{value}</span>
  </div>
);
