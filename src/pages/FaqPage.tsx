import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CAMEROON_FAQS } from '../data/editorial';
import { useDocumentSeo, useStore } from '../context/StoreContext';

export function FaqPage() {
  const { openContact } = useStore();
  const [selectedCategory, setSelectedCategory] = useState(CAMEROON_FAQS.categories[0].id);
  const [openFaqId, setOpenFaqId] = useState<string>(CAMEROON_FAQS.items[0].id);
  const [stickyTop, setStickyTop] = useState(96);

  useEffect(() => {
    const header = document.querySelector('header');
    if (!header) return;
    const update = () => setStickyTop(header.getBoundingClientRect().height + 24);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(header);
    return () => ro.disconnect();
  }, []);

  const filteredItems = useMemo(
    () => CAMEROON_FAQS.items.filter((i) => i.category === selectedCategory),
    [selectedCategory]
  );

  useDocumentSeo({
    title: "Frequently Asked Questions | Pomegranate 'n' Lime Cameroon",
    description:
      'Answers on Douala & Yaoundé delivery timelines, MTN MoMo & Orange Money payments, bespoke table mat minimum quantities, and linen care.',
    canonicalPath: '/faq',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: CAMEROON_FAQS.items.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    },
  });

  return (
    <div className="mx-auto max-w-[1920px] px-4 sm:px-8 lg:px-16 xl:px-24 py-10 sm:py-16">
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <h1 className="text-[34px] sm:text-[44px] font-display text-admiral">
          Frequently Asked Questions
        </h1>
        <p className="mt-2 text-[15px] text-antiquity">
          Cameroon delivery, Mobile Money payments, artisanal care &amp; exchanges
        </p>
      </div>

      {/* Mobile Category Pills */}
      <div className="lg:hidden flex gap-2 overflow-x-auto pb-4 mb-4 no-scrollbar">
        {CAMEROON_FAQS.categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => {
              setSelectedCategory(cat.id);
              const first = CAMEROON_FAQS.items.find((i) => i.category === cat.id);
              if (first) setOpenFaqId(first.id);
            }}
            className={`shrink-0 rounded-full px-4 py-2 text-[13px] font-serif cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-admiral text-primrose font-medium'
                : 'border border-champagne bg-chiffon text-admiral'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
        {/* Desktop Sticky Left Sidebar */}
        <aside
          className="hidden lg:flex w-[320px] shrink-0 flex-col gap-3 sticky"
          style={{ top: `${stickyTop}px` }}
        >
          <div className="rounded-xl border border-champagne bg-chiffon p-4 flex flex-col gap-1.5">
            <div className="px-3 pb-2 text-[12px] font-sans uppercase tracking-wider text-antiquity font-semibold">
              FAQ Topics
            </div>
            {CAMEROON_FAQS.categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.id);
                  const first = CAMEROON_FAQS.items.find((i) => i.category === cat.id);
                  if (first) setOpenFaqId(first.id);
                }}
                className={`rounded-lg px-4 py-3 text-left text-[15px] font-serif transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-admiral text-primrose font-medium'
                    : 'text-admiral hover:bg-champagne/40'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </aside>

        {/* Right: Accordion */}
        <div className="flex-1 w-full flex flex-col gap-4">
          {filteredItems.map((item) => {
            const isOpen = openFaqId === item.id;
            return (
              <div
                key={item.id}
                className="rounded-xl border border-champagne bg-chiffon overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqId(isOpen ? '' : item.id)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer hover:bg-biege/40 transition-colors"
                >
                  <span className="text-[17px] sm:text-[18px] font-serif font-medium text-admiral">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-antiquity transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="border-t border-champagne/50 px-6 py-4 text-[15px] leading-relaxed text-admiral/85 font-serif bg-biege/25">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}

          <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-champagne bg-biege/50 p-6">
            <div>
              <h2 className="text-[20px] font-display text-admiral">Still need help?</h2>
              <p className="text-[14px] text-admiral/75">
                Reach our Bonapriso &amp; Bastos Cameroon Atelier concierge directly.
              </p>
            </div>
            <button
              type="button"
              onClick={openContact}
              className="rounded-[40px] bg-antiquity px-7 py-2.5 text-[14px] font-medium text-chiffon hover:opacity-90 cursor-pointer shrink-0"
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
