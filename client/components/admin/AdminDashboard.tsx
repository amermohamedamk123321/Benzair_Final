import React, { useState, useEffect, ChangeEvent } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLocale } from '@/hooks/useLocale';
import { cn } from '@/lib/utils';

interface ContentData {
  heroTitle: string;
  heroSubtitle: string;
  aboutText: string;
  companyDescription: string;
  contactEmail: string;
  contactAddress: string;
  instagramUrl?: string;
  facebookUrl?: string;
  whatsappUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  profileDocumentName?: string;
  profileDocumentData?: string;
}

// Helper: fetch external image and convert to data URL (returns null on failure)
const fetchImageAsDataUrl = async (url: string, timeout = 10000): Promise<string | null> => {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise<string | null>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || null));
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch (e) {
    return null;
  }
};

const createTempId = () => 'temp-' + String(Date.now()) + '-' + Math.random().toString(36).slice(2, 8);

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { t, dir } = useLocale();
  const [activeTab, setActiveTab] = useState<string>('products');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const [contentData, setContentData] = useState<ContentData>(() => {
    try {
      const saved = localStorage.getItem('website-content');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          heroTitle: parsed.heroTitle || 'Premium Afghan Dried Fruits',
          heroSubtitle: parsed.heroSubtitle || 'Sourced directly from contracted farmers across Afghanistan',
          aboutText: parsed.aboutText || 'Benazir Yakta Trading Company is a pioneering women-led Afghan exporter specializing in premium dried fruits, nuts, and spices.',
          companyDescription: parsed.companyDescription || 'Premium Afghan dried fruits, nuts, and spices. Empowering women, supporting communities.',
          contactEmail: parsed.contactEmail || 'info@benaziryakta.com',
          contactAddress: parsed.contactAddress || 'Shahrak-e-Omid Sabz, Kabul, Afghanistan',
          instagramUrl: parsed.instagramUrl || '',
          facebookUrl: parsed.facebookUrl || '',
          whatsappUrl: parsed.whatsappUrl || '',
          twitterUrl: parsed.twitterUrl || '',
          linkedinUrl: parsed.linkedinUrl || '',
          profileDocumentName: parsed.profileDocumentName || '',
          profileDocumentData: parsed.profileDocumentData || ''
        } as ContentData;
      }
    } catch {}
    return {
      heroTitle: 'Premium Afghan Dried Fruits',
      heroSubtitle: 'Sourced directly from contracted farmers across Afghanistan',
      aboutText: 'Benazir Yakta Trading Company is a pioneering women-led Afghan exporter specializing in premium dried fruits, nuts, and spices.',
      companyDescription: 'Premium Afghan dried fruits, nuts, and spices. Empowering women, supporting communities.',
      contactEmail: 'info@benaziryakta.com',
      contactAddress: 'Shahrak-e-Omid Sabz, Kabul, Afghanistan',
      instagramUrl: '',
      facebookUrl: '',
      whatsappUrl: '',
      twitterUrl: '',
      linkedinUrl: '',
      profileDocumentName: '',
      profileDocumentData: ''
    } as ContentData;
  });

  const handleContentChange = (field: keyof ContentData, value: string) => {
    setContentData(prev => ({ ...prev, [field]: value }));
  };

  const handleProfileUpload = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setContentData(prev => ({
          ...prev,
          profileDocumentName: file.name,
          profileDocumentData: reader.result as string
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleProfileFileInput = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    handleProfileUpload(file);
    event.target.value = '';
  };

  const clearProfileDocument = () => {
    setContentData(prev => ({
      ...prev,
      profileDocumentName: '',
      profileDocumentData: ''
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    localStorage.setItem('website-content', JSON.stringify(contentData));
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const tabs = [
    { id: 'products', name: t('admin.tabs.products'), icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M3 3h4l1.68 9.39A2 2 0 0010.66 14h6.69a2 2 0 001.98-1.61L22 6H6" />
        <circle cx="10" cy="20" r="1" />
        <circle cx="19" cy="20" r="1" />
      </svg>
    ) },
    { id: 'orders', name: t('admin.tabs.orders'), icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M3 3h2l.4 2M7 13h10l4-8H5.4" />
        <circle cx="10" cy="20" r="1" />
        <circle cx="18" cy="20" r="1" />
      </svg>
    ) },
    { id: 'slideshow', name: t('admin.tabs.slideshow'), icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M3 7l9 6 9-6" />
      </svg>
    ) },
    { id: 'awards', name: 'Awards', icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 2l2.09 4.26L18 7l-3 2.91L15.18 14 12 12.27 8.82 14 9 9.91 6 7l3.91-.74L12 2z" />
      </svg>
    ) },
    { id: 'content', name: t('admin.tabs.content'), icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    ) },
    { id: 'analytics', name: t('admin.tabs.analytics'), icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M3 3v18h18" />
        <path d="M7 13v-6" />
        <path d="M12 13V7" />
        <path d="M17 13v-2" />
      </svg>
    ) },
    { id: 'users', name: t('admin.tabs.users'), icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M17 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M6 21v-2a4 4 0 0 1 3-3.87" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ) }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className={cn('flex items-center space-x-4', { 'space-x-reverse': dir==='rtl' })}>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">BY</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{t('admin.dashboard')}</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('admin.welcomeBack')} {user?.username}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
            >
              <svg className={cn('w-4 h-4', dir==='rtl' ? 'ml-2' : 'mr-2')} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {t('admin.logout')}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-64">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <span className="text-xl mr-3">{tab.icon}</span>
                  <span className="font-medium">{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="flex-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              {saveSuccess && (
                <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg">
                  ✅ {t('admin.saved')}
                </div>
              )}

              {activeTab === 'products' && (
                <AdminProducts />
              )}

              {activeTab === 'orders' && (
                <AdminOrders />
              )}

              {activeTab === 'slideshow' && (
                <AdminSlideshow />
              )}

              {activeTab === 'awards' && (
                <AdminAwards />
              )}

              {activeTab === 'content' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">{t('admin.tabs.content')}</h2>

                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Contact Email</label>
                        <input
                          type="email"
                          value={contentData.contactEmail}
                          onChange={(e) => handleContentChange('contactEmail', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Contact Address</label>
                        <input
                          type="text"
                          value={contentData.contactAddress}
                          onChange={(e) => handleContentChange('contactAddress', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                      </div>
                    </div>

                    <div className="mt-6 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Footer Social Links</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Instagram URL</label>
                          <input type="url" value={contentData.instagramUrl || ''} onChange={(e)=>handleContentChange('instagramUrl', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700" placeholder="https://instagram.com/your-page" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Facebook URL</label>
                          <input type="url" value={contentData.facebookUrl || ''} onChange={(e)=>handleContentChange('facebookUrl', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700" placeholder="https://facebook.com/your-page" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">WhatsApp URL</label>
                          <input type="url" value={contentData.whatsappUrl || ''} onChange={(e)=>handleContentChange('whatsappUrl', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700" placeholder="https://wa.me/XXXXXXXXXXX" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">YouTube URL</label>
                          <input type="url" value={contentData.twitterUrl || ''} onChange={(e)=>handleContentChange('twitterUrl', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700" placeholder="https://youtube.com/channel/your-channel" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">LinkedIn URL</label>
                          <input type="url" value={contentData.linkedinUrl || ''} onChange={(e)=>handleContentChange('linkedinUrl', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700" placeholder="https://linkedin.com/company/your-page" />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Company Profile PDF</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Upload a PDF to power the download button on the About page.</p>
                      {contentData.profileDocumentName && contentData.profileDocumentData ? (
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4 rounded-lg bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 px-4 py-3">
                          <div className="text-sm text-gray-700 dark:text-gray-200">
                            <span className="font-medium">{t('about.profileDownloadFileLabel')}</span>{' '}
                            <span>{contentData.profileDocumentName}</span>
                          </div>
                          <a
                            href={contentData.profileDocumentData}
                            download={contentData.profileDocumentName}
                            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors duration-200"
                          >
                            {t('about.profileDownloadButton')}
                          </a>
                        </div>
                      ) : (
                        <div className="mb-4 rounded-lg bg-gray-100 dark:bg-gray-900/60 border border-dashed border-gray-300 dark:border-gray-700 px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                          {t('about.profileDownloadUnavailable')}
                        </div>
                      )}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <label className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg border border-dashed border-blue-400 text-blue-700 dark:text-blue-300 bg-white dark:bg-gray-800 cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200">
                          Upload PDF
                          <input type="file" accept="application/pdf" onChange={handleProfileFileInput} className="hidden" />
                        </label>
                        <button
                          type="button"
                          onClick={clearProfileDocument}
                          disabled={!contentData.profileDocumentData}
                          className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Delete PDF
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'analytics' && (
                <AdminAnalytics />
              )}

              {activeTab === 'users' && (
                <AdminUserManagement />
              )}

              {activeTab === 'content' && (
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSaving ? (
                      <div className={cn('flex items-center space-x-2', { 'space-x-reverse': dir==='rtl' })}>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>{t('loading')}</span>
                      </div>
                    ) : (
                      t('saveChanges')
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------------------
   Admin Slideshow: improve preview, show uploading state for optimistic adds,
   and convert pasted external URLs to data URLs before sending to server so
   images are stored on the website host.
   --------------------------------------------------------------------------- */
function AdminSlideshow() {
  const { t, dir, lang } = useLocale();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [slides, setSlides] = useState<{ id: string; url: string; uploading?: boolean; error?: string }[]>([]);
  const [newUrl, setNewUrl] = useState('');
  const [texts, setTexts] = useState<{ en: any; fa: any }>({ en: { title:'', lead:'', values:'', services:'' }, fa: { title:'', lead:'', values:'', services:'' } });
  const [saving, setSaving] = useState(false);
  const [adding, setAdding] = useState(false);

  const safeFetch = async (input: RequestInfo, init?: RequestInit, timeout = 8000) => {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);
      const res = await fetch(input, { signal: controller.signal, ...(init || {}) });
      clearTimeout(id);
      return res;
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.warn(`Request timeout (${timeout}ms): ${input}`);
      }
      return null;
    }
  };

  useEffect(()=>{
    const load = async () => {
      setLoading(true);
      setError(null);
      const res = await safeFetch('/api/hero');
      if (!res || !res.ok) { setError('Failed to load'); setLoading(false); return; }
      const data = await res.json();
      setSlides((data.slides || []).map((s:any)=> ({ id: s.id, url: s.url })));
      setTexts(data.texts || { en: { title:'', lead:'', values:'', services:'' }, fa: { title:'', lead:'', values:'', services:'' } });
      setLoading(false);
    };
    load();
  },[]);

  const onPickFile = async (file?: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { setNewUrl(String(reader.result || '')); };
    reader.readAsDataURL(file);
  };

  const addSlide = async () => {
    let url = newUrl.trim();
    if (!url) return;
    setAdding(true);
    setError(null);

    // If external URL, try to fetch it and convert to data URL so server will save it locally.
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) {
      const converted = await fetchImageAsDataUrl(url);
      if (!converted) {
        setError('Unable to fetch external image (CORS or network error). Please upload the image file instead.');
        setAdding(false);
        return;
      }
      url = converted;
    }

    const tempId = createTempId();
    const optimistic = [...slides, { id: tempId, url, uploading: true }];
    setSlides(optimistic);
    setNewUrl('');

    try {
      const res = await safeFetch('/api/hero/slides', { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ url }) });
      if (!res || !res.ok) {
        // mark the temp slide as error
        setSlides(prev => prev.map(s => s.id === tempId ? { ...s, uploading: false, error: 'Failed to upload' } : s));
      } else {
        const created = await res.json().catch(()=>null);
        if (created && created.id) {
          setSlides(prev => prev.map(s => s.id === tempId ? created : s));
        } else {
          setSlides(prev => prev.map(s => s.id === tempId ? { ...s, uploading: false, error: 'Unexpected server response' } : s));
        }
      }
    } catch (e:any) {
      setSlides(prev => prev.map(s => s.id === tempId ? { ...s, uploading: false, error: String(e?.message || 'Upload failed') } : s));
    } finally {
      setAdding(false);
    }
  };

  const removeSlide = async (id: string) => {
    const prev = slides;
    setSlides(slides.filter(s=>s.id!==id));
    const res = await safeFetch(`/api/hero/slides/${id}`, { method: 'DELETE' });
    if (!res || !res.ok) setSlides(prev);
  };

  const updateTexts = (lng: 'en'|'fa', field: 'title'|'lead'|'values'|'services', value: string) => {
    setTexts(prev=> ({ ...prev, [lng]: { ...prev[lng], [field]: value } }));
  };

  const saveAll = async () => {
    setSaving(true);
    const res = await safeFetch('/api/hero', { method:'PUT', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ slides: slides.map(s=> ({ id: s.id, url: s.url })), texts }) });
    if (!res || !res.ok) setError('Failed to save'); else setError(null);
    setSaving(false);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">{t('admin.tabs.slideshow')}</h2>
      {loading && <div className="text-gray-600 dark:text-gray-300">{t('loading')}</div>}
      {error && <div className="text-red-600">{error}</div>}

      {!loading && !error && (
        <div className="space-y-8">
          <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Hero Images</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {slides.map(s => (
                <div key={s.id} className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                  <img src={s.url} alt="slide" className="w-full h-40 object-cover" />
                  {s.uploading && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
                      <div className="flex items-center gap-2"><div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" /> Uploading...</div>
                    </div>
                  )}
                  {s.error && (
                    <div className="absolute bottom-0 left-0 right-0 bg-red-600 text-white text-xs px-2 py-1">{s.error}</div>
                  )}
                  <button onClick={()=>removeSlide(s.id)} className="absolute top-2 right-2 px-3 py-1.5 text-xs rounded-full bg-red-600 text-white">Remove</button>
                </div>
              ))}
            </div>
            <div className="mt-4 grid md:grid-cols-3 gap-3 items-end">
              <div className="md:col-span-2">
                <input value={newUrl} onChange={(e)=>setNewUrl(e.target.value)} placeholder="Paste image URL or upload" className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
              </div>
              <div className="flex gap-2">
                <label className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 cursor-pointer text-sm text-gray-700 dark:text-gray-200">
                  Upload
                  <input type="file" accept="image/*" onChange={(e)=>onPickFile(e.target.files?.[0]||null)} className="hidden" />
                </label>
                <button onClick={addSlide} disabled={adding} className="px-4 py-3 rounded-lg bg-blue-600 text-white font-semibold">
                  {adding ? <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Uploading</span> : 'Add'}
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Hero Texts</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {(['en','fa'] as const).map(lng => (
                <div key={lng}>
                  <h4 className="font-semibold mb-3">{lng.toUpperCase()}</h4>
                  <div className="space-y-3">
                    <input value={texts[lng].title||''} onChange={(e)=>updateTexts(lng,'title', e.target.value)} placeholder="Title" className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
                    <textarea value={texts[lng].lead||''} onChange={(e)=>updateTexts(lng,'lead', e.target.value)} placeholder="Lead" rows={3} className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
                    <textarea value={texts[lng].values||''} onChange={(e)=>updateTexts(lng,'values', e.target.value)} placeholder="Values" rows={2} className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
                    <textarea value={texts[lng].services||''} onChange={(e)=>updateTexts(lng,'services', e.target.value)} placeholder="Services" rows={3} className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <button onClick={saveAll} disabled={saving} className="px-5 py-3 rounded-lg bg-blue-600 text-white font-semibold disabled:opacity-60">{saving ? t('loading') : t('saveChanges')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Admin Awards: show immediate preview and a clear upload state + errors.
   Ensure server receives data URLs so uploads are saved server-side.
   --------------------------------------------------------------------------- */
function AdminAwards(){
  const { t, dir } = useLocale();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);
  const [awards, setAwards] = useState<any[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newImage, setNewImage] = useState('');
  const [adding, setAdding] = useState(false);

  const safeFetch = async (input: RequestInfo, init?: RequestInit, timeout = 8000) => {
    try{
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);
      const res = await fetch(input, { signal: controller.signal, ...(init||{}) });
      clearTimeout(id);
      return res;
    }catch(err: any){
      if (err.name === 'AbortError') {
        console.warn(`Request timeout (${timeout}ms): ${input}`);
      } else {
        console.warn('safeFetch failed', err);
      }
      return null;
    }
  };

  useEffect(()=>{
    const load = async ()=>{
      setLoading(true); setError(null);
      const res = await safeFetch('/api/awards');
      if (!res || !res.ok) { setError('Failed to load awards'); setLoading(false); return; }
      const data = await res.json();
      setAwards(data || []);
      setLoading(false);
    };
    load();
  },[]);

  const onPickFile = async (file?: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setNewImage(String(reader.result || ''));
    reader.readAsDataURL(file);
  };

  const addAward = async () => {
    if (!newImage) { setError('Please choose an image'); return; }
    setError(null);
    setAdding(true);
    const payload = { imageUrl: newImage, title: newTitle, description: newDescription };
    const tempId = createTempId();
    const optimistic = [...awards, { id: tempId, ...payload, uploading: true }];
    setAwards(optimistic);
    setNewTitle(''); setNewDescription(''); setNewImage('');

    try {
      const res = await safeFetch('/api/awards', { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify(payload) });
      if (!res || !res.ok) { setError('Failed to add'); setAwards(old => old.filter(a => a.id !== tempId)); return; }
      const created = await res.json().catch(()=>null);
      if (created && created.id) setAwards(list => list.map(a => a.id === tempId ? created : a));
      else setAwards(old => old.filter(a => a.id !== tempId));
    } catch (e:any) {
      setError(String(e?.message || 'Failed to add award'));
      setAwards(old => old.filter(a => a.id !== tempId));
    } finally {
      setAdding(false);
    }
  };

  const remove = async (id: string) => {
    const prev = awards;
    setAwards(awards.filter(a => a.id !== id));
    const res = await safeFetch(`/api/awards/${id}`, { method: 'DELETE' });
    if (!res || (res && !res.ok)) setAwards(prev);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Awards</h2>
      {loading && <div className="text-gray-600 dark:text-gray-300">Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            {awards.map(a => (
              <div key={a.id} className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                {a.imageUrl ? <img src={a.imageUrl} alt={a.title} className="w-full h-40 object-cover" /> : <div className="w-full h-40 flex items-center justify-center bg-gray-100 text-gray-500">No Image</div>}
                {a.uploading && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
                    <div className="flex items-center gap-2"><div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" /> Uploading...</div>
                  </div>
                )}
                <div className="p-3">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">{a.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{a.description}</p>
                </div>
                <button onClick={()=>remove(a.id)} className="absolute top-2 right-2 px-3 py-1.5 text-xs rounded-full bg-red-600 text-white">Remove</button>
              </div>
            ))}
          </div>
          <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60">
            <div className="grid md:grid-cols-3 gap-3 items-end">
              <div className="md:col-span-2">
                <input value={newTitle} onChange={(e)=>setNewTitle(e.target.value)} placeholder="Title" className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
                <textarea value={newDescription} onChange={(e)=>setNewDescription(e.target.value)} placeholder="Description" rows={2} className="w-full mt-2 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
              </div>
              <div className="flex gap-2">
                <label className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 cursor-pointer text-sm text-gray-700 dark:text-gray-200">
                  Upload
                  <input type="file" accept="image/*" onChange={(e)=>onPickFile(e.target.files?.[0]||null)} className="hidden" />
                </label>
                <button onClick={addAward} disabled={adding} className="px-4 py-3 rounded-lg bg-blue-600 text-white font-semibold">{adding ? <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Adding</span> : 'Add'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Products: ensure uploads are saved server-side by converting external URLs
   to data URLs before sending; show clear creating state and image previews.
   --------------------------------------------------------------------------- */
function AdminProducts() {
  const locale = useLocale();
  const { dir } = locale;
  const translate = locale.t;
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState<Record<string, boolean>>({});
  const [modalError, setModalError] = useState<string | null>(null);
  const [confirmPrompt, setConfirmPrompt] = useState<{ open: boolean; message: string; resolve?: (r: boolean) => void }>({ open: false, message: '' });

  const askConfirm = (message: string) => {
    return new Promise<boolean>((resolve) => {
      setConfirmPrompt({ open: true, message, resolve });
    });
  };

  const LOCAL_KEY = 'products-local';
  const readLocal = (): any[] => { try { const s = localStorage.getItem(LOCAL_KEY); return s ? JSON.parse(s) : []; } catch { return []; } };
  const saveLocal = (list: any[]) => { try { localStorage.setItem(LOCAL_KEY, JSON.stringify(list)); } catch {} };
  const withRecentFromLocal = (serverList: any[]) => {
    const local = readLocal();
    const map = new Map(local.map((p:any)=>[p.id, !!p.recent]));
    return serverList.map((p:any)=> ({ ...p, recent: map.get(p.id) || false }));
  };

  const [newProduct, setNewProduct] = useState({ name: '', unit: 'kg', price: 0, currency: 'USD', source: 'bought', initialImportQty: 0, initialStock: 0, importDate: '', imageUrl: '', recent: false });
  const [creating, setCreating] = useState(false);

  const safeFetch = async (input: RequestInfo, init?: RequestInit, timeout = 8000) => {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);
      const response = await fetch(input, { signal: controller.signal, ...(init || {}) });
      clearTimeout(id);
      return response;
    } catch (err) {
      console.warn('safeFetch failed', err);
      return null;
    }
  };

  const load = async () => {
    setLoading(true);
    try {
      const res = await safeFetch('/api/products');
      if (!res || !res.ok) throw new Error('Failed to load products');
      const data = await res.json();
      const enhanced = withRecentFromLocal(data);
      setProducts(enhanced);
      if (Array.isArray(data) && data.length > 0) saveLocal(enhanced);
      else {
        const local = readLocal();
        if (local.length) setProducts(local);
      }
      setError(null);
    } catch (e: any) {
      const local = readLocal();
      if (local.length) { setProducts(local); setError(null); }
      else { setError(e.message || 'Failed to load'); }
    }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const readFileAsDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const compressImage = (file: File, maxDim = 1200, quality = 0.75): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      try {
        const imageUrl = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let { width, height } = img as HTMLImageElement & { width: number; height: number };
          if (width > height && width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else if (height >= width && height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) { resolve(readFileAsDataUrl(file)); return; }
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          URL.revokeObjectURL(imageUrl);
          resolve(dataUrl);
        };
        img.onerror = (e) => reject(e);
        img.src = imageUrl;
      } catch (e) {
        const fallback = await readFileAsDataUrl(file).catch(()=> '');
        resolve(fallback);
      }
    });
  };

  const onPickNewImage = async (file?: File | null) => {
    if (!file) return;
    const dataUrl = await compressImage(file);
    setNewProduct(p => ({ ...p, imageUrl: dataUrl }));
  };

  const createProduct = async () => {
    const missing: string[] = [];
    if (!newProduct.name || !String(newProduct.name).trim()) missing.push('Name');
    if (!newProduct.price || Number(newProduct.price) <= 0) missing.push('Price');
    if (!newProduct.unit) missing.push('Unit');
    if (!newProduct.currency) missing.push('Currency');
    if (!newProduct.source) missing.push('Source');
    if (newProduct.source === 'imported') {
      if (!newProduct.initialImportQty || Number(newProduct.initialImportQty) <= 0) missing.push('Initial import quantity');
      if (!newProduct.importDate) missing.push('Import date');
    } else {
      if (!newProduct.initialStock || Number(newProduct.initialStock) <= 0) missing.push('Initial stock');
    }

    if (missing.length) {
      setModalError('Please fill required fields: ' + missing.join(', '));
      return;
    }

    setCreating(true);
    try {
      // If an external URL was pasted, try to convert to data URL so server saves it locally
      let payload = { ...newProduct } as any;
      if (payload.imageUrl && (payload.imageUrl.startsWith('http://') || payload.imageUrl.startsWith('https://') || payload.imageUrl.startsWith('//'))) {
        const converted = await fetchImageAsDataUrl(payload.imageUrl);
        if (!converted) {
          setModalError('Unable to fetch external image (CORS or network error). Please upload the image file instead.');
          setCreating(false);
          return;
        }
        payload.imageUrl = converted;
      }

      const res = await safeFetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res || !res.ok) { const err = res ? await res.json().catch(()=>({})) : {}; throw new Error(err?.error || 'Failed to create'); }
      setNewProduct({ name: '', unit: 'kg', price: 0, currency: 'USD', source: 'bought', initialImportQty: 0, initialStock: 0, importDate: '', imageUrl: '', recent: false });
      await load();
    } catch (e:any) {
      const id = (window.crypto && 'randomUUID' in window.crypto) ? (window.crypto as any).randomUUID() : String(Date.now());
      const now = new Date().toISOString();
      const product:any = {
        id,
        name: newProduct.name,
        unit: newProduct.unit,
        price: Number(newProduct.price)||0,
        imageUrl: newProduct.imageUrl||'',
        createdAt: now,
        imports: [],
        exports: [],
        baseStock: Number(newProduct.source==='imported'?0:newProduct.initialStock)||0,
        source: newProduct.source,
        currency: newProduct.currency,
        available: Number(newProduct.source==='imported'?0:newProduct.initialStock)||0,
        recent: !!newProduct.recent,
      };
      if (newProduct.source==='imported' && Number(newProduct.initialImportQty)>0){
        product.imports.push({ quantity: Number(newProduct.initialImportQty), date: (newProduct.importDate||now) });
        product.available += Number(newProduct.initialImportQty);
      }
      const list = [...readLocal(), product];
      saveLocal(list);
      setProducts(list);
      setModalError(null);
      setNewProduct({ name: '', unit: 'kg', price: 0, currency: 'USD', source: 'bought', initialImportQty: 0, initialStock: 0, importDate: '', imageUrl: '', recent: false });
    } finally {
      setCreating(false);
    }
  };

  const addImport = async (id: string, qty: number, date: string) => {
    setBusyId(id);
    try {
      const res = await safeFetch(`/api/products/${id}/imports`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ quantity: qty, date }) });
      if (!res || !res.ok) throw new Error((await (res ? res.json().catch(()=>({})) : Promise.resolve({})))?.error || 'Failed to add import');
      await load();
    } catch (e:any) {
      const list = readLocal().map((p:any)=>{
        if (p.id !== id) return p;
        const imports = [...(p.imports||[]), { quantity: qty, date: date || new Date().toISOString() }];
        const available = Number((p.baseStock||0)) + imports.reduce((s:number,r:any)=>s+Number(r.quantity||0),0) - (p.exports||[]).reduce((s:number,r:any)=>s+Number(r.quantity||0),0);
        return { ...p, imports, available };
      });
      saveLocal(list);
      setProducts(list);
    } finally {
      setBusyId(null);
    }
  };

  const addExport = async (id: string, qty: number, date: string, destination: string) => {
    const current = products.find(x=>x.id===id);
    const currentAvailable = Number(current?.available || 0);
    if (qty > currentAvailable) { setModalError('Export quantity exceeds available stock'); return; }

    setBusyId(id);
    try {
      const res = await safeFetch(`/api/products/${id}/exports`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ quantity: qty, date, destination }) });
      if (!res || !res.ok) throw new Error((await (res ? res.json().catch(()=>({})) : Promise.resolve({})))?.error || 'Failed to add export');
      await load();
    } catch (e:any) {
      let blocked = false;
      const list = readLocal().map((p:any)=>{
        if (p.id !== id) return p;
        const alreadyExported = (p.exports||[]).reduce((s:number,r:any)=>s+Number(r.quantity||0),0);
        const alreadyImported = (p.imports||[]).reduce((s:number,r:any)=>s+Number(r.quantity||0),0);
        const base = Number(p.baseStock||0);
        const availableBefore = base + alreadyImported - alreadyExported;
        if (qty > availableBefore) { blocked = true; return { ...p, available: availableBefore }; }
        const exportsArr = [...(p.exports||[]), { quantity: qty, destination, date: date || new Date().toISOString() }];
        const available = base + alreadyImported - exportsArr.reduce((s:number,r:any)=>s+Number(r.quantity||0),0);
        return { ...p, exports: exportsArr, available };
      });
      if (blocked) { setModalError('Export quantity exceeds available stock'); }
      else { saveLocal(list); setProducts(list); }
    } finally {
      setBusyId(null);
    }
  };

  const deleteProduct = async (id: string) => {
    setBusyId(id);
    const prev = products.slice();
    const nextList = products.filter(p=>p.id !== id);
    setProducts(nextList);
    try { saveLocal(nextList); } catch {}

    try {
      const res = await safeFetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res && res.ok) { await load(); return; }
      setProducts(prev);
      saveLocal(prev);
    } catch (e) {
      console.warn('deleteProduct failed, kept local removal', e);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">{translate('admin.tabs.products')}</h2>

      <div className="mb-8 p-6 rounded-2xl border border-blue-100 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Add Product</h3>
        <div className="grid md:grid-cols-7 gap-4 items-end">
          <div>
            <input value={newProduct.name} onChange={(e)=>setNewProduct({...newProduct, name:e.target.value})} placeholder="Product name" className="px-3 py-3 h-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Name shown to customers</p>
          </div>
          <div>
            <select value={newProduct.unit} onChange={(e)=>setNewProduct({...newProduct, unit:e.target.value})} className="px-3 py-3 h-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 w-full focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="kg">kg</option>
              <option value="ton">ton</option>
              <option value="bag">bag</option>
              <option value="box">box</option>
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Unit used for pricing</p>
          </div>
          <div>
            <select value={newProduct.currency} onChange={(e)=>setNewProduct({...newProduct, currency:e.target.value})} className="px-3 py-3 h-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 w-full focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="USD">USD</option>
              <option value="AFN">AFN</option>
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Currency of the price</p>
          </div>
          <div>
            <input type="number" value={Number(newProduct.price)} onChange={(e)=>setNewProduct({...newProduct, price:Number(e.target.value)})} placeholder="Price / unit" className="px-3 py-3 h-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Selling price per unit</p>
          </div>
          <div>
            <select value={newProduct.source} onChange={(e)=>setNewProduct({...newProduct, source:e.target.value})} className="px-3 py-3 h-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 w-full focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="bought">Bought Locally</option>
              <option value="imported">Imported</option>
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">How stock enters inventory</p>
          </div>
          {newProduct.source==='imported' ? (
            <>
              <div>
                <input type="number" value={Number(newProduct.initialImportQty)} onChange={(e)=>setNewProduct({...newProduct, initialImportQty:Number(e.target.value)})} placeholder="Initial import qty" className="px-3 py-3 h-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">First shipment quantity</p>
              </div>
              <div>
                <input type="date" value={newProduct.importDate} onChange={(e)=>setNewProduct({...newProduct, importDate:e.target.value})} className="px-3 py-3 h-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Date of first shipment</p>
              </div>
            </>
          ) : (
            <div>
              <input type="number" value={Number(newProduct.initialStock)} onChange={(e)=>setNewProduct({...newProduct, initialStock:Number(e.target.value)})} placeholder="Initial stock" className="px-3 py-3 h-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Starting quantity in stock</p>
            </div>
          )}
          <div className="space-y-2 col-span-1 md:col-span-2">
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Image</label>
            <label className="flex items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600">
              <span className="text-sm text-gray-600 dark:text-gray-300">Click to upload</span>
              <input type="file" accept="image/*" onChange={(e)=>onPickNewImage(e.target.files?.[0] || null)} className="hidden" />
            </label>
            {newProduct.imageUrl && (
              <img src={newProduct.imageUrl} alt="Preview" className="w-full h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-700" />
            )}
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <button onClick={createProduct} disabled={creating} className="px-5 py-3 rounded-md bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition">{creating ? <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Creating...</span> : 'Create Product'}</button>
          <p className="text-xs text-gray-500 dark:text-gray-400">Imported adds an initial import entry. Bought sets starting stock directly.</p>
        </div>
      </div>

      {loading && <div className="text-gray-600 dark:text-gray-300">{translate('loading')}</div>}
      {error && <div className="text-red-600">{translate('anErrorOccurred')}</div>}

      {!loading && !error && (
        <div className="space-y-4">
          {products.map((p)=> (
            <div key={p.id} className="relative rounded-2xl p-4 border border-blue-100 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
                  <button onClick={()=>setEditOpen(o=>({ ...o, [p.id]: !o[p.id] }))} className="px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-sm">{translate('editDetails')}</button>
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={async ()=>{ const ok = await askConfirm(translate('deleteProductConfirm')); if(!ok) return; await deleteProduct(p.id); }} title={translate('deleteProductConfirm')} className="w-10 h-10 rounded-md bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition shadow-sm">🗑️</button>
                  <img src={p.imageUrl || 'https://via.placeholder.com/80x50?text=No+Image'} alt={p.name} className="w-24 h-16 object-cover rounded-lg border border-gray-200 dark:border-gray-700" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{p.name}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${p.source==='imported'?'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300':'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'}`}>{p.source==='imported'?'Imported':'Bought'}</span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">{p.currency || 'USD'}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Price: {p.price} {p.currency||'USD'} / {p.unit} · Available: <span className="font-semibold">{p.available}</span></p>
                  </div>
                </div>
                <div className="flex gap-3 items-center ml-auto">
                  <div className="text-xs text-gray-500 dark:text-gray-400 hidden md:block">Quick actions</div>
                  <ImportExportInline busy={busyId===p.id} onImport={(qty,date)=>addImport(p.id, qty, date)} onExport={(qty,date,dest)=>addExport(p.id, qty, date, dest)} />
                </div>
              </div>
              {editOpen[p.id] && (
                <ProductEditor product={p} onSaved={load} onError={setModalError} />
              )}
            </div>
          ))}
        </div>
      )}

      {modalError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={()=>setModalError(null)}></div>
          <div className="relative max-w-lg w-full mx-auto p-6 rounded-2xl bg-white dark:bg-gray-800 border border-red-200 dark:border-red-900/40 shadow-2xl">
            <h4 className="text-lg font-semibold text-red-700 dark:text-red-300 mb-2">{translate('anErrorOccurred')}</h4>
            <p className="text-sm text-gray-800 dark:text-gray-200">{modalError}</p>
            <div className="mt-4 text-right">
              <button onClick={()=>setModalError(null)} className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700">{translate('close')}</button>
            </div>
          </div>
        </div>
      )}

      {confirmPrompt.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={()=>{ if(confirmPrompt.resolve) confirmPrompt.resolve(false); setConfirmPrompt({ open:false, message:'' }); }}></div>
          <div className="relative max-w-md w-full mx-auto p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{translate('pleaseConfirm')}</h4>
            <p className="text-sm text-gray-800 dark:text-gray-200">{confirmPrompt.message}</p>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={()=>{ if(confirmPrompt.resolve) confirmPrompt.resolve(false); setConfirmPrompt({ open:false, message:'' }); }} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700">{translate('cancel')}</button>
              <button onClick={()=>{ if(confirmPrompt.resolve) confirmPrompt.resolve(true); setConfirmPrompt({ open:false, message:'' }); }} className="px-4 py-2 rounded-lg bg-blue-600 text-white">{translate('confirm')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------------
   The remaining components (ImportExportInline, ProductEditor, AdminOrders,
   AdminAnalytics, AdminUserManagement) are left mostly unchanged, but small
   safeguards are added in ProductEditor to ensure external image URLs are
   converted to data URLs before sending them to the server for persistence.
   --------------------------------------------------------------------------- */
function ImportExportInline({ onImport, onExport, busy }:{ onImport:(q:number,d:string)=>void; onExport:(q:number,d:string, dest:string)=>void; busy:boolean }){
  const [impQty, setImpQty] = useState<number>(0);
  const [impDate, setImpDate] = useState<string>('');
  const [expQty, setExpQty] = useState<number>(0);
  const [expDate, setExpDate] = useState<string>('');
  const [dest, setDest] = useState<string>('');
  const validImport = impQty > 0;
  const validExport = expQty > 0 && dest.trim().length > 0;
  return (
    <div className="grid md:grid-cols-2 gap-3 w-full md:w-auto">
      <div className="flex flex-wrap gap-2 items-center p-2 rounded-lg border border-green-200 dark:border-green-900/40 bg-green-50/30 dark:bg-green-900/10">
        <div className="text-xs font-semibold text-green-700 dark:text-green-300">Quick Import</div>
        <input aria-label="Import quantity" type="number" min={0} value={impQty} onChange={(e)=>setImpQty(Number(e.target.value))} placeholder="Qty" className="w-24 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700" />
        <input aria-label="Import date" type="date" value={impDate} onChange={(e)=>setImpDate(e.target.value)} className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700" />
        <button disabled={busy || !validImport} onClick={()=>onImport(impQty, impDate)} className="px-3 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50">Add Import</button>
      </div>
      <div className="flex flex-wrap gap-2 items-center p-2 rounded-lg border border-blue-200 dark:border-blue-900/40 bg-blue-50/30 dark:bg-blue-900/10">
        <div className="text-xs font-semibold text-blue-700 dark:text-blue-300">Quick Export</div>
        <input aria-label="Export quantity" type="number" min={1} value={expQty} onChange={(e)=>setExpQty(Number(e.target.value))} placeholder="Qty" className="w-24 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700" />
        <input aria-label="Export destination" type="text" value={dest} onChange={(e)=>setDest(e.target.value)} placeholder="Destination" className="w-36 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700" />
        <input aria-label="Export date" type="date" value={expDate} onChange={(e)=>setExpDate(e.target.value)} className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700" />
        <button disabled={busy || !validExport} onClick={()=>onExport(expQty, expDate, dest)} className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50">Add Export</button>
      </div>
    </div>
  );
}

function ProductEditor({ product, onSaved, onError }:{ product:any; onSaved:()=>void; onError?:(msg:string)=>void }){
  const imported = (product.imports||[]).reduce((s:number,r:any)=>s+Number(r.quantity||0),0);
  const exported = (product.exports||[]).reduce((s:number,r:any)=>s+Number(r.quantity||0),0);
  const startAvailable = Number(product.available || 0);
  const [form, setForm] = useState({ name: product.name, unit: product.unit, price: product.price, currency: product.currency||'USD', source: product.source||'bought', imageUrl: product.imageUrl || '', available: startAvailable });
  const [saving, setSaving] = useState(false);

  const readFileAsDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const onPickImage = async (file?: File | null) => {
    if (!file) return;
    try {
      const dataUrl = await (async () => {
        const imageUrl = URL.createObjectURL(file);
        const img = new Image();
        const p = new Promise<string>((resolve, reject) => {
          img.onload = () => {
            const canvas = document.createElement('canvas');
            let { width, height } = img as HTMLImageElement & { width: number; height: number };
            const maxDim = 1600;
            if (width > height && width > maxDim) { height = Math.round((height * maxDim) / width); width = maxDim; }
            else if (height >= width && height > maxDim) { width = Math.round((width * maxDim) / height); height = maxDim; }
            canvas.width = width; canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx) { resolve(''); return; }
            ctx.drawImage(img, 0, 0, width, height);
            const out = canvas.toDataURL('image/jpeg', 0.8);
            URL.revokeObjectURL(imageUrl);
            resolve(out);
          };
          img.onerror = reject;
        });
        img.src = imageUrl;
        const res = await p;
        return res || await readFileAsDataUrl(file);
      })();
      setForm(f => ({ ...f, imageUrl: dataUrl }));
    } catch (e:any) {
      onError?.(e?.message || 'Failed to process image');
    }
  };

  const save = async () => {
    setSaving(true);
    const baseStock = Number(form.available || 0) - imported + exported;
    const payload = { name: form.name, unit: form.unit, price: form.price, imageUrl: form.imageUrl, currency: form.currency, source: form.source, baseStock: baseStock < 0 ? 0 : baseStock };
    try {
      // If image is an external URL, try to fetch and convert it so server stores it locally
      if (payload.imageUrl && (payload.imageUrl.startsWith('http://') || payload.imageUrl.startsWith('https://') || payload.imageUrl.startsWith('//'))) {
        const converted = await fetchImageAsDataUrl(payload.imageUrl);
        if (!converted) { throw new Error('Unable to fetch external image (CORS). Please upload an image file instead.'); }
        payload.imageUrl = converted;
      }

      const res = await fetch(`/api/products/${product.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res || !res.ok) throw new Error((await (res ? res.json().catch(()=>({})) : Promise.resolve({})))?.error || 'Failed to save');
      setSaving(false);
      await onSaved();
    } catch (e:any) {
      try {
        const key = 'products-local';
        const s = localStorage.getItem(key);
        const list = s? JSON.parse(s): [];
        const next = list.map((p:any)=> p.id===product.id ? { ...p, ...payload, available: (payload.baseStock||0) + (p.imports||[]).reduce((s:number,r:any)=>s+Number(r.quantity||0),0) - (p.exports||[]).reduce((s:number,r:any)=>s+Number(r.quantity||0),0) } : p);
        localStorage.setItem(key, JSON.stringify(next));
      } catch {}
      setSaving(false);
      await onSaved();
    }
  };

  return (
    <div className="mt-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
      <div className="grid md:grid-cols-7 gap-3 items-start">
        <input aria-label="Name" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700" />
        <select aria-label="Unit" value={form.unit} onChange={(e)=>setForm({...form, unit:e.target.value})} className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700">
          <option value="kg">kg</option>
          <option value="ton">ton</option>
          <option value="bag">bag</option>
          <option value="box">box</option>
        </select>
        <select aria-label="Currency" value={form.currency} onChange={(e)=>setForm({...form, currency:e.target.value})} className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700">
          <option value="USD">USD</option>
          <option value="AFN">AFN</option>
        </select>
        <input aria-label="Price" type="number" value={Number(form.price)} onChange={(e)=>setForm({...form, price:Number(e.target.value)})} className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700" />
        <select aria-label="Source" value={form.source} onChange={(e)=>setForm({...form, source:e.target.value})} className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700">
          <option value="bought">Bought Locally</option>
          <option value="imported">Imported</option>
        </select>
        <input aria-label="Available" type="number" value={Number(form.available)} onChange={(e)=>setForm({...form, available:Number(e.target.value)})} className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700" />
        <div className="space-y-2">
          <label className="block text-sm text-gray-700 dark:text-gray-300">Image</label>
          <input type="file" accept="image/*" onChange={(e)=>onPickImage(e.target.files?.[0] || null)} className="block w-full text-sm" />
        </div>
        <div className="flex items-center gap-2">
          <img src={form.imageUrl || 'https://via.placeholder.com/80x50?text=No+Image'} alt="Preview" className="w-24 h-16 object-cover rounded-lg border border-gray-200 dark:border-gray-700" />
        </div>
      </div>
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">Available sets the current stock shown to customers. Exports will reduce it; imports will increase it.</div>
      <div className="mt-3 flex gap-2">
        <button onClick={save} disabled={saving} className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 disabled:opacity-50">{saving?'Saving...':'Save Changes'}</button>
      </div>
    </div>
  );
}

function AdminOrders(){
  const { t, dir } = useLocale();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [err, setErr] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders');
      if (!res.ok) throw new Error((await res.text()) || 'Failed to load orders');
      setOrders(await res.json());
      setErr(null);
    } catch (e:any) {
      setErr(e?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };
  useEffect(()=>{ load(); }, []);

  const setStatus = async (id: string, status: string) => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const res = await fetch(`/api/orders/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }), signal: controller.signal });
      clearTimeout(timeout);
      if (!res.ok) { const r = await res.json().catch(()=>({})); setErr(r.error || 'Failed to update order status'); return; }
      await load();
    } catch (e:any) {
      if (e && e.name === 'AbortError') {
        setErr('Request timed out');
      } else {
        setErr(e?.message || 'Failed to update order status');
      }
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">{t('admin.tabs.orders')}</h2>
      {err && (
        <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">{t('anErrorOccurred')}</div>
      )}
      {loading ? (
        <div className="text-gray-600 dark:text-gray-300">{t('loading')}</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Product</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Qty</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Destination</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
              {orders.map((o)=> (
                <tr key={o.id}>
                  <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-100">{o.customerName}<div className="text-xs text-gray-500">{o.customerEmail}</div></td>
                  <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-100">{o.productName}</td>
                  <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-100">{o.quantity}</td>
                  <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-100">{o.destination || '-'}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${o.status==='pending'?'bg-yellow-100 text-yellow-800':o.status==='approved'?'bg-blue-100 text-blue-800':o.status==='completed'?'bg-green-100 text-green-800':'bg-gray-200 text-gray-700'}`}>{o.status}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <div className="inline-flex gap-2">
                      <button onClick={()=>setStatus(o.id,'approved')} className="px-3 py-1 rounded-lg bg-blue-600 text-white">Approve</button>
                      <button onClick={()=>setStatus(o.id,'completed')} className="px-3 py-1 rounded-lg bg-green-600 text-white">Complete</button>
                      <button onClick={()=>setStatus(o.id,'cancelled')} className="px-3 py-1 rounded-lg bg-gray-300 text-gray-800">Cancel</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function AdminAnalytics(){
  const { t, dir } = useLocale();
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string|null>(null);

  const readLocal = (key: string) => { try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : []; } catch { return []; } };

  useEffect(()=>{
    (async()=>{
      setLoading(true);
      try{
        const controller = new AbortController();
        const id = setTimeout(()=>controller.abort(), 8000);
        const [orRes, prRes] = await Promise.all([
          fetch('/api/orders', { signal: controller.signal }).catch(()=>null),
          fetch('/api/products', { signal: controller.signal }).catch(()=>null),
        ]);
        clearTimeout(id);

        let loadedOrders: any[] = [];
        let loadedProducts: any[] = [];

        if (orRes && orRes.ok) { loadedOrders = await orRes.json(); try{ localStorage.setItem('orders-local', JSON.stringify(loadedOrders)); }catch{} }
        else { loadedOrders = readLocal('orders-local'); }

        if (prRes && prRes.ok) { loadedProducts = await prRes.json(); try{ localStorage.setItem('products-local', JSON.stringify(loadedProducts)); }catch{} }
        else { loadedProducts = readLocal('products-local'); }

        setOrders(Array.isArray(loadedOrders)?loadedOrders:[]);
        setProducts(Array.isArray(loadedProducts)?loadedProducts:[]);
        setErr(null);
      } catch (e:any) {
        setErr(e?.message || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    })();
  },[]);

  // Metrics
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o=>o.status==='pending').length;
  const completedOrders = orders.filter(o=>o.status==='completed').length;
  const totalProducts = products.length;
  const topProduct = products.slice().sort((a,b)=> (Number(b.available||0) - Number(a.available||0)))[0];

  // Orders over last 14 days
  const getOrdersByDay = () => {
    const map = new Map<string, number>();
    const days = 14;
    for (let i=days-1;i>=0;i--) {
      const d = new Date(); d.setDate(d.getDate()-i);
      const key = d.toISOString().slice(0,10);
      map.set(key, 0);
    }
    for (const o of orders) {
      const key = (o.createdAt||o.date||'').toString().slice(0,10);
      if (!key) continue;
      if (!map.has(key)) continue;
      map.set(key, (map.get(key)||0)+1);
    }
    return Array.from(map.entries()).map(([date,count])=>({ date, count }));
  };

  const series = getOrdersByDay();
  const maxCount = Math.max(1, ...series.map(s=>s.count));

  // Top products for bar list
  const topProducts = products.slice().sort((a:any,b:any)=> Number(b.available||0)-Number(a.available||0)).slice(0,8);
  const maxAvailable = Math.max(1, ...topProducts.map((p:any)=>Number(p.available||0)));

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">{t('admin.tabs.analytics')}</h2>

      {loading ? (
        <div className="text-gray-600 dark:text-gray-300">{t('loading')}</div>
      ) : (
        <div className="space-y-6">
          {/* Big metric cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
              <div className="text-sm text-gray-500">Total Orders</div>
              <div className="text-3xl font-semibold text-gray-900 dark:text-gray-100">{totalOrders}</div>
              <div className="text-xs text-gray-400 mt-2">Orders created in the system</div>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
              <div className="text-sm text-gray-500">Pending</div>
              <div className="text-3xl font-semibold text-amber-600">{pendingOrders}</div>
              <div className="text-xs text-gray-400 mt-2">Awaiting approval</div>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
              <div className="text-sm text-gray-500">Completed</div>
              <div className="text-3xl font-semibold text-green-600">{completedOrders}</div>
              <div className="text-xs text-gray-400 mt-2">Fulfilled orders</div>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
              <div className="text-sm text-gray-500">Total Products</div>
              <div className="text-3xl font-semibold text-gray-900 dark:text-gray-100">{totalProducts}</div>
              <div className="text-xs text-gray-400 mt-2">Products in catalog</div>
            </div>
          </div>

          {/* Charts stacked: Daily, Monthly, Revenue */}
          <div className="space-y-6">
            {/* Daily orders (current month) */}
            <div className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">Orders by Day (current month)</h3>
                <div className="text-sm text-gray-500">Total {totalOrders}</div>
              </div>
              <div className="w-full h-40">
                {(() => {
                  // build daily series for current month
                  const now = new Date();
                  const y = now.getFullYear();
                  const m = now.getMonth();
                  const daysInMonth = new Date(y, m+1, 0).getDate();
                  const map = new Array(daysInMonth).fill(0);
                  for (const o of orders) {
                    const d = new Date(o.createdAt || o.date || o);
                    if (d.getFullYear() === y && d.getMonth() === m) {
                      map[d.getDate()-1]++;
                    }
                  }
                  const max = Math.max(1, ...map);
                  return (
                    <div className="w-full h-full flex items-end gap-1 overflow-hidden">
                      {map.map((count, idx) => (
                        <div key={idx} className="flex-1 flex items-end justify-center" title={`${idx+1}: ${count}`}>
                          <div className="bg-blue-500 dark:bg-blue-400 rounded-t-md w-full" style={{ height: `${(count/max)*100}%` }} />
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
              <div className="mt-3 text-xs text-gray-500">Showing orders per day for the current month. Hover bars to see counts.</div>
            </div>

            {/* Monthly orders (year) */}
            <div className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">Orders by Month (year)</h3>
                <div className="text-sm text-gray-500">Year to date</div>
              </div>
              <div className="w-full h-40">
                {(() => {
                  const now = new Date();
                  const y = now.getFullYear();
                  const months = new Array(12).fill(0);
                  for (const o of orders) {
                    const d = new Date(o.createdAt || o.date || o);
                    if (d.getFullYear() === y) months[d.getMonth()] += 1;
                  }
                  const max = Math.max(1, ...months);
                  return (
                    <div className="w-full h-full flex items-end gap-2">
                      {months.map((count, i) => (
                        <div key={i} className="flex-1 flex items-end justify-center" title={`${i+1}: ${count}`}>
                          <div className="bg-indigo-500 dark:bg-indigo-400 rounded-t-md w-full" style={{ height: `${(count/max)*100}%` }} />
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
              <div className="mt-3 text-xs text-gray-500">Monthly totals for the current year.</div>
            </div>

            {/* Revenue chart */}
            <div className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">Revenue (monthly)</h3>
                <div className="text-sm text-gray-500">Estimated revenue from orders</div>
              </div>
              <div className="w-full h-40">
                {(() => {
                  const now = new Date();
                  const y = now.getFullYear();
                  const months = new Array(12).fill(0);
                  const priceMap = new Map(products.map((p:any)=>[p.id, Number(p.price||0)]));
                  for (const o of orders) {
                    const d = new Date(o.createdAt || o.date || o);
                    if (d.getFullYear() === y) {
                      const price = priceMap.get(o.productId) || 0;
                      months[d.getMonth()] += (Number(o.quantity||0) * price);
                    }
                  }
                  const max = Math.max(1, ...months);
                  return (
                    <div className="w-full h-full flex items-end gap-2">
                      {months.map((value, i) => (
                        <div key={i} className="flex-1 flex items-end justify-center" title={`${i+1}: ${value.toFixed(2)}`}>
                          <div className="bg-green-500 dark:bg-green-400 rounded-t-md w-full" style={{ height: `${(value/max)*100}%` }} />
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
              <div className="mt-3 text-xs text-gray-500">Estimated revenue per month (uses product price * order qty).</div>
            </div>
          </div>

        </div>
      )}

      {err && <div className="mt-4 text-red-600">{err}</div>}
    </div>
  );
}

// Placeholder: simple user management stub (kept as-is, no changes required for uploads)
function AdminUserManagement(){
  const { t } = useLocale();
  const [admins, setAdmins] = useState<{ id: string; username: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const load = async ()=>{
    setLoading(true); setError(null);
    try{
      const res = await fetch('/api/admins');
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      setAdmins(Array.isArray(data)?data:[]);
    }catch(e:any){ setError(e?.message||'Failed'); }
    finally { setLoading(false); }
  };

  useEffect(()=>{ load(); }, []);

  const addAdmin = async ()=>{
    if (!username.trim() || !password.trim()) return;
    try{
      const res = await fetch('/api/admins', { method: 'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ username: username.trim(), password }) });
      if (!res.ok) { const r = await res.json().catch(()=>({})); throw new Error(r.error || 'Failed'); }
      setUsername(''); setPassword(''); await load();
    }catch(e:any){ setError(e?.message||'Failed to add'); }
  };

  const removeAdmin = async (id:string)=>{
    try{
      const res = await fetch(`/api/admins/${id}`, { method: 'DELETE' });
      if (!res || (res && !res.ok)) throw new Error('Failed');
      await load();
    }catch(e:any){ setError(e?.message||'Failed to remove'); }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">{t('admin.tabs.users')}</h2>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
          <h3 className="font-semibold mb-4">Admin Accounts</h3>
          <p className="text-sm text-gray-500 mb-4">Manage administrator accounts used for signing in to the dashboard.</p>
          <input value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="Username" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 mb-2" />
          <div className="relative mb-4">
            <input
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              className="w-full px-3 py-2 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200 focus:outline-none"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-4.753 4.753m4.753-4.753L3.596 3.039m10.318 10.318L21.44 21.44M9.172 9.172L21 21" />
                </svg>
              )}
            </button>
          </div>
          <div className="flex justify-end">
            <button onClick={addAdmin} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Create Admin</button>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
          <h3 className="font-semibold mb-4">Existing Admins</h3>
          {loading ? <div className="text-sm text-gray-500">Loading...</div> : (
            admins.length===0 ? <div className="text-sm text-gray-500">No admin accounts found.</div> : (
              <ul className="space-y-3">
                {admins.map(a=> (
                  <li key={a.id} className="flex items-center justify-between">
                    <div className="font-medium">{a.username}</div>
                    <div className="flex items-center gap-2">
                      <button onClick={()=>removeAdmin(a.id)} className="px-3 py-1 rounded-md bg-red-600 text-white text-sm">Remove</button>
                    </div>
                  </li>
                ))}
              </ul>
            )
          )}
        </div>
      </div>

      <div className="mt-6 text-sm text-gray-500">Signing in uses server-stored admin credentials. Passwords are stored as plain text in this demo — for production use a proper auth provider and hashed storage (Supabase recommended).</div>
    </div>
  );
}

export default AdminDashboard;
