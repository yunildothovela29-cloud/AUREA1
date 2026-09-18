import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import {
  addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, setDoc, updateDoc,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import {
  CalendarDays, Check, Edit3, Home, ImagePlus, LogOut, Mail, MapPin, Plus,
  RefreshCw, Save, Trash2, Upload, X,
} from 'lucide-react';
import { auth, db, storage } from '../lib/firebase';
import { BRAND_CONFIG } from '../data/config';
import { PropertyType, OperationType, Property } from '../types';
import { BrandLogo } from '../components/BrandLogo';

type PropertyForm = {
  title: string;
  operation: OperationType;
  type: PropertyType;
  location: string;
  neighborhood: string;
  address: string;
  price: string;
  pricePeriod: string;
  bedrooms: string;
  bathrooms: string;
  suites: string;
  area: string;
  parking: string;
  description: string;
  longDescription: string;
  highlights: string;
  amenities: string;
  images: string[];
  featured: boolean;
  status: Property['status'];
};

const emptyForm: PropertyForm = {
  title: '', operation: 'venda', type: 'Moradia', location: '', neighborhood: '',
  address: '', price: '', pricePeriod: '', bedrooms: '3', bathrooms: '2', suites: '0',
  area: '', parking: '1', description: '', longDescription: '', highlights: '',
  amenities: '', images: [], featured: false, status: 'Disponível',
};

const slugify = (value: string) =>
  value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const splitLines = (value: string) =>
  value.split(/[\n,]/).map((item) => item.trim()).filter(Boolean);

export const AdminPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState(BRAND_CONFIG.admin.email);
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(true);
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState<'properties' | 'visits'>('properties');
  const [properties, setProperties] = useState<any[]>([]);
  const [visits, setVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<PropertyForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState('');

  const isAdmin = user?.email?.toLowerCase() === BRAND_CONFIG.admin.email.toLowerCase();

  const loadData = async () => {
    if (!isAdmin) return;
    setLoading(true);
    try {
      const [propertySnap, visitSnap] = await Promise.all([
        getDocs(collection(db, 'properties')),
        getDocs(query(collection(db, 'visits'), orderBy('createdAt', 'desc'))),
      ]);
      setProperties(propertySnap.docs.map((item) => ({ id: item.id, ...item.data() })));
      setVisits(visitSnap.docs.map((item) => ({ id: item.id, ...item.data() })));
    } catch (error) {
      console.error(error);
      setFormError('Não foi possível carregar os dados. Verifique as regras do Firebase.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isAdmin) void loadData();
  }, [isAdmin]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setFormError('');
  };

  const startEdit = (property: any) => {
    setEditingId(property.id);
    setForm({
      title: property.title || '',
      operation: property.operation || 'venda',
      type: property.type || 'Moradia',
      location: property.location || '',
      neighborhood: property.neighborhood || '',
      address: property.address || '',
      price: String(property.price ?? ''),
      pricePeriod: property.pricePeriod || '',
      bedrooms: String(property.bedrooms ?? 0),
      bathrooms: String(property.bathrooms ?? 0),
      suites: String(property.suites ?? 0),
      area: String(property.area ?? 0),
      parking: String(property.parking ?? 0),
      description: property.description || '',
      longDescription: Array.isArray(property.longDescription) ? property.longDescription.join('\n') : '',
      highlights: Array.isArray(property.highlights) ? property.highlights.join(', ') : '',
      amenities: Array.isArray(property.amenities) ? property.amenities.join(', ') : '',
      images: Array.isArray(property.images) ? property.images : [],
      featured: Boolean(property.featured),
      status: property.status || 'Disponível',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    await signOut(auth);
    resetForm();
  };

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setLoginError('');

    if (email.toLowerCase() !== BRAND_CONFIG.admin.email.toLowerCase()) {
      setLoginError('Este painel está reservado ao administrador da 2S.');
      return;
    }

    setAuthLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch {
      setLoginError('Não foi possível iniciar sessão. Confirme o email e a palavra-passe no Firebase Authentication.');
    } finally {
      setAuthLoading(false);
    }
  };

  const updateField = <K extends keyof PropertyForm>(key: K, value: PropertyForm[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const handleFiles = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (!files.length || !user) return;

    setUploading(true);
    setFormError('');
    try {
      const urls: string[] = [];
      for (const file of files) {
        if (!file.type.startsWith('image/')) continue;
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
        const storageRef = ref(storage, 'properties/' + user.uid + '/' + Date.now() + '-' + safeName);
        await uploadBytes(storageRef, file, { contentType: file.type });
        urls.push(await getDownloadURL(storageRef));
      }
      setForm((current) => ({ ...current, images: [...current.images, ...urls] }));
    } catch (error) {
      console.error(error);
      setFormError('Falha no upload das imagens. Confirme se o Firebase Storage está activo e se as regras foram publicadas.');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const handleAddImageUrl = () => {
    const url = window.prompt('Cole aqui o URL da fotografia:');
    if (url?.trim()) {
      setForm((current) => ({ ...current, images: [...current.images, url.trim()] }));
    }
  };

  const removeImage = (index: number) => {
    setForm((current) => ({ ...current, images: current.images.filter((_, idx) => idx !== index) }));
  };

  const handleSaveProperty = async (event: FormEvent) => {
    event.preventDefault();
    if (!isAdmin) return;

    if (!form.title.trim() || !form.location.trim() || !form.address.trim() || !form.price.trim()) {
      setFormError('Preencha pelo menos título, localização, morada e preço.');
      return;
    }

    if (!form.images.length) {
      setFormError('Adicione pelo menos uma fotografia.');
      return;
    }

    setSaving(true);
    setFormError('');

    const payload = {
      title: form.title.trim(),
      slug: slugify(form.title),
      operation: form.operation,
      type: form.type,
      location: form.location.trim(),
      neighborhood: (form.neighborhood || form.location).trim(),
      city: 'Maputo',
      address: form.address.trim(),
      price: Number(form.price),
      priceDisplay: new Intl.NumberFormat('pt-MZ').format(Number(form.price)) + ' MT',
      pricePeriod: form.operation === 'arrendamento' ? (form.pricePeriod.trim() || '/mês') : '',
      currency: 'MT',
      bedrooms: Number(form.bedrooms) || 0,
      bathrooms: Number(form.bathrooms) || 0,
      suites: Number(form.suites) || 0,
      area: Number(form.area) || 0,
      parking: Number(form.parking) || 0,
      yearBuilt: new Date().getFullYear(),
      featured: form.featured,
      description: form.description.trim(),
      longDescription: splitLines(form.longDescription),
      highlights: splitLines(form.highlights),
      amenities: splitLines(form.amenities),
      images: form.images,
      agent: {
        name: '2S Imobiliária & Serviços',
        role: 'Atendimento',
        phone: BRAND_CONFIG.phone,
        email: BRAND_CONFIG.email,
        photo: '',
      },
      status: form.status,
      updatedAt: new Date().toISOString(),
    };

    try {
      if (editingId) {
        await updateDoc(doc(db, 'properties', editingId), payload);
      } else {
        const propertyRef = doc(collection(db, 'properties'));
        await setDoc(propertyRef, { ...payload, id: propertyRef.id, createdAt: new Date().toISOString() });
      }

      resetForm();
      await loadData();
    } catch (error) {
      console.error(error);
      setFormError('Não foi possível guardar o imóvel. Verifique a configuração do Firebase.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Remover este imóvel do site?')) return;
    try {
      await deleteDoc(doc(db, 'properties', id));
      await loadData();
    } catch (error) {
      console.error(error);
      setFormError('Não foi possível remover o imóvel.');
    }
  };

  const markVisit = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, 'visits', id), { status });
      await loadData();
    } catch (error) {
      console.error(error);
      setFormError('Não foi possível actualizar a visita.');
    }
  };

  const stats = useMemo(() => ({
    total: properties.filter((p) => p.status !== 'Arquivado').length,
    featured: properties.filter((p) => p.featured && p.status !== 'Arquivado').length,
    pending: visits.filter((v) => !v.status || v.status === 'pendente' || v.status === 'Pendente').length,
  }), [properties, visits]);

  if (authLoading) {
    return <div className="min-h-screen grid place-items-center bg-[#F5F7FA]"><RefreshCw className="animate-spin text-[#D93030]" /></div>;
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] grid place-items-center px-4">
        <div className="w-full max-w-md bg-white border border-[#DDE3EE] rounded-3xl p-7 sm:p-9 shadow-xl">
          <BrandLogo className="justify-center mb-7" />
          <div className="text-center mb-7">
            <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#D93030]">Área reservada</span>
            <h1 className="text-2xl font-semibold text-[#14245F] mt-2">Painel do administrador</h1>
            <p className="text-sm text-[#68738A] mt-2">Só a conta de administração da 2S pode entrar aqui.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full px-4 py-3 rounded-xl border border-[#DDE3EE] bg-[#FAFBFC] text-sm outline-none focus:border-[#14245F]" placeholder="Email" />
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="w-full px-4 py-3 rounded-xl border border-[#DDE3EE] bg-[#FAFBFC] text-sm outline-none focus:border-[#14245F]" placeholder="Palavra-passe" />
            {loginError && <p className="text-sm text-[#B42318]">{loginError}</p>}
            <button disabled={!password} className="w-full py-3 rounded-xl bg-[#14245F] text-white text-sm font-semibold hover:bg-[#0E1944] disabled:opacity-50">Entrar</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#14245F]">
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-[#E1E6EF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <BrandLogo compact />
          <div className="flex items-center gap-2">
            <button onClick={() => setActiveTab('properties')} className={'px-4 py-2 rounded-xl text-sm font-semibold ' + (activeTab === 'properties' ? 'bg-[#EEF2FA] text-[#14245F]' : 'text-[#667085]')}>Imóveis</button>
            <button onClick={() => setActiveTab('visits')} className={'px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 ' + (activeTab === 'visits' ? 'bg-[#FDECEC] text-[#B42318]' : 'text-[#667085]')}><CalendarDays className="w-4 h-4" /> Visitas{stats.pending ? ' (' + stats.pending + ')' : ''}</button>
            <button onClick={() => void loadData()} className="p-2 rounded-xl text-[#667085] hover:bg-[#F2F4F7]" title="Actualizar"><RefreshCw className={'w-4 h-4 ' + (loading ? 'animate-spin' : '')} /></button>
            <button onClick={() => void handleLogout()} className="p-2 rounded-xl text-[#B42318] hover:bg-[#FDECEC]" title="Sair"><LogOut className="w-4 h-4" /></button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-7 sm:py-10">
        {activeTab === 'properties' ? (
          <div className="grid grid-cols-1 xl:grid-cols-[390px_1fr] gap-7 items-start">
            <section className="bg-white rounded-3xl border border-[#DDE3EE] p-6 shadow-sm xl:sticky xl:top-24">
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#D93030]">{editingId ? 'Editar' : 'Novo'}</span>
                  <h2 className="text-xl font-semibold text-[#14245F]">{editingId ? 'Editar imóvel' : 'Adicionar imóvel'}</h2>
                </div>
                {editingId && <button onClick={resetForm} className="p-2 rounded-lg hover:bg-[#F2F4F7]"><X className="w-4 h-4" /></button>}
              </div>

              <form onSubmit={handleSaveProperty} className="space-y-4">
                <input value={form.title} onChange={(e) => updateField('title', e.target.value)} className="field" placeholder="Título da propriedade" required />
                <div className="grid grid-cols-2 gap-3">
                  <select value={form.operation} onChange={(e) => updateField('operation', e.target.value as OperationType)} className="field"><option value="venda">Venda</option><option value="arrendamento">Arrendamento</option></select>
                  <select value={form.type} onChange={(e) => updateField('type', e.target.value as PropertyType)} className="field"><option>Moradia</option><option>Apartamento</option><option>Penthouse</option><option>Terreno</option><option>Escritório</option></select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input value={form.location} onChange={(e) => updateField('location', e.target.value)} className="field" placeholder="Zona (ex. Triunfo)" required />
                  <input value={form.neighborhood} onChange={(e) => updateField('neighborhood', e.target.value)} className="field" placeholder="Bairro" />
                </div>
                <input value={form.address} onChange={(e) => updateField('address', e.target.value)} className="field" placeholder="Morada / localização" required />
                <div className="grid grid-cols-2 gap-3">
                  <input value={form.price} onChange={(e) => updateField('price', e.target.value)} className="field" type="number" min="0" placeholder="Preço em MT" required />
                  <input value={form.pricePeriod} onChange={(e) => updateField('pricePeriod', e.target.value)} className="field" placeholder="/mês (arrendamento)" />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <input value={form.bedrooms} onChange={(e) => updateField('bedrooms', e.target.value)} className="field" type="number" min="0" placeholder="Q" title="Quartos" />
                  <input value={form.bathrooms} onChange={(e) => updateField('bathrooms', e.target.value)} className="field" type="number" min="0" placeholder="B" title="Banhos" />
                  <input value={form.suites} onChange={(e) => updateField('suites', e.target.value)} className="field" type="number" min="0" placeholder="S" title="Suites" />
                  <input value={form.parking} onChange={(e) => updateField('parking', e.target.value)} className="field" type="number" min="0" placeholder="P" title="Estacionamento" />
                </div>
                <input value={form.area} onChange={(e) => updateField('area', e.target.value)} className="field" type="number" min="0" placeholder="Área em m²" />
                <textarea value={form.description} onChange={(e) => updateField('description', e.target.value)} className="field min-h-20" placeholder="Descrição curta" />
                <textarea value={form.longDescription} onChange={(e) => updateField('longDescription', e.target.value)} className="field min-h-20" placeholder="Detalhes adicionais (separe parágrafos por linha)" />
                <input value={form.highlights} onChange={(e) => updateField('highlights', e.target.value)} className="field" placeholder="Destaques separados por vírgulas" />
                <input value={form.amenities} onChange={(e) => updateField('amenities', e.target.value)} className="field" placeholder="Comodidades separadas por vírgulas" />
                <div className="grid grid-cols-2 gap-3">
                  <select value={form.status} onChange={(e) => updateField('status', e.target.value as Property['status'])} className="field"><option>Disponível</option><option>Reservado</option><option>Em Negociação</option><option>Arquivado</option></select>
                  <label className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[#DDE3EE] text-sm"><input type="checkbox" checked={form.featured} onChange={(e) => updateField('featured', e.target.checked)} /> Destaque</label>
                </div>

                <div className="border border-dashed border-[#C7CFDC] rounded-2xl p-4">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div><p className="text-sm font-semibold">Fotografias</p><p className="text-xs text-[#667085]">{form.images.length} adicionada(s)</p></div>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={handleAddImageUrl} className="px-3 py-2 rounded-lg border border-[#DDE3EE] text-xs font-semibold">URL</button>
                      <label className="px-3 py-2 rounded-lg bg-[#14245F] text-white text-xs font-semibold cursor-pointer inline-flex items-center gap-2">
                        <Upload className="w-3.5 h-3.5" /> {uploading ? 'A enviar…' : 'Upload'}
                        <input type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} disabled={uploading} />
                      </label>
                    </div>
                  </div>
                  {form.images.length > 0 && (
                    <div className="grid grid-cols-4 gap-2">
                      {form.images.map((src, index) => (
                        <div key={src + index} className="relative aspect-square rounded-lg overflow-hidden bg-[#EEF2F6]">
                          <img src={src} alt="" className="w-full h-full object-cover" />
                          <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 p-1 rounded-full bg-white/90 text-[#B42318]"><X className="w-3 h-3" /></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {formError && <p className="text-sm text-[#B42318]">{formError}</p>}

                <button disabled={saving || uploading} className="w-full py-3 rounded-xl bg-[#D93030] text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
                  {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : editingId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {saving ? 'A guardar…' : editingId ? 'Guardar alterações' : 'Publicar imóvel'}
                </button>
              </form>
            </section>

            <section>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                <div className="bg-white border border-[#DDE3EE] rounded-2xl p-4"><span className="text-xs text-[#667085]">Imóveis</span><strong className="block text-2xl mt-1">{stats.total}</strong></div>
                <div className="bg-white border border-[#DDE3EE] rounded-2xl p-4"><span className="text-xs text-[#667085]">Em destaque</span><strong className="block text-2xl mt-1">{stats.featured}</strong></div>
                <div className="bg-white border border-[#DDE3EE] rounded-2xl p-4"><span className="text-xs text-[#667085]">Visitas pendentes</span><strong className="block text-2xl mt-1 text-[#B42318]">{stats.pending}</strong></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {properties.map((property) => (
                  <article key={property.id} className="bg-white border border-[#DDE3EE] rounded-2xl overflow-hidden">
                    <div className="aspect-[16/9] bg-[#EEF2F6]">
                      <img src={property.images?.[0]} alt={property.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div><h3 className="font-semibold text-[#14245F]">{property.title}</h3><p className="text-xs text-[#667085] mt-1 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{property.neighborhood || property.location}</p></div>
                        <span className="text-[10px] uppercase font-bold px-2 py-1 rounded-full bg-[#EEF2FA]">{property.status}</span>
                      </div>
                      <div className="flex items-center justify-between mt-4"><strong>{property.priceDisplay}</strong><div className="flex items-center gap-1"><button onClick={() => startEdit(property)} className="p-2 rounded-lg hover:bg-[#F2F4F7] text-[#14245F]" title="Editar"><Edit3 className="w-4 h-4" /></button><button onClick={() => void handleDelete(property.id)} className="p-2 rounded-lg hover:bg-[#FDECEC] text-[#B42318]" title="Eliminar"><Trash2 className="w-4 h-4" /></button></div></div>
                    </div>
                  </article>
                ))}
                {!properties.length && <div className="bg-white border border-dashed border-[#C7CFDC] rounded-2xl p-10 text-center text-[#667085]">Ainda não há imóveis. Adicione o primeiro no formulário.</div>}
              </div>
            </section>
          </div>
        ) : (
          <section>
            <div className="mb-6"><span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#D93030]">Pedidos recebidos</span><h2 className="text-2xl font-semibold mt-1">Visitas</h2></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {visits.map((visit) => (
                <article key={visit.id} className="bg-white border border-[#DDE3EE] rounded-2xl p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div><p className="text-xs text-[#667085]">{visit.createdAt ? new Date(visit.createdAt).toLocaleString('pt-MZ') : ''}</p><h3 className="font-semibold text-lg mt-1">{visit.propertyTitle}</h3></div>
                    <span className="text-[10px] uppercase font-bold px-2 py-1 rounded-full bg-[#FDECEC] text-[#B42318]">{visit.status || 'pendente'}</span>
                  </div>
                  <div className="space-y-2 mt-4 text-sm text-[#4B5565]">
                    <p className="flex gap-2 items-center"><Home className="w-4 h-4" /> {visit.clientName}</p>
                    <p className="flex gap-2 items-center"><Mail className="w-4 h-4" /> {visit.clientEmail}</p>
                    <p className="flex gap-2 items-center">{visit.clientPhone}</p>
                    <p className="flex gap-2 items-center"><CalendarDays className="w-4 h-4" /> {visit.preferredDate} às {visit.preferredTime}</p>
                    {visit.message && <p className="bg-[#F5F7FA] rounded-xl p-3 text-xs">{visit.message}</p>}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-5">
                    <button onClick={() => void markVisit(visit.id, 'confirmada')} className="px-3 py-2 rounded-lg bg-[#ECFDF3] text-[#027A48] text-xs font-semibold flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Confirmar</button>
                    <a href={'https://wa.me/' + String(visit.clientPhone || '').replace(/\D/g, '')} target="_blank" rel="noopener noreferrer" className="px-3 py-2 rounded-lg border border-[#DDE3EE] text-xs font-semibold">WhatsApp</a>
                  </div>
                </article>
              ))}
              {!visits.length && <div className="bg-white border border-dashed border-[#C7CFDC] rounded-2xl p-10 text-center text-[#667085]">Ainda não existem pedidos de visita.</div>}
            </div>
          </section>
        )}
      </main>

      <style>{'.field{width:100%;padding:10px 12px;border:1px solid #DDE3EE;border-radius:12px;background:#FAFBFC;color:#14245F;font-size:14px;outline:none}.field:focus{border-color:#14245F;box-shadow:0 0 0 3px rgba(20,36,95,.08)}'}</style>
    </div>
  );
};
