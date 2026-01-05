import React from 'react';
import { Cloud, Github, Globe, Code, Server, Database, ArrowRight, Settings } from 'lucide-react';

const HostingGuide: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10 animate-fade-in-up">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-emerald-900 to-teal-800 rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 flex items-center gap-3">
            <Cloud className="w-10 h-10 text-emerald-400" /> 
            Konfigurasi Database
          </h2>
          <p className="text-emerald-100 text-lg max-w-2xl font-light leading-relaxed">
            Langkah-langkah menghubungkan aplikasi ke Google Firebase agar data bisa tersimpan secara online dan real-time.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Warning Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 flex flex-col md:flex-row gap-5 items-start">
          <div className="bg-blue-100 p-3 rounded-full shrink-0">
            <Settings className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Wajib Dilakukan Guru</h3>
            <p className="text-gray-700 text-sm leading-relaxed mb-3">
              Aplikasi ini sudah diprogram untuk menggunakan Firebase. Namun, Anda harus memasukkan "Kunci Rumah" (API Key) Anda sendiri agar data tersimpan di akun Google Anda.
            </p>
            <p className="text-gray-700 text-sm mt-3 font-medium">
              Buka file <code>services/firebaseConfig.ts</code> di kode editor Anda untuk memasukkan kode yang Anda dapatkan di bawah ini.
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-bold text-xl text-gray-800">Langkah Membuat Database (Gratis)</h3>
          </div>
          
          <div className="divide-y divide-gray-100">
            {/* Step 1 */}
            <div className="p-6 md:p-8 flex gap-6 hover:bg-gray-50 transition-colors group">
              <div className="hidden md:flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-lg border-2 border-emerald-50 group-hover:scale-110 transition-transform">1</div>
                <div className="h-full w-0.5 bg-gray-100 mt-2"></div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Database className="w-5 h-5 text-gray-400" />
                  <h4 className="text-lg font-bold text-gray-800">Buat Project Firebase</h4>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Kunjungi <a href="https://console.firebase.google.com" target="_blank" className="text-blue-600 hover:underline font-bold">console.firebase.google.com</a> dan login dengan Gmail sekolah/pribadi.
                </p>
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 ml-2">
                  <li>Klik <strong>Create a project</strong>.</li>
                  <li>Beri nama (misal: <code>ukom-2026</code>).</li>
                  <li>Matikan Google Analytics (tidak perlu).</li>
                  <li>Klik <strong>Create Project</strong>.</li>
                </ol>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 md:p-8 flex gap-6 hover:bg-gray-50 transition-colors group">
              <div className="hidden md:flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-lg border-2 border-emerald-50 group-hover:scale-110 transition-transform">2</div>
                <div className="h-full w-0.5 bg-gray-100 mt-2"></div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Server className="w-5 h-5 text-gray-400" />
                  <h4 className="text-lg font-bold text-gray-800">Setup Realtime Database</h4>
                </div>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 ml-2">
                  <li>Di menu kiri, pilih <strong>Build</strong> &gt; <strong>Realtime Database</strong>.</li>
                  <li>Klik <strong>Create Database</strong>.</li>
                  <li>Pilih lokasi (Singapore/US oke saja).</li>
                  <li><strong>PENTING:</strong> Pada langkah Security Rules, pilih <strong>Start in Test Mode</strong> (agar siswa bisa input tanpa login email).</li>
                  <li>Klik <strong>Enable</strong>.</li>
                </ol>
              </div>
            </div>

             {/* Step 3 */}
             <div className="p-6 md:p-8 flex gap-6 hover:bg-gray-50 transition-colors group">
              <div className="hidden md:flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-lg border-2 border-emerald-50 group-hover:scale-110 transition-transform">3</div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Code className="w-5 h-5 text-gray-400" />
                  <h4 className="text-lg font-bold text-gray-800">Salin Kodingan (Config)</h4>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Dapatkan kode akses agar aplikasi ini bisa terhubung.
                </p>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 ml-2">
                  <li>Klik ikon <strong>Gear (Settings)</strong> di kiri atas &gt; Project Settings.</li>
                  <li>Scroll ke bawah ke bagian "Your apps".</li>
                  <li>Klik ikon <strong>Web (&lt;/&gt;)</strong>. Beri nama aplikasi "Web Pendaftaran".</li>
                  <li>Anda akan melihat kode <code>const firebaseConfig = ...</code>.</li>
                  <li>Salin <code>apiKey</code>, <code>projectId</code>, dll ke dalam file <code>services/firebaseConfig.ts</code> di aplikasi ini.</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostingGuide;