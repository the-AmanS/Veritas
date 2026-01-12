import React from 'react';
import { X, ShieldCheck, Cpu, User, Instagram } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg">
              <ShieldCheck size={20} />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">About Veritas</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-8 space-y-8">

          {/* Mission */}
          <section>
            <h3 className="text-lg font-serif font-bold text-gray-900 mb-3">Our Mission</h3>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              In an era of deepfakes and viral misinformation, Veritas serves as a digital shield.
              We don't just search the web; we filter reality through a lens of credibility,
              ensuring that the information you consume is verified by the world's most trusted institutions.
            </p>
          </section>

          {/* Architecture */}
          <section className="bg-slate-50 rounded-xl p-5 sm:p-6 border border-slate-100">
            <h3 className="text-lg font-serif font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Cpu size={20} className="text-blue-600" />
              How it Works: RAG Architecture
            </h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="mt-1 flex-shrink-0">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Retrieval</h4>
                  <p className="text-xs sm:text-sm text-gray-600">The system scans the live internet for your claim using Google Search.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="mt-1 flex-shrink-0">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Filtering (The Trust Layer)</h4>
                  <p className="text-xs sm:text-sm text-gray-600">We aggressively discard sources that are not in our curated whitelist of global news agencies (Reuters, AP, BBC, PTI, etc.).</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="mt-1 flex-shrink-0">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Generation</h4>
                  <p className="text-xs sm:text-sm text-gray-600">Google Gemini AI analyzes the remaining credible evidence to synthesize a verdict: Verified, False, or Misleading.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Creator */}
          <section className="border-t border-gray-100 pt-6">
            <h3 className="text-lg font-serif font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User size={20} className="text-blue-600" />
              Meet the Creator
            </h3>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white shadow-sm border border-gray-200 p-4 rounded-xl">
              <div className="h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                AS
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-lg">Aman Singh</h4>
                <p className="text-blue-600 font-medium">Third Year BSc IT Student</p>
                <p className="text-xs text-gray-500 mt-1">Passionate about AI Safety & Information Integrity</p>

                <div className="flex flex-wrap gap-3 mt-3">
                  <a href="https://www.instagram.com/amman._11/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-bold text-pink-600 bg-pink-50 px-3 py-1.5 rounded-full hover:bg-pink-100 transition-colors border border-pink-100">
                    <Instagram size={14} />
                    @amman._11
                  </a>
                  <a href="https://www.instagram.com/dr.kanekii/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-bold text-pink-600 bg-pink-50 px-3 py-1.5 rounded-full hover:bg-pink-100 transition-colors border border-pink-100">
                    <Instagram size={14} />
                    @dr.kanekii
                  </a>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">© 2025 Veritas Project. All verification logic powered by Google Gemini.</p>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;