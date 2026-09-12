import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { Calendar, Home, LogOut, Plus, Trash, Edit, Mail, Phone, Loader2 } from 'lucide-react';

export const AdminPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [activeTab, setActiveTab] = useState<'visits' | 'properties'>('visits');
  const [visits, setVisits] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        fetchData();
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchData = async () => {
    setLoadingData(true);
    try {
      const vSnap = await getDocs(query(collection(db, 'visits'), orderBy('createdAt', 'desc')));
      setVisits(vSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      
      const pSnap = await getDocs(collection(db, 'properties'));
      setProperties(pSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError('Credenciais inválidas. Contacte o administrador.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => signOut(auth);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]"><Loader2 className="w-8 h-8 animate-spin text-[#825A39]" /></div>;

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF8F5] px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-[#E8E2D6] shadow-md">
          <h1 className="font-serif text-3xl text-center text-[#221A15] mb-2">Acesso Reservado</h1>
          <p className="text-center text-xs text-[#8C8074] uppercase tracking-widest mb-8">Gestão Aurea Properties</p>
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#6B5E54] mb-2">Email Administrador</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E0D7C9] rounded-xl text-sm focus:outline-hidden focus:border-[#825A39]" />
            </div>
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#6B5E54] mb-2">Palavra-passe</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E0D7C9] rounded-xl text-sm focus:outline-hidden focus:border-[#825A39]" />
            </div>
            {error && <p className="text-red-500 text-xs font-medium">{error}</p>}
            <button type="submit" disabled={loading} className="w-full py-3 bg-[#221A15] hover:bg-[#3E2819] text-white text-xs uppercase tracking-widest font-medium rounded-xl transition-colors">
              Iniciar Sessão
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#221A15]">
      {/* Admin Header */}
      <header className="bg-white border-b border-[#E8E2D6] px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-6">
          <div className="w-8 h-8 border border-[#221A15] flex items-center justify-center shrink-0">
            <span className="font-serif text-sm text-[#221A15]">A</span>
          </div>
          <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#6B5E54] hidden sm:block">Painel de Gestão</span>
        </div>
        
        <div className="flex items-center gap-6">
          <nav className="flex items-center gap-2">
            <button onClick={() => setActiveTab('visits')} className={`px-4 py-2 text-[10px] uppercase tracking-widest font-semibold rounded-lg transition-colors ${activeTab === 'visits' ? 'bg-[#FAF8F5] text-[#221A15]' : 'text-[#8C8074] hover:bg-[#FAF8F5]'}`}>Visitas</button>
            <button onClick={() => setActiveTab('properties')} className={`px-4 py-2 text-[10px] uppercase tracking-widest font-semibold rounded-lg transition-colors ${activeTab === 'properties' ? 'bg-[#FAF8F5] text-[#221A15]' : 'text-[#8C8074] hover:bg-[#FAF8F5]'}`}>Imóveis</button>
          </nav>
          <button onClick={handleLogout} className="flex items-center gap-2 text-xs text-[#B33927] hover:bg-red-50 px-3 py-2 rounded-lg transition-colors">
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {loadingData ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#825A39]" /></div>
        ) : activeTab === 'visits' ? (
          <div className="space-y-6">
            <h2 className="font-serif text-3xl">Agendamentos de Visita</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {visits.length === 0 ? <p className="text-[#8C8074] text-sm">Nenhum agendamento registado.</p> : visits.map(v => (
                <div key={v.id} className="bg-white p-6 rounded-2xl border border-[#E8E2D6] shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-[#825A39] bg-[#FAF8F5] px-2 py-1 rounded-md">{v.status || 'Pendente'}</span>
                    <span className="text-xs text-[#8C8074]">{new Date(v.createdAt).toLocaleDateString('pt-MZ')}</span>
                  </div>
                  <h3 className="font-serif text-xl mb-1">{v.propertyTitle}</h3>
                  <p className="text-sm text-[#6B5E54] mb-4 flex items-center gap-2"><Calendar className="w-4 h-4"/> Data preferida: <strong>{v.preferredDate} às {v.preferredTime}</strong></p>
                  
                  <div className="bg-[#FAF8F5] p-4 rounded-xl space-y-2 text-xs text-[#5E5249]">
                    <div className="flex items-center justify-between border-b border-[#E0D7C9] pb-2">
                      <span className="font-semibold text-[#221A15]">{v.clientName}</span>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <Phone className="w-3.5 h-3.5 text-[#8C8074]"/> <a href={`tel:${v.clientPhone}`} className="hover:text-[#825A39]">{v.clientPhone}</a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-[#8C8074]"/> <a href={`mailto:${v.clientEmail}`} className="hover:text-[#825A39]">{v.clientEmail}</a>
                    </div>
                    {v.message && (
                      <div className="pt-2 mt-2 border-t border-[#E0D7C9]">
                        <span className="block text-[10px] uppercase text-[#8C8074] mb-1">Mensagem:</span>
                        <p className="italic">"{v.message}"</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-3xl">Gestão de Imóveis</h2>
              <button className="flex items-center gap-2 bg-[#221A15] text-white px-5 py-2.5 rounded-lg text-xs uppercase tracking-widest font-medium hover:bg-[#3E2819] transition-colors">
                <Plus className="w-4 h-4" />
                Adicionar Imóvel
              </button>
            </div>
            
            <div className="bg-white rounded-2xl border border-[#E8E2D6] overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-[#FAF8F5] text-[10px] uppercase tracking-wider text-[#8C8074]">
                    <th className="px-6 py-4 font-semibold">Imóvel</th>
                    <th className="px-6 py-4 font-semibold hidden md:table-cell">Localização</th>
                    <th className="px-6 py-4 font-semibold">Preço</th>
                    <th className="px-6 py-4 font-semibold text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E2D6]">
                  {properties.length === 0 ? (
                    <tr><td colSpan={4} className="px-6 py-8 text-center text-[#8C8074]">Nenhum imóvel inserido. Adicione imóveis para mostrar no site.</td></tr>
                  ) : properties.map(p => (
                    <tr key={p.id} className="hover:bg-[#FAF8F5] transition-colors">
                      <td className="px-6 py-4 font-medium">{p.title}</td>
                      <td className="px-6 py-4 text-[#6B5E54] hidden md:table-cell">{p.neighborhood}, {p.location}</td>
                      <td className="px-6 py-4 text-[#221A15] font-semibold">{p.priceDisplay} {p.pricePeriod || ''}</td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-[#8C8074] hover:text-[#221A15] p-2 transition-colors"><Edit className="w-4 h-4" /></button>
                        <button className="text-[#8C8074] hover:text-[#B33927] p-2 transition-colors ml-2"><Trash className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-[#8C8074] mt-4">* Para adicionar imóveis rapidamente na demonstração, pode utilizar os dados do arquivo de exemplo, ou ligar um formulário funcional que irá gravar no Firebase.</p>
          </div>
        )}
      </main>
    </div>
  );
};
