
import React, { useState } from 'react';
import { getSafetyAdvice } from '../services/gemini';

export const AISafetyAssistant: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([]);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const userMsg = prompt;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setPrompt('');
    setLoading(true);

    const advice = await getSafetyAdvice(userMsg);
    setMessages(prev => [...prev, { role: 'ai', text: advice || 'Erro ao processar consulta.' }]);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-indigo-600 p-8 rounded-2xl text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2">Assistente de Segurança Inteligente</h2>
          <p className="opacity-80">Tire dúvidas sobre normas NP 4413, tipos de fogo ou manutenção preventiva.</p>
        </div>
        <div className="absolute right-[-20px] top-[-20px] opacity-10">
           <svg className="w-48 h-48" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col h-[500px]">
        <div className="flex-grow p-6 overflow-y-auto space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-slate-400 mt-20">
              <p>Olá! Sou o seu assistente especializado em segurança.</p>
              <p className="text-sm">Tente perguntar: "Qual a diferença entre um extintor ABC e CO2?"</p>
            </div>
          )}
          {messages.map((m, idx) => (
            <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                m.role === 'user' 
                  ? 'bg-red-600 text-white rounded-tr-none' 
                  : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
              }`}>
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
               <div className="bg-slate-100 px-4 py-2 rounded-2xl text-slate-500 text-sm animate-pulse">A pensar...</div>
            </div>
          )}
        </div>

        <form onSubmit={handleAsk} className="p-4 border-t border-slate-100 flex gap-2">
          <input 
            type="text" 
            placeholder="Escreva a sua dúvida de segurança aqui..." 
            className="flex-grow px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={loading}
          />
          <button 
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50"
          >
            Perguntar
          </button>
        </form>
      </div>
    </div>
  );
};
