'use client';
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { supabase } from "./supabase";

type Step = "home" | "form" | "preview" | "payment" | "final";

type Theme = {
  id: string;
  name: string;
  emoji: string;
  gradient: string;
  glow: string;
};

type PhotoTransform = {
  x: number;
  y: number;
  scale: number;
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
    gradient: "linear-gradient(135deg, #8b5cf6 0%, #c084fc 100%, #f472b6 100%)",
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

const relationships = [
  "Girlfriend",
  "Boyfriend",
  "Wife",
  "Husband",
  "Best Friend",
  "Brother",
  "Sister",
  "Mom",
  "Dad",
  "Other",
];

const funnyLines: Record<string, string[]> = {
  Girlfriend: [
    "Age badh rahi hai, cuteness abhi bhi dangerous level pe hai. 😂❤️",
    "Aaj birthday hai isliye tum right ho... kal se dekh lenge. 😂",
    "Officially ek saal aur cute... aur thodi expensive bhi. 😂💸",
    "Happy Birthday! Cake tumhara, calories meri taraf se imaginary. 😂🎂",
  ],
  Boyfriend: [
    "Ek saal aur bade ho gaye, maturity ka update abhi pending hai. 😂",
    "Happy Birthday! Aaj tumhari bakwaas officially maaf hai. 😂",
    "Age badh gayi, harkatein same hain. Perfect! 😂",
    "Congratulations! Tum ab bhi mere favourite headache ho. 😂❤️",
  ],
  Wife: [
    "Happy Birthday! Aaj complaints ki limit thodi badha di gayi hai. 😂❤️",
    "Ek saal aur experienced... lekin argument mein main phir bhi haarunga. 😂",
    "Aaj birthday hai, isliye shopping demand officially approved. 😂🛍️",
    "Happy Birthday! Tumhari smile ka subscription lifetime hai. ❤️😂",
  ],
  Husband: [
    "Happy Birthday! Aaj tumhari saari mistakes maaf... sirf aaj. 😂",
    "Age badh rahi hai, responsibility ka update kab aayega? 😂",
    "Aaj tumhari marzi chalegi... limited time offer. 😂❤️",
    "Happy Birthday to my favourite human punching bag. 😂❤️",
  ],
  "Best Friend": [
    "Congratulations! Ek saal aur old, personality abhi bhi questionable. 😂",
    "Happy Birthday idiot! Family mein tumhe kisne add kiya tha? 😂❤️",
    "Age sirf number hai... tumhare case mein bada number hai. 😂🎂",
    "Aaj roast nahi karunga... birthday ke baad double karunga. 😂",
  ],
  Brother: [
    "Happy Birthday! Maa ka favourite banne ki race abhi bhi on hai. 😂",
    "Ek saal aur bade... responsibility abhi bhi mere naam hai. 😂",
    "Birthday tera hai, treat bhi teri hi hogi. Simple. 😂🍕",
    "Happy Birthday bro! Bachpan ki maar abhi bhi pending hai. 😂",
  ],
  Sister: [
    "Happy Birthday! Aaj tumhari shopping demands officially legal hain. 😂🛍️",
    "Ek saal aur badi... attitude already unlimited tha. 😂",
    "Happy Birthday sis! Ghar ki asli boss ko salaam. 😂👑",
    "Aaj tumhara birthday hai, isliye remote bhi tumhara. 😂📺",
  ],
  Mom: [
    "Happy Birthday Mom ❤️ Aaj kitchen duty officially cancelled. 😂",
    "Aaj aap bas relax karo... kaam hum karenge. Shayad. 😂❤️",
    "Happy Birthday to the person who somehow knows everything. 😂❤️",
    "Mummy, aaj daantne ka quota zero rakho please. 😂🎂",
  ],
  Dad: [
    "Happy Birthday Dad ❤️ Aaj lecture thoda short rakhna please. 😂",
    "Aaj aapka birthday hai, toh budget lecture kal se. 😂",
    "Happy Birthday Dad! Family ke CEO ko salute. 😂👑",
    "Aaj remote aur newspaper dono aapke. Happy Birthday! 😂",
  ],
  Other: [
    "Age badh rahi hai, vibe abhi bhi solid hai. 😂🔥",
    "Happy Birthday! Maturity ka update kabhi bhi aa sakta hai. 😂",
    "Congratulations! Ek saal aur iconic. 🎂😂",
    "Birthday rule: calories don't count today. 😂🎂",
  ],
};

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

function getFinalPageLine(relationship: string, page: number, name: string) {
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

export default function Home() {
  const [step, setStep] = useState<Step>("home");

  const [relationship, setRelationship] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [yourName, setYourName] = useState("");
  const [age, setAge] = useState("");
  const [dob, setDob] = useState("");
  const [message, setMessage] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPhotoTransforms((prev) => prev.filter((_, i) => i !== index));
    if (adjustPhotoIndex === index) {
      setAdjustPhotoIndex(null);
    } else if (adjustPhotoIndex !== null && adjustPhotoIndex > index) {
      setAdjustPhotoIndex(adjustPhotoIndex - 1);
    }
  };

  const reset = () => {
    setStep("home");
    setRelationship("");
    setPartnerName("");
    setYourName("");
    setAge("");
    setDob("");
    setMessage("");
    setWhatsapp("");
    setPhotos([]);
    setPhotoTransforms([]);
    setAdjustPhotoIndex(null);
    setSongUrl("");
    setSongName("");
    setYoutubeId(null);
    setIsSongPlaying(false);
    setThemeId("blush");
    setOpened(false);
    setFinalPage(0);
    setFunnyMode(false);
    setFunnyText("");
    setPreviewAnimation(false);
  };

  const [photos, setPhotos] = useState<string[]>([]);
  const [photoTransforms, setPhotoTransforms] = useState<PhotoTransform[]>([]);
  const [adjustPhotoIndex, setAdjustPhotoIndex] = useState<number | null>(null);

  const [songUrl, setSongUrl] = useState("");
  const [songName, setSongName] = useState("");
  const [youtubeId, setYoutubeId] = useState<string | null>(null);
  const [isSongPlaying, setIsSongPlaying] = useState(false);

  const [themeId, setThemeId] = useState("blush");
  const [previewAnimation, setPreviewAnimation] = useState(false);
  const [opened, setOpened] = useState(false);
  const [finalPage, setFinalPage] = useState(0);

  const [funnyMode, setFunnyMode] = useState(false);
  const [funnyText, setFunnyText] = useState("");

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const theme = themes.find((t) => t.id === themeId) || themes[0];
  const relationshipLine = getRelationshipLine(relationship);
  const ageLine = getAgeLine(relationship, age);

  const getPhotoTransform = (index: number): PhotoTransform => {
    return photoTransforms[index] || { x: 0, y: 0, scale: 1 };
  };

  const updatePhotoTransform = (index: number, patch: Partial<PhotoTransform>) => {
    setPhotoTransforms((prev) => {
      const next = [...prev];
      while (next.length <= index) {
        next.push({ x: 0, y: 0, scale: 1 });
      }
      next[index] = { ...next[index], ...patch };
      return next;
    });
  };

  const resetPhotoTransform = (index: number) => {
    updatePhotoTransform(index, { x: 0, y: 0, scale: 1 });
  };

  const photoStyle = (index: number) => {
    const transform = getPhotoTransform(index);
    return {
      transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
    };
  };

  const showFunny = () => {
    const lines = funnyLines[relationship] || funnyLines.Other;
    const currentIndex = lines.indexOf(funnyText);
    let nextIndex = Math.floor(Math.random() * lines.length);
    if (lines.length > 1 && nextIndex === currentIndex) {
      nextIndex = (nextIndex + 1) % lines.length;
    }
    setFunnyText(lines[nextIndex]);
    setFunnyMode(true);
  };

  const handlePhotos = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const remaining = 10 - photos.length;
    const selectedFiles = files.slice(0, remaining);
    const uploadedUrls: string[] = [];

    for (const file of selectedFiles) {
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${file.name.split('.').pop()}`;
      const { error } = await supabase.storage.from('birthday-files').upload(fileName, file);
      if (!error) {
        const { data } = supabase.storage.from('birthday-files').getPublicUrl(fileName);
        if (data?.publicUrl) uploadedUrls.push(data.publicUrl);
      }
    }
    setPhotos((prev) => [...prev, ...uploadedUrls].slice(0, 10));
    setPhotoTransforms((prev) => [
      ...prev,
      ...uploadedUrls.map(() => ({ x: 0, y: 0, scale: 1 })),
    ]);
    e.target.value = "";
  };

  const handleSong = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fileName = `song-${Math.random().toString(36).substring(2)}-${Date.now()}.${file.name.split('.').pop()}`;
    const { error } = await supabase.storage.from('birthday-files').upload(fileName, file);
    if (!error) {
      const { data } = supabase.storage.from('birthday-files').getPublicUrl(fileName);
      if (data?.publicUrl) {
        setSongUrl(data.publicUrl);
        setSongName(file.name);
        setYoutubeId(null);
      }
    }
    e.target.value = "";
  };

  const validateForm = () => {
    if (!relationship) { alert("Birthday kis ke liye hai, select karo 🎂"); return false; }
    if (!partnerName.trim()) { alert("Birthday person ka naam enter karo ❤️"); return false; }
    if (!yourName.trim()) { alert("Apna naam enter karo ✨"); return false; }
    if (!age.trim()) { alert("Age enter karo 🎂"); return false; }
    if (!message.trim()) { alert("Personal message likho 💌"); return false; }
    if (photos.length === 0) { alert("Kam se kam 1 photo upload karo 📸"); return false; }
    if (!songUrl && !youtubeId) { alert("Song upload karo ya direct YouTube link add karo 🎵"); return false; }
    if (!whatsapp.trim()) { alert("WhatsApp number enter karo 📱"); return false; }
    return true;
  };

  const goPreview = () => {
    if (!validateForm()) return;
    setStep("preview");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goPayment = () => {
    setStep("payment");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goFinal = async () => {
    try {
      const { data, error } = await supabase.from("birthday_wishes").insert([
        {
          partner_name: partnerName,
          your_name: yourName,
          relationship: relationship,
          age: age,
          dob: dob,
          message: message,
          whatsapp: whatsapp,
          theme_id: themeId,
          song_url: songUrl,
          photos: photos,
        },
      ]).select();

      if (error) {
        alert("Error saving data: " + error.message);
        return;
      }

      if (data && data.length > 0) {
        setStep("final");
        setOpened(false);
        setFinalPage(0);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err) {
      console.error("Something went wrong:", err);
    }
  };

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

  useEffect(() => {
    if (step !== "final" || !opened) return;
    const delay = finalPage === 0 ? 6500 : 4500;
    const timer = window.setTimeout(() => {
      if (finalPage < 3) {
        setFinalPage((prev) => prev + 1);
      } else {
        setFinalPage(0);
      }
    }, delay);
    return () => window.clearTimeout(timer);
  }, [step, opened, finalPage]);

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

  const handleScreenClick = () => {
    if (step !== "final" || !opened) return;
    if (finalPage < 3) {
      setFinalPage((prev) => prev + 1);
    } else {
      setFinalPage(0);
    }
  };

  const nextPage = () => setFinalPage((prev) => Math.min(prev + 1, 3));
  const previousPage = () => setFinalPage((prev) => Math.max(prev - 1, 0));

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].clientX;
    touchStartY.current = e.changedTouches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const diffX = endX - touchStartX.current;
    const diffY = endY - touchStartY.current;
    if (Math.abs(diffX) < 60 || Math.abs(diffX) < Math.abs(diffY)) return;
    if (diffX < 0) nextPage();
    else previousPage();
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#fff7fb] text-[#3b3040]">
      {songUrl && !youtubeId && (
        <audio ref={audioRef} src={songUrl} loop preload="auto" onPlay={() => setIsSongPlaying(true)} onPause={() => setIsSongPlaying(false)} />
      )}

      {youtubeId && isSongPlaying && (
        <div className="fixed bottom-4 left-4 z-[999] bg-black/80 p-2 rounded-2xl shadow-2xl backdrop-blur-xl border border-white/20 flex items-center gap-3">
          <div className="text-[10px] text-white font-bold pl-2">Playing YouTube Audio 🎵</div>
          <iframe
            width="140"
            height="40"
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&loop=1&playlist=${youtubeId}&enablejsapi=1`}
            frameBorder="0"
            allow="autoplay; encrypted-media"
            style={{ borderRadius: "12px", border: "none" }}
          ></iframe>
        </div>
      )}

      {/* ================= HOME ================= */}
      {step === "home" && (
        <section className="relative min-h-screen overflow-hidden bg-[#fff7fb]">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="orb orb-one" /><div className="orb orb-two" /><div className="orb orb-three" /><div className="orb orb-four" />
            <Sparkles />
          </div>

          <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center px-5 py-12">
            <div className="w-full text-center">
              <span className="mb-7 inline-flex animate-fade-down rounded-full border border-white bg-white/70 px-5 py-2 text-[10px] font-black tracking-[0.25em] text-pink-500 shadow-lg shadow-pink-100 backdrop-blur-xl">
                ✦ PERSONALIZED BIRTHDAY EXPERIENCES ✦
              </span>

              <h1 className="animate-fade-up mx-auto max-w-5xl text-5xl font-black leading-[0.88] tracking-tight md:text-8xl">
                Their birthday.
                <span className="gradient-text mt-3 block pb-3">But make it unforgettable. ✨</span>
              </h1>

              <p className="animate-fade-up-delay mx-auto mt-7 max-w-xl text-sm leading-7 text-[#837486] md:text-lg">
                Their photos. Their song. Your words.<br />Turn all of it into one beautiful little universe. 💗
              </p>

              <button
                type="button"
                onClick={() => setStep("form")}
                className="shine-button animate-fade-up-delay-2 mt-10 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-sky-500 px-10 py-5 text-sm font-black text-white shadow-2xl shadow-pink-300/50 transition transform hover:scale-105 active:scale-95 cursor-pointer touch-manipulation"
              >
                💌 START CREATING →
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ================= FORM ================= */}
      {step === "form" && (
        <section className="relative min-h-screen overflow-hidden bg-[#fff7fb] px-4 py-8 md:px-8">
          <div className="fixed inset-0 pointer-events-none">
            <div className="form-orb form-orb-one" /><div className="form-orb form-orb-two" />
          </div>

          <div className="relative z-10 mx-auto max-w-5xl">
            <button
              type="button"
              onClick={() => setStep("home")}
              className="mb-7 rounded-full border border-white bg-white/70 px-5 py-2.5 text-sm font-black text-[#948598] shadow-sm backdrop-blur-xl hover:text-pink-500 transition cursor-pointer touch-manipulation"
            >
              ← Back
            </button>

            <div className="mb-10 text-center">
              <div className="mb-4 inline-flex rounded-full border border-pink-100 bg-white/80 px-4 py-2 text-xs font-bold tracking-[0.2em] text-pink-500 shadow-sm">
                ✦ CREATE YOUR SURPRISE ✦
              </div>
              <h1 className="text-4xl font-black tracking-tight md:text-7xl">
                Let&apos;s make it <span className="gradient-text block pb-2">personal. 💗</span>
              </h1>
            </div>

            <div className="grid gap-5 lg:grid-cols-[1fr_.8fr]">
              <div className="glass-card rounded-[32px] p-5 md:p-7 space-y-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-pink-500">Birthday details</p>
                  <h2 className="mt-2 text-2xl font-black">Tell us about them</h2>
                </div>

                <div>
                  <label className="mb-3 block text-sm font-bold">Who are we celebrating? 🎂</label>
                  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                    {relationships.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => { setRelationship(item); setFunnyText(""); setFunnyMode(false); }}
                        className={`relationship-btn touch-manipulation cursor-pointer ${relationship === item ? "relationship-selected" : ""}`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                  {relationship && (
                    <div className="relationship-line mt-3">
                      <span className="mr-1">✨</span>{relationshipLine}
                    </div>
                  )}
                </div>

                <TextInput label="Their name" placeholder="e.g. Jhon" value={partnerName} onChange={setPartnerName} />
                <TextInput label="Your name" placeholder="e.g. Alex" value={yourName} onChange={setYourName} />
                <TextInput label="Their age" placeholder="e.g. 25" type="number" value={age} onChange={setAge} />
                <div>
  <label className="mb-2 block text-sm font-bold">Born on 📅</label>
  <input 
    type="date" 
    value={dob} 
    onChange={(e) => setDob(e.target.value)} 
    className="modern-input w-full cursor-pointer" 
  />
</div>

                <div>
                  <label className="mb-2 block text-sm font-bold">Your personal message 💌</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    placeholder="Apne dil ki baat yaha likho..."
                    className="modern-input w-full resize-none"
                  />
                </div>

                {relationship && (
                  <div className="funny-box">
                    <div className="flex items-center gap-3">
                      <div className="funny-face">😂</div>
                      <div className="flex-1">
                        <p className="text-sm font-black">Add a little chaos? 😂</p>
                        <p className="text-[10px] text-[#9d8da0]">Generate a funny birthday line</p>
                      </div>
                      <button type="button" onClick={showFunny} className="funny-button touch-manipulation cursor-pointer">
                        {funnyMode ? "ANOTHER 😂" : "FUNNY MODE"}
                      </button>
                    </div>
                    {funnyMode && funnyText && (
                      <div className="funny-result">
                        <span className="text-xl">🤣</span>
                        <p>{funnyText}</p>
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-bold">Their photos 📸</label>
                    <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-bold text-pink-500">{photos.length}/10</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {photos.map((photo, index) => (
                      <div key={`${photo}-${index}`} className="photo-upload-card group relative overflow-hidden rounded-2xl">
                        <div className="relative aspect-square overflow-hidden bg-[#f1eaf2]">
                          <img src={photo} alt="" className="absolute inset-0 h-full w-full object-cover" />
                        </div>
                        <div className="absolute inset-x-0 bottom-0 flex gap-1 bg-gradient-to-t from-black/70 to-transparent p-2 pt-8">
                          <button type="button" onClick={() => setAdjustPhotoIndex(index)} className="flex-1 rounded-xl bg-white/90 py-2.5 text-[10px] font-black text-[#6d5870] shadow-lg backdrop-blur touch-manipulation cursor-pointer">
                            ADJUST
                          </button>
                          <button type="button" onClick={() => removePhoto(index)} className="rounded-xl bg-white/90 px-3 py-2.5 text-xs font-black text-pink-500 shadow-lg touch-manipulation cursor-pointer">
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                    {photos.length < 10 && (
                      <label className="upload-box flex aspect-square cursor-pointer flex-col items-center justify-center rounded-2xl touch-manipulation">
                        <span className="text-2xl">＋</span>
                        <span className="text-[10px] font-bold mt-1">ADD PHOTO</span>
                        <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotos} />
                      </label>
                    )}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold">Birthday song 🎵</label>
                  <label className="song-upload flex cursor-pointer items-center gap-3 rounded-2xl p-4 touch-manipulation">
                    <div className="song-icon flex h-11 w-11 items-center justify-center rounded-xl text-xl">🎧</div>
                    <div className="flex-1">
                      <p className="text-sm font-bold">Upload audio</p>
                      <p className="text-xs text-[#aaa0ad]">MP3 / WAV / M4A</p>
                    </div>
                    <span className="text-xl">＋</span>
                    <input type="file" accept="audio/*" className="hidden" onChange={handleSong} />
                  </label>
                  {songName && <p className="mt-2 rounded-xl bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-500">✓ {songName}</p>}
                  <input
                    value={songUrl.startsWith("blob:") ? "" : songUrl}
                    onChange={(e) => {
                      const url = e.target.value;
                      setSongUrl(url);
                      if (!url) { setYoutubeId(null); setSongName(""); return; }
                      const yId = getYouTubeId(url);
                      if (yId) { 
                        setYoutubeId(yId); 
                        setSongName("YouTube Song Selected"); 
                      } else { 
                        setYoutubeId(null); 
                        setSongName("Linked Audio Track"); 
                      }
                    }}
                    placeholder="Paste YouTube link or direct .mp3 URL"
                    className="modern-input mt-3 w-full"
                  />
                </div>

                <TextInput label="WhatsApp number 📱" placeholder="10 digit WhatsApp number" type="tel" value={whatsapp} onChange={setWhatsapp} />
              </div>

              <div className="space-y-5">
                <div className="glass-card rounded-[32px] p-5 md:p-6 space-y-4">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-500">CHOOSE THE VIBE</p>
                  <h2 className="text-2xl font-black">Pick their energy.</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {themes.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setThemeId(item.id)}
                        className={`theme-card touch-manipulation cursor-pointer ${themeId === item.id ? "theme-card-selected" : ""}`}
                      >
                        <div className="theme-preview" style={{ background: item.gradient }}>
                          <span>{item.emoji}</span>
                          {themeId === item.id && <b>✓</b>}
                        </div>
                        <div className="mt-2 text-sm font-bold">{item.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={goPreview}
                  className="shine-button w-full rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-sky-500 py-5 text-sm font-black text-white shadow-xl shadow-purple-200 transition transform hover:scale-[1.02] active:scale-95 cursor-pointer touch-manipulation"
                >
                  CREATE MY PREVIEW →
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ================= PREVIEW ================= */}
      {step === "preview" && (
        <section className="relative min-h-screen overflow-hidden bg-[#fff7fb] px-4 py-12">
          <div className="absolute inset-0 pointer-events-none">
            <div className="preview-orb preview-orb-one" /><div className="preview-orb preview-orb-two" />
          </div>

          <div className="relative z-10 mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <span className="inline-flex rounded-full border border-pink-100 bg-white/80 px-4 py-2 text-xs font-bold tracking-[0.2em] text-pink-500 shadow-sm">
                ✦ STEP 02 · COMPLETE PREVIEW ✦
              </span>
              <h1 className="mt-3 text-3xl font-black md:text-5xl">Here is your <span className="gradient-text block pb-1">Masterpiece Summary.</span></h1>
              <p className="mt-2 text-sm text-[#837486]">Verify all the details before proceeding to payment! ✨</p>
            </div>

            {/* Main Summary Card */}
            <div className="glass-card rounded-[32px] p-6 md:p-10 space-y-8 shadow-2xl">
              
              {/* Basic Details Grid */}
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-pink-500 mb-3">👤 Basic Information</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  <div className="bg-white/90 p-4 rounded-2xl border border-pink-50 shadow-sm">
                    <p className="text-[10px] uppercase font-bold text-pink-400">For</p>
                    <p className="text-sm font-black mt-1 truncate">{partnerName || "N/A"}</p>
                  </div>
                  <div className="bg-white/90 p-4 rounded-2xl border border-pink-50 shadow-sm">
                    <p className="text-[10px] uppercase font-bold text-pink-400">From</p>
                    <p className="text-sm font-black mt-1 truncate">{yourName || "N/A"}</p>
                  </div>
                  <div className="bg-white/90 p-4 rounded-2xl border border-pink-50 shadow-sm">
                    <p className="text-[10px] uppercase font-bold text-pink-400">Age & DOB</p>
                    <p className="text-sm font-black mt-1 truncate">{age ? `${age} yrs` : "-"} / {dob || "-"}</p>
                  </div>
                  <div className="bg-white/90 p-4 rounded-2xl border border-pink-50 shadow-sm">
                    <p className="text-[10px] uppercase font-bold text-pink-400">Relation</p>
                    <p className="text-sm font-black mt-1 truncate">{relationship || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Personal Message */}
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-pink-500 mb-3">💌 Personal Message</p>
                <div className="rounded-2xl bg-white/90 p-5 border border-pink-50 text-sm font-medium text-[#5a4c5e] italic shadow-sm">
                  &ldquo;{message || "No message written yet..."}&rdquo;
                </div>
              </div>

              {/* Song Details */}
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-500 mb-3">🎵 Selected Song / Audio</p>
                <div className="flex items-center gap-3 rounded-2xl bg-white/90 p-4 border border-purple-50 shadow-sm">
                  <span className="text-2xl">🎧</span>
                  <p className="text-xs font-bold truncate flex-1">{songName || (songUrl ? "Custom Audio / YouTube Link Linked" : "No song selected")}</p>
                </div>
              </div>

              {/* Photos Grid */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-pink-500">📸 Selected Photos ({photos.length}/10)</p>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {photos.map((photo, idx) => (
                    <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 border-2 border-white shadow-md">
                      <img src={photo} alt="" className="absolute inset-0 h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Theme Vibe */}
              <div className="flex items-center justify-between bg-white/60 p-4 rounded-2xl border border-white">
                <span className="text-xs font-bold text-[#735a78]">Selected Theme Vibe:</span>
                <span className="text-xs font-black px-4 py-1.5 rounded-full bg-pink-100 text-pink-600">{theme.name} {theme.emoji}</span>
              </div>
            </div>

            {/* Bottom Action Buttons */}
            <div className="mt-8 space-y-3">
              <button
                type="button"
                onClick={goPayment}
                className="shine-button w-full rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-sky-500 py-5 text-sm font-black text-white shadow-2xl shadow-pink-300 transition transform hover:scale-[1.02] active:scale-95 cursor-pointer touch-manipulation"
              >
                ✨ PROCEED TO YOUR SURPRISE ✨
              </button>
              <button
                type="button"
                onClick={() => setStep("form")}
                className="w-full rounded-2xl border border-white bg-white/80 py-4 text-sm font-black text-[#8f8094] shadow-sm transition hover:bg-white cursor-pointer touch-manipulation"
              >
                ← GO BACK & EDIT DETAILS
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ================= PAYMENT ================= */}
      {step === "payment" && (
        <section className="relative flex min-h-screen items-center overflow-hidden bg-[#fff7fb] px-4 py-8">
          <div className="absolute inset-0 pointer-events-none">
            <div className="payment-orb payment-one" /><div className="payment-orb payment-two" />
          </div>

          <div className="relative z-10 mx-auto w-full max-w-md">
            <div className="mb-7 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-500">STEP 03 · PAYMENT</p>
              <h1 className="mt-3 text-4xl font-black">Your surprise is ready.</h1>
              <p className="mt-3 text-sm text-[#9a8c9e]">One tiny payment. One very big reaction. 💗</p>
            </div>

            <div className="overflow-hidden rounded-[32px] border border-white bg-white/90 shadow-2xl shadow-purple-200/60 backdrop-blur-xl p-6">
              <div className="my-6 h-px bg-pink-100" />
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs text-[#aaa0ad]">TOTAL</p>
                  <p className="text-4xl font-black">₹199</p>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-500">ONE TIME</span>
              </div>

              <button
                type="button"
                onClick={goFinal}
                className="shine-button mt-7 w-full rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-sky-500 py-5 text-sm font-black text-white shadow-xl shadow-purple-200 transition transform hover:scale-[1.02] active:scale-95 cursor-pointer touch-manipulation"
              >
                PAY ₹199 & CREATE THE SURPRISE FOR YOUR SPECIAL ONE❤️ →
              </button>
            </div>

            <button type="button" onClick={() => setStep("preview")} className="mt-5 w-full text-sm font-bold text-[#a095a5] cursor-pointer">
              ← Back to preview
            </button>
          </div>
        </section>
      )}

      {/* ================= FINAL ================= */}
      {step === "final" && (
        <div 
          className="min-h-screen overflow-x-hidden text-[#3b3040] select-none cursor-pointer" 
          style={{ background: theme.gradient }}
          onClick={handleScreenClick}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
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
                  className="shine-white mt-9 w-full rounded-2xl bg-white py-5 text-sm font-black text-[#6e5475] shadow-2xl transition hover:scale-105 active:scale-95 cursor-pointer"
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
                  className="rounded-full border border-white/40 bg-black/30 px-4 py-2 text-[10px] font-black text-white backdrop-blur-xl shadow-xl transition hover:bg-black/50 cursor-pointer"
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
                        {getFinalPageLine(relationship, 0, partnerName)}
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
                      {getFinalPageLine(relationship, 1, partnerName)}
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

              {/* ================= PAGE 4 ================= */}
              {finalPage === 3 && (
                <div className="page-enter relative min-h-screen overflow-hidden flex flex-col items-center justify-center px-5 py-16 text-center" style={{ background: theme.gradient }}>
                  <div className="relative z-10 w-full max-w-2xl text-white">
                    <span className="text-xs font-bold uppercase tracking-[0.35em] text-white/80">✦ THE FINALE ✦</span>
                    <h2 className="mt-3 text-5xl font-black md:text-7xl drop-shadow-md">
                      Happy Birthday <br />
                      <span className="text-pink-200">{partnerName}!</span>
                    </h2>
                    
                    <p className="mt-5 text-base text-white/90 leading-relaxed font-medium">
                      {getFinalPageLine(relationship, 3, partnerName)}
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
                          className="rounded-full bg-white px-5 py-3 text-xs font-black text-[#735a78] shadow-lg hover:scale-105 transition cursor-pointer"
                        >
                          {isSongPlaying ? "PAUSE" : "PLAY"}
                        </button>
                      </div>
                    </div>

                    <div className="mt-8 text-3xl tracking-widest animate-pulse">
                      💗 ✨ 🎂 ✨ 💗
                    </div>

                    <div className="mt-12 pt-6 border-t border-white/20">
                      <p className="text-xs font-bold tracking-wider text-white/90">
                        Crafted with pure emotions & love. Looping back to start automatically! ✨
                      </p>
                      
                      <div className="mt-5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            reset();
                          }}
                          className="rounded-full border border-white/50 bg-white/25 px-6 py-3 text-xs font-black text-white backdrop-blur-xl shadow-xl hover:bg-white hover:text-[#735a78] transition duration-300 cursor-pointer"
                        >
                          ✨ Create Another Surprise Wish Like This
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ================= PHOTO ADJUST MODAL ================= */}
      {adjustPhotoIndex !== null && photos[adjustPhotoIndex] && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
          <div className="max-h-[94vh] w-full max-w-md overflow-y-auto rounded-[32px] bg-white text-[#17121c] shadow-2xl p-5 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[9px] font-black uppercase tracking-[0.22em] text-pink-500">PHOTO STUDIO</div>
                <h3 className="mt-1 text-2xl font-black">Adjust your photo 📸</h3>
              </div>
              <button type="button" onClick={() => setAdjustPhotoIndex(null)} className="flex h-10 w-10 items-center justify-center rounded-full bg-black/5 text-xl font-bold cursor-pointer">
                ×
              </button>
            </div>

            <div className="relative aspect-[4/5] overflow-hidden rounded-[26px] bg-[#eee7ef]">
              <img src={photos[adjustPhotoIndex]} alt="" className="absolute inset-0 h-full w-full scale-110 object-cover blur-3xl opacity-45" />
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                <img src={photos[adjustPhotoIndex]} alt="" className="h-full w-full object-contain" style={photoStyle(adjustPhotoIndex)} />
              </div>
            </div>

            <PhotoSlider label="Zoom" value={getPhotoTransform(adjustPhotoIndex).scale} min={0.7} max={2.2} step={0.01} display={`${Math.round(getPhotoTransform(adjustPhotoIndex).scale * 100)}%`} onChange={(v) => updatePhotoTransform(adjustPhotoIndex, { scale: v })} />
            <PhotoSlider label="Left / Right" value={getPhotoTransform(adjustPhotoIndex).x} min={-120} max={120} step={1} display={getPhotoTransform(adjustPhotoIndex).x === 0 ? "CENTER" : `${getPhotoTransform(adjustPhotoIndex).x}px`} onChange={(v) => updatePhotoTransform(adjustPhotoIndex, { x: v })} />
            <PhotoSlider label="Up / Down" value={getPhotoTransform(adjustPhotoIndex).y} min={-120} max={120} step={1} display={getPhotoTransform(adjustPhotoIndex).y === 0 ? "CENTER" : `${getPhotoTransform(adjustPhotoIndex).y}px`} onChange={(v) => updatePhotoTransform(adjustPhotoIndex, { y: v })} />

            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => resetPhotoTransform(adjustPhotoIndex)} className="rounded-2xl border border-[#eee5ef] bg-[#faf7fa] py-4 text-xs font-black text-[#88788b] cursor-pointer">
                ↻ FIT PHOTO
              </button>
              <button type="button" onClick={() => setAdjustPhotoIndex(null)} className="rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-sky-500 py-4 text-xs font-black text-white shadow-lg cursor-pointer">
                DONE ✓
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STYLES */}
      <style>{`
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { margin: 0; background: #fff7fb; }
        button, input, textarea { font-family: inherit; }

        .gradient-text {
          background: linear-gradient(90deg, #f43f5e, #a855f7, #0ea5e9, #f43f5e);
          background-size: 300% auto;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: gradientMove 5s linear infinite;
        }

        @keyframes gradientMove { to { background-position: 300% center; } }

        .glass-card {
          border: 1px solid rgba(255, 255, 255, 0.9);
          background: rgba(255, 255, 255, 0.76);
          box-shadow: 0 25px 70px rgba(168, 85, 247, 0.08), 0 8px 25px rgba(244, 63, 94, 0.06);
          backdrop-filter: blur(25px);
        }

        .sparkle {
          position: absolute; z-index: 2; color: #f472b6; font-size: 22px; opacity: 0;
          animation: sparkleAnim 3.5s ease-in-out infinite; pointer-events: none;
        }

        @keyframes sparkleAnim {
          0%, 100% { opacity: 0; transform: scale(0.5) rotate(0deg); }
          35% { opacity: 1; transform: scale(1.2) rotate(90deg); }
          70% { opacity: 0.6; transform: scale(0.8) rotate(180deg); }
        }

        .orb { position: absolute; border-radius: 999px; animation: orbFloat 9s ease-in-out infinite; }
        .orb-one { width: 380px; height: 380px; left: -120px; top: -80px; background: #fda4af; filter: blur(70px); opacity: 0.6; }
        .orb-two { width: 420px; height: 420px; right: -130px; top: 10%; background: #c4b5fd; filter: blur(80px); opacity: 0.6; animation-delay: 1.5s; }
        .orb-three { width: 300px; height: 300px; left: 15%; bottom: -100px; background: #7dd3fc; filter: blur(80px); opacity: 0.55; animation-delay: 3s; }
        .orb-four { width: 220px; height: 220px; right: 25%; bottom: 8%; background: #f9a8d4; filter: blur(65px); opacity: 0.55; animation-delay: 2s; }

        @keyframes orbFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(35px, -30px) scale(1.12); }
        }

        .card-float { animation: cardFloat 5s ease-in-out infinite; }
        @keyframes cardFloat {
          0%, 100% { transform: translateY(0) rotate(-1deg); }
          50% { transform: translateY(-12px) rotate(1deg); }
        }

        .animate-fade-down { animation: fadeDown 0.8s both; }
        .animate-fade-up { animation: fadeUp 0.9s 0.1s both; }
        .animate-fade-up-delay { animation: fadeUp 0.9s 0.25s both; }
        .animate-fade-up-delay-2 { animation: fadeUp 0.9s 0.4s both; }

        @keyframes fadeDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(30px); filter: blur(5px); } to { opacity: 1; transform: translateY(0); filter: blur(0); } }

        .shine-button { position: relative; overflow: hidden; }
        .shine-button::after {
          content: ""; position: absolute; top: 0; left: -100%; width: 55%; height: 100%;
          background: linear-gradient(100deg, transparent, rgba(255, 255, 255, 0.5), transparent);
          transform: skewX(-20deg); animation: buttonShine 3.5s infinite;
        }

        @keyframes buttonShine { 0% { left: -100%; } 35%, 100% { left: 150%; } }

        .form-orb { position: absolute; border-radius: 999px; filter: blur(75px); }
        .form-orb-one { width: 300px; height: 300px; background: #f9a8d4; left: -100px; top: 20%; }
        .form-orb-two { width: 350px; height: 350px; background: #c4b5fd; right: -130px; bottom: 10%; }

        .relationship-btn {
          border: 1px solid #eee4ef; background: rgba(255, 255, 255, 0.75); color: #8c7e91;
          padding: 14px 10px; border-radius: 16px; font-size: 13px; font-weight: 700; transition: all 0.2s ease;
        }
        .relationship-btn:hover { border-color: #f9a8d4; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(244, 114, 182, 0.12); }
        .relationship-selected {
          border-color: #f472b6 !important; color: #db2777 !important;
          background: linear-gradient(135deg, #fce7f3, #ede9fe, #e0f2fe) !important;
          box-shadow: 0 10px 25px rgba(244, 114, 182, 0.2); transform: translateY(-2px);
        }

        .relationship-line {
          border-radius: 14px; background: linear-gradient(90deg, #fff1f2, #f5f3ff, #f0f9ff);
          padding: 11px 13px; color: #db7093; font-size: 11px; line-height: 18px;
        }

        .modern-input {
          border: 1px solid #eee5ef; background: rgba(255, 255, 255, 0.82); border-radius: 17px;
          padding: 16px; font-size: 14px; outline: none; transition: all 0.25s ease;
        }
        .modern-input::placeholder { color: #c1b6c5; }
        .modern-input:focus { border-color: #f472b6; box-shadow: 0 0 0 4px rgba(244, 114, 182, 0.1); background: white; }

        .funny-box {
          position: relative; overflow: hidden; border: 1px solid #fbcfe8; border-radius: 24px;
          background: linear-gradient(135deg, rgba(255, 241, 242, 0.95), rgba(245, 243, 255, 0.95)); padding: 16px;
        }
        .funny-face {
          display: flex; height: 45px; width: 45px; align-items: center; justify-content: center;
          border-radius: 15px; background: white; font-size: 24px; box-shadow: 0 5px 15px rgba(244, 114, 182, 0.1);
        }
        .funny-button {
          position: relative; z-index: 2; border-radius: 14px; background: linear-gradient(135deg, #f43f5e, #a855f7);
          padding: 10px 14px; color: white; font-size: 10px; font-weight: 900; box-shadow: 0 8px 18px rgba(168, 85, 247, 0.18);
        }
        .funny-result {
          position: relative; z-index: 2; display: flex; gap: 10px; margin-top: 12px; border-radius: 16px;
          background: white; padding: 13px; color: #625365;
        }
        .funny-result p { font-size: 12px; font-weight: 700; line-height: 18px; }

        .upload-box {
          border: 1.5px dashed #f9a8d4; background: linear-gradient(135deg, #fff1f2, #f5f3ff);
          color: #ec4899; transition: all 0.25s ease;
        }
        .upload-box:hover { transform: translateY(-3px); box-shadow: 0 12px 25px rgba(244, 114, 182, 0.14); }

        .song-upload {
          border: 1px solid #ddd6fe; background: linear-gradient(135deg, rgba(245, 243, 255, 0.9), rgba(255, 241, 246, 0.9));
        }
        .song-icon { background: linear-gradient(135deg, #ddd6fe, #fbcfe8); }

        .theme-card {
          border: 1px solid #eee5ef; border-radius: 20px; background: rgba(255, 255, 255, 0.7);
          padding: 12px; text-align: left; transition: all 0.3s ease; cursor: pointer;
        }
        .theme-card:hover { transform: translateY(-4px); box-shadow: 0 15px 30px rgba(139, 92, 246, 0.12); }
        .theme-card-selected { border-color: #a78bfa; box-shadow: 0 15px 35px rgba(139, 92, 246, 0.18); transform: translateY(-3px); }

        .theme-preview {
          position: relative; height: 75px; border-radius: 14px; display: flex; align-items: center; justify-content: center; overflow: hidden;
        }
        .theme-preview span { position: relative; z-index: 2; font-size: 28px; }
        .theme-preview b {
          position: absolute; right: 6px; top: 6px; z-index: 3; display: flex; height: 23px; width: 23px;
          align-items: center; justify-content: center; border-radius: 999px; background: white; color: #a855f7; font-size: 11px;
        }

        input[type="range"] { accent-color: #ec4899; cursor: pointer; }
        .preview-orb, .payment-orb, .final-orb { position: absolute; border-radius: 999px; filter: blur(80px); }
        .preview-orb-one { width: 350px; height: 350px; left: -100px; top: 10%; background: #f9a8d4; }
        .preview-orb-two { width: 400px; height: 400px; right: -120px; bottom: 5%; background: #c4b5fd; }
        .payment-one { width: 350px; height: 350px; background: #f9a8d4; left: -120px; top: 10%; }
        .payment-two { width: 400px; height: 400px; background: #c4b5fd; right: -130px; bottom: 5%; }

        @keyframes pageEnter {
          from { opacity: 0; transform: scale(0.95) translateY(20px); filter: blur(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
        }
        .page-enter { animation: pageEnter 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; }

        @keyframes heroZoom {
          0% { transform: scale(1.15); filter: blur(10px); }
          100% { transform: scale(1); filter: blur(0); }
        }
        .hero-zoom { animation: heroZoom 1.2s cubic-bezier(0.16, 1, 0.3, 1) both; }

        @keyframes textReveal {
          from { opacity: 0; transform: translateY(30px); filter: blur(5px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        .text-reveal { animation: textReveal 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both; }

        @keyframes polaroidFloat {
          0%, 100% { transform: rotate(-3deg) translateY(0); }
          50% { transform: rotate(-1deg) translateY(-8px); }
        }
        .polaroid-float { animation: polaroidFloat 4s ease-in-out infinite; }
        .font-hand { font-family: cursive; }
      `}</style>
    </main>
  );
}

function Sparkles({ light = false }: { light?: boolean }) {
  const items = [
    ["✦", "12%", "18%", "1s"],
    ["✧", "82%", "14%", "2s"],
    ["·", "25%", "32%", "0.5s"],
    ["✦", "72%", "38%", "1.5s"],
    ["♡", "15%", "70%", "2.5s"],
    ["✧", "88%", "72%", "1.2s"],
  ];
  return (
    <>
      {items.map(([symbol, left, top, delay], index) => (
        <span key={index} className="sparkle" style={{ left, top, animationDelay: delay, color: light ? "rgba(255,255,255,.8)" : undefined }}>
          {symbol}
        </span>
      ))}
    </>
  );
}

function TextInput({ label, placeholder, value, onChange, type = "text" }: { label: string; placeholder: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="modern-input w-full" />
    </div>
  );
}

function PhotoSlider({ label, value, min, max, step, display, onChange }: { label: string; value: number; min: number; max: number; step: number; display: string; onChange: (value: number) => void }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-xs font-black uppercase tracking-[0.15em] text-black/45">{label}</label>
        <span className="rounded-full bg-black/5 px-3 py-1 text-[10px] font-black text-black/45">{display}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full" />
    </div>
  );
}