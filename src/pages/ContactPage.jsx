import React from 'react';
import ContactHero from '../components/contact/ContactHero';
import ContactForm from '../components/contact/ContactForm';
import TrustGuarantees from '../components/TrustGuarantees';

export default function ContactPage({ onNavigateHome }) {
  return (
    <div className="w-full bg-[#FFFFFF] text-[#000000] overflow-x-clip">
      {/* 1st Section: Contact Page Hero Banner (PSD 'Header', canvas y=69..1190 behind transparent navbar) */}
      <ContactHero />

      {/* 2nd Section: Contact Form (PSD 'Contact', canvas y=1357..3352) */}
      <ContactForm />

      {/* 4-Icon Trust & Guarantees Strip (PSD 'Icons', canvas y=3520..4136) */}
      <TrustGuarantees />
    </div>
  );
}

