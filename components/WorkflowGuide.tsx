import React from 'react';
import { Clapperboard, Film, MonitorPlay, PlayCircle, FolderOutput, UserCog, Camera, Edit3, Mic2, ClipboardList, Presentation, FolderOpen, FileAudio, FileVideo, FileImage, FileText, LayoutTemplate, Eye, Speaker, Info, Clock, Timer, Scissors, Save, CheckCircle, BookOpen } from 'lucide-react';

const WorkflowGuide: React.FC = () => {
  
  // COLORFUL BUT MODERN THEME DATA
  const workflowSteps = [
    {
      title: "Pra-UKOM",
      subtitle: "Syarat Masuk (H-1)",
      icon: <ClipboardList className="w-6 h-6 text-rose-600" />,
      bgIcon: "bg-rose-100",
      border: "border-rose-200",
      accent: "bg-rose-500",
      items: [
        "Audio Mentah",
        "Video Performance",
        "Video Adegan",
        "Storyboard (.doc)",
        "Asset Grafis"
      ]
    },
    {
      title: "Sesi 1: Opening",
      subtitle: "08.00 - 08.30 (30m)",
      icon: <MonitorPlay className="w-6 h-6 text-blue-600" />,
      bgIcon: "bg-blue-100",
      border: "border-blue-200",
      accent: "bg-blue-500",
      items: [
        "Briefing Ketua",
        "Setup Folder Project",
        "Cek Kelengkapan Alat",
        "Pembagian Jobdesk",
        "Doa Bersama"
      ]
    },
    {
      title: "Sesi 2: Seleksi",
      subtitle: "08.30 - 09.30 (60m)",
      icon: <FolderOpen className="w-6 h-6 text-violet-600" />,
      bgIcon: "bg-violet-100",
      border: "border-violet-200",
      accent: "bg-violet-500",
      items: [
        "Import Footage",
        "Sorting & Rename",
        "Sync Audio/Video",
        "Pilih Take Terbaik",
        "Backup Awal"
      ]
    },
    {
      title: "Sesi 3: Editing",
      subtitle: "09.30 - 11.30 (120m)",
      icon: <Scissors className="w-6 h-6 text-amber-600" />,
      bgIcon: "bg-amber-100",
      border: "border-amber-200",
      accent: "bg-amber-500",
      items: [
        "Offline Cut (Kasar)",
        "Color Grading",
        "Visual Effect / Transisi",
        "Sound Mixing",
        "Subtitle & Credit"
      ]
    },
    {
      title: "Sesi 4: Finalisasi",
      subtitle: "13.00 - 14.00 (60m)",
      icon: <Save className="w-6 h-6 text-emerald-600" />,
      bgIcon: "bg-emerald-100",
      border: "border-emerald-200",
      accent: "bg-emerald-500",
      items: [
        "Preview Kelompok",
        "Revisi Minor",
        "Export Master (MP4)",
        "Desain & Cetak Cover",
        "Upload ke Server"
      ]
    },
    {
      title: "Sesi 5: Laporan",
      subtitle: "14.00 - 14.45 (45m)",
      icon: <FileText className="w-6 h-6 text-cyan-600" />,
      bgIcon: "bg-cyan-100",
      border: "border-cyan-200",
      accent: "bg-cyan-500",
      items: [
        "Resume Jobdesk",
        "Laporan Kendala",
        "Laporan Solusi",
        "Pemberkasan Dokumen",
        "Siap Presentasi"
      ]
    },
    {
      title: "Sesi 6: Sidang",
      subtitle: "14.45 - Selesai (30m)",
      icon: <Presentation className="w-6 h-6 text-indigo-600" />,
      bgIcon: "bg-indigo-100",
      border: "border-indigo-200",
      accent: "bg-indigo-500",
      items: [
        "Opening Salam",
        "Putar Video Hasil",
        "Presentasi Individu",
        "Tanya Jawab",
        "Penutupan"
      ]
    }
  ];

  const openingSessionTasks = [
    { role: "Ketua", task: "Brief singkat, Membagi sesi kerja" },
    { role: "Editor", task: "Setup project editing" },
    { role: "Audio", task: "Setup project audio" },
    { role: "Konseptor", task: "Cek kesesuaian storytelling" },
    { role: "Kameraman", task: "Menyeleksi footage terbaik" },
    { role: "Aktor", task: "Menentukan ekspresi adegan" },
    { role: "Dokumentator", task: "Foto & catat proses (Bukti UKOM)" }
  ];

  const session2Tasks = [
    { role: "Ketua", task: "Mengawasi alur" },
    { role: "Editor", task: "Import semua file" },
    { role: "Audio", task: "Set audio ke timeline" },
    { role: "Kameraman", task: "Pilih shot terbaik" },
    { role: "Konseptor", task: "Cocokkan storyboard" },
    { role: "Aktor", task: "Pilih adegan ekspresif" },
    { role: "Dokumentator", task: "Foto & catat" }
  ];

  const session3Tasks = [
    { role: "Editor", task: "Potong, transisi, sinkron" },
    { role: "Audio", task: "Cek volume & clarity" },
    { role: "Konseptor", task: "Jaga alur cerita" },
    { role: "Kameraman", task: "Saran angle & cut" },
    { role: "Aktor", task: "Koreksi ekspresi" },
    { role: "Ketua", task: "Kontrol waktu" },
    { role: "Dokumentator", task: "Dokumentasi proses" }
  ];

  const session4Tasks = [
    { role: "Editor", task: "Tambah judul & credit" },
    { role: "Ketua", task: "Cek kesesuaian UKOM" },
    { role: "Editor & Audio", task: "Final check (Preview)" },
    { role: "Anggota Lain", task: "Checklist penilaian" },
    { role: "Editor", task: "Export video final" }
  ];

  const session5Tasks = [
    { role: "Ketua", task: "Ringkasan proyek" },
    { role: "Konseptor", task: "Storytelling" },
    { role: "Audio", task: "Proses audio" },
    { role: "Editor", task: "Proses editing" },
    { role: "Kameraman", task: "Teknik pengambilan" },
    { role: "Aktor", task: "Ekspresi & adegan" },
    { role: "Dokumentator", task: "Bukti kerja" }
  ];

  const jobDesks = [
    {
      role: "Ketua",
      icon: <UserCog className="w-8 h-8 text-emerald-600" />,
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      hover: "hover:border-emerald-400",
      desc: "Bertanggung jawab memimpin kelompok, membagi tugas, mengambil keputusan, dan memastikan target waktu tercapai."
    },
    {
      role: "Editor Video",
      icon: <Film className="w-8 h-8 text-green-600" />,
      bg: "bg-green-50",
      border: "border-green-100",
      hover: "hover:border-green-400",
      desc: "Melakukan proses editing visual (offline/online), transisi, color grading, dan rendering hasil akhir (export)."
    },
    {
      role: "Editor Audio",
      icon: <Mic2 className="w-8 h-8 text-sky-600" />,
      bg: "bg-sky-50",
      border: "border-sky-100",
      hover: "hover:border-sky-400",
      desc: "Melakukan processing audio, cleaning noise, mixing, serta menambahkan BGM dan SFX agar suara jernih."
    },
    {
      role: "Konseptor (Pembuat Storyboard)",
      icon: <Edit3 className="w-8 h-8 text-teal-600" />,
      bg: "bg-teal-50",
      border: "border-teal-100",
      hover: "hover:border-teal-400",
      desc: "Menyusun ide cerita, membuat naskah, dan menggambar storyboard sebagai panduan utama saat produksi."
    },
    {
      role: "Kameraman",
      icon: <Camera className="w-8 h-8 text-cyan-600" />,
      bg: "bg-cyan-50",
      border: "border-cyan-100",
      hover: "hover:border-cyan-400",
      desc: "Bertugas mengambil gambar (syuting), mengatur komposisi (angle), framing, dan pencahayaan."
    },
    {
      role: "Aktor/Desain Grafis",
      icon: <Clapperboard className="w-8 h-8 text-indigo-600" />,
      bg: "bg-indigo-50",
      border: "border-indigo-100",
      hover: "hover:border-indigo-400",
      desc: "Berperan sebagai talent dalam video, sekaligus membuat desain cover, poster, dan aset grafis pendukung."
    },
    {
      role: "Dokumentor",
      icon: <FileImage className="w-8 h-8 text-rose-600" />,
      bg: "bg-rose-50",
      border: "border-rose-100",
      hover: "hover:border-rose-400",
      desc: "Mendokumentasikan kegiatan di balik layar (BTS) berupa foto/video dan mencatat laporan kendala produksi."
    }
  ];

  return (
    <div className="max-w-[90rem] mx-auto space-y-12 pb-16 animate-fade-in-up">
      
      {/* Hero Header - GREEN THEME */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-800 text-white rounded-3xl p-8 md:p-12 text-center relative overflow-hidden shadow-2xl mx-4 lg:mx-0">
         <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
               <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
            </svg>
         </div>
         <div className="relative z-10">
            <div className="flex justify-center mb-4">
                <div className="bg-white/10 p-3 rounded-full backdrop-blur-md">
                    <FolderOutput className="w-10 h-10 text-emerald-400" />
                </div>
            </div>
            <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">Alur Kerja UKOM 1 Hari</h1>
            <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
                Panduan teknis pelaksanaan Uji Kompetensi Keahlian (UKOM) dengan sistem One Day Service.
            </p>
         </div>
      </div>

      {/* SECTION: FOLDER STRUCTURE - UPDATED TEXT */}
      <div className="px-4">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 shadow-sm">
           <div className="flex items-start gap-4 flex-col md:flex-row">
              <div className="bg-amber-100 p-3 rounded-xl shrink-0">
                 <FolderOpen className="w-8 h-8 text-amber-700" />
              </div>
              <div className="w-full">
                 <h2 className="text-2xl font-bold text-gray-800 mb-2">Syarat Wajib Pra-UKOM</h2>
                 <p className="text-gray-700 mb-6">
                    Sebelum Hari H Ujian, seluruh kelompok <strong>WAJIB</strong> menyiapkan file bahan mentah yang sudah disusun rapi. 
                    Ini bukan bagian ujian, tapi <strong>syarat masuk</strong> ruang ujian.
                 </p>

                 <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-inner font-mono text-sm md:text-base">
                    <div className="flex items-center gap-2 font-bold text-gray-800 mb-2">
                       <FolderOpen className="w-5 h-5 text-amber-500 fill-amber-500" />
                       UKOM_KELOMPOK_[X]
                    </div>
                    <div className="ml-5 border-l-2 border-gray-300 pl-4 space-y-3">
                       
                       <div className="group">
                          <div className="flex items-center gap-2 text-gray-700 mb-1">
                             <FolderOpen className="w-4 h-4 text-amber-500 fill-amber-500" />
                             AUDIO
                          </div>
                       </div>
                       
                       <div className="group">
                          <div className="flex items-center gap-2 text-gray-700 mb-1">
                             <FolderOpen className="w-4 h-4 text-amber-500 fill-amber-500" />
                             VIDEO_PERFORMANCE
                          </div>
                       </div>

                       <div className="group">
                          <div className="flex items-center gap-2 text-gray-700 mb-1">
                             <FolderOpen className="w-4 h-4 text-amber-500 fill-amber-500" />
                             VIDEO_ADEGAN
                          </div>
                       </div>

                       <div className="group">
                          <div className="flex items-center gap-2 text-gray-700 mb-1">
                             <FolderOpen className="w-4 h-4 text-amber-500 fill-amber-500" />
                             STORYBOARD
                          </div>
                       </div>

                       <div className="group">
                          <div className="flex items-center gap-2 text-gray-700 mb-1">
                             <FolderOpen className="w-4 h-4 text-amber-500 fill-amber-500" />
                             ASSET GAMBAR (UNTUK COVER ATAU THUMBNAIL)
                          </div>
                       </div>

                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* SECTION 2: JOB DESK - MOVED HERE AS REQUESTED */}
      <div className="px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-2">
            <UserCog className="w-7 h-7 text-emerald-600" /> Pembagian Tugas (Jobdesk)
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobDesks.map((job, idx) => (
                <div key={idx} className={`bg-white rounded-xl p-6 border ${job.border} transition-all duration-300 ${job.hover} hover:shadow-lg group`}>
                    <div className="flex items-center gap-4 mb-4">
                        <div className={`${job.bg} p-3 rounded-lg group-hover:scale-105 transition-transform`}>
                            {job.icon}
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 leading-tight">{job.role}</h3>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        {job.desc}
                    </p>
                </div>
            ))}
        </div>
      </div>

      {/* SECTION 1: TIMELINE - MODERN FRESH */}
      <div className="px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-2">
            <PlayCircle className="w-7 h-7 text-emerald-600" /> Timeline Hari H
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {workflowSteps.map((step, idx) => (
                <div key={idx} className="relative flex flex-col group">
                    <div className={`bg-white rounded-xl shadow-sm border ${step.border} hover:shadow-lg transition-all duration-300 h-full flex flex-col overflow-hidden`}>
                         {/* Colored Top Bar */}
                         <div className={`h-1.5 w-full ${step.accent}`}></div>
                         
                         <div className="p-5 flex flex-col h-full relative">
                            <span className="absolute top-3 right-4 text-5xl font-black text-gray-100 select-none z-0">
                                {idx}
                            </span>

                            <div className="relative z-10">
                                <div className={`w-10 h-10 ${step.bgIcon} rounded-lg flex items-center justify-center mb-3`}>
                                    {step.icon}
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 leading-tight">{step.title}</h3>
                                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-4">{step.subtitle}</p>
                                
                                <ul className="space-y-2">
                                    {step.items.map((item, i) => (
                                        <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                                            <div className="w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0 bg-gray-300"></div>
                                            <span className="leading-snug">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                         </div>
                    </div>
                </div>
            ))}
          </div>

          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
            <p className="text-yellow-800 font-medium text-sm">
                Note: Informasi di atas menyesuaikan dengan situasi dan kondisi di lapangan.
            </p>
          </div>
      </div>

      {/* SECTION 1.5: ALL SESSIONS (1-6) - DISTINCTIVE COLORS */}
      <div className="px-4 space-y-6">
        
        {/* SESI 1 - BLUE THEME */}
        <div className="bg-white border-l-4 border-blue-500 rounded-r-xl shadow-sm p-6 md:p-8 relative overflow-hidden group hover:shadow-md transition-all">
            <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-gray-100 pb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider flex items-center gap-1"><Timer className="w-3 h-3" /> ±5–6 Jam</span>
                            <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider flex items-center gap-1"><Clock className="w-3 h-3" /> Sesi 1 (30 Menit)</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3 mt-2">
                            <MonitorPlay className="w-7 h-7 text-blue-600" /> 
                            Opening & Pembagian Tugas
                        </h2>
                        <p className="text-gray-500 mt-1">Tujuan: Memastikan semua anggota tim langsung bekerja secara paralel.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {openingSessionTasks.map((item, idx) => (
                        <div key={idx} className="bg-blue-50/50 border border-blue-100 rounded-lg p-3 hover:bg-blue-100/50 transition-colors">
                            <h3 className="font-bold text-gray-800 text-sm mb-1">{item.role}</h3>
                            <p className="text-xs text-gray-500 leading-snug">{item.task}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* SESI 2 - VIOLET THEME */}
        <div className="bg-white border-l-4 border-violet-500 rounded-r-xl shadow-sm p-6 md:p-8 relative overflow-hidden group hover:shadow-md transition-all">
            <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-gray-100 pb-6">
                    <div>
                         <div className="flex items-center gap-2 mb-1">
                            <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider flex items-center gap-1"><Clock className="w-3 h-3" /> Sesi 2 (60 Menit)</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3 mt-2">
                            <FolderOpen className="w-7 h-7 text-violet-600" /> 
                            Seleksi & Sorting Bahan
                        </h2>
                        <p className="text-gray-500 mt-1">Tujuan: Semua anggota pegang peran aktif dalam manajemen aset.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                     {session2Tasks.map((item, idx) => (
                        <div key={idx} className="bg-violet-50/50 border border-violet-100 rounded-lg p-3 hover:bg-violet-100/50 transition-colors">
                            <h3 className="font-bold text-gray-800 text-sm mb-1">{item.role}</h3>
                            <p className="text-xs text-gray-500 leading-snug">{item.task}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* SESI 3 - AMBER THEME */}
        <div className="bg-white border-l-4 border-amber-500 rounded-r-xl shadow-sm p-6 md:p-8 relative overflow-hidden group hover:shadow-md transition-all">
            <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-gray-100 pb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider flex items-center gap-1"><Clock className="w-3 h-3" /> Sesi 3 (120 Menit)</span>
                            <span className="bg-rose-100 text-rose-700 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider flex items-center gap-1 border border-rose-200">🎯 Paling Krusial</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3 mt-2">
                            <Scissors className="w-7 h-7 text-amber-600" /> 
                            Editing Inti
                        </h2>
                        <p className="text-gray-500 mt-1">📌 Tidak ada yang diam → semua review aktif.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {session3Tasks.map((item, idx) => (
                        <div key={idx} className="bg-amber-50/50 border border-amber-100 rounded-lg p-3 hover:bg-amber-100/50 transition-colors">
                            <h3 className="font-bold text-gray-800 text-sm mb-1">{item.role}</h3>
                            <p className="text-xs text-gray-500 leading-snug">{item.task}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* SESI 4 - EMERALD THEME */}
        <div className="bg-white border-l-4 border-emerald-500 rounded-r-xl shadow-sm p-6 md:p-8 relative overflow-hidden group hover:shadow-md transition-all">
            <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-gray-100 pb-6">
                    <div>
                         <div className="flex items-center gap-2 mb-1">
                            <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider flex items-center gap-1"><Clock className="w-3 h-3" /> Sesi 4 (60 Menit)</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3 mt-2">
                            <Save className="w-7 h-7 text-emerald-600" /> 
                            Finalisasi & Export
                        </h2>
                        <p className="text-gray-500 mt-1">Output Akhir: 🎬 Video Final UKOM</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {session4Tasks.map((item, idx) => (
                        <div key={idx} className="bg-emerald-50/50 border border-emerald-100 rounded-lg p-3 hover:bg-emerald-100/50 transition-colors">
                            <h3 className="font-bold text-gray-800 text-sm mb-1">{item.role}</h3>
                            <p className="text-xs text-gray-500 leading-snug">{item.task}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* SESI 5 - CYAN THEME */}
        <div className="bg-white border-l-4 border-cyan-500 rounded-r-xl shadow-sm p-6 md:p-8 relative overflow-hidden group hover:shadow-md transition-all">
            <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-gray-100 pb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider flex items-center gap-1"><Clock className="w-3 h-3" /> Sesi 5 (45 Menit)</span>
                            <span className="bg-cyan-100 text-cyan-700 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider flex items-center gap-1 border border-cyan-200">Wajib Kontribusi</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3 mt-2">
                            <FileText className="w-7 h-7 text-cyan-600" /> 
                            Laporan & Persiapan Presentasi
                        </h2>
                        <p className="text-gray-500 mt-1">Setiap anggota WAJIB membuat laporan individu sesuai jobdesk.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {session5Tasks.map((item, idx) => (
                        <div key={idx} className="bg-cyan-50/50 border border-cyan-100 rounded-lg p-3 hover:bg-cyan-100/50 transition-colors">
                            <h3 className="font-bold text-gray-800 text-sm mb-1">{item.role}</h3>
                            <p className="text-xs text-gray-500 leading-snug">{item.task}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* SESI 6 - EMERALD GREEN THEME */}
        <div className="bg-emerald-900 rounded-xl shadow-lg p-6 md:p-8 relative overflow-hidden text-white">
            <div className="absolute top-0 right-0 p-4 opacity-5">
                 <Presentation className="w-64 h-64" />
            </div>
            
            <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-emerald-700 pb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="bg-emerald-800 text-emerald-200 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider flex items-center gap-1"><Clock className="w-3 h-3" /> Sesi 6 (30 Menit)</span>
                        </div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3 mt-2">
                            <Presentation className="w-7 h-7 text-yellow-300" /> 
                            Presentasi UKOM
                        </h2>
                        <p className="text-emerald-200 mt-1">Semua anggota bicara (bergiliran).</p>
                    </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-6 relative">
                     <h3 className="text-yellow-300 font-bold mb-4 flex items-center gap-2 text-lg">
                        <Mic2 className="w-5 h-5" /> Template Jawaban (Wajib Hafal):
                     </h3>
                     
                     <div className="bg-black/40 p-6 rounded-xl font-mono text-base md:text-lg leading-relaxed text-center border border-white/10 text-emerald-300">
                        “Saya bertugas sebagai <span className="text-white border-b border-dashed border-white/40 mx-1">JOBDESK</span>, pada hari H saya mengerjakan <span className="text-white border-b border-dashed border-white/40 mx-1">TUGAS SAYA</span>, kendala <span className="text-white border-b border-dashed border-white/40 mx-1">MASALAH</span>, solusinya <span className="text-white border-b border-dashed border-white/40 mx-1">SOLUSI SAYA</span>.”
                     </div>
                </div>
            </div>
        </div>

     </div>

    </div>
  );
};

export default WorkflowGuide;