import React, { useState } from 'react';
import { ArrowLeft, ChevronRight, Play, X } from 'lucide-react';
import {
  BLOG_ARTICLES,
  STORY_SECTIONS,
  WORK_STORY_VIDEOS,
  type WorkStoryVideo,
} from '../data/editorial';
import { useDocumentSeo, useStore } from '../context/StoreContext';
import { LazyImage } from '../components/LazyImage';

interface OurStoryPageProps {
  section?: 'our-story' | 'brand-story' | 'product-story' | 'work-story' | 'blogs';
  blogId?: string;
}

const STORY_TABS = [
  { key: 'our-story', label: 'Our Story', href: '/our-story' },
  { key: 'brand-story', label: 'Brand Story', href: '/our-story/brand-story' },
  { key: 'product-story', label: 'Product Story', href: '/our-story/product-story' },
  { key: 'work-story', label: 'Work Story', href: '/our-story/work-story' },
  { key: 'blogs', label: 'Blogs & Journal', href: '/our-story/blogs' },
] as const;

export function OurStoryPage({ section = 'our-story', blogId }: OurStoryPageProps) {
  const { navigate } = useStore();
  const [activeVideo, setActiveVideo] = useState<WorkStoryVideo | null>(null);

  const selectedArticle = blogId ? BLOG_ARTICLES.find((b) => b.id === blogId) : undefined;
  const storyData = STORY_SECTIONS[section] || STORY_SECTIONS['our-story'];

  useDocumentSeo({
    title: selectedArticle
      ? `${selectedArticle.title} | Pomegranate 'n' Lime Cameroon`
      : section === 'work-story'
      ? "Work Story | Pomegranate 'n' Lime Cameroon"
      : section === 'blogs'
      ? "Journal & Blogs | Pomegranate 'n' Lime Cameroon"
      : `${storyData.heading} | Pomegranate 'n' Lime Cameroon`,
    description: selectedArticle
      ? selectedArticle.excerpt
      : "Discover Pomegranate 'n' Lime Cameroon's journey — reviving handcrafted courtyard grandeur and the art of hosting across Douala, Yaoundé, and worldwide.",
    canonicalPath: blogId ? `/our-story/blogs/${blogId}` : section === 'our-story' ? '/our-story' : `/our-story/${section}`,
  });

  return (
    <div className="mx-auto max-w-[1920px] px-4 sm:px-8 lg:px-16 xl:px-24 py-8 sm:py-14">
      {/* Sub-Navigation Tabs */}
      <nav
        aria-label="Our World Navigation"
        className="mb-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3 border-b border-champagne pb-5"
      >
        {STORY_TABS.map((t) => {
          const isActive = t.key === section;
          return (
            <a
              key={t.key}
              href={t.href}
              onClick={(e) => {
                e.preventDefault();
                navigate(t.href);
              }}
              className={`rounded-full px-5 py-2 text-[13px] sm:text-[14px] font-serif transition-colors ${
                isActive
                  ? 'bg-admiral text-primrose font-medium shadow-sm'
                  : 'border border-champagne bg-chiffon text-admiral hover:bg-champagne/50'
              }`}
            >
              {t.label}
            </a>
          );
        })}
      </nav>

      {/* Single Blog Article View (/our-story/blogs/:id) */}
      {section === 'blogs' && selectedArticle ? (
        <article className="mx-auto max-w-3xl">
          <button
            type="button"
            onClick={() => navigate('/our-story/blogs')}
            className="mb-6 inline-flex items-center gap-2 text-[14px] text-antiquity hover:underline cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to All Blogs</span>
          </button>

          <div className="mb-4 flex flex-wrap items-center gap-2 text-[12px] font-sans uppercase tracking-widest text-antiquity">
            <span>{selectedArticle.publishedAt}</span>
            <span>·</span>
            <span>{selectedArticle.readTime}</span>
          </div>

          <h1 className="text-[32px] sm:text-[44px] font-display text-admiral leading-tight mb-6">
            {selectedArticle.title}
          </h1>

          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-champagne mb-8">
            <LazyImage
              src={selectedArticle.headerImage}
              alt={selectedArticle.title}
              fill
              priority
              className="object-cover"
            />
          </div>

          <div className="space-y-5 text-[16px] sm:text-[17px] leading-relaxed text-admiral/90 font-serif">
            {selectedArticle.paragraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-2 border-t border-champagne pt-6">
            {selectedArticle.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-champagne bg-biege/60 px-3.5 py-1 text-[12px] text-antiquity"
              >
                #{tag}
              </span>
            ))}
          </div>
        </article>
      ) : section === 'blogs' ? (
        /* Blogs Listing View (/our-story/blogs) */
        <div>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h1 className="text-[34px] sm:text-[46px] font-display text-admiral">
              Atelier Journal &amp; Blogs
            </h1>
            <p className="mt-2 text-[15px] text-antiquity italic">
              Essays on table artistry, royal courtyards, and contemporary Cameroonian hosting
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {BLOG_ARTICLES.map((post) => (
              <article
                key={post.id}
                onClick={() => navigate(`/our-story/blogs/${post.id}`)}
                className="group cursor-pointer rounded-2xl border border-champagne bg-chiffon overflow-hidden shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-champagne/20">
                  <LazyImage
                    src={post.headerImage}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="text-[12px] font-sans text-antiquity mb-2">
                    {post.publishedAt} · {post.readTime}
                  </div>
                  <h2 className="text-[24px] font-display text-admiral group-hover:text-antiquity transition-colors">
                    {post.title}
                  </h2>
                  <p className="mt-2 text-[14px] text-admiral/75 line-clamp-3">{post.excerpt}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-[13px] font-medium text-antiquity">
                    <span>Read Essay</span>
                    <ChevronRight className="h-4 w-4" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : section === 'work-story' ? (
        /* Work Story / Craft Videos (/our-story/work-story) */
        <div>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h1 className="text-[34px] sm:text-[46px] font-display text-admiral">
              Work Story &amp; Studio Films
            </h1>
            <p className="mt-2 text-[15px] text-antiquity italic">
              Step inside our embroidery frames and Cameroon table styling showcases
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {WORK_STORY_VIDEOS.map((vid) => (
              <div
                key={vid.id}
                className="flex flex-col rounded-2xl border border-champagne bg-chiffon overflow-hidden shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setActiveVideo(vid)}
                  className="group relative aspect-[4/5] w-full overflow-hidden bg-admiral cursor-pointer"
                >
                  <LazyImage
                    src={vid.thumbnail}
                    alt={vid.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-90"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-admiral/25 group-hover:bg-admiral/40 transition-colors">
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-chiffon/95 text-antiquity shadow-xl transition-transform group-hover:scale-110">
                      <Play className="h-7 w-7 ml-1" fill="#ac6628" />
                    </span>
                  </div>
                  <span className="absolute bottom-3 right-3 rounded-full bg-admiral/80 px-3 py-1 text-[11px] font-sans text-chiffon tabular-nums">
                    {vid.duration}
                  </span>
                </button>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-[20px] font-display text-admiral">{vid.title}</h2>
                    <p className="mt-2 text-[14px] text-admiral/75 leading-relaxed">
                      {vid.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {activeVideo && (
            <div
              className="fixed inset-0 z-[180] flex items-center justify-center bg-black/75 p-4"
              onClick={() => setActiveVideo(null)}
            >
              <div
                className="w-full max-w-xl rounded-2xl border border-champagne bg-chiffon p-6 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h3 className="text-[22px] font-display text-admiral">{activeVideo.title}</h3>
                  <button
                    type="button"
                    onClick={() => setActiveVideo(null)}
                    className="p-1 text-admiral hover:opacity-70 cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-champagne mb-4">
                  <LazyImage
                    src={activeVideo.thumbnail}
                    alt={activeVideo.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-[14px] text-admiral/85 leading-relaxed mb-5">
                  {activeVideo.description}
                </p>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <a
                    href={activeVideo.reelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-admiral px-6 py-2.5 text-[14px] text-chiffon hover:opacity-90"
                  >
                    Watch Full Reel on Instagram
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveVideo(null);
                      navigate('/collections');
                    }}
                    className="rounded-full border border-antiquity px-5 py-2.5 text-[14px] text-antiquity hover:bg-champagne/40 cursor-pointer"
                  >
                    Shop Featured Linens
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Editorial Narrative View (Our Story, Brand Story, Product Story) */
        <div className="mx-auto max-w-5xl">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h1 className="text-[36px] sm:text-[48px] font-display text-admiral">
              {storyData.heading}
            </h1>
            <p className="mt-2 text-[16px] sm:text-[18px] italic text-antiquity">
              {storyData.subtitle}
            </p>
          </div>

          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-champagne bg-champagne/20 mb-10 shadow-sm">
            <LazyImage
              src={storyData.heroImage}
              alt={storyData.heading}
              fill
              priority
              className="object-cover"
            />
          </div>

          <div className="mx-auto max-w-3xl space-y-5 text-[16px] sm:text-[17px] leading-[1.85] text-admiral/90 font-serif">
            {storyData.paragraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>

          {storyData.footerImage && (
            <div className="mt-12 relative aspect-[21/9] w-full overflow-hidden rounded-2xl border border-champagne">
              <LazyImage
                src={storyData.footerImage}
                alt={`${storyData.heading} Atelier`}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* More to Read */}
          <div className="mt-14 border-t border-champagne pt-10">
            <h2 className="text-[24px] font-display text-admiral mb-5">More to Read</h2>
            <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
              {STORY_TABS.filter((t) => t.key !== section).map((t) => (
                <a
                  key={t.key}
                  href={t.href}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(t.href);
                  }}
                  className="min-w-[210px] flex-1 rounded-xl border border-champagne bg-biege/40 p-5 hover:bg-champagne/40 transition-colors"
                >
                  <div className="text-[12px] font-sans uppercase tracking-wider text-antiquity">
                    Explore
                  </div>
                  <div className="mt-1 text-[20px] font-display text-admiral">{t.label}</div>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
