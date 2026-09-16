import React, { useState } from 'react';
import { Smartphone, Download, Check } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'header' | 'banner' | 'pill';
  onOpenStoreModal?: () => void;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'header',
  onOpenStoreModal,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);

  // If already installed as standalone PWA
  if (isInstalled) {
    return (
      <button
        onClick={onOpenStoreModal}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer border border-slate-200"
        title="App Installed - View Store Publishing Status"
      >
        <Check className="w-3.5 h-3.5 text-emerald-600" />
        <span className="hidden sm:inline">App Installed</span>
      </button>
    );
  }

  // Header quick button
  if (variant === 'header') {
    return (
      <>
        <button
          onClick={() => {
            if (isInstallable) {
              install();
            } else if (isIOS) {
              setShowIOSModal(true);
            } else if (onOpenStoreModal) {
              onOpenStoreModal();
            }
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          title="Install KAAMLY Mobile App / View Store Publishing Guide"
        >
          <Smartphone className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden sm:inline">Get App</span>
          <span className="sm:hidden">App</span>
        </button>

        {showIOSModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setShowIOSModal(false)}
          >
            <div
              className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-2xl border border-slate-200 text-slate-900"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-extrabold text-base mb-2">Install KAAMLY on iPhone / iPad</h3>
              <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                1. Tap the <strong className="text-slate-900">Share</strong> icon in Safari toolbar.<br />
                2. Scroll down and choose <strong className="text-slate-900">Add to Home Screen</strong>.<br />
                3. Tap <strong className="text-slate-900">Add</strong> to launch KAAMLY like a native app.
              </p>
              <button
                onClick={() => setShowIOSModal(false)}
                className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                Understood
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Pill variant
  return (
    <button
      onClick={() => {
        if (isInstallable) {
          install();
        } else if (onOpenStoreModal) {
          onOpenStoreModal();
        }
      }}
      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200 transition-colors cursor-pointer"
    >
      <Download className="w-3.5 h-3.5" />
      <span>Play Store & App Store Ready</span>
    </button>
  );
};
