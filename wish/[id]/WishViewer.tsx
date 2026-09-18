"use client";

import { useEffect, useRef, useState } from "react";

type Theme = {
  id: string;
  name: string;
  emoji: string;
  gradient: string;
  glow: string;
};

const themes: Theme[] = [
  {
    id: "blush",
    name: "Blush Love",
    emoji: "🌸",
    gradient: "linear-gradient(135deg, #ff6f91 0%, #ff9a9e 48%, #c084fc 100%)",
    glow: "#ff6f91",
  },
  {
    id: "cotton",
    name: "Cotton Candy",
    emoji: "🍭",
    gradient: "linear-gradient(135deg, #38bdf8 0%, #a78bfa 48%, #f472b6 100%)",
    glow: "#a78bfa",
  },
  {
    id: "peach",
    name: "Peachy Glow",
    emoji: "🍑",
    gradient: "linear-gradient(135deg, #fb7185 0%, #fb923c 48%, #facc15 100%)",
    glow: "#fb7185",
  },
  {
    id: "lavender",
    name: "Lavender Dream",
    emoji: "🪻",
    gradient: "linear-gradient(135deg, #8b5cf6 0%, #c084fc 48%, #f472b6 100%)",
    glow: "#a855f7",
  },
  {
    id: "cherry",
    name: "Cherry Kiss",
    emoji: "🍒",
    gradient: "linear-gradient(135deg, #e11d48 0%, #fb7185 48%, #f9a8d4 100%)",
    glow: "#fb7185",
  },
  {
    id: "sky",
    name: "Angel Sky",
    emoji: "☁️",
    gradient: "linear-gradient(135deg, #0ea5e9 0%, #60a5fa 45%, #c084fc 100%)",
    glow: "#38bdf8",
  },
];

function getRelationshipLine(relationship: string) {
  switch (relationship) {
    case "Girlfriend":
    case "Boyfriend":
      return "Zindagi ke har safar mein, bas tera haath mere haath mein ho. ❤️";
    case "Wife":
    case "Husband":
      return "Tumse hi shuru hoti hai meri har subah, aur tumhi par khatam meri har shaam. ❤️";
    case "Best Friend":
      return "Dosti toh sabhi karte hain, par kambakht tere jaisa pagal koi nahi. 😂❤️";
    case "Brother":
    case "Sister":
      return "Ladayi chahe jitni bhi ho, par dil se humesha ek doosre ke sath hain. ✨";
    case "Mom":
      return "Maa, aapki ek muskaan se meri poori duniya roshan ho jati hai. ❤️";
    case "Dad":
      return "Papa, meri har khushi ke peeche aapka hi saya hai. 👑";
    default:
      return "Kuch log zindagi mein aakar use hamesha ke liye khaas bana dete hain. ✨";
  }
}

function getAgeLine(relationship: string, age: string) {
  return `${age} saal ki umar aur dil abhi bhi bilkul bachhon jaisa masoom. ✨`;
}

function getCinematicLine(relationship: string, page: number, name: string) {
  const lines: Record<string, string[]> = {
    Girlfriend: [
      `Suno ${name}, aaj ka din sirf tumhara nahi, us har lamhe ka hai jab tum meri zindagi mein aayi thi. ❤️`,
      "Kuch yaadein dil ke itne paas hoti hain ki waqt chahe jitna bhi badal jaye, unki khushboo kabhi kam nahi hoti. ✨",
      "Socha tha kuch khas likhu tumhare liye, par samajh nahi aaya... ki tumhein shabdun mein bayaan karun ya apni saanson mein. 💗",
      "Hamesha aise hi muskurati rehna, kyunki tumhari yeh hasi hi meri sabse badi taakat hai. Happy Birthday Meri Jaan! 🎂",
    ],
    Boyfriend: [
      `Tumse milna, tumse judna aur yeh safar tay karna — meri zindagi ka sabse khoobsurat faisla tha, ${name}. ❤️`,
      "Zindagi ke har mod par chahe kitne bhi toofan aayein, tumhara yeh sath sab kuch aasaan kar deta hai. ✨",
      "Hazaaron baatein hain jo kehni hain, par bas itna jaan lo ki tum mere liye kya maane rakhte ho. 🥂",
      "Khush raho, abaad raho aur hamesha mere paas raho. Happy Birthday! 🎂",
    ],
    Wife: [
      `Jab se tum aayi ho is ghar mein, yeh sirf ek makaan nahi, ek khoobsurat parivaar ban gaya hai, ${name}. ❤️`,
      "Har tasveer mein jo roop hai, wo is ghar ki jaan hai. Tumse hi mera har din tyohar hai. ✨",
      "Zindagi ke is safar mein tumhara humsafar hona mere liye kisi khuda ke vardaan se kam nahi. 💗",
      "Salgirah mubarak ho meri ardhangini, tumhari khushi hi meri sabse badi jeet hai. ❤️",
    ],
    Husband: [
      `Meri har mushkil ko aasaan karne wale, mere sabse bade sahara ho tum, ${name}. ❤️`,
      "Pata hi nahi chala waqt kaise nikal gaya, par har ek pal tumhare sath sone ki tarah keemti raha. ✨",
      "Khuda se bas yahi dua hai ki agle saare janam bhi humein yhi roop mile. 💗",
      "Aapka yeh din aur aane wala har saal behad shandar ho. Happy Birthday! 🎂",
    ],
    "Best Friend": [
      `Yaar ${name}, sach kahun toh tere bina yeh zindagi bilkul boring hoti. 😂❤️`,
      "Khatarnak ideas se lekar bewajah ki hassi tak — hamari dosti ki kahani hi alag hai. ✨",
      "Bhaad mein jaye duniya, jab tak tu sath hai, har problem ki aisi ki taisi! 🥂",
      "Salamat rahe hamari yaari jab tak yeh duniya rahe. Happy Birthday dost! 🎂",
    ],
    Brother: [
      `Bachpan ki wo ladaiyan aur aaj ki yeh samajhdari — waqt badal gaya par tu wahi nikamma hai, ${name}! 😂❤️`,
      "Har mushkil waqt mein sabse pehle khada hone wala shakhs hai mera bhai. ✨",
      "Tujhse zyada pareshan kisi ne nahi kiya, par tujhse zyada pyaar bhi kisi se nahi kiya. 💗",
      "Hamesha aage badho aur naam roshan karo. Happy Birthday Bhai! 🎂",
    ],
    Sister: [
      `Ghar ki raunak aur sabse badi drama queen, ${name} ko janamdin ki dher saari shubhkaamnayein! 😂👑`,
      "Teri har zid ke peeche jo pyaar hota hai, wo koi nahi samajh sakta. ✨",
      "Tu chahe kitni bhi badi ho jaye, mere liye hamesha meri choti gudiya hi rahegi. 💗",
      "Duniya ki har khushi tere kadmon mein ho. Happy Birthday! 🎂",
    ],
    Mom: [
      `Maa, aapki ungli pakad kar chalna seekha tha, aaj aap hi ki wajah se main yahan hoon. ❤️`,
      "Aapke aanchal ki chhaon mein jo sukoon hai, wo is poori duniya mein kahin nahi. ✨",
      "Aapki duaon ka hi asar hai ki aaj har mushkil aasan lagti hai. 💗",
      "Sada swasth raho aur humesha hamare sath raho, Maa. Happy Birthday! ❤️",
    ],
    Dad: [
      `Papa, aapne khamoshi se humari har khwahish ko poora kiya hai. ❤️`,
      "Aapki ungli pakad kar hi maine is duniya ko samajhna seekha hai. ✨",
      "Aap hamari dhal ho, hamara guroor ho. 👑",
      "Salute hai aapke us tyag ko jo aapne humare liye kiya. Happy Birthday Dad! ❤️",
    ],
    Other: [
      `Zindagi mein kuch log bahut khas hote hain, aur aap unhi mein se ek hain, ${name}. ✨`,
      "Yeh kuch yaadein hain jo is safar ki gawah hain. 💗",
      "Har pal khush raho, yahi dil se dua hai. ❤️",
      "Aane wala har din aapke liye dher saari khushiyan lekar aaye. Happy Birthday! ✨",
    ],
  };

  const key = relationship in lines ? relationship : "Other";
  return lines[key][page] || lines.Other[page];
}

function getYouTubeId(url: string) {
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export default function WishViewer({ data }: { data: any }) {
  const partnerName = data.partner_name || "";
  const yourName = data.your_name || "";
  const relationship = data.relationship || "Other";
  const age = data.age || "";
  const dob = data.dob || "";
  const message = data.message || "";
  const photos: string[] = data.photos || [];
  const songUrl = data.song_url || "";
  const themeId = data.theme_id || "blush";

  const youtubeId = getYouTubeId(songUrl);

  const [opened, setOpened] = useState(false);
  const [finalPage, setFinalPage] = useState(0);
  const [isSongPlaying, setIsSongPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const theme = themes.find((t) => t.id === themeId) || themes[0];
  const relationshipLine = getRelationshipLine(relationship);
  const ageLine = getAgeLine(relationship, age);

  const openSurprise = async () => {
    setOpened(true);
    setFinalPage(0);

    setTimeout(async () => {
      if (youtubeId) {
        setIsSongPlaying(true);
      } else if (audioRef.current && songUrl) {
        try {
          audioRef.current.currentTime = 0;
          await audioRef.current.play();
          setIsSongPlaying(true);
        } catch {
          setIsSongPlaying(false);
        }
      }
    }, 250);
  };

  const toggleSong = async () => {
    if (youtubeId) {
      setIsSongPlaying(!isSongPlaying);
      return;
    }
    if (!audioRef.current || !songUrl) return;

    try {
      if (audioRef.current.paused) {
        await audioRef.current.play();
        setIsSongPlaying(true);
      } else {
        audioRef.current.pause();
        setIsSongPlaying(false);
      }
    } catch {
      setIsSongPlaying(false);
    }
  };

  // 🔥 Auto-slide timer (4-5 sec baad slide apne aap aage shift hogi, aur last page se wapas 1st par loop ho jayegi)
  useEffect(() => {
    if (!opened) return;

    const delay = finalPage === 0 ? 6500 : 4500; // Pehla page 6.5 sec, baaki 4.5 sec
    const timer = window.setTimeout(() => {
      if (finalPage < 3) {
        setFinalPage((prev) => prev + 1);
      } else {
        setFinalPage(0); // Last page se wapas 1st page par loop
      }
    }, delay);

    return () => window.clearTimeout(timer);
  }, [opened, finalPage]);

  // 🔥 Click anywhere to manually advance or loop back to start
  const handleScreenClick = () => {
    if (!opened) return;
    if (finalPage < 3) {
      setFinalPage((prev) => prev + 1);
    } else {
      setFinalPage(0);
    }
  };

  return (
    <main 
      className="min-h-screen overflow-x-hidden text-[#3b3040] select-none cursor-pointer" 
      style={{ background: theme.gradient }}
      onClick={handleScreenClick}
    >
      {songUrl && !youtubeId && (
        <audio
          ref={audioRef}
          src={songUrl}
          loop
          preload="auto"
          onPlay={() => setIsSongPlaying(true)}
          onPause={() => setIsSongPlaying(false)}
        />
      )}

      {youtubeId && isSongPlaying && (
        <iframe
          width="0"
          height="0"
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&loop=1&playlist=${youtubeId}&controls=0`}
          frameBorder="0"
          allow="autoplay"
          style={{ display: "none" }}
        ></iframe>
      )}

      {!opened ? (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-5">
          <div className="absolute inset-0 bg-black/15 backdrop-blur-sm" />
          <div className="relative z-10 w-full max-w-md text-center">
            <div className="reveal-ring relative mx-auto mb-7 h-48 w-48 overflow-hidden rounded-full border-8 border-white/60 bg-white/20 p-1 shadow-2xl animate-pulse">
              {photos[0] && (
                <img src={photos[0]} alt="" className="absolute inset-0 h-full w-full object-cover rounded-full transform hover:scale-110 transition duration-700" />
              )}
            </div>

            <p className="text-xs font-bold uppercase tracking-[0.35em] text-white/90">
              ✦ KISI NE AAPKE LIYE KUCH KHAAS BANYA HAI ✦
            </p>

            <h1 className="mt-4 text-5xl font-black leading-[.9] text-white drop-shadow-2xl md:text-7xl">
              {partnerName}
            </h1>

            {dob && (
              <p className="mt-2 text-xs font-bold tracking-widest text-white/85">
                🎂 Special Day: {dob}
              </p>
            )}

            <p className="mx-auto mt-5 max-w-xs text-sm leading-6 text-white/90 font-medium">
              {relationshipLine}
            </p>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openSurprise();
              }}
              className="shine-white mt-9 w-full rounded-2xl bg-white py-5 text-sm font-black text-[#6e5475] shadow-2xl transition hover:scale-105 active:scale-95"
            >
              🎁 TAP TO OPEN YOUR SURPRISE 💗
            </button>

            <p className="mt-4 text-[11px] tracking-widest text-white/70 font-bold">
              SOUND ON KIJIYEGA 🎵 (Auto-slide & tap supported)
            </p>
          </div>
        </div>
      ) : (
        <div className="relative min-h-screen overflow-hidden">
          {/* Top Progress Bars */}
          <div className="fixed left-1/2 top-5 z-50 flex w-[82%] max-w-md -translate-x-1/2 gap-2 pointer-events-none">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-all duration-700 ${
                  i <= finalPage ? "bg-white shadow-lg scale-y-125" : "bg-white/30"
                }`}
              />
            ))}
          </div>

          {/* Music Control & Page Count */}
          <div className="fixed right-5 top-4 z-[100] flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleSong();
              }}
              className="rounded-full border border-white/40 bg-black/30 px-4 py-2 text-[10px] font-black text-white backdrop-blur-xl shadow-xl transition hover:bg-black/50"
            >
              {isSongPlaying ? "🔊 MUSIC ON" : "🔇 MUSIC OFF"}
            </button>
            <div className="rounded-full border border-white/20 bg-black/20 px-3 py-2 text-[10px] font-bold text-white backdrop-blur-xl">
              {finalPage + 1} / 4
            </div>
          </div>

          {/* ================= PAGE 1 ================= */}
          {finalPage === 0 && (
            <div className="page-enter relative min-h-screen overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0">
                {photos[0] && <img src={photos[0]} alt="" className="absolute inset-0 h-full w-full object-cover blur-3xl opacity-60 scale-125" />}
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                  {photos[0] && <img src={photos[0]} alt="" className="hero-zoom h-full w-full object-contain" />}
                </div>
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              </div>

              <div className="absolute inset-x-0 bottom-0 z-10 p-6 pb-20 md:p-16">
                <div className="text-reveal max-w-4xl text-white">
                  <p className="text-xs font-bold uppercase tracking-[0.35em] text-pink-300">✦ HAMEESHA KHUSH RAHO ✦</p>
                  <h1 className="mt-3 text-6xl font-black leading-[.85] md:text-9xl drop-shadow-lg">{partnerName}</h1>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <span className="rounded-full border border-white/30 bg-white/20 px-4 py-2 text-sm font-bold backdrop-blur-xl">{ageLine}</span>
                    {dob && <span className="rounded-full border border-white/30 bg-white/20 px-4 py-2 text-sm font-bold backdrop-blur-xl">🎂 {dob}</span>}
                  </div>
                  <p className="mt-6 max-w-xl text-sm leading-7 text-white/90 md:text-lg font-medium">
                    {getCinematicLine(relationship, 0, partnerName)}
                  </p>
                  <p className="mt-4 text-[11px] tracking-widest text-white/60 animate-pulse">
                    (Auto-sliding or click anywhere to advance ➔)
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ================= PAGE 2 ================= */}
          {finalPage === 1 && (
            <div className="page-enter min-h-screen overflow-y-auto bg-[#fff7fb]/95 px-5 py-24 md:px-12 flex flex-col justify-center">
              <div className="mx-auto max-w-5xl w-full">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-pink-600">✦ YAADEIN AUR LAMHE ✦</p>
                <h2 className="mt-2 text-4xl font-black md:text-7xl text-[#3b3040]">
                  Kuch khoobsurat pal, <span className="gradient-text block pb-1">jo hamesha yaad rahenge.</span>
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-[#7a697e] font-medium">
                  {getCinematicLine(relationship, 1, partnerName)}
                </p>

                <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
                  {photos.map((photo, index) => (
                    <div key={index} className="memory-pop overflow-hidden rounded-[26px] bg-white p-2 shadow-2xl transform hover:scale-105 transition duration-500">
                      <div className="relative h-[210px] overflow-hidden rounded-[20px] bg-[#eee8ef]">
                        <img src={photo} alt="" className="h-full w-full object-cover" />
                      </div>
                      <div className="px-2 py-2 text-center">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-pink-500">MEMORY #{index + 1}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= PAGE 3 ================= */}
          {finalPage === 2 && (
            <div className="page-enter relative min-h-screen overflow-hidden bg-gradient-to-br from-[#fbcfe8] via-[#e9d5ff] to-[#bae6fd] px-5 py-24 flex items-center justify-center">
              <div className="relative z-10 mx-auto max-w-4xl w-full">
                <div className="grid w-full items-center gap-8 md:grid-cols-2">
                  <div className="mx-auto w-full max-w-sm">
                    <div className="polaroid-float rotate-[-3deg] rounded-[32px] bg-white p-3 shadow-2xl">
                      <div className="relative h-[400px] overflow-hidden rounded-[24px] bg-[#eee8ef]">
                        {photos[1] || photos[0] ? (
                          <img src={photos[1] || photos[0]} alt="" className="h-full w-full object-cover" />
                        ) : null}
                      </div>
                      <p className="font-hand text-center text-lg text-[#78687c] mt-3">Meri duniya ka sabse pyara hissa. 💗</p>
                    </div>
                  </div>
                  <div className="text-reveal">
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-purple-700">✦ DIL SE KUCH BAATEIN ✦</p>
                    <h2 className="mt-2 text-4xl font-black leading-[1.1] md:text-6xl text-[#3b3040]">
                      A special note from <span className="text-purple-700">{yourName}.</span>
                    </h2>
                    
                    <div className="mt-6 rounded-[28px] border border-white/80 bg-white/70 p-6 shadow-2xl backdrop-blur-xl">
                      <p className="text-lg font-bold leading-8 text-[#4a3b4e] md:text-xl">
                        “{message}”
                      </p>
                    </div>
                    <p className="mt-4 text-xs font-bold text-purple-900 tracking-wide">
                      {relationshipLine}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= PAGE 4 (FINALE + LOOP BACK) ================= */}
          {finalPage === 3 && (
            <div className="page-enter relative min-h-screen overflow-hidden flex flex-col items-center justify-center px-5 py-16 text-center" style={{ background: theme.gradient }}>
              <div className="relative z-10 w-full max-w-2xl text-white">
                <span className="text-xs font-bold uppercase tracking-[0.35em] text-white/80">✦ THE FINALE ✦</span>
                <h2 className="mt-3 text-5xl font-black md:text-7xl drop-shadow-md">
                  Happy Birthday <br />
                  <span className="text-pink-200">{partnerName}!</span>
                </h2>
                
                <p className="mt-5 text-base text-white/90 leading-relaxed font-medium">
                  {getCinematicLine(relationship, 3, partnerName)}
                </p>

                <div className="mx-auto mt-6 max-w-md rounded-[30px] border border-white/40 bg-white/20 p-5 shadow-2xl backdrop-blur-xl">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/30 text-2xl shadow-inner">
                      🎵
                    </div>
                    <div className="min-w-0 text-left flex-1">
                      <p className="text-sm font-black text-white">Special Soundtrack</p>
                      <p className="truncate text-xs text-white/80">Playing your vibe...</p>
                    </div>
                    <button 
                      type="button" 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSong();
                      }} 
                      className="rounded-full bg-white px-5 py-3 text-xs font-black text-[#735a78] shadow-lg hover:scale-105 transition"
                    >
                      {isSongPlaying ? "PAUSE" : "PLAY"}
                    </button>
                  </div>
                </div>

                <div className="mt-8 text-3xl tracking-widest animate-pulse">
                  💗 ✨ 🎂 ✨ 💗
                </div>

                {/* Footer options */}
                <div className="mt-12 pt-6 border-t border-white/20">
                  <p className="text-xs font-bold tracking-wider text-white/90">
                    Crafted with pure emotions & love. Looping back to start automatically! ✨
                  </p>
                  
                  <div className="mt-5">
                    <a
                      href="/"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-block rounded-full border border-white/50 bg-white/25 px-6 py-3 text-xs font-black text-white backdrop-blur-xl shadow-xl hover:bg-white hover:text-[#735a78] transition duration-300"
                    >
                      ✨ Create Another Surprise Wish Like This
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 🔥 Embedded Cinematic Animations CSS */}
      <style jsx global>{`
        @keyframes pageEnter {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
            filter: blur(8px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
            filter: blur(0);
          }
        }
        .page-enter {
          animation: pageEnter 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes heroZoom {
          0% { transform: scale(1.15); filter: blur(10px); }
          100% { transform: scale(1); filter: blur(0); }
        }
        .hero-zoom {
          animation: heroZoom 1.2s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes textReveal {
          from { opacity: 0; transform: translateY(30px); filter: blur(5px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        .text-reveal {
          animation: textReveal 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both;
        }

        @keyframes memoryPop {
          from { opacity: 0; transform: scale(0.9) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .memory-pop {
          animation: memoryPop 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes polaroidFloat {
          0%, 100% { transform: rotate(-3deg) translateY(0); }
          50% { transform: rotate(-1deg) translateY(-8px); }
        }
        .polaroid-float {
          animation: polaroidFloat 4s ease-in-out infinite;
        }

        .font-hand {
          font-family: cursive;
        }
      `}</style>
    </main>
  );
}