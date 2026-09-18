import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { PROPERTIES } from '../data/properties';
import { Property } from '../types';

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>(PROPERTIES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true); setError('');
    try {
      const snapshot = await getDocs(collection(db, 'properties'));
      if (snapshot.empty) { setProperties(PROPERTIES); }
      else {
        const remote = snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as Property))
          .filter((item) => item.status !== 'Arquivado')
          .sort((a, b) => String((b as any).createdAt || '').localeCompare(String((a as any).createdAt || '')));
        setProperties(remote);
      }
    } catch (err) {
      console.error('Falha ao carregar imóveis:', err);
      setError('Não foi possível actualizar os imóveis agora.');
      setProperties(PROPERTIES);
    } finally { setLoading(false); }
  };

  useEffect(() => { void load(); }, []);
  return { properties, loading, error, refresh: load };
}
