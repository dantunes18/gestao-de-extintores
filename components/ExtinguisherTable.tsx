
import React, { useState } from 'react';
import { Extinguisher, ExtinguisherStatus, ExtinguisherType } from '../types';
import { Icons } from '../constants';

interface TableProps {
  data: Extinguisher[];
  onDelete: (id: string) => void;
  onEdit: (e: Extinguisher) => void;
  onAdd: () => void;
}

export const ExtinguisherTable: React.FC<TableProps> = ({ data, onDelete, onEdit, onAdd }) => {
  const [search, setSearch] = useState('');

  const filtered = data.filter(e => 
    e.code.toLowerCase().includes(search.toLowerCase()) || 
    e.location.toLowerCase().includes(search.toLowerCase()) ||
    (e.assignedEquipment && e.assignedEquipment.toLowerCase().includes(search.toLowerCase()))
  );

  const handleExportCSV = () => {
    if (filtered.length === 0) return;

    // Cabeçalhos do CSV
    const headers = [
      'Código',
      'Tipo',
      'Capacidade',
      'Localização',
      'Equipamento Alocado',
      'Última Manutenção',
      'Data Validade',
      'Estado'
    ];

    // Mapeamento dos dados
    const rows = filtered.map(e => [
      e.code,
      e.type,
      e.capacity,
      e.location,
      e.assignedEquipment || 'Nenhum',
      e.lastMaintenance,
      e.expiryDate,
      e.status
    ]);

    // Construção do conteúdo CSV
    const csvContent = [
      headers.join(';'),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(';'))
    ].join('\n');

    // Adicionar BOM para suporte a caracteres acentuados no Excel
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Trigger do download
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `exportacao_extintores_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Icons.Search />
          </div>
          <input 
            type="text" 
            placeholder="Pesquisar código, local ou equipamento..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <button 
            onClick={handleExportCSV}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 shadow-sm text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Exportar CSV
          </button>
          <button 
            onClick={onAdd}
            className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-2 shadow-md shadow-red-200 text-sm"
          >
            <span className="text-lg">+</span>
            Novo Equipamento
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-wider border-b border-slate-100">
            <tr>
              <th className="px-6 py-4">Código</th>
              <th className="px-6 py-4">Tipo / Cap.</th>
              <th className="px-6 py-4">Localização / Alocação</th>
              <th className="px-6 py-4">Validade</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(e => (
              <tr key={e.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4 font-bold text-slate-800">{e.code}</td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  <div className="flex flex-col">
                    <span className="font-medium">{e.type}</span>
                    <span className="text-[11px] text-slate-400">{e.capacity}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-700">{e.location}</span>
                    <span className="text-[11px] text-slate-400 italic">Alocado a: {e.assignedEquipment || 'Nenhum'}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{e.expiryDate}</td>
                <td className="px-6 py-4">
                   <StatusBadge status={e.status} />
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => onEdit(e)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors" title="Editar">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                      </svg>
                    </button>
                    <button onClick={() => onDelete(e.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors" title="Eliminar">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                   <div className="flex flex-col items-center gap-2">
                     <Icons.Extinguisher />
                     <p className="text-sm">Nenhum equipamento encontrado com os critérios de pesquisa.</p>
                   </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }: { status: ExtinguisherStatus }) => {
  const styles = {
    [ExtinguisherStatus.OPERATIONAL]: 'bg-emerald-100 text-emerald-700',
    [ExtinguisherStatus.EXPIRED]: 'bg-red-100 text-red-700',
    [ExtinguisherStatus.MAINTENANCE]: 'bg-amber-100 text-amber-700',
    [ExtinguisherStatus.NEEDS_REPLACEMENT]: 'bg-indigo-100 text-indigo-700',
  };
  return (
    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-tight shadow-sm border border-transparent ${styles[status]}`}>
      {status}
    </span>
  );
};
