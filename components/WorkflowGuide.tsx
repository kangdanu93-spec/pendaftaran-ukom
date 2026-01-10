import React from 'react';
import { Film, MonitorPlay, PlayCircle, FolderOutput, UserCog, Edit3, ClipboardList, Presentation, FolderOpen, FileImage, FileText, Scissors, Save, Lightbulb, Target, Sparkles } from 'lucide-react';

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
        "Video Adegan",
        "Storyboard (.doc)",
        "Naskah Film (.doc)",
        "Asset Gambar (Cover & Poster)"
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

  const jobDesks = [
    {
      role: "Ketua",
      icon: <UserCog className="w-8 h-8 text-emerald-600" />,
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      hover: "hover:border-emerald-400",
      desc: "Bertanggung jawab memimpin kelompok, membagi tugas, mengambil keputusan, dan memastikan target waktu tercapai serta Mendokumentasikan kegiatan berbentuk foto dan catatan laporan setiap proses produksi di ketik dan di print. (1 Orang)"
    },
    {
      role: "Editor Audio & Video",
      icon: <Film className="w-8 h-8 text-green-600" />,
      bg: "bg-green-50",
      border: "border-green-100",
      hover: "hover:border-green-400",
      desc: "Melakukan proses editing visual (offline), transisi, color grading, musik, efek suara,caption dan rendering hasil akhir (export). (2 Orang)"
    },
    {
      role: "Konseptor",
      icon: <Edit3 className="w-8 h-8 text-teal-600" />,
      bg: "bg-teal-50",
      border: "border-teal-100",
      hover: "hover:border-teal-400",
      desc: "Menyusun ide cerita, membuat naskah, dan menggambar storyboard sebagai panduan utama saat produksi di ketik dan di print. (2 Orang)"
    },
    {
      role: "Desain Grafis",
      icon: <FileImage className="w-8 h-8 text-indigo-600" />,
      bg: "bg-indigo-50",
      border: "border-indigo-100",
      hover: "hover:border-indigo-400",
      desc: "Berperan membuat desain cover, poster, dan aset grafis pendukung. (1 atau 2 orang)"
    }
  ];

  const examThemes = [
    {
      category: "ILM Kesehatan",
      title: "Ayo Cuci Tangan!",
      color: "blue",
      items: [
        "Cuci tangan dengan sabun sebelum makan dan setelah beraktivitas.",
        "Lindungi diri dan keluarga dari kuman dan penyakit."
      ],
      tagline: "Cuci tangan, langkah kecil untuk hidup sehat."
    },
    {
      category: "ILM Pendidikan",
      title: "Sekolah Itu Penting",
      color: "amber",
      items: [
        "Pendidikan membuka jalan menuju masa depan yang lebih baik.",
        "Jangan putus sekolah, raih cita-citamu!"
      ],
      tagline: "Belajar hari ini, sukses esok hari."
    },
    {
      category: "ILM Lingkungan",
      title: "Jangan Buang Sampah",
      color: "emerald",
      items: [
        "Sampah yang dibuang sembarangan menyebabkan banjir dan penyakit.",
        "Buang sampah pada tempatnya demi lingkungan bersih."
      ],
      tagline: "Lingkungan bersih, hidup pun bersih."
    },
    {
      category: "ILM Lalu Lintas",
      title: "Utamakan Keselamatan",
      color: "red",
      items: [
        "Gunakan helm dan patuhi rambu lalu lintas.",
        "Keselamatan lebih penting daripada kecepatan."
      ],
      tagline: "Pulang selamat adalah tujuan utama."
    },
    {
      category: "ILM Anti Bullying",
      title: "Stop Bullying!",
      color: "violet",
      items: [
        "Bullying melukai hati dan masa depan.",
        "Ayo saling menghargai dan peduli sesama."
      ],
      tagline: "Berani baik itu hebat."
    },
    {
      category: "ILM Literasi Digital",
      title: "Saring Sebelum Sharing",
      color: "cyan",
      items: [
        "Jangan mudah percaya berita di internet.",
        "Periksa kebenaran informasi sebelum membagikannya."
      ],
      tagline: "Cerdas bermedia sosial."
    }
  ];

  const getColorClass = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-50 border-blue-200 text-blue-900';
      case 'amber': return 'bg-amber-50 border-amber-200 text-amber-900';
      case 'emerald': return 'bg-emerald-50 border-emerald-200 text-emerald-900';
      case 'red': return 'bg-red-50 border-red-200 text-red-900';
      case 'violet': return 'bg-violet-50 border-violet-200 text-violet-900';
      case 'cyan': return 'bg-cyan-50 border-cyan-200 text-cyan-900';
      default: return 'bg-gray-50 border-gray-200 text-gray-900';
    }
  };

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

      {/* SECTION: FOLDER STRUCTURE */}
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
                       UKOM_KELOMPOK_[...]
                    </div>
                    <div className="ml-5 border-l-2 border-gray-300 pl-4 space-y-3">
                       
                       <div className="group">
                          <div className="flex items-center gap-2 text-gray-700 mb-1">
                             <FolderOpen className="w-4 h-4 text-amber-500 fill-amber-500" />
                             VIDEO_ADEGAN
                          </div>
                       </div>

                       <div className="group">
                          <div className="flex items-center gap-2 text-gray-700 mb-1">
                             <FileText className="w-4 h-4 text-blue-500" />
                             STORYBOARD (.DOC)
                          </div>
                       </div>

                       <div className="group">
                          <div className="flex items-center gap-2 text-gray-700 mb-1">
                             <FileText className="w-4 h-4 text-blue-500" />
                             NASKAH_FILM (.DOC)
                          </div>
                       </div>

                       <div className="group">
                          <div className="flex items-center gap-2 text-gray-700 mb-1">
                             <FolderOpen className="w-4 h-4 text-amber-500 fill-amber-500" />
                             ASSET_GAMBAR (UNTUK COVER & POSTER)
                          </div>
                       </div>

                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* SECTION: SOAL & TUGAS (NEW) */}
      <div className="px-4">
        <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
           <div className="flex items-center gap-3 mb-6">
              <Target className="w-8 h-8 text-rose-600" />
              <h2 className="text-3xl font-bold text-gray-900">SOAL / TUGAS</h2>
           </div>

           <div className="bg-gray-900 text-white p-8 rounded-2xl text-center mb-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                   <Film className="w-32 h-32 text-white" />
               </div>
               <h3 className="text-2xl md:text-3xl font-black mb-3 tracking-tight">
                  Judul Tugas : Produksi Film Iklan Layanan Masyarakat
               </h3>
               <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-6 py-2">
                  <p className="text-lg md:text-xl font-bold text-emerald-300">
                    (hasil karya berdurasi 3 menit)
                  </p>
               </div>
           </div>

           <div className="flex items-center gap-2 mb-6">
               <Lightbulb className="w-6 h-6 text-amber-500" />
               <h3 className="text-xl font-bold text-gray-800">Contoh Tema Tugas</h3>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
               {examThemes.map((theme, idx) => (
                   <div key={idx} className={`p-6 rounded-xl border ${getColorClass(theme.color)} hover:shadow-md transition-all`}>
                       <div className="flex justify-between items-start mb-3">
                           <span className="text-xs font-bold uppercase tracking-wider opacity-70 border border-current px-2 py-0.5 rounded-md">
                               {theme.category}
                           </span>
                       </div>
                       <h4 className="text-xl font-bold mb-3">{theme.title}</h4>
                       
                       <div className="space-y-2 mb-4 min-h-[80px]">
                           {theme.items.map((item, i) => (
                               <p key={i} className="text-sm leading-snug flex items-start gap-2">
                                   <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-current opacity-60 shrink-0"></span>
                                   {item}
                               </p>
                           ))}
                       </div>
                       
                       <div className="bg-white/50 rounded-lg p-3 text-sm italic font-medium border border-current border-opacity-20 flex items-start gap-2">
                           <Sparkles className="w-4 h-4 mt-0.5 shrink-0" />
                           "{theme.tagline}"
                       </div>
                   </div>
               ))}
           </div>
        </div>
      </div>

      {/* SECTION: JOB DESK */}
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

      {/* SECTION: TIMELINE */}
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
    </div>
  );
};

export default WorkflowGuide;