import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export function AddressBanner() {
  const { currentPath, user, addresses, navigate } = useStore();
  const [closed, setClosed] = useState(false);

  const onShopRoute =
    currentPath === '/' ||
    currentPath.startsWith('/collections') ||
    currentPath.startsWith('/products');

  if (!onShopRoute || closed || addresses.length > 0) return null;

  return (
    <div className="fixed bottom-16 lg:bottom-0 inset-x-0 z-30 bg-chiffon border-t border-antiquity shadow-[0_-4px_10px_rgba(0,0,0,0.06)] px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3">
      <div className="mx-auto max-w-[1200px] flex items-center justify-center pr-6">
        <div className="flex items-center justify-center gap-3 sm:gap-4 whitespace-nowrap">
          <div className="flex flex-col gap-0.5 text-left">
            <span className="text-[12px] sm:text-[15px] font-medium text-admiral leading-none">
              Add your delivery address
            </span>
            <span className="text-[10px] sm:text-[12px] text-antiquity leading-none">
              We need it to calculate Cameroon or global shipping
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              if (user) {
                navigate('/checkout/address?mode=add&next=/');
              } else {
                navigate('/register?next=%2Fcheckout%2Faddress%3Fmode%3Dadd');
              }
            }}
            className="shrink-0 rounded-[40px] bg-admiral px-4 sm:px-7 py-1.5 sm:py-2 text-[11px] sm:text-[13px] font-medium text-chiffon hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer leading-none"
          >
            Add Address
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setClosed(true)}
        aria-label="Close"
        className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 flex items-center gap-1 text-admiral hover:opacity-80 text-[12px] sm:text-[13px] p-1 cursor-pointer"
      >
        <X className="h-4 w-4" />
        <span className="hidden sm:inline">Close</span>
      </button>
    </div>
  );
}
