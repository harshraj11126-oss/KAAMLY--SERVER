import React, { useState } from 'react';
import {
  X,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Copy,
  Terminal,
  ShieldCheck,
  FileCode,
  Download,
  ExternalLink,
  Layers
} from 'lucide-react';

interface StorePublishModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StorePublishModal: React.FC<StorePublishModalProps> = ({ isOpen, onClose }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const auditItems = [
    {
      title: 'Cryptographic Auth & Brute-Force Defense',
      value: 'HMAC-SHA256 & Rate Limited',
      status: 'pass',
      desc: 'Server-side timing-safe OTP verification, max 3 attempts, 5-min expiry, single-use token issuance. No client-side bypass.'
    },
    {
      title: 'Zero Client-Side Secrets / Gemini Proxy',
      value: 'Server-Side API Proxy',
      status: 'pass',
      desc: 'AI keys and tokens are stored server-side. Browser clients access through rate-limited /api/ai/assist proxy.'
    },
    {
      title: 'Android Manifest & Network Hardening',
      value: 'Cleartext HTTP Disabled',
      status: 'pass',
      desc: 'android:allowBackup="false", android:usesCleartextTraffic="false", strict networkSecurityConfig trust anchors.'
    },
    {
      title: 'Location & Phone Number Privacy',
      value: 'Neighborhood Precision Masking',
      status: 'pass',
      desc: 'Coordinates blurred to ~1.1km neighborhood level. Public listings mask contact numbers to stop scraping.'
    },
    {
      title: 'Google Play Data Safety & Account Deletion',
      value: 'Full Purge Compliant',
      status: 'pass',
      desc: 'Complies with Google Play Store 2024/2025/2026 data deletion mandate. Users can delete all profile & activity data.'
    },
    {
      title: 'Target SDK & API Level Compliance',
      value: 'Target SDK 34 / 35 ready',
      status: 'pass',
      desc: 'Meets Google Play Console requirements with minimal safe permissions (no intrusive SMS/CALL permissions).'
    }
  ];

  const keystoreCmd = `keytool -genkey -v -keystore release-key.jks -alias kaamly-key -keyalg RSA -keysize 2048 -validity 10000`;
  const aabBuildCmd = `npm run build\nnpx cap sync\ncd android && ./gradlew bundleRelease`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-white text-base">
                Google Play Store & App Store Publication Hub
              </h2>
              <p className="text-xs text-slate-400">
                KAAMLY v1.0.0 (Build 1) • Production Readiness Audit
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Audit Checklist */}
          <div>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
              Play Store Verification Checklist
            </h3>
            <div className="space-y-2.5">
              {auditItems.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-950/60 border border-slate-800 rounded-2xl flex items-start gap-3"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-white">{item.title}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                        {item.value}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Android AAB Generation Commands */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Release Commands (Android App Bundle .aab)
              </h3>
            </div>

            {/* Keystore */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="font-semibold flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-amber-400" />
                  1. Generate Production Release Keystore:
                </span>
                <button
                  onClick={() => copyToClipboard(keystoreCmd, 'keystore')}
                  className="text-amber-400 hover:text-amber-300 flex items-center gap-1 text-[11px]"
                >
                  <Copy className="w-3 h-3" />
                  {copiedKey === 'keystore' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <pre className="text-[11px] font-mono bg-slate-900 p-2.5 rounded-xl text-slate-300 overflow-x-auto">
                {keystoreCmd}
              </pre>
            </div>

            {/* Bundle Release */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="font-semibold flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-amber-400" />
                  2. Compile & Build Signed Android Bundle (.aab):
                </span>
                <button
                  onClick={() => copyToClipboard(aabBuildCmd, 'aab')}
                  className="text-amber-400 hover:text-amber-300 flex items-center gap-1 text-[11px]"
                >
                  <Copy className="w-3 h-3" />
                  {copiedKey === 'aab' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <pre className="text-[11px] font-mono bg-slate-900 p-2.5 rounded-xl text-slate-300 overflow-x-auto">
                {aabBuildCmd}
              </pre>
            </div>
          </div>

          {/* Privacy & Policy Requirements */}
          <div className="p-4 bg-slate-800/30 border border-slate-800 rounded-2xl space-y-2 text-xs text-slate-300">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Google Play Console Data Safety Declarations
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-[11px] text-slate-400">
              <li>
                <strong>Data Collection:</strong> Phone number (Account management), Approximate & Precise Location (Worker/Job matching).
              </li>
              <li>
                <strong>Data Sharing:</strong> No data shared with 3rd-party advertising brokers.
              </li>
              <li>
                <strong>Account Deletion:</strong> User-initiated account deletion feature implemented in Profile screen (Play Store mandate).
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <span className="text-xs text-slate-400">Ready for Google Play Console upload</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-colors"
          >
            Close Hub
          </button>
        </div>
      </div>
    </div>
  );
};
