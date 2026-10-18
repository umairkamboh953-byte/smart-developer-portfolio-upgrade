import React, { useState } from 'react';
import { PublicSettings } from '../types';
import { Mail, MessageSquare, Send, CheckCircle2, Clock, Globe2, AlertCircle } from 'lucide-react';

interface ContactSectionProps {
  settings: PublicSettings;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ settings }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Please fill out all required fields.');
      return;
    }

    setLoading(true);

    try {
      // Re-use inquiries endpoint with contact message type
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: name,
          email,
          businessName: subject || 'General Inquiry',
          country: 'Direct Message',
          websiteType: 'General Consultation',
          requiredFeatures: [],
          budgetRange: 'Consultation',
          projectDescription: message
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send message.');
      }

      setSuccess(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err: any) {
      setError(err.message || 'Error sending message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12 animate-in fade-in duration-300">
      <div className="text-center max-w-2xl mx-auto space-y-2.5 sm:space-y-3">
        <div className="text-xs font-semibold text-blue-400">Direct Communication</div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
          Get in Touch
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Have questions about ready-made website source code or want to discuss a custom contract? We are here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Column: Direct Contact Details & Info */}
        <div className="lg:col-span-5 space-y-4 sm:space-y-6">
          <div className="p-4 sm:p-6 rounded-2xl border border-white/10 bg-[#0c0f1c] space-y-4">
            <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
              Verified Contact Channels
            </h3>

            <div className="space-y-4 pt-1">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600/15 border border-blue-500/25 flex items-center justify-center text-blue-400 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] sm:text-[11px] text-slate-400 block uppercase">Primary Business Email</span>
                  <a
                    href={`mailto:${settings.businessEmail || 'smartbuy9@gmail.com'}`}
                    className="text-xs sm:text-sm font-semibold text-white hover:text-blue-400 transition-colors truncate block"
                  >
                    {settings.businessEmail || 'smartbuy9@gmail.com'}
                  </a>
                </div>
              </div>

              {settings.whatsappEnabled && settings.whatsappNumber ? (
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shrink-0">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] sm:text-[11px] text-slate-400 block uppercase">WhatsApp Business</span>
                    <a
                      href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs sm:text-sm font-semibold text-white hover:text-emerald-400 transition-colors truncate block"
                    >
                      {settings.whatsappNumber}
                    </a>
                  </div>
                </div>
              ) : null}

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-violet-600/15 border border-violet-500/25 flex items-center justify-center text-violet-400 shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] sm:text-[11px] text-slate-400 block uppercase">Response Turnaround</span>
                  <span className="text-xs sm:text-sm font-semibold text-white">Within 4 to 12 Hours</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600/15 border border-indigo-500/25 flex items-center justify-center text-indigo-400 shrink-0">
                  <Globe2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] sm:text-[11px] text-slate-400 block uppercase">International Markets</span>
                  <span className="text-xs text-slate-300">
                    Pakistan, USA, UK, Canada, Australia & global clients
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl border border-white/5 bg-[#090b14] text-xs text-slate-400 space-y-2">
            <div className="font-semibold text-slate-200">Source Code Delivery Assurance</div>
            <p className="leading-relaxed">
              Every digital purchase inquiry is assigned a permanent reference tracking number. You can verify order statuses anytime through the portal.
            </p>
          </div>
        </div>

        {/* Right Column: Contact Message Form */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-white/10 bg-[#0c0f1c] space-y-4 sm:space-y-5 shadow-2xl"
          >
            <h3 className="text-sm sm:text-base font-bold text-white">Send a Direct Message</h3>

            {error && (
              <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Your message has been received! We will follow up via email shortly.</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2.5 bg-[#121628] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Your Email *</label>
                <input
                  type="email"
                  required
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2.5 bg-[#121628] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Subject / Website of Interest</label>
              <input
                type="text"
                placeholder="e.g. Inquiring about Aura Luxe e-commerce template"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full min-h-[44px] px-3.5 py-2.5 bg-[#121628] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Your Message *</label>
              <textarea
                required
                rows={4}
                placeholder="Write your questions or project requirements here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3.5 bg-[#121628] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 leading-relaxed transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto min-h-[44px] px-7 py-3 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{loading ? 'Sending...' : 'Send Message'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
