import React, { useState } from 'react';
import { 
  PhoneCall, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  HelpCircle
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    role: 'Individual Citizen Recycler',
    message: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // FAQ Accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  const faqs = [
    {
      q: 'How does Waste2Wealth determine the estimated value of my waste?',
      a: 'Our algorithmic valuation engine benchmarks live regional scrap aggregator spot prices, wholesale trading indexes, and material purity levels. While municipal and local buyer transactions may fluctuate based on transportation costs and contamination, our calculator provides the most transparent indicative price range.',
    },
    {
      q: 'What happens to the waste once a pickup crew collects it?',
      a: 'Collected materials are transported exclusively to audited, licensed Material Recovery Facilities (MRFs) and circular remanufacturing plants. Recyclables are weighed on calibrated digital scales, optical-sorted by polymer or metallic alloy, and diverted away from municipal landfills.',
    },
    {
      q: 'Can businesses and manufacturing plants sell bulk industrial scrap?',
      a: 'Yes! Industrial manufacturers, warehouses, and commercial offices can list baled cardboard (OCC), high-density polymers, clean metal offcuts, and decommissioned electronic assets in our marketplace or arrange scheduled flatbed truck pickups.',
    },
    {
      q: 'Are the collection centers on this website real?',
      a: 'The recycling centers displayed currently serve as verified benchmark demo facilities across major metropolitan hubs to demonstrate seamless directory routing, logistics coordination, and material acceptance criteria.',
    },
    {
      q: 'How do marketplace sellers receive payment for their listed waste?',
      a: 'Buyers and aggregators contact sellers directly through the platform to arrange physical material inspection, scale verification, and payment via direct bank transfer, cash-on-scale, or digital escrow.',
    },
  ];

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Please provide your name';
    if (!formData.email.trim() || !formData.email.includes('@')) errors.email = 'Please provide a valid email';
    if (!formData.subject.trim()) errors.subject = 'Subject is required';
    if (!formData.message.trim()) errors.message = 'Please provide a message or inquiry details';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        role: 'Individual Citizen Recycler',
        message: '',
      });
      setFormErrors({});
    }, 4000);
  };

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !newsletterEmail.includes('@')) return;
    setNewsletterSuccess(true);
    setTimeout(() => {
      setNewsletterSuccess(false);
      setNewsletterEmail('');
    }, 4000);
  };

  return (
    <section id="contact" className="py-20 md:py-28 relative overflow-hidden bg-stone-100/50 scroll-mt-20 border-t border-stone-200/80">
      {/* Ambient background glows */}
      <div className="absolute top-20 right-10 w-96 h-96 rounded-full glow-spot-emerald pointer-events-none -z-10" />
      <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full glow-spot-purple pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill border border-emerald-300/60 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
            <span>Connect & Collaborate</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-stone-900 font-heading tracking-tight">
            Get in Touch & Frequently Asked Questions
          </h2>
          <p className="mt-3 text-stone-600 text-sm sm:text-base leading-relaxed font-medium">
            Have questions regarding enterprise feedstock procurement, municipal recycling partnerships, 
            or custom zero-waste pilot programs? Our circular solutions engineers are ready to assist.
          </p>
        </div>

        {/* Contact Grid: Form + Info + FAQs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Form */}
          <div className="lg:col-span-7 glass-panel p-6 sm:p-9 rounded-3xl border border-white/80 shadow-xl backdrop-blur-xl">
            <h3 className="text-xl sm:text-2xl font-black text-stone-900 font-heading mb-2">
              Send an Inquiry or Partnership Proposal
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 mb-7 font-medium">
              Complete the dispatch ticket below and our engineering team will respond within 24 business hours.
            </p>

            {isSubmitted ? (
              <div className="py-12 text-center space-y-3 glass-panel bg-emerald-50/80 rounded-3xl border border-emerald-200/90 p-8 shadow-md">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-inner">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-black text-stone-900 font-heading">Inquiry Registered!</h4>
                <p className="text-xs text-stone-600 max-w-sm mx-auto font-medium leading-relaxed">
                  Thank you for reaching out. A circular solutions specialist has been assigned to your ticket and will reply to your email promptly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Elena Rostova"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm ${
                        formErrors.name ? 'border-rose-400 bg-rose-50/50' : 'border-stone-200/90 bg-white/80'
                      } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                    />
                    {formErrors.name && (
                      <p className="text-[11px] text-rose-600 mt-1 font-semibold">{formErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="elena@company.com"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm ${
                        formErrors.email ? 'border-rose-400 bg-rose-50/50' : 'border-stone-200/90 bg-white/80'
                      } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                    />
                    {formErrors.email && (
                      <p className="text-[11px] text-rose-600 mt-1 font-semibold">{formErrors.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      Subject *
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. Commercial Cardboard Baling Partnership"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm ${
                        formErrors.subject ? 'border-rose-400 bg-rose-50/50' : 'border-stone-200/90 bg-white/80'
                      } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                    />
                    {formErrors.subject && (
                      <p className="text-[11px] text-rose-600 mt-1 font-semibold">{formErrors.subject}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      Stakeholder Role
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200/90 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/90 font-medium"
                    >
                      <option value="Individual Citizen Recycler">Individual Citizen Recycler</option>
                      <option value="Industrial Scrap Aggregator">Industrial Scrap Aggregator</option>
                      <option value="Manufacturing Feedstock Buyer">Manufacturing Feedstock Buyer</option>
                      <option value="Municipal Waste Authority">Municipal Waste Authority</option>
                      <option value="NGO / Sustainability Educator">NGO / Sustainability Educator</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    Message / Proposal Specifications *
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your inquiry, volume requirements, material types, or proposed collaboration."
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm ${
                      formErrors.message ? 'border-rose-400 bg-rose-50/50' : 'border-stone-200/90 bg-white/80'
                    } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                  />
                  {formErrors.message && (
                    <p className="text-[11px] text-rose-600 mt-1 font-semibold">{formErrors.message}</p>
                  )}
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-700/20 transition-all active:scale-95 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Inquiry</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Info & FAQ Accordion */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick Contact Info Card */}
            <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-white/80 shadow-md space-y-4 backdrop-blur-xl">
              <h4 className="text-sm font-black text-stone-900 font-heading">
                Operational Support Headquarters
              </h4>
              <div className="space-y-3.5 text-xs text-stone-600 font-medium">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span>Circular Economy Innovation Center, 450 Waterfront Blvd, Seattle, WA 98101</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/10 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-cyan-600" />
                  </div>
                  <span className="font-mono text-stone-800 font-semibold">support@waste2wealth-eco.demo</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-amber-600" />
                  </div>
                  <span>Mon - Fri: 08:00 AM - 06:00 PM PST</span>
                </div>
              </div>
            </div>

            {/* FAQ Accordion */}
            <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-white/80 shadow-md backdrop-blur-xl">
              <div className="flex items-center gap-2 text-sm font-black text-stone-900 font-heading mb-4">
                <HelpCircle className="w-4 h-4 text-emerald-600" />
                <span>Frequently Answered Questions</span>
              </div>

              <div className="space-y-2.5">
                {faqs.map((faq, i) => {
                  const isOpen = openFaq === i;
                  return (
                    <div
                      key={i}
                      className="border border-stone-200/90 rounded-2xl overflow-hidden transition-all bg-white/70"
                    >
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : i)}
                        className="w-full p-3.5 text-left flex items-center justify-between text-xs font-bold text-stone-800 hover:text-emerald-700 transition-colors cursor-pointer"
                        aria-expanded={isOpen}
                      >
                        <span className="pr-2">{faq.q}</span>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="p-3.5 text-xs text-stone-600 leading-relaxed bg-white/90 border-t border-stone-100 font-normal animate-in fade-in">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Newsletter Subscription Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-950 via-stone-900 to-teal-950 text-white shadow-xl border border-emerald-500/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Circular Market Digest</span>
              </h4>
              <p className="text-xs text-stone-300 mb-4 font-normal leading-relaxed">
                Receive weekly secondary plastics, recycled metals, and scrap paper wholesale price indices.
              </p>
              {newsletterSuccess ? (
                <div className="p-3 rounded-xl bg-emerald-900/90 border border-emerald-600 text-white text-xs font-bold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Subscribed successfully to weekly digest!</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletter} className="flex gap-2">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter business email..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-stone-950/80 border border-emerald-700/60 text-xs text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-stone-950 font-black text-xs shrink-0 cursor-pointer shadow-md transition-all active:scale-95"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
