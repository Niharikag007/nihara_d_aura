import React from 'react';

const WHATSAPP_NUMBER = '919266059846';
const WHATSAPP_MESSAGE = "Hello Nihara D'Aura, I would like to know more about your products and services.";

export default function WhatsAppButton() {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Nihara D'Aura on WhatsApp"
      title="Chat with us on WhatsApp"
      className="fixed bottom-[5.5rem] right-4 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_rgba(37,211,102,0.4)] transition-transform duration-200 hover:scale-105 hover:bg-[#20BD5A] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/35 md:bottom-6 md:right-6"
    >
      <svg
        viewBox="0 0 32 32"
        fill="currentColor"
        aria-hidden="true"
        className="h-8 w-8"
      >
        <path d="M16.02 3C8.86 3 3.04 8.78 3.04 15.9c0 2.28.6 4.5 1.75 6.46L3 29l6.84-1.78a13.1 13.1 0 0 0 6.18 1.56h.01c7.16 0 12.98-5.79 12.98-12.9 0-3.45-1.35-6.7-3.8-9.14A12.91 12.91 0 0 0 16.02 3Zm0 23.6h-.01c-1.9 0-3.77-.5-5.4-1.47l-.39-.23-4.06 1.06 1.08-3.94-.25-.4a10.58 10.58 0 0 1-1.63-5.72c0-5.87 4.8-10.65 10.68-10.65 2.85 0 5.53 1.1 7.54 3.12a10.54 10.54 0 0 1 3.13 7.52c0 5.88-4.8 10.67-10.69 10.67Zm5.86-7.99c-.32-.16-1.9-.94-2.2-1.05-.3-.1-.51-.16-.73.16-.21.32-.84 1.05-1.03 1.27-.19.21-.38.24-.7.08-.32-.16-1.35-.5-2.58-1.6-.96-.85-1.61-1.9-1.8-2.22-.19-.31-.02-.49.14-.65.14-.14.32-.38.49-.57.16-.19.21-.32.32-.54.1-.21.05-.4-.03-.57-.08-.16-.73-1.75-1-2.4-.26-.63-.53-.54-.73-.55h-.62c-.22 0-.57.08-.87.4-.3.33-1.14 1.11-1.14 2.7s1.17 3.12 1.33 3.34c.16.21 2.3 3.5 5.57 4.9.78.33 1.39.53 1.86.68.78.24 1.5.2 2.06.12.63-.1 1.9-.78 2.17-1.54.27-.75.27-1.4.19-1.53-.08-.14-.3-.22-.62-.38Z" />
      </svg>
    </a>
  );
}
