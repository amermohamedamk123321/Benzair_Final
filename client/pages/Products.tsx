import { useEffect, useState } from 'react';
import Header from '../components/Header';
import { Link } from 'react-router-dom';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { useLocale } from '@/hooks/useLocale';
import { cn } from '@/lib/utils';

interface ImportRecord { quantity: number; date: string }
interface ExportRecord { quantity: number; date: string; destination: string }
interface Product { id: string; name: string; unit: string; price: number; currency?: 'USD' | 'AFN'; imageUrl?: string; createdAt: string; imports: ImportRecord[]; exports: ExportRecord[]; available?: number }

interface OrderInput { productId: string; productName: string; quantity: number; customerName: string; customerEmail?: string; destination?: string; notes?: string }

function formatDate(iso?: string) {
  if (!iso) return '-';
  const d = new Date(iso);
  return d.toLocaleDateString();
}

const Products: React.FC = () => {
  const { t, dir } = useLocale();
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderFor, setOrderFor] = useState<Product | null>(null);
  const [order, setOrder] = useState<OrderInput | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [serverIds, setServerIds] = useState<Set<string>>(new Set());
  const [notify, setNotify] = useState<{open:boolean; type:'success'|'error'; message:string}>({open:false,type:'success',message:''});
  const isAdmin = !!user?.isAuthenticated;

  const fetchJson = async (input: RequestInfo | URL, init?: RequestInit, { retries = 1, timeoutMs = 10000 }: { retries?: number; timeoutMs?: number } = {}) => {
    for (let attempt = 0; attempt <= retries; attempt++) {
      const controller = new AbortController();
      const t = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const res = await fetch(input, { ...(init||{}), signal: controller.signal });
        clearTimeout(t);
        if (!res.ok) {
          let msg = 'Request failed';
          try { const j:any = await res.json(); if (j?.error) msg = j.error; } catch {}
          throw new Error(msg);
        }
        return res.json();
      } catch (err:any) {
        clearTimeout(t);
        const isLast = attempt === retries;
        if (isLast) throw err;
        await new Promise(r => setTimeout(r, 500));
      }
    }
    throw new Error('Request failed');
  };

  useEffect(() => {
    (async () => {
      try {
        const serverData: any[] = await fetchJson('/api/products', undefined, { retries: 2, timeoutMs: 8000 });
        let merged: any[] = Array.isArray(serverData) ? [...serverData] : [];
        setServerIds(new Set((serverData||[]).map((p:any)=>p.id)));
        try {
          const local = localStorage.getItem('products-local');
          const localList: any[] = local ? JSON.parse(local) : [];
          const map = new Map<string, any>(merged.map((p:any)=>[p.id, p]));
          for (const lp of localList) { if (!map.has(lp.id)) map.set(lp.id, lp); }
          merged = Array.from(map.values());
        } catch {}
        setProducts(merged as Product[]);
      } catch (e: any) {
        // Fallback to local-only if server fails
        try {
          const local = localStorage.getItem('products-local');
          const localList: any[] = local ? JSON.parse(local) : [];
          setProducts(localList as Product[]);
          setError(null);
        } catch (err:any) {
          setError(e.message || 'Failed to load');
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const openOrder = (p: Product) => {
    setOrderFor(p);
    setOrder({ productId: p.id, productName: p.name, quantity: 1, customerName: '', customerEmail: '', destination: '', notes: '' });
  };

  const ensureServerProduct = async (p: Product): Promise<string> => {
    if (serverIds.has(p.id)) return p.id;
    const payload: any = {
      name: p.name,
      unit: p.unit,
      price: p.price,
      currency: p.currency || 'USD',
      source: (p as any).source || 'bought',
      imageUrl: p.imageUrl || '',
      initialStock: Number(p.available ?? 0)
    };
    const created = await fetchJson('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }, { retries: 1, timeoutMs: 8000 });
    const newId: string = created.id;
    // Update products state and local storage with new id
    setProducts(prev => prev.map(x => x.id === p.id ? { ...x, id: newId, imports: created.imports||[], exports: created.exports||[], available: created.available } as Product : x));
    setServerIds(prev => new Set([...Array.from(prev), newId]));
    try {
      const key = 'products-local';
      const s = localStorage.getItem(key);
      const list: any[] = s ? JSON.parse(s) : [];
      const next = list.map(x => x.id === p.id ? { ...x, id: newId } : x);
      localStorage.setItem(key, JSON.stringify(next));
    } catch {}
    return newId;
  };

  const submitOrder = async () => {
    if (!order || !orderFor) return;
    const available = Number(orderFor.available ?? 0);
    if (order.quantity > available) { setNotify({open:true,type:'error',message:'Requested quantity exceeds available stock'}); return; }

    setSubmitting(true);
    try {
      let productIdToUse = order.productId;
      if (!serverIds.has(order.productId)) {
        productIdToUse = await ensureServerProduct(orderFor);
      }
      const payload = { ...order, productId: productIdToUse };
      await fetchJson('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }, { retries: 1, timeoutMs: 8000 });
      setOrderFor(null);
      setOrder(null);
      setNotify({open:true,type:'success',message:'Order submitted successfully. We will contact you soon.'});
    } catch (e: any) {
      setNotify({open:true,type:'error',message:String(e.message || 'Failed to submit')});
    } finally {
      setSubmitting(false);
    }
  };

  const totalImported = (p: Product) => (p.imports || []).reduce((s, r) => s + Number(r.quantity || 0), 0);

  const visibleInventory = products.filter(p => (p.available ?? 0) > 0);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Header />

      <section className="container mx-auto px-6 pt-14 pb-10 md:pt-20 md:pb-6">
        <div className="text-center">
          <div className={cn('inline-flex items-center space-x-3 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 px-5 py-2 rounded-full mb-5 border border-blue-100 dark:border-gray-700', { 'space-x-reverse': dir==='rtl' })}>
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">{t('products.tag')}</span>
          </div>
          <h1 className="text-[56px] leading-[64.4px] font-semibold font-vazirmatn text-center text-gray-900 dark:text-gray-100 text-shadow-primary">{t('products.titleFull')}</h1>
          <p className="mt-4 text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto text-center">{t('products.lead')}</p>
        </div>
      </section>

      <section className="container mx-auto px-6 pb-20">
        {loading && (
          <div className="text-center text-gray-600 dark:text-gray-300">{t('loading')}</div>
        )}
        {error && (
          <div className="text-center text-red-600">{t('anErrorOccurred')}</div>
        )}
        {!loading && !error && (
          <>
            <div className="mb-8 mt-6 text-center">
              <h2 className="text-[36px] leading-[40px] font-normal font-vazirmatn tracking-[2px] text-gray-900 dark:text-gray-100 text-center">{t('inventory')}</h2>
            </div>

            <div className="rounded-2xl border border-blue-300 dark:border-blue-800/50 p-4 md:p-6 bg-white/80 dark:bg-gray-900/40">
              {visibleInventory.length === 0 && (
                <div className="text-center text-gray-600 dark:text-gray-300 py-10">{t('noProducts')}</div>
              )}

              <div className="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {visibleInventory.map((p) => (
                <div key={p.id} className="rounded-3xl overflow-hidden bg-white/90 dark:bg-gray-800/80 border border-blue-200 dark:border-gray-600 shadow-lg flex flex-col">
                  <div className="h-56 w-full bg-gray-100 dark:bg-gray-900/60">
                    <img src={p.imageUrl || 'https://via.placeholder.com/640x240?text=No+Image'} alt={p.name} className="w-full h-56 object-contain object-center" />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{p.name}</h3>
                      </div>
                      <div className="px-3 py-1.5 rounded-full bg-amber-200 text-amber-900 dark:bg-amber-900/50 dark:text-amber-200 text-sm font-bold">
                        <span dir="ltr">{p.price.toLocaleString()} {p.currency || 'USD'} / {p.unit}</span>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div className="px-4 py-3 rounded-lg bg-blue-100 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-900/50">
                        <p className="font-medium text-blue-800 dark:text-blue-200">{t('imported')}</p>
                        <p className="text-blue-800/80 dark:text-blue-200/80"><span dir="ltr">{totalImported(p)} {p.unit}</span></p>
                      </div>
                      <div className="px-4 py-3 rounded-lg bg-green-100 dark:bg-green-900/40 border border-green-200 dark:border-green-900/50">
                        <p className="font-medium text-green-800 dark:text-green-200">{t('available')}</p>
                        <p className="text-green-800/80 dark:text-green-200/80"><span dir="ltr">{p.available ?? 0} {p.unit}</span></p>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-1 gap-3 text-sm">
                      <div className="px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700">
                        <p className="font-medium text-gray-800 dark:text-gray-200">{t('dateOfImport')}</p>
                        <p className="text-gray-600 dark:text-gray-400"><span dir="ltr">{formatDate(p.imports[p.imports.length-1]?.date)}</span></p>
                      </div>
                    </div>
                    <div className="mt-6">
                      <button onClick={() => openOrder(p)} className="w-full px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 border border-transparent transition ease-in-out duration-150">{t('order')}</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            </div>

            <div className="mt-16 mb-8 text-center">
              <h2 className="text-[36px] leading-[40px] font-normal font-vazirmatn tracking-[2px] text-gray-900 dark:text-gray-100 text-center">{t('exports')}</h2>
            </div>
            <div className="rounded-2xl border border-green-400 dark:border-green-800/50 p-4 md:p-6 bg-white/80 dark:bg-gray-900/40">
            <div className="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {products.flatMap(p => (p.exports || []).map(e => ({ product: p, rec: e }))).slice(-12).reverse().map(({product: p, rec: e}, idx) => (
                <div key={`${p.id}-${idx}`} className="rounded-3xl overflow-hidden bg-white/90 dark:bg-gray-800/80 border border-green-300 dark:border-green-800/40 shadow-lg flex flex-col">
                  <div className="h-56 w-full bg-gray-100 dark:bg-gray-900/60">
                    <img src={p.imageUrl || 'https://via.placeholder.com/640x240?text=No+Image'} alt={p.name} className="w-full h-56 object-contain object-center" />
                  </div>
                  <div className="p-6 flex-1">
                    <div className="flex items-start justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{p.name}</h3>
                      <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 text-xs font-semibold">{t('export')}</span>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                      <div className="px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700">
                        <p className="font-medium text-gray-800 dark:text-gray-200">{t('quantity')}</p>
                        <p className="text-gray-600 dark:text-gray-400"><span dir="ltr">{e.quantity} {p.unit}</span></p>
                      </div>
                      <div className="px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700">
                        <p className="font-medium text-gray-800 dark:text-gray-200">{t('destination')}</p>
                        <p className="text-gray-600 dark:text-gray-400">{e.destination || '-'}</p>
                      </div>
                      <div className="px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 col-span-2">
                        <p className="font-medium text-gray-800 dark:text-gray-200">{t('date')}</p>
                        <p className="text-gray-600 dark:text-gray-400"><span dir="ltr">{formatDate(e.date)}</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            </div>

            <section className="mt-16 p-8 rounded-3xl border border-blue-100 dark:border-gray-700 bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 shadow-sm">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/40 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-3">
                    <span>✓</span>
                    {t('readyIn24h')}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">{t('needCustomQuote')}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">{t('tellUs')}</p>
                </div>
                <div className="flex">
                  <Link to="/contact" className="px-10 py-4 text-lg rounded-xl bg-blue-600 text-white font-semibold shadow-xl hover:bg-blue-700 transition inline-flex items-center justify-center">
                    {t('getQuote')}
                  </Link>
                </div>
              </div>
            </section>
          </>
        )}
      </section>

      {orderFor && order && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOrderFor(null)}></div>
          <div className="relative w-full max-w-lg mx-auto rounded-2xl p-6 md:p-8 bg-white dark:bg-gray-800 border border-blue-100 dark:border-gray-700 shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">{t('order')} {orderFor.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{t('available')}: <span dir="ltr">{orderFor.available ?? 0} {orderFor.unit}</span> · {t('order')}: <span dir="ltr">{orderFor.price.toLocaleString()} / {orderFor.unit}</span></p>
            <div className="space-y-4">
              <div>
                <label className={cn('block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1', dir==='rtl' && 'text-right')}>{t('contact.form.name')}</label>
                <input dir={dir} value={order.customerName} onChange={(e)=>setOrder({...order, customerName:e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={cn('block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1', dir==='rtl' && 'text-right')}>{t('contact.form.email')}</label>
                  <input dir="ltr" type="email" value={order.customerEmail} onChange={(e)=>setOrder({...order, customerEmail:e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className={cn('block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1', dir==='rtl' && 'text-right')}>{`${t('quantity')} (${orderFor.unit})`}</label>
                  <input dir="ltr" type="number" min={1} max={orderFor.available ?? undefined} value={order.quantity} onChange={(e)=>{ const max = Number(orderFor.available ?? 1); const v = Math.max(1, Math.min(max, Number(e.target.value))); setOrder({...order, quantity:v}); }} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className={cn('block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1', dir==='rtl' && 'text-right')}>{t('destination')}</label>
                <input dir={dir} value={order.destination} onChange={(e)=>setOrder({...order, destination:e.target.value})} placeholder="City / Country" className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className={cn('block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1', dir==='rtl' && 'text-right')}>{t('contact.form.message')}</label>
                <textarea dir={dir} value={order.notes} onChange={(e)=>setOrder({...order, notes:e.target.value})} rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
              </div>
            </div>
            <div className="mt-6 flex gap-3 justify-end">
              <button onClick={()=>setOrderFor(null)} className="px-5 py-3 rounded-xl bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">{t('cancel')}</button>
              <button onClick={submitOrder} disabled={submitting || !order.customerName || !order.quantity} className="px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 disabled:opacity-50">{submitting? t('loading') : t('order')}</button>
            </div>
          </div>
        </div>
      )}

      <Footer />

      {notify.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={()=>setNotify(n=>({ ...n, open:false }))}></div>
          <div className={`relative w-full max-w-md mx-auto rounded-2xl p-6 bg-white dark:bg-gray-800 border ${notify.type==='success'?'border-green-200 dark:border-green-900/40':'border-red-200 dark:border-red-900/40'} shadow-2xl`}>
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${notify.type==='success'?'bg-green-600 text-white':'bg-red-600 text-white'}`}>{notify.type==='success' ? '✓' : '!'}</div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{notify.type==='success'? t('success') : t('error')}</h4>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">{notify.message}</p>
            <div className="mt-4 text-right">
              <button onClick={()=>setNotify(n=>({ ...n, open:false }))} className={`px-4 py-2 rounded-lg ${notify.type==='success'?'bg-green-600 hover:bg-green-700':'bg-red-600 hover:bg-red-700'} text-white`}>{t('close')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
