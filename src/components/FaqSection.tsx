import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldCheck } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';

interface FaqSectionProps {
  language: Language;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ language }) => {
  const t = translations[language];
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      qBn: 'কোন ধরনের গান সুরনবে আপলোড করা যাবে? কপিরাইট নিয়ম কী?',
      qEn: 'What songs can I upload? What are the copyright policies?',
      aBn:
        'আপনি যেসব গানের মালিকানা ধারণ করেন অথবা যে গানগুলো পাবলিক ডোমেইন (Public Domain বা কপিরাইট মুক্ত)-এর অন্তর্ভুক্ত, সেগুলো আপনি আপলোড করতে পারবেন। আপলোডের সময় একটি বাধ্যতামূলক স্বত্ব নিশ্চিতকরণে সম্মতি প্রদান করতে হয়। ব্যবহারকারীর নিরাপত্তা ও গোপনীয়তা বজায় রাখতে ৩০ দিন পর সার্ভার থেকে অডিও ফাইল স্বয়ংক্রিয়ভাবে স্থায়ীভাবে মুছে ফেলা হয়।',
      aEn:
        'You may upload tracks you own or songs belonging to the public domain. Every upload requires a mandatory copyright ownership acknowledgment. To guarantee user privacy and legal compliance, all uploaded audio files are automatically purged after 30 days.',
    },
    {
      qBn: 'জনপ্রিয় বা মৃত কিংবদন্তি শিল্পীদের ভয়েস কি ক্লোন করা যায়?',
      qEn: 'Can I clone the voices of famous legendary artists?',
      aBn:
        'না, সুরনব নীতিগত ও আইনগত কারণে কোনো জীবন্ত বা মৃত খ্যাতনামা শিল্পীর কণ্ঠস্বর হুবহু ক্লোনিং করা কঠোরভাবে নিষিদ্ধ করে। আমাদের সিস্টেমে মূল কণ্ঠের অডিও ক্লিনিং এবং স্টুডিও গ্রেড ডি-নয়েজিং করা যায়, অথবা আমাদের লাইসেন্সকৃত রয়্যালটি-মুক্ত এআই ভোকাল প্রোফাইল (Male Baritone, Female Velvet ইত্যাদি) ব্যবহার করা যায়।',
      aEn:
        'No. Strict safety safeguards forbid cloning recognizable commercial or celebrity voices. You can clean up the original vintage tape vocal with de-noising & saturation, or choose from our licensed, royalty-free synthetic vocal timbres.',
    },
    {
      qBn: 'গানের মূল সুর ও আবেগ কি সত্যিই অবিকল থাকে?',
      qEn: 'How does SurNob preserve the exact original melody and emotion?',
      aBn:
        'আমাদের সিস্টেমে নিউরাল পিচ-ট্র্যাকিং (Neural Pitch Tracking) এবং বেসিক পিচ (Basic Pitch) মডেল ব্যবহার করে মূল গানের প্রতিটি স্বর এবং কর্ডের মাইক্রোটোনাল বক্ররেখা নিখুঁতভাবে এক্সট্রাক্ট করা হয়। নতুন অ্যারেঞ্জমেন্ট করার সময় সেই মূল স্কেল ও মেলোডি অক্ষুণ্ণ রেখে কেবল আধুনিক বাদ্যযন্ত্র (808, সিন্থ, আধুনিক ড্রাম) যুক্ত করা হয়।',
      aEn:
        'We use neural polyphonic pitch tracking (Basic Pitch & Librosa) to map the microtonal melody contour and harmonic progression into precise MIDI coordinates. Modern drums, 808s, and synths are layered strictly in lockstep with the extracted melody.',
    },
    {
      qBn: 'ডিমাক্স (Demucs) স্টেম সেপারেশন কীভাবে কাজ করে?',
      qEn: 'How does Demucs multi-track stem separation work?',
      aBn:
        'ডিমাক্স হলো স্টেট-অব-দ্য-আর্ট ডিপ লার্নিং আর্কিটেকচার যা একটি মিশ্রিত মনো বা স্টেরিও অডিওকে ৪ থেকে ৬টি আলাদা ট্র্যাকে (ভোকাল, ড্রামস, বেস, হারমোনিয়াম, অ্যাকোস্টিক যন্ত্র) বিভক্ত করে। ব্যবহারকারী আমাদের স্টেম প্লেয়ারের মাধ্যমে প্রতিটি ট্র্যাক আলাদাভাবে মিউট, সোলো বা ভলিউম সামঞ্জস্য করতে পারেন।',
      aEn:
        'Demucs is a state-of-the-art hybrid deep neural network that isolates mono or stereo mixed audio into distinct stem tracks. You can inspect, mute, solo, and balance each stem independently in our real-time Web Audio mixer.',
    },
    {
      qBn: 'কোন কোন ফরম্যাটে গান ডাউনলোড করা যাবে?',
      qEn: 'Which audio formats can I download?',
      aBn:
        'সুরনবে আপনি হাই-কোয়ালিটি 320kbps MP3, স্টুডিও মাস্টার 24-bit Lossless WAV ফাইল এবং আলাদা আলাদা সমস্ত ট্র্যাকের একটি পূর্ণাঙ্গ স্টেম জিপ (ZIP) আর্কাইভ ডাউনলোড করতে পারবেন। প্রতিটি ফাইলে এআই ওয়াটারমার্ক ও মেটাডেটা সুরক্ষিতভাবে সংরক্ষিত থাকে।',
      aEn:
        'You can export high-bitrate 320kbps MP3s, 24-bit Lossless studio WAVs, or a complete multi-track Stems ZIP archive containing isolated vocals, drums, bass, and synth stems.',
    },
  ];

  return (
    <section id="faq" className="py-16 sm:py-24 border-b border-slate-800/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-purple-300 bg-purple-950/60 border border-purple-800/50 rounded-full mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
            <span>{t.faqTitle}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {language === 'bn' ? 'সুরনব সম্পর্কে আপনার জিজ্ঞাসা' : 'Frequently Asked Questions'}
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left text-sm font-bold text-white hover:text-purple-300 transition-colors cursor-pointer"
                >
                  <span className="pr-4">{language === 'bn' ? faq.qBn : faq.qEn}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-purple-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-300/90 leading-relaxed border-t border-slate-800/60">
                    <p>{language === 'bn' ? faq.aBn : faq.aEn}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
