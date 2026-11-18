import React from 'react';
import { CAMEROON_CONTACT } from '../data/cameroon';
import { useDocumentSeo, useStore } from '../context/StoreContext';

type PolicyKey =
  | 'privacy-policy'
  | 'terms-of-use'
  | 'returns-exchanges'
  | 'general-terms-and-conditions';

interface PolicyPageProps {
  policy: PolicyKey;
}

const POLICIES: Record<
  PolicyKey,
  { title: string; subtitle: string; sections: Array<{ heading: string; body: string[] }> }
> = {
  'privacy-policy': {
    title: 'Privacy Policy',
    subtitle: 'Cameroon & International Data Protection Standard',
    sections: [
      {
        heading: '1. Information We Collect',
        body: [
          `At ${CAMEROON_CONTACT.legalEntity}, we collect only the details needed to handcraft, deliver, and invoice your table linens: your name, email address, Cameroon (+237) or international phone number, and delivery Quartier/address.`,
          'Mobile Money (MTN MoMo / Orange Money) and card authorizations are processed securely without storing raw payment PINs or card security codes.',
        ],
      },
      {
        heading: '2. How We Use Your Data',
        body: [
          'Your contact details enable express courier coordination in Douala, Yaoundé, Bafoussam, Buea, Kribi, and global DHL shipments, as well as generating your official Cameroon tax invoice.',
          `For any privacy request, write to ${CAMEROON_CONTACT.email}.`,
        ],
      },
    ],
  },
  'terms-of-use': {
    title: 'Terms of Use',
    subtitle: 'Governing Use of the Cameroon Storefront & Atelier',
    sections: [
      {
        heading: '1. Artisanal Handcrafted Nature',
        body: [
          'All Pomegranate ‘n’ Lime pieces are hand-dyed and hand-embroidered. Subtle variations in linen slub and thread tone are authentic signatures of handcrafted artistry.',
          'Prices are displayed in FCFA (XAF) by default for Cameroon clients, with optional USD and EUR viewing for diaspora and international patrons.',
        ],
      },
      {
        heading: '2. Governing Law & Jurisdiction',
        body: [
          'These Terms are governed by the laws of the Republic of Cameroon and applicable OHADA Uniform Acts. Any dispute falls under the competent jurisdiction of the Courts of Douala / Littoral.',
        ],
      },
    ],
  },
  'returns-exchanges': {
    title: 'Returns & Exchanges',
    subtitle: 'Cameroon & Global Quality Assurance',
    sections: [
      {
        heading: '1. 48-Hour Exchange Window',
        body: [
          'Products may be exchanged within 48 hours of delivery in Cameroon (or 7 days for international deliveries) in cases of manufacturing defect or transit damage.',
          'Items must be unused, unwashed, and returned in original packaging with all Atelier tags intact.',
        ],
      },
      {
        heading: '2. How to Initiate an Exchange',
        body: [
          `Send a clear unboxing photo or short video within 24 hours via WhatsApp (${CAMEROON_CONTACT.whatsappDisplay}) or email (${CAMEROON_CONTACT.supportEmail}).`,
          'Our Douala or Yaoundé courier will schedule a complimentary replacement pickup.',
        ],
      },
    ],
  },
  'general-terms-and-conditions': {
    title: 'General Terms and Conditions',
    subtitle: 'Orders, Minimum Quantities & Shipping Terms',
    sections: [
      {
        heading: '1. Individual Table Mat Minimum Rule',
        body: [
          'Individual Table Mats require a minimum total of 4 mats per order across any mix of motifs or collections. Full Sets, Half Sets, Runners, and Napkin sets have a minimum quantity of 1.',
        ],
      },
      {
        heading: '2. Cameroon & International Shipping',
        body: [
          `Orders above ${CAMEROON_CONTACT.freeShippingThresholdUsdMinor / 100 * 600} FCFA (150,000 FCFA) qualify for complimentary courier delivery within Douala and Yaoundé. Regional deliveries and international DHL shipments are quoted transparently at checkout.`,
        ],
      },
    ],
  },
};

export function PolicyPage({ policy }: PolicyPageProps) {
  const { navigate } = useStore();
  const data = POLICIES[policy] || POLICIES['privacy-policy'];

  useDocumentSeo({
    title: `${data.title} | Pomegranate 'n' Lime Cameroon`,
    description: `${data.title} for Pomegranate 'n' Lime Cameroon SARL — Douala & Yaoundé.`,
    canonicalPath: `/policies/${policy}`,
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:py-16">
      <div className="mb-8 flex flex-wrap gap-2 border-b border-champagne pb-4">
        {(Object.keys(POLICIES) as PolicyKey[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => navigate(`/policies/${key}`)}
            className={`rounded-full px-4 py-1.5 text-[13px] font-serif cursor-pointer ${
              key === policy
                ? 'bg-admiral text-primrose font-medium'
                : 'border border-champagne bg-chiffon text-admiral hover:bg-champagne/40'
            }`}
          >
            {POLICIES[key].title}
          </button>
        ))}
      </div>

      <h1 className="text-[32px] sm:text-[42px] font-display text-admiral">{data.title}</h1>
      <p className="mt-1 text-[15px] italic text-antiquity mb-8">{data.subtitle}</p>

      <div className="space-y-7 rounded-2xl border border-champagne bg-chiffon p-6 sm:p-8">
        {data.sections.map((sec) => (
          <section key={sec.heading}>
            <h2 className="text-[20px] font-serif font-bold text-admiral mb-2">{sec.heading}</h2>
            <div className="space-y-2.5 text-[15px] leading-relaxed text-admiral/85 font-serif">
              {sec.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>
        ))}

        <div className="border-t border-champagne pt-4 text-[13px] text-admiral/70">
          {CAMEROON_CONTACT.legalEntity} · {CAMEROON_CONTACT.doualaAtelier} · {CAMEROON_CONTACT.taxId}
        </div>
      </div>
    </div>
  );
}
