import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import { AuthChangeEvent, Session, User } from '@supabase/supabase-js';
import {
  CalendarDays, Check, Edit3, Home, LogOut, Mail, MapPin, Plus,
  RefreshCw, Save, Trash2, Upload, X,
} from 'lucide-react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { BRAND_CONFIG } from '../data/config';
import { OperationType, Property, PropertyType } from '../types';
import { BrandLogo } from '../components/BrandLogo';

type PropertyForm = {
  title: string; operation: OperationType; type: PropertyType; location: string;
  neighborhood: string; address: string; price: string; pricePeriod: string;
  rooms: string; bathrooms: string; bedrooms: string; kitchens: string; area: string; parking: string;
  description: string; longDescription: string; highlights: string; amenities: string;
  images: string[]; featured: boolean; status: Property['status'];
};

const emptyForm: PropertyForm = {
  title: '', operation: 'venda', type: 'Moradia', location: '', neighborhood: '', address: '',
  price: '', pricePeriod: '', rooms: '', bathrooms: '', bedrooms: '', kitchens: '', area: '', parking: '',
  description: '', longDescription: '', highlights: '', amenities: '', images: [],
  featured: false, status: 'Disponível',
};

const slugify = (value: string) => value.normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '').toLowerCase()
  .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const splitValues = (value: string) => value.split(/[\n,]/).map((v) => v.trim()).filter(Boolean);

const mapProperty = (row: any): Property => ({
  id: String(row.id),
  slug: row.slug || '',
  title: row.title || '',
  operation: row.operation,
  type: row.type,
  location: row.location || '',
  neighborhood: row.neighborhood || row.location || '',
  city: row.city || 'Maputo',
  address: row.address || '',
  price: Number(row.price || 0),
  priceDisplay: row.price_display || '',
  pricePeriod: row.price_period || undefined,
  currency: row.currency || 'MT',
  bedrooms: Number(row.bedrooms || 0),
  bathrooms: Number(row.bathrooms || 0),
  suites: Number(row.suites || 0),
  area: Number(row.area || 0),
  parking: Number(row.parking || 0),
  yearBuilt: row.year_built ? Number(row.year_built) : undefined,
  featured: Boolean(row.featured),
  tag: row.tag || undefined,
  description: row.description || '',
  longDescription: row.long_description || [],
  highlights: row.highlights || [],
  amenities: row.amenities || [],
  images: row.images || [],
  agent: row.agent || { name: BRAND_CONFIG.name, role: 'Atendimento', phone: BRAND_CONFIG.phone, email: BRAND_CONFIG.email, photo: '' },
  status: row.status || 'Disponível',
});

export const AdminPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState(BRAND_CONFIG.admin.email);
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(true);
  const [loginError, setLoginError] = useState('');

  const [tab, setTab] = useState<'properties' | 'visits'>('properties');
  const [properties, setProperties] = useState<Property[]>([]);
  const [visits, setVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<PropertyForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const isAdmin = user?.email?.toLowerCase() === BRAND_CONFIG.admin.email.toLowerCase();

  const loadData = async () => {
    if (!isAdmin) return;
    setLoading(true);
    setError('');

    const [{ data: propertyRows, error: propertyError }, { data: visitRows, error: visitError }] = await Promise.all([
      supabase.from('properties').select('*').order('created_at', { ascending: false }),
      supabase.from('visits').select('*').order('created_at', { ascending: false }),
    ]);

    if (propertyError || visitError) {
      console.error(propertyError || visitError);
      setError('Não foi possível carregar os dados. Confirme se executou o SQL do Supabase e criou a conta do administrador.');
    } else {
      setProperties((propertyRows || []).map(mapProperty));
      setVisits(visitRows || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    let active = true;
    void supabase.auth.getSession().then(({ data }) => {
      if (active) {
        setUser(data.session?.user ?? null);
        setAuthLoading(false);
      }
    });

    const { data } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (isAdmin) void loadData();
  }, [isAdmin]);

  const setField = <K extends keyof PropertyForm>(key: K, value: PropertyForm[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const reset = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError('');
  };

  const login = async (event: FormEvent) => {
    event.preventDefault();
    setLoginError('');

    if (!isSupabaseConfigured) {
      setLoginError('O site ainda não recebeu as variáveis VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY no Vercel.');
      return;
    }

    if (email.toLowerCase().trim() !== BRAND_CONFIG.admin.email.toLowerCase()) {
      setLoginError('Esta área está reservada ao administrador da 2S.');
      return;
    }

    setAuthLoading(true);
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (authError) {
      console.error('Supabase Auth error:', authError);
      const msg = String(authError.message || '').toLowerCase();
      if (msg.includes('email not confirmed') || msg.includes('email not verified')) {
        setLoginError('O email desta conta Supabase ainda não foi confirmado. Confirme-o em Authentication → Users ou desactive Confirm Email para esta conta.');
      } else if (msg.includes('invalid login credentials')) {
        setLoginError('Credenciais inválidas. Confirme que este email existe no Supabase Authentication e que a palavra-passe é a definida no Supabase.');
      } else {
        setLoginError('Supabase não aceitou o login: ' + authError.message);
      }
    }
    setAuthLoading(false);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    reset();
  };

  const edit = (property: Property) => {
    setEditingId(property.id);
    setForm({
      title: property.title, operation: property.operation, type: property.type,
      location: property.location, neighborhood: property.neighborhood, address: property.address,
      price: String(property.price), pricePeriod: property.pricePeriod || '',
      rooms: String(property.rooms || ''), bathrooms: String(property.bathrooms || ''), bedrooms: String(property.bedrooms || ''), kitchens: String(property.kitchens || ''),
      suites: String(property.suites || 0), area: String(property.area), parking: String(property.parking),
      description: property.description, longDescription: property.longDescription.join('\n'),
      highlights: property.highlights.join(', '), amenities: property.amenities.join(', '),
      images: property.images, featured: property.featured, status: property.status,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const uploadImages = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return;
    const files = Array.from(event.target.files || []).filter((file) => file.type.startsWith('image/'));
    if (!files.length) return;

    setUploading(true);
    setError('');
    try {
      const urls: string[] = [];
      for (const file of files) {
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
        const path = 'properties/' + user.id + '/' + Date.now() + '-' + safeName;
        const { error: uploadError } = await supabase.storage.from('property-images').upload(path, file, {
          contentType: file.type,
          upsert: false,
        });
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from('property-images').getPublicUrl(path);
        urls.push(data.publicUrl);
      }
      setForm((current) => ({ ...current, images: [...current.images, ...urls] }));
    } catch (uploadError) {
      console.error(uploadError);
      setError('Falha no upload. Confirme se criou o bucket property-images e executou o SQL.');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const saveProperty = async (event: FormEvent) => {
    event.preventDefault();
    if (!isAdmin) return;

    if (!form.title.trim() || !form.location.trim() || !form.address.trim() || !form.price.trim() || !form.images.length) {
      setError('Preencha título, localização, morada, preço e pelo menos uma fotografia.');
      return;
    }

    setSaving(true);
    setError('');

    const priceNumber = Number(form.price);
    const payload = {
      slug: slugify(form.title),
      title: form.title.trim(),
      operation: form.operation,
      type: form.type,
      location: form.location.trim(),
      neighborhood: form.neighborhood.trim() || form.location.trim(),
      city: 'Maputo',
      address: form.address.trim(),
      price: priceNumber,
      price_display: new Intl.NumberFormat('pt-MZ').format(priceNumber) + ' MT',
      price_period: form.operation === 'arrendamento' ? (form.pricePeriod.trim() || '/mês') : null,
      currency: 'MT',
      rooms: Number(form.rooms) || 0,
      bathrooms: Number(form.bathrooms) || 0,
      bedrooms: Number(form.bedrooms) || 0,
      kitchens: Number(form.kitchens) || 0,
      suites: Number(form.suites) || 0,
      area: Number(form.area) || 0,
      parking: Number(form.parking) || 0,
      featured: form.featured,
      description: form.description.trim(),
      long_description: splitValues(form.longDescription),
      highlights: splitValues(form.highlights),
      amenities: splitValues(form.amenities),
      images: form.images,
      agent: { name: BRAND_CONFIG.name, role: 'Atendimento', phone: BRAND_CONFIG.phone, email: BRAND_CONFIG.email, photo: '' },
      status: form.status,
      updated_at: new Date().toISOString(),
    };

    const result = editingId
      ? await supabase.from('properties').update(payload).eq('id', editingId)
      : await supabase.from('properties').insert(payload);

    if (result.error) {
      console.error(result.error);
      setError('Não foi possível guardar o imóvel: ' + result.error.message);
    } else {
      reset();
      await loadData();
    }

    setSaving(false);
  };

  const removeProperty = async (id: string) => {
    if (!window.confirm('Eliminar este imóvel do site?')) return;
    const { error: deleteError } = await supabase.from('properties').delete().eq('id', id);
    if (deleteError) setError('Não foi possível eliminar o imóvel.');
    else await loadData();
  };

  const updateVisit = async (id: string, status: string) => {
    const { error: updateError } = await supabase.from('visits').update({ status }).eq('id', id);
    if (updateError) setError('Não foi possível actualizar a visita.');
    else await loadData();
  };

  const stats = useMemo(() => ({
    total: properties.filter((p) => p.status !== 'Arquivado').length,
    featured: properties.filter((p) => p.featured && p.status !== 'Arquivado').length,
    pending: visits.filter((v) => !v.status || v.status === 'pendente').length,
  }), [properties, visits]);

  if (authLoading) return <div className="min-h-screen grid place-items-center bg-[#F5F7FA]"><RefreshCw className="w-6 h-6 animate-spin text-[#D93030]" /></div>;

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen grid place-items-center bg-[#F5F7FA] px-4">
        <div className="w-full max-w-md bg-white rounded-3xl border border-[#DDE3EE] shadow-xl p-7">
          <BrandLogo className="justify-center mb-7" />
          <div className="text-center mb-6">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#D93030] font-bold">Área privada</p>
            <h1 className="text-2xl font-semibold text-[#14245F] mt-2">Administrador 2S</h1>
            <p className="text-sm text-[#667085] mt-2">Apenas a conta autorizada pode entrar neste painel.</p>
          </div>
          <form onSubmit={login} className="space-y-3">
            <input className="field" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <input className="field" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Palavra-passe" />
            {loginError && <p className="text-sm text-[#B42318]">{loginError}</p>}
            <button className="w-full py-3 rounded-xl bg-[#14245F] text-white font-semibold disabled:opacity-50" disabled={!password}>Entrar</button>
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
          <div className="flex items-center gap-1.5">
            <button onClick={() => setTab('properties')} className={'px-3 py-2 rounded-lg text-sm font-semibold ' + (tab === 'properties' ? 'bg-[#EEF2FA]' : 'text-[#667085]')}>Imóveis</button>
            <button onClick={() => setTab('visits')} className={'px-3 py-2 rounded-lg text-sm font-semibold ' + (tab === 'visits' ? 'bg-[#FDECEC] text-[#B42318]' : 'text-[#667085]')}>Visitas {stats.pending ? '(' + stats.pending + ')' : ''}</button>
            <button onClick={() => void loadData()} className="p-2 text-[#667085]" title="Actualizar"><RefreshCw className={'w-4 h-4 ' + (loading ? 'animate-spin' : '')} /></button>
            <button onClick={() => void logout()} className="p-2 text-[#B42318]" title="Sair"><LogOut className="w-4 h-4" /></button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-7">
        {tab === 'properties' ? (
          <div className="grid grid-cols-1 xl:grid-cols-[390px_1fr] gap-6 items-start">
            <section className="bg-white border border-[#DDE3EE] rounded-3xl p-6 xl:sticky xl:top-24 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div><p className="text-[10px] uppercase tracking-[0.2em] text-[#D93030] font-bold">{editingId ? 'Editar' : 'Novo'}</p><h2 className="text-xl font-semibold">{editingId ? 'Editar imóvel' : 'Adicionar imóvel'}</h2></div>
                {editingId && <button onClick={reset} className="p-2"><X className="w-4 h-4" /></button>}
              </div>

              <form onSubmit={saveProperty} className="space-y-3">
                <input className="field" value={form.title} onChange={(e) => setField('title', e.target.value)} placeholder="Título" />
                <div className="grid grid-cols-2 gap-2">
                  <select className="field" value={form.operation} onChange={(e) => setField('operation', e.target.value as OperationType)}><option value="venda">Venda</option><option value="arrendamento">Arrendamento</option></select>
                  <select className="field" value={form.type} onChange={(e) => setField('type', e.target.value as PropertyType)}><option>Moradia</option><option>Apartamento</option><option>Penthouse</option><option>Terreno</option><option>Escritório</option></select>
                </div>
                <div className="grid grid-cols-2 gap-2"><input className="field" value={form.location} onChange={(e) => setField('location', e.target.value)} placeholder="Zona" /><input className="field" value={form.neighborhood} onChange={(e) => setField('neighborhood', e.target.value)} placeholder="Bairro" /></div>
                <input className="field" value={form.address} onChange={(e) => setField('address', e.target.value)} placeholder="Morada / localização" />
                <div className="grid grid-cols-2 gap-2"><input className="field" value={form.price} onChange={(e) => setField('price', e.target.value)} type="number" min="0" placeholder="Preço MT" /><input className="field" value={form.pricePeriod} onChange={(e) => setField('pricePeriod', e.target.value)} placeholder="/mês" /></div>
                <div className="grid grid-cols-4 gap-2"><label className="compact-stat"><span>S</span><small>Salas</small><input value={form.rooms} onChange={(e) => setField('rooms', e.target.value)} type="number" min="0" placeholder="—" /></label><label className="compact-stat"><span>B</span><small>Banhos</small><input value={form.bathrooms} onChange={(e) => setField('bathrooms', e.target.value)} type="number" min="0" placeholder="—" /></label><label className="compact-stat"><span>Q</span><small>Quartos</small><input value={form.bedrooms} onChange={(e) => setField('bedrooms', e.target.value)} type="number" min="0" placeholder="—" /></label><label className="compact-stat"><span>C</span><small>Cozinhas</small><input value={form.kitchens} onChange={(e) => setField('kitchens', e.target.value)} type="number" min="0" placeholder="—" /></label></div>
                <input className="field" value={form.area} onChange={(e) => setField('area', e.target.value)} type="number" min="0" placeholder="Área m²" />
                <textarea className="field min-h-20" value={form.description} onChange={(e) => setField('description', e.target.value)} placeholder="Descrição curta" />
                <textarea className="field min-h-20" value={form.longDescription} onChange={(e) => setField('longDescription', e.target.value)} placeholder="Detalhes adicionais — uma linha por parágrafo" />
                <input className="field" value={form.highlights} onChange={(e) => setField('highlights', e.target.value)} placeholder="Destaques — separados por vírgulas" />
                <input className="field" value={form.amenities} onChange={(e) => setField('amenities', e.target.value)} placeholder="Comodidades — separadas por vírgulas" />
                <div className="grid grid-cols-2 gap-2"><select className="field" value={form.status} onChange={(e) => setField('status', e.target.value as Property['status'])}><option>Disponível</option><option>Reservado</option><option>Em Negociação</option><option>Arquivado</option></select><label className="flex items-center gap-2 px-3 rounded-xl border border-[#DDE3EE] text-sm"><input type="checkbox" checked={form.featured} onChange={(e) => setField('featured', e.target.checked)} /> Destaque</label></div>

                <div className="border border-dashed border-[#C7CFDC] rounded-2xl p-4">
                  <div className="flex items-center justify-between gap-2"><div><p className="text-sm font-semibold">Fotografias</p><p className="text-xs text-[#667085]">{form.images.length} adicionada(s)</p></div><label className="cursor-pointer px-3 py-2 rounded-lg bg-[#14245F] text-white text-xs font-semibold inline-flex items-center gap-2"><Upload className="w-3.5 h-3.5" /> {uploading ? 'A enviar…' : 'Upload'}<input className="hidden" type="file" accept="image/*" multiple onChange={uploadImages} disabled={uploading} /></label></div>
                  {form.images.length > 0 && <div className="grid grid-cols-4 gap-2 mt-3">{form.images.map((src, i) => <div key={src + i} className="relative aspect-square rounded-lg overflow-hidden bg-[#EEF2F6]"><img src={src} alt="" className="w-full h-full object-cover" /><button type="button" onClick={() => setField('images', form.images.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 p-1 rounded-full bg-white text-[#B42318]"><X className="w-3 h-3" /></button></div>)}</div>}
                </div>

                {error && <p className="text-sm text-[#B42318]">{error}</p>}
                <button disabled={saving || uploading} className="w-full py-3 rounded-xl bg-[#D93030] text-white font-semibold">{saving ? 'A guardar…' : editingId ? 'Guardar alterações' : 'Publicar imóvel'}</button>
              </form>
            </section>

            <section>
              <div className="grid sm:grid-cols-3 gap-3 mb-5">
                <div className="bg-white border border-[#DDE3EE] rounded-2xl p-4"><span className="text-xs text-[#667085]">Imóveis</span><strong className="block text-2xl mt-1">{stats.total}</strong></div>
                <div className="bg-white border border-[#DDE3EE] rounded-2xl p-4"><span className="text-xs text-[#667085]">Destaques</span><strong className="block text-2xl mt-1">{stats.featured}</strong></div>
                <div className="bg-white border border-[#DDE3EE] rounded-2xl p-4"><span className="text-xs text-[#667085]">Visitas pendentes</span><strong className="block text-2xl mt-1 text-[#B42318]">{stats.pending}</strong></div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {properties.map((property) => <article key={property.id} className="bg-white border border-[#DDE3EE] rounded-2xl overflow-hidden"><div className="aspect-[16/9] bg-[#EEF2F6]"><img src={property.images[0]} alt={property.title} className="w-full h-full object-cover" /></div><div className="p-4"><div className="flex justify-between gap-3"><div><h3 className="font-semibold">{property.title}</h3><p className="text-xs text-[#667085] mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" />{property.neighborhood || property.location}</p></div><span className="text-[10px] px-2 py-1 rounded-full bg-[#F1F4F8]">{property.status}</span></div><div className="flex items-center justify-between mt-3"><strong>{property.priceDisplay}</strong><div><button onClick={() => edit(property)} className="p-2 text-[#14245F]"><Edit3 className="w-4 h-4" /></button><button onClick={() => void removeProperty(property.id)} className="p-2 text-[#B42318]"><Trash2 className="w-4 h-4" /></button></div></div></div></article>)}
                {!properties.length && <div className="bg-white border border-dashed border-[#C7CFDC] rounded-2xl p-10 text-center text-[#667085]">Ainda não há imóveis publicados.</div>}
              </div>
            </section>
          </div>
        ) : (
          <section>
            <div className="mb-5"><p className="text-[10px] uppercase tracking-[0.2em] text-[#D93030] font-bold">Pedidos recebidos</p><h2 className="text-2xl font-semibold mt-1">Visitas</h2></div>
            <div className="grid lg:grid-cols-2 gap-4">
              {visits.map((visit) => <article key={visit.id} className="bg-white border border-[#DDE3EE] rounded-2xl p-5"><div className="flex justify-between gap-3"><div><p className="text-xs text-[#667085]">{visit.created_at ? new Date(visit.created_at).toLocaleString('pt-MZ') : ''}</p><h3 className="font-semibold mt-1">{visit.property_title}</h3></div><span className="text-[10px] px-2 py-1 rounded-full bg-[#FDECEC] text-[#B42318]">{visit.status}</span></div><div className="mt-4 space-y-2 text-sm text-[#566176]"><p className="flex gap-2 items-center"><Home className="w-4 h-4" />{visit.client_name}</p><p className="flex gap-2 items-center"><Mail className="w-4 h-4" />{visit.client_email}</p><p>{visit.client_phone}</p><p className="flex gap-2 items-center"><CalendarDays className="w-4 h-4" />{visit.preferred_date} às {visit.preferred_time}</p>{visit.message && <p className="bg-[#F5F7FA] rounded-xl p-3 text-xs">{visit.message}</p>}</div><div className="flex gap-2 mt-5"><button onClick={() => void updateVisit(visit.id, 'confirmada')} className="px-3 py-2 rounded-lg bg-[#ECFDF3] text-[#027A48] text-xs font-semibold"><Check className="w-3.5 h-3.5 inline mr-1" />Confirmar</button><a href={'https://wa.me/' + String(visit.client_phone || '').replace(/\D/g, '')} target="_blank" rel="noopener noreferrer" className="px-3 py-2 rounded-lg border border-[#DDE3EE] text-xs font-semibold">WhatsApp</a></div></article>)}
              {!visits.length && <div className="bg-white border border-dashed border-[#C7CFDC] rounded-2xl p-10 text-center text-[#667085]">Ainda não existem pedidos de visita.</div>}
            </div>
          </section>
        )}
      </main>
      <style>{'.field{width:100%;box-sizing:border-box;padding:11px 12px;border:1px solid #DDE3EE;border-radius:12px;background:#FAFBFC;color:#14245F;font-size:14px;line-height:1.35;outline:none}.field:focus{border-color:#14245F;box-shadow:0 0 0 3px rgba(20,36,95,.08)}.compact-stat{display:flex;flex-direction:column;gap:2px;padding:9px 8px;border:1px solid #DDE3EE;border-radius:12px;background:#FAFBFC}.compact-stat span{font-size:13px;font-weight:800;color:#14245F}.compact-stat small{font-size:9px;color:#7A8495}.compact-stat input{width:100%;box-sizing:border-box;margin-top:3px;border:0;background:transparent;outline:none;font-size:15px;font-weight:600;color:#14245F;min-width:0}.compact-stat input::placeholder{color:#A7AFBC}'}</style>
    </div>
  );
};
