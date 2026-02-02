
import React, { useState, useEffect } from 'react';
import { Extinguisher, ExtinguisherType, ExtinguisherStatus } from '../types';

interface FormProps {
  initialData?: Extinguisher | null;
  onSave: (data: Extinguisher) => void;
  onCancel: () => void;
}

export const ExtinguisherForm: React.FC<FormProps> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Extinguisher>({
    id: Math.random().toString(36).substr(2, 9),
    code: '',
    type: ExtinguisherType.ABC_PO,
    capacity: '6kg',
    location: '',
    assignedEquipment: '',
    lastMaintenance: new Date().toISOString().split('T')[0],
    expiryDate: '',
    status: ExtinguisherStatus.OPERATIONAL,
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-8 overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800">
            {initialData ? 'Editar Equipamento' : 'Novo Equipamento'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Código / ID</label>
              <input 
                required
                className="w-full px-3 py-2 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-red-500/20 outline-none"
                value={formData.code}
                onChange={e => setFormData({...formData, code: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Capacidade</label>
              <input 
                required
                className="w-full px-3 py-2 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-red-500/20 outline-none"
                value={formData.capacity}
                onChange={e => setFormData({...formData, capacity: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Tipo de Agente</label>
            <select 
              className="w-full px-3 py-2 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-red-500/20 outline-none"
              value={formData.type}
              onChange={e => setFormData({...formData, type: e.target.value as ExtinguisherType})}
            >
              {Object.values(ExtinguisherType).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Localização</label>
              <input 
                required
                className="w-full px-3 py-2 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-red-500/20 outline-none"
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Equipamento Alocado</label>
              <input 
                className="w-full px-3 py-2 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-red-500/20 outline-none"
                placeholder="Ex: Máquina A, Quadro X"
                value={formData.assignedEquipment || ''}
                onChange={e => setFormData({...formData, assignedEquipment: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Última Manutenção</label>
              <input 
                type="date"
                required
                className="w-full px-3 py-2 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-red-500/20 outline-none"
                value={formData.lastMaintenance}
                onChange={e => setFormData({...formData, lastMaintenance: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Data de Validade</label>
              <input 
                type="date"
                required
                className="w-full px-3 py-2 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-red-500/20 outline-none"
                value={formData.expiryDate}
                onChange={e => setFormData({...formData, expiryDate: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Estado Atual</label>
            <select 
              className="w-full px-3 py-2 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-red-500/20 outline-none"
              value={formData.status}
              onChange={e => setFormData({...formData, status: e.target.value as ExtinguisherStatus})}
            >
              {Object.values(ExtinguisherStatus).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button" 
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-bold shadow-lg shadow-red-500/20 transition-all"
            >
              {initialData ? 'Atualizar Dados' : 'Guardar Equipamento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
