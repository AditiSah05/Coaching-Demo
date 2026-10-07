import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle, Send, CheckCircle2, Facebook, Instagram, Youtube, Linkedin } from 'lucide-react';
import { useData } from '../context/DataContext';
import { ScallopedBorder } from '../components/common/ScallopedBorder';

export const Contact = () => {
  const { settings, api } = useData();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: 'IMU-CET Ranker Prep Course',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    api.submitEnquiry(formData);
    setSubmitted(true);
  };

  const whatsappClean = (settings?.whatsapp || '').replace(/[^0-9]/g, '');

  return (
    <div className="bg-ivory text-ink min-h-screen">
      
      {/* Header */}
      <section className="bg-navy-deep text-ivory py-16 relative bg-maritime-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="badge-solid bg-gold/20 text-gold mb-3">Contattaci</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white mb-4">
            Contact & Campus Location
          </h1>
          <p className="text-sm text-ivory/80 max-w-2xl mx-auto leading-relaxed">
            Have questions about Merchant Navy eligibility or sponsorship coaching? Reach out to our counsellors.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <ScallopedBorder fillColor="#FBF6EC" />
        </div>
      </section>

      {/* Main Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left: Contact Info Cards */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-white rounded-3xl p-6 border-2 border-navy-deep/10 shadow-chunky space-y-4">
                <h3 className="font-serif text-xl font-bold text-navy-deep border-b pb-2">
                  Campus Headquarters
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-terracotta/10 text-terracotta flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-navy-deep block">Academy Address:</span>
                      <span className="text-ink/70 leading-relaxed">{settings?.address}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-sea-blue/10 text-navy-deep flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-navy-deep block">Phone Helplines:</span>
                      <a href={`tel:${settings?.phonePrimary}`} className="text-sea-blue font-bold hover:underline block">{settings?.phonePrimary}</a>
                      <a href={`tel:${settings?.phoneSecondary}`} className="text-ink/70 hover:underline block">{settings?.phoneSecondary}</a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gold/20 text-navy-deep flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-navy-deep block">Email Desk:</span>
                      <a href={`mailto:${settings?.email}`} className="text-terracotta font-semibold hover:underline">{settings?.email}</a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-seagreen/20 text-seagreen flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-navy-deep block">Campus Operating Hours:</span>
                      <span className="text-ink/70">Monday - Saturday: 08:00 AM - 07:00 PM</span>
                      <span className="text-ink/70 block">Sunday: 09:00 AM - 02:00 PM</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Quick Chat */}
              <div className="bg-seagreen text-white rounded-3xl p-6 shadow-lg flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-lg font-bold">Instant Counselling</h4>
                  <p className="text-xs text-white/90">Chat directly with Master Mariner desk</p>
                </div>
                <a
                  href={`https://wa.me/${whatsappClean}?text=Hello%20Pacific%20Marine%20Academy,%20I%20want%20information.`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white text-seagreen font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              </div>

            </div>

            {/* Right: Interactive Enquiry Form */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-3xl p-8 border-2 border-navy-deep/10 shadow-chunky">
                
                {!submitted ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="font-serif text-2xl font-bold text-navy-deep border-b pb-2">
                      Send Admission Enquiry
                    </h3>

                    <div>
                      <label className="block text-xs font-bold text-navy-deep mb-1">Your Name*</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Rahul Patil"
                        className="w-full p-3 text-xs rounded-xl border border-navy-deep/20 focus:outline-none focus:border-terracotta"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-navy-deep mb-1">Mobile / WhatsApp*</label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="w-full p-3 text-xs rounded-xl border border-navy-deep/20 focus:outline-none focus:border-terracotta"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-navy-deep mb-1">Email Address</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="rahul@example.com"
                          className="w-full p-3 text-xs rounded-xl border border-navy-deep/20 focus:outline-none focus:border-terracotta"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-navy-deep mb-1">Program Of Interest</label>
                      <select
                        value={formData.course}
                        onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                        className="w-full p-3 text-xs rounded-xl border border-navy-deep/20 focus:outline-none"
                      >
                        <option value="IMU-CET Ranker Prep Course">IMU-CET Ranker Prep Course</option>
                        <option value="DNS & Sponsorship Exam Coaching">DNS & Sponsorship Exam Coaching</option>
                        <option value="G.P. Rating Entrance & Foundation">G.P. Rating Entrance & Foundation</option>
                        <option value="Engine Cadet Prep">Engine Cadet Prep</option>
                        <option value="General Guidance Call">General Career Guidance Call</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-navy-deep mb-1">Message / Question</label>
                      <textarea
                        rows="4"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tell us about your educational background (10th/12th PCM %) and questions..."
                        className="w-full p-3 text-xs rounded-xl border border-navy-deep/20 focus:outline-none focus:border-terracotta"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-terracotta hover:bg-terracotta-hover text-white font-bold py-3.5 rounded-xl shadow-terracotta text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Submit Enquiry</span>
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-12 space-y-4">
                    <CheckCircle2 className="w-16 h-16 text-seagreen mx-auto animate-bounce" />
                    <h3 className="font-serif text-2xl font-bold text-navy-deep">Enquiry Received!</h3>
                    <p className="text-xs text-ink/70 max-w-md mx-auto">
                      Thank you {formData.name}. Our Master Mariner counselling desk has logged your query and will contact you via phone within 2 hours.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="bg-navy-deep text-gold font-bold px-6 py-2.5 rounded-xl text-xs uppercase"
                    >
                      Send Another Message
                    </button>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Embedded Google Map */}
      <section className="py-12 bg-white border-t border-navy-deep/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h3 className="font-serif text-2xl font-bold text-navy-deep">Find Us On Google Maps</h3>
          </div>

          <div className="arch-image overflow-hidden border-4 border-navy-deep shadow-2xl h-96">
            <iframe
              src={settings?.mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title="Pacific Marine Academy Google Map Location"
            ></iframe>
          </div>
        </div>
      </section>

    </div>
  );
};
