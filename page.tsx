'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Form States
  const [formData, setFormData] = useState({
    relationship: 'Friend',
    name: '',
    sender: '',
    age: '',
    dob: '',
    photos: [] as string[],
    songType: 'file',
    songUrl: '',
    theme: 'neon',
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).map((file) => URL.createObjectURL(file));
      setFormData((prev) => ({ ...prev, photos: [...prev.photos, ...filesArray].slice(0, 10) }));
    }
  };

  const handlePayment = () => {
    // Yahan 199 ka payment integration aayega
    alert('Redirecting to 199 INR Payment Gateway...');
    const randomId = Math.random().toString(36).substring(7);
    router.push(`/wish/${randomId}?name=${encodeURIComponent(formData.name)}&sender=${encodeURIComponent(formData.sender)}&theme=${formData.theme}`);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 md:p-8">
      <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative">
        {/* Progress Bar */}
        <div className="flex justify-between mb-6 text-xs text-slate-400 font-semibold uppercase tracking-wider">
          <span className={step >= 1 ? 'text-pink-500' : ''}>1. Details</span>
          <span className={step >= 2 ? 'text-pink-500' : ''}>2. Media</span>
          <span className={step >= 3 ? 'text-pink-500' : ''}>3. Theme</span>
          <span className={step >= 4 ? 'text-pink-500' : ''}>4. Preview & Pay</span>
        </div>

        {/* STEP 1: Basic Info & Relationship */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-black bg-gradient-to-r from-pink-400 to-yellow-400 bg-clip-text text-transparent">
              Birthday Details
            </h2>
            
            <div>
              <label className="block text-sm text-slate-300 mb-1">Relationship</label>
              <select
                value={formData.relationship}
                onChange={(e) => handleChange('relationship', e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-pink-500"
              >
                <option value="Friend">Friend</option>
                <option value="Best Friend">Best Friend</option>
                <option value="Partner">Partner / Girlfriend / Boyfriend</option>
                <option value="Brother">Brother</option>
                <option value="Sister">Sister</option>
                <option value="Family">Family Member</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-1">Jiska Birthday Hai Uska Naam</label>
              <input
                type="text"
                placeholder="e.g. Rahul"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-1">Bhejne Wale Ka Naam (Aapka Naam)</label>
              <input
                type="text"
                placeholder="e.g. Amit"
                value={formData.sender}
                onChange={(e) => handleChange('sender', e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-300 mb-1">Age</label>
                <input
                  type="number"
                  placeholder="e.g. 22"
                  value={formData.age}
                  onChange={(e) => handleChange('age', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => handleChange('dob', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full mt-4 py-3 bg-gradient-to-r from-pink-500 to-yellow-500 font-bold rounded-xl text-black"
            >
              Next: Add Photos & Song ➔
            </button>
          </div>
        )}

        {/* STEP 2: Photos (1-10) & Song */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-black bg-gradient-to-r from-pink-400 to-yellow-400 bg-clip-text text-transparent">
              Photos & Music
            </h2>

            <div>
              <label className="block text-sm text-slate-300 mb-1">Upload Photos (Max 10)</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-sm"
              />
              <p className="text-xs text-slate-400 mt-1">Selected: {formData.photos.length} / 10 photos</p>
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-1">Background Song</label>
              <div className="flex gap-4 mb-2">
                <label className="text-sm flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="songType"
                    checked={formData.songType === 'file'}
                    onChange={() => handleChange('songType', 'file')}
                  /> Upload File
                </label>
                <label className="text-sm flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="songType"
                    checked={formData.songType === 'url'}
                    onChange={() => handleChange('songType', 'url')}
                  /> Song URL (YouTube/Audio)
                </label>
              </div>

              {formData.songType === 'file' ? (
                <input type="file" accept="audio/*" className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-300" />
              ) : (
                <input
                  type="url"
                  placeholder="Paste audio/YouTube URL"
                  value={formData.songUrl}
                  onChange={(e) => handleChange('songUrl', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm"
                />
              )}
            </div>

            <div className="flex gap-4 mt-6">
              <button onClick={() => setStep(1)} className="w-1/2 py-3 bg-slate-800 font-bold rounded-xl text-slate-300">
                Back
              </button>
              <button onClick={() => setStep(3)} className="w-1/2 py-3 bg-gradient-to-r from-pink-500 to-yellow-500 font-bold rounded-xl text-black">
                Next: Theme ➔
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Theme Selection */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-black bg-gradient-to-r from-pink-400 to-yellow-400 bg-clip-text text-transparent">
              Select Theme
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div
                onClick={() => handleChange('theme', 'neon')}
                className={`p-4 rounded-2xl border cursor-pointer transition ${formData.theme === 'neon' ? 'border-pink-500 bg-pink-500/10' : 'border-slate-800 bg-slate-800/50'}`}
              >
                <h3 className="font-bold text-pink-400">Neon Party</h3>
                <p className="text-xs text-slate-400">Vibrant dark glow effects</p>
              </div>

              <div
                onClick={() => handleChange('theme', 'royal')}
                className={`p-4 rounded-2xl border cursor-pointer transition ${formData.theme === 'royal' ? 'border-yellow-500 bg-yellow-500/10' : 'border-slate-800 bg-slate-800/50'}`}
              >
                <h3 className="font-bold text-yellow-400">Royal Gold</h3>
                <p className="text-xs text-slate-400">Elegant gold & black</p>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button onClick={() => setStep(2)} className="w-1/2 py-3 bg-slate-800 font-bold rounded-xl text-slate-300">
                Back
              </button>
              <button onClick={() => setStep(4)} className="w-1/2 py-3 bg-gradient-to-r from-pink-500 to-yellow-500 font-bold rounded-xl text-black">
                Preview ➔
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Preview & Payment (199 INR) */}
        {step === 4 && (
          <div className="space-y-4 text-center">
            <h2 className="text-2xl font-black bg-gradient-to-r from-pink-400 to-yellow-400 bg-clip-text text-transparent">
              Preview & Finalize
            </h2>

            <div className="bg-slate-800/60 p-4 rounded-2xl text-left space-y-2 text-sm text-slate-300 border border-slate-700">
              <p>🎂 <b>For:</b> {formData.name || 'Not provided'}</p>
              <p>🎁 <b>From:</b> {formData.sender || 'Anonymous'}</p>
              <p>❤️ <b>Relationship:</b> {formData.relationship}</p>
              <p>🎨 <b>Theme:</b> {formData.theme}</p>
              <p>🖼️ <b>Photos:</b> {formData.photos.length} uploaded</p>
            </div>

            <div className="bg-pink-500/10 border border-pink-500/30 p-4 rounded-2xl">
              <p className="text-sm text-pink-300">Unlock lifetime active link & all premium animations</p>
              <p className="text-3xl font-black text-white mt-1">₹199 Only</p>
            </div>

            <div className="flex gap-4 mt-6">
              <button onClick={() => setStep(3)} className="w-1/2 py-3 bg-slate-800 font-bold rounded-xl text-slate-300">
                Back
              </button>
              <button
                onClick={handlePayment}
                className="w-1/2 py-3 bg-gradient-to-r from-green-400 to-emerald-500 font-bold rounded-xl text-black shadow-lg shadow-emerald-500/20"
              >
                Pay ₹199 & Publish 🚀
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}