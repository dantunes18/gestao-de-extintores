
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { ExtinguisherTable } from './components/ExtinguisherTable';
import { ExtinguisherForm } from './components/ExtinguisherForm';
import { getExtinguishers, saveExtinguisher, deleteExtinguisher, getUsers, registerUser, findUser } from './services/db';
import { Extinguisher, User } from './types';
import { Icons } from './constants';

type AuthMode = 'login' | 'register' | 'recovery';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'list'>('dashboard');
  const [extinguishers, setExtinguishers] = useState<Extinguisher[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Extinguisher | null>(null);
  
  const [formData, setFormData] = useState({ username: '', password: '', name: '', confirmPassword: '' });
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      setExtinguishers(getExtinguishers());
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = findUser(formData.username);
    if (user && user.password === formData.password) {
      setIsAuthenticated(true);
      setCurrentUser({
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role
      });
      setFormData({ username: '', password: '', name: '', confirmPassword: '' });
    } else {
      alert("Credenciais inválidas. Verifique o utilizador e a palavra-passe.");
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("As palavras-passe não coincidem.");
      return;
    }
    try {
      registerUser({
        id: Math.random().toString(36).substr(2, 9),
        username: formData.username,
        password: formData.password,
        name: formData.name,
        role: 'tecnico'
      });
      alert("Registo efetuado com sucesso! Aceda agora com as suas credenciais.");
      setAuthMode('login');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    const user = findUser(formData.username);
    if (user) {
      alert(`Recuperação de Dados: Para o utilizador "${user.username}", a palavra-passe registada é "${user.password}".`);
      setAuthMode('login');
    } else {
      alert("Utilizador não encontrado na base de dados.");
    }
  };

  const handleSave = (item: Extinguisher) => {
    saveExtinguisher(item);
    setExtinguishers(getExtinguishers());
    setIsFormOpen(false);
    setEditingItem(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem a certeza que deseja eliminar este registo da base de dados?")) {
      deleteExtinguisher(id);
      setExtinguishers(getExtinguishers());
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-red-600 p-10 text-center text-white flex flex-col items-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm border border-white/30">
              <div className="text-white scale-125">
                <Icons.Extinguisher />
              </div>
            </div>
            <h1 className="text-3xl font-black mb-1 italic tracking-tight">GestExtintor Pro</h1>
            <p className="opacity-80 text-sm font-medium">Sistema de Gestão de Segurança</p>
          </div>

          <div className="p-8">
            {authMode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Utilizador</label>
                    <input 
                      type="text"
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500/20 outline-none transition-all"
                      placeholder="Nome de utilizador"
                      value={formData.username}
                      onChange={e => setFormData({...formData, username: e.target.value})}
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-bold text-slate-500 uppercase">Palavra-passe</label>
                      <button type="button" onClick={() => setAuthMode('recovery')} className="text-xs text-red-600 font-semibold hover:underline">Recuperar?</button>
                    </div>
                    <input 
                      type="password"
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500/20 outline-none transition-all"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={e => setFormData({...formData, password: e.target.value})}
                    />
                  </div>
                </div>
                <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95">
                  Entrar no Sistema
                </button>
                <div className="text-center pt-2">
                  <p className="text-sm text-slate-500">
                    Novo utilizador? <button type="button" onClick={() => setAuthMode('register')} className="text-red-600 font-bold hover:underline">Criar conta</button>
                  </p>
                </div>
              </form>
            )}

            {authMode === 'register' && (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nome Completo</label>
                  <input 
                    type="text"
                    required
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Utilizador</label>
                  <input 
                    type="text"
                    required
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    value={formData.username}
                    onChange={e => setFormData({...formData, username: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Passe</label>
                    <input 
                      type="password"
                      required
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                      value={formData.password}
                      onChange={e => setFormData({...formData, password: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Confirmação</label>
                    <input 
                      type="password"
                      required
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                      value={formData.confirmPassword}
                      onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                    />
                  </div>
                </div>
                <button type="submit" className="w-full py-4 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg mt-4">
                  Efetuar Registo
                </button>
                <div className="text-center pt-2">
                  <button type="button" onClick={() => setAuthMode('login')} className="text-sm text-slate-500 hover:text-slate-800 font-medium">
                    Voltar ao Login
                  </button>
                </div>
              </form>
            )}

            {authMode === 'recovery' && (
              <form onSubmit={handleRecovery} className="space-y-6">
                <p className="text-sm text-slate-600 text-center">Identifique o utilizador para recuperar a password da base de dados.</p>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Utilizador</label>
                  <input 
                    type="text"
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    placeholder="Nome de utilizador"
                    value={formData.username}
                    onChange={e => setFormData({...formData, username: e.target.value})}
                  />
                </div>
                <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg">
                  Consultar Dados
                </button>
                <div className="text-center pt-2">
                  <button type="button" onClick={() => setAuthMode('login')} className="text-sm text-slate-500 hover:text-slate-800 font-medium">
                    Voltar ao Login
                  </button>
                </div>
              </form>
            )}
            
            <p className="text-center text-[10px] text-slate-400 mt-8">© 2024 GestExtintor - Dados Guardados Localmente (Browser)</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout 
      activeTab={activeTab} 
      onTabChange={setActiveTab} 
      onLogout={() => setIsAuthenticated(false)}
      user={currentUser!}
    >
      {activeTab === 'dashboard' && <Dashboard data={extinguishers} />}
      
      {activeTab === 'list' && (
        <ExtinguisherTable 
          data={extinguishers} 
          onDelete={handleDelete} 
          onEdit={(e) => { setEditingItem(e); setIsFormOpen(true); }}
          onAdd={() => { setEditingItem(null); setIsFormOpen(true); }}
        />
      )}

      {isFormOpen && (
        <ExtinguisherForm 
          initialData={editingItem}
          onSave={handleSave}
          onCancel={() => { setIsFormOpen(false); setEditingItem(null); }}
        />
      )}
    </Layout>
  );
};

export default App;
