import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { Tenant } from '../types';
import { extractAverageColor } from '../utils/extractAccent';
import { Upload, X, Image as ImageIcon, Palette } from 'lucide-react';

type Props = {
  tenant: Tenant;
  updateTenant: (u: Partial<Tenant>) => void;
};

const MAX_MB = 2;
const ACCEPT = ['image/png', 'image/jpeg'];

const swatch = (hex?: string) => (
  <span
    className="inline-block h-4 w-4 rounded ring-1 ring-black/10 align-[-2px] mr-2"
    style={{ backgroundColor: hex || '#e5e7eb' }}
  />
);

// simple title-case converter for filenames / subdomains
const toTitleCase = (s: string) =>
  s
    .replace(/\.[^.]+$/, '')       // strip extension
    .replace(/[_-]+/g, ' ')        // underscores/dashes -> spaces
    .replace(/\s+/g, ' ')          // collapse spaces
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

const looksLikeDemo = (name?: string | null) =>
  !name ||
  name.trim().length === 0 ||
  ['demo', 'demo company', 'company name'].includes(name.trim().toLowerCase());

const SettingsPage: React.FC<Props> = ({ tenant, updateTenant }) => {
  const [companyName, setCompanyName] = useState(tenant.companyName);
  const [subdomain, setSubdomain] = useState(tenant.subdomain);
  const [primary, setPrimary] = useState(tenant.primaryColor);
  const [secondary, setSecondary] = useState(tenant.secondaryColor);
  const [logoUrl, setLogoUrl] = useState<string | null>(tenant.logoUrl ?? null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  // track last blob URL so we can revoke it
  const lastBlobUrlRef = useRef<string | null>(null);

  const headerPreviewBg = useMemo(() => primary || '#7c3aed', [primary]);

  useEffect(() => {
    // cleanup old blob URL when logo changes
    if (logoUrl && logoUrl.startsWith('blob:')) {
      if (lastBlobUrlRef.current && lastBlobUrlRef.current !== logoUrl) {
        URL.revokeObjectURL(lastBlobUrlRef.current);
      }
      lastBlobUrlRef.current = logoUrl;
    }
    return () => {
      // cleanup on unmount
      if (lastBlobUrlRef.current?.startsWith('blob:')) {
        URL.revokeObjectURL(lastBlobUrlRef.current);
      }
    };
  }, [logoUrl]);

  function handleReset() {
    setCompanyName(tenant.companyName);
    setSubdomain(tenant.subdomain);
    setPrimary(tenant.primaryColor);
    setSecondary(tenant.secondaryColor);
    setLogoUrl(tenant.logoUrl ?? null);
    setError(null);
  }

  async function handleFileSelected(file: File) {
    setError(null);
    if (!ACCEPT.includes(file.type)) {
      setError('Please upload a PNG or JPG file.');
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`Max file size is ${MAX_MB} MB.`);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setLogoUrl(objectUrl);

    // If company name looks like a default, infer it from the filename
    if (looksLikeDemo(companyName)) {
      const inferred = toTitleCase(file.name);
      if (inferred) setCompanyName(inferred);
    }

    // Try to extract an accent color for Primary
    try {
      const accent = await extractAverageColor(objectUrl);
      if (accent) setPrimary(accent);
    } catch {
      // ignore extraction failures silently
    }
  }

  function removeLogo() {
    if (logoUrl?.startsWith('blob:')) URL.revokeObjectURL(logoUrl);
    setLogoUrl(null);
  }

  function onChooseFile() {
    fileRef.current?.click();
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);

    const patch: Partial<Tenant> = {
      companyName,
      subdomain,
      primaryColor: primary,
      secondaryColor: secondary,
      logoUrl,
    };

    // mimic async
    setTimeout(() => {
      updateTenant(patch);
      setBusy(false);
    }, 300);
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="mb-2 text-2xl font-bold text-gray-900">Company Settings</h1>
      <p className="mb-6 text-gray-600">Manage your company branding and preferences</p>

      {/* Header preview */}
      <div className="mb-6 bg-white border rounded-xl">
        <div
          className="flex items-center justify-between px-4 py-3 text-white rounded-t-xl"
          style={{ backgroundColor: headerPreviewBg }}
        >
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Logo"
                className="object-contain w-8 h-8 p-1 bg-white rounded"
              />
            ) : (
              <div className="grid w-8 h-8 rounded bg-white/20 place-items-center">
                <ImageIcon size={16} />
              </div>
            )}
            <div>
              <div className="text-sm font-semibold">{companyName || 'Company Name'}</div>
              <div className="text-xs opacity-80">Fire Safety Management System</div>
            </div>
          </div>
          <div className="hidden gap-2 md:flex">
            <span className="rounded bg-white/20 px-2 py-0.5 text-xs">Trial</span>
            <span className="rounded bg-white/20 px-2 py-0.5 text-xs">Admin</span>
          </div>
        </div>
        <div className="px-4 py-3 text-xs text-gray-500">
          Header preview — updates as you change colors or logo.
        </div>
      </div>

      {error && (
        <div className="p-3 mb-4 text-sm text-red-700 border border-red-200 rounded bg-red-50">
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Logo */}
        <section className="p-4 bg-white border rounded-xl">
          <h2 className="mb-2 text-lg font-semibold">Company Logo</h2>
          <p className="mb-4 text-sm text-gray-500">
            PNG or JPG, max {MAX_MB}MB. Square images look best.
          </p>

          <div className="grid items-center gap-4 sm:grid-cols-[80px_1fr]">
            <div className="grid w-16 h-16 overflow-hidden border rounded-lg bg-gray-50 place-items-center">
              {logoUrl ? (
                <img className="object-contain w-full h-full" src={logoUrl} alt="Logo preview" />
              ) : (
                <span className="text-xs text-gray-400">No logo</span>
              )}
            </div>

            <div className="space-y-2">
              {/* Visible file input */}
              <input
                ref={fileRef}
                type="file"
                accept={ACCEPT.join(',')}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  await handleFileSelected(file);
                }}
                className="block w-full border border-gray-300 rounded-lg file:mr-3 file:rounded-md file:border-0 file:bg-indigo-600 file:px-3 file:py-2 file:text-white hover:file:opacity-90"
              />

              {logoUrl && (
                <button
                  type="button"
                  onClick={removeLogo}
                  className="text-sm text-gray-600 underline"
                >
                  Remove logo
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Company Info */}
        <section className="p-4 bg-white border rounded-xl">
          <h2 className="mb-2 text-lg font-semibold">Company Information</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block mb-1 text-sm font-medium">Company Name</label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter company name"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block mb-1 text-sm font-medium">Subdomain</label>
              <div className="flex">
                <input
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg"
                  value={subdomain}
                  onChange={(e) =>
                    setSubdomain(
                      e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9-]/g, '')
                        .slice(0, 32),
                    )
                  }
                  placeholder="yourcompany"
                />
                <span className="px-3 py-2 text-sm bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg">
                  .yourapp.com
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Lowercase letters, numbers, and hyphens only.
              </p>
            </div>
          </div>
        </section>

        {/* Brand Colors */}
        <section className="p-4 bg-white border rounded-xl">
          <h2 className="mb-2 text-lg font-semibold">Brand Colors</h2>

          <div className="grid items-center gap-4 sm:grid-cols-[180px_1fr_100px]">
            <div className="text-sm text-gray-600">Primary Color</div>
            <div className="flex items-center gap-3">
              {swatch(primary)}
              <input
                type="text"
                value={primary}
                onChange={(e) => setPrimary(e.target.value)}
                className="px-2 py-1 font-mono text-sm border border-gray-300 rounded-lg w-36"
                placeholder="#7c3aed"
              />
            </div>
            <input
              type="color"
              value={primary}
              onChange={(e) => setPrimary(e.target.value)}
              className="w-16 border rounded cursor-pointer h-9"
              aria-label="Pick primary color"
            />
          </div>

          <div className="mt-4 grid items-center gap-4 sm:grid-cols-[180px_1fr_100px]">
            <div className="text-sm text-gray-600">Secondary Color</div>
            <div className="flex items-center gap-3">
              {swatch(secondary)}
              <input
                type="text"
                value={secondary}
                onChange={(e) => setSecondary(e.target.value)}
                className="px-2 py-1 font-mono text-sm border border-gray-300 rounded-lg w-36"
                placeholder="#5b21b6"
              />
            </div>
            <input
              type="color"
              value={secondary}
              onChange={(e) => setSecondary(e.target.value)}
              className="w-16 border rounded cursor-pointer h-9"
              aria-label="Pick secondary color"
            />
          </div>

          <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
            <Palette size={16} />
            Tip: toggle between the two to find good contrast for text and icons.
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              disabled={busy}
              className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:opacity-90 disabled:opacity-60"
            >
              {busy ? 'Saving…' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Reset to Company Defaults
            </button>
          </div>
        </section>
      </form>
    </div>
  );
};

export default SettingsPage;
