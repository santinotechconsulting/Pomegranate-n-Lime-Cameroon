import React, { useState } from 'react';
import { Briefcase, Building2, Edit3, Home, PenLine, Trash2 } from 'lucide-react';
import { useDocumentSeo, useStore } from '../../context/StoreContext';
import type { Address } from '../../types/store';
import { Spinner } from '../../components/Spinner';
import { AccountSidebar } from './AccountSidebar';

function AddressCard({
  address,
  isDefault,
  isDefaultLoading,
  onEdit,
  onDelete,
  onMakeDefault,
}: {
  address: Address;
  isDefault: boolean;
  isDefaultLoading: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onMakeDefault: () => void;
}) {
  const [cardHover, setCardHover] = useState(false);
  const [editHover, setEditHover] = useState(false);

  const isWork = Boolean(address.label && /work/i.test(address.label));
  const labelText = isWork ? 'Work' : address.label || 'Home';

  return (
    <div
      onMouseEnter={() => setCardHover(true)}
      onMouseLeave={() => setCardHover(false)}
      className="relative rounded-lg border border-champagne bg-chiffon p-4 lg:p-5 transition-shadow hover:shadow-sm"
    >
      {/* Desktop top-right actions */}
      <div className="absolute right-6 top-6 hidden lg:flex items-center gap-8 text-[14px] text-[#1c2237]">
        <button
          type="button"
          onClick={onEdit}
          onMouseEnter={() => setEditHover(true)}
          onMouseLeave={() => setEditHover(false)}
          className="flex items-center gap-1.5 transition-opacity cursor-pointer hover:opacity-80"
        >
          {editHover ? (
            <PenLine className="h-4 w-4 text-admiral" />
          ) : (
            <Edit3 className="h-4 w-4 text-admiral" />
          )}
          <span>Edit Info</span>
        </button>

        <button
          type="button"
          onClick={onDelete}
          className="flex items-center gap-1.5 transition-opacity cursor-pointer hover:opacity-80"
        >
          <Trash2 className="h-4 w-4 text-admiral" />
          <span>Delete</span>
        </button>
      </div>

      {/* Desktop bottom-right Make as Default */}
      {!isDefault && (
        <div className="absolute bottom-6 right-6 hidden lg:block">
          <button
            type="button"
            onClick={onMakeDefault}
            disabled={isDefaultLoading}
            className="flex items-center justify-center gap-2 w-[180px] rounded-full border border-antiquity py-2 text-[13px] font-medium text-antiquity bg-transparent transition-colors hover:bg-champagne/25 cursor-pointer disabled:opacity-60"
          >
            {isDefaultLoading && <Spinner size="xs" color="brand" />}
            <span>{isDefaultLoading ? 'Updating...' : 'Make as Default'}</span>
          </button>
        </div>
      )}

      <div className="flex items-start gap-5 sm:gap-6">
        <div className="flex flex-col items-center gap-2 w-24 shrink-0">
          <div className="flex h-24 w-24 flex-col items-center justify-center rounded-xl bg-[#ebdcb9] text-[#9b6828] transition-transform duration-200">
            {isWork ? (
              cardHover ? (
                <Building2 className="h-9 w-9" />
              ) : (
                <Briefcase className="h-9 w-9" />
              )
            ) : (
              <Home className="h-10 w-10" strokeWidth={cardHover ? 2.2 : 1.7} />
            )}
            <span className="mt-1 text-[14px] font-medium leading-none text-admiral">
              {labelText}
            </span>
          </div>

          {isDefault && (
            <span className="rounded-full border border-primrose px-4 py-0.5 text-[10px] text-antiquity text-center w-full bg-primrose/10">
              Default
            </span>
          )}
        </div>

        <div className="flex-1 pr-0 lg:pr-44 lg:pl-3 w-full text-left">
          <h3 className="text-[20px] font-serif text-admiral">{address.fullName}</h3>
          <p className="mt-2 text-[14px] leading-relaxed text-admiral">
            {address.line1}
            {address.line2 && (
              <>
                <br />
                {address.line2}
              </>
            )}
            <br />
            {address.city}, {address.state}
            {address.pincode ? ` - ${address.pincode}` : ''}
            <br />
            {address.country}
          </p>
          {address.phone && (
            <p className="mt-3 text-[14px] text-[#1c2237] tabular-nums">{address.phone}</p>
          )}
        </div>
      </div>

      {/* Mobile Actions */}
      <div className="mt-5 flex flex-col gap-3 lg:hidden border-t border-champagne/60 pt-4">
        <div className="flex items-center justify-center gap-3 w-full">
          <button
            type="button"
            onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-1.5 py-1 text-[13px] font-medium text-[#1c2237] cursor-pointer"
          >
            <Edit3 className="h-4 w-4 text-admiral" />
            <span>Edit Info</span>
          </button>
          <div className="h-6 w-px bg-[#ebdcb9]" />
          <button
            type="button"
            onClick={onDelete}
            className="flex-1 flex items-center justify-center gap-1.5 py-1 text-[13px] font-medium text-[#1c2237] cursor-pointer"
          >
            <Trash2 className="h-4 w-4 text-admiral" />
            <span>Delete</span>
          </button>
        </div>

        {!isDefault && (
          <button
            type="button"
            onClick={onMakeDefault}
            disabled={isDefaultLoading}
            className="flex items-center justify-center gap-2 w-full rounded-full border border-antiquity py-2.5 text-[13px] font-medium text-antiquity hover:bg-champagne/20 cursor-pointer disabled:opacity-60"
          >
            {isDefaultLoading && <Spinner size="xs" color="brand" />}
            <span>{isDefaultLoading ? 'Updating...' : 'Make as Default'}</span>
          </button>
        )}
      </div>
    </div>
  );
}

export function AddressesPage() {
  const { user, authChecked, addresses, refreshAddresses, navigate, showToast } = useStore();
  const [defaultLoadingId, setDefaultLoadingId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useDocumentSeo({
    title: "My Addresses | Pomegranate 'n' Lime Cameroon",
    description: 'Manage your Douala, Yaoundé, regional Cameroon, and international delivery addresses.',
  });

  if (!authChecked) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="md" label="Loading addresses..." />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-[600px] px-4 py-20 text-center">
        <h1 className="text-[28px] font-serif text-admiral mb-3">Sign in to manage Addresses</h1>
        <p className="text-[15px] text-admiral/75 mb-6">
          Save your Home and Work addresses across Cameroon for effortless checkout.
        </p>
        <button
          type="button"
          onClick={() => navigate('/login?next=/account/addresses')}
          className="rounded-[40px] bg-admiral px-8 py-3 text-[15px] text-chiffon hover:opacity-90 cursor-pointer"
        >
          Login to Continue
        </button>
      </div>
    );
  }

  const handleMakeDefault = async (id: string) => {
    setDefaultLoadingId(id);
    try {
      const res = await fetch(`/api/me/addresses/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        credentials: 'same-origin',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ isDefault: true }),
      });
      if (res.ok) {
        await refreshAddresses();
        showToast('Default address updated successfully');
      } else {
        showToast('Failed to update default address', { type: 'error' });
      }
    } finally {
      setDefaultLoadingId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/me/addresses/${encodeURIComponent(deleteTargetId)}`, {
        method: 'DELETE',
        credentials: 'same-origin',
      });
      if (res.ok) {
        await refreshAddresses();
        setDeleteTargetId(null);
        showToast('Address deleted successfully');
      }
    } finally {
      setDeleting(false);
    }
  };

  const sorted = [...addresses].sort((a, b) => (a.isDefault ? -1 : b.isDefault ? 1 : 0));

  return (
    <div className="mx-auto flex w-full max-w-[1920px] flex-col gap-6 px-3 sm:px-6 lg:flex-row lg:gap-10 lg:px-16 xl:px-24 py-8 lg:py-12">
      <AccountSidebar active="addresses" sidebarTitle="My Addresses" />

      <div className="flex flex-1 flex-col gap-6 min-w-0">
        <div className="px-1 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-[28px] font-serif font-normal text-admiral">
              Addresses
            </h1>
            <p className="mt-1 text-xs sm:text-[14px] text-purple">
              Manage your Cameroon &amp; global delivery addresses
            </p>
          </div>
          {addresses.length > 0 && (
            <button
              type="button"
              onClick={() => navigate('/checkout/address?mode=add&next=/account/addresses')}
              className="shrink-0 whitespace-nowrap rounded-full bg-antiquity px-5 py-2.5 text-xs sm:px-7 sm:py-3 sm:text-[14px] font-medium text-chiffon transition-opacity hover:opacity-90 cursor-pointer"
            >
              Add New Address
            </button>
          )}
        </div>

        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center pb-8 pt-4 px-4">
            <img src="/addressBlank.svg" alt="Where Should We Deliver?" className="h-56 w-56 mb-6" />
            <h2 className="text-[20px] sm:text-[24px] font-serif text-admiral mb-2">
              Where Should We Deliver?
            </h2>
            <p className="text-[14px] sm:text-[16px] text-admiral/80 mb-8 max-w-md">
              Add your Cameroon Quartier or international address so we can calculate accurate
              shipping and courier timelines.
            </p>
            <button
              type="button"
              onClick={() => navigate('/checkout/address?mode=add&next=/account/addresses')}
              className="rounded-full bg-antiquity px-8 py-2.5 text-[15px] font-medium text-chiffon hover:opacity-90 cursor-pointer"
            >
              Add New Address
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {sorted.map((addr) => (
              <AddressCard
                key={addr._id}
                address={addr}
                isDefault={addr.isDefault}
                isDefaultLoading={defaultLoadingId === addr._id}
                onEdit={() =>
                  navigate(`/checkout/address?mode=edit&id=${encodeURIComponent(addr._id)}&next=/account/addresses`)
                }
                onDelete={() => setDeleteTargetId(addr._id)}
                onMakeDefault={() => handleMakeDefault(addr._id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTargetId && (
        <div
          className="fixed inset-0 z-[180] flex items-center justify-center bg-black/45 px-4"
          onClick={() => !deleting && setDeleteTargetId(null)}
        >
          <div
            role="dialog"
            aria-label="Delete Address"
            onClick={(e) => e.stopPropagation()}
            className="flex w-full max-w-sm flex-col gap-6 rounded-lg border border-champagne bg-chiffon p-6 shadow-xl"
          >
            <h2 className="text-[20px] font-bold text-admiral">Delete Address</h2>
            <p className="text-[16px] text-admiral">Are you sure you want to delete this address?</p>
            <div className="flex w-full gap-4">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteTargetId(null)}
                className="flex-1 rounded-[40px] border border-admiral py-2.5 text-[15px] text-admiral hover:bg-champagne cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleConfirmDelete}
                className="flex-1 rounded-[40px] bg-admiral py-2.5 text-[15px] text-chiffon hover:opacity-90 cursor-pointer flex items-center justify-center gap-2"
              >
                {deleting && <Spinner size="xs" color="light" />}
                <span>{deleting ? 'Deleting...' : 'Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
