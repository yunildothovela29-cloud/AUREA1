import { useCallback, useEffect, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { Property } from '../types';

function mapProperty(row: any): Property {
  return {
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
    longDescription: Array.isArray(row.long_description) ? row.long_description : [],
    highlights: Array.isArray(row.highlights) ? row.highlights : [],
    amenities: Array.isArray(row.amenities) ? row.amenities : [],
    images: Array.isArray(row.images) ? row.images : [],
    agent: row.agent || {
      name: '2S Imobiliária & Serviços',
      role: 'Atendimento',
      phone: '+258 84 406 7591',
      email: 'sergio.sulemane@gmail.com',
      photo: '',
    },
    status: row.status || 'Disponível',
  };
}

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');

    if (!isSupabaseConfigured) {
      setProperties([]);
      setError('Supabase ainda não está configurado neste deployment.');
      setLoading(false);
      return;
    }

    const { data, error: queryError } = await supabase
      .from('properties')
      .select('*')
      .neq('status', 'Arquivado')
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false });

    if (queryError) {
      console.error('Erro ao carregar imóveis:', queryError);
      setError('Não foi possível actualizar os imóveis agora.');
      setProperties([]);
    } else {
      setProperties((data || []).map(mapProperty));
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { properties, loading, error, refresh: load };
}
