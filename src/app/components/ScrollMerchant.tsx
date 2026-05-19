"use client";
import React, { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Bell, Star, Gift, TrendingUp, Stamp, type LucideIcon } from "lucide-react";

const FEATURE_ICONS: LucideIcon[] = [Stamp, Bell, TrendingUp, Star];

/* ─── Flying cards data ─── */
const CARDS = [
  { icon:"⭐", bg:"rgba(245,158,11,.14)", title:"Nouvel avis Google ★★★★★", sub:"Marie a laissé 5 étoiles · +1 récompense créditée." },
  { icon:"🔔", bg:"rgba(58,128,240,.13)",  title:"Rappel de visite envoyé",    sub:"12 clients relancés sans effort." },
  { icon:"🎁", bg:"rgba(46,204,113,.13)",  title:"3 récompenses à distribuer", sub:"Vos clients réguliers en attente." },
  { icon:"👤", bg:"rgba(58,128,240,.13)",  title:"Marie a tamponné",            sub:"Votre commerce · il y a 2 min" },
  { icon:"🏆", bg:"rgba(245,158,11,.14)", title:"Paul a reçu un reward",       sub:"10 tampons accomplis 🎉" },
  { icon:"💬", bg:"rgba(46,204,113,.13)", title:"Ana a laissé un avis",        sub:"« Service impeccable ! » · 5 ★" },
  { icon:"📈", bg:"rgba(58,128,240,.13)", title:"Visites en hausse +12%",      sub:"Record cette semaine." },
  { icon:"🔥", bg:"rgba(220,38,38,.11)",  title:"Heure creuse détectée",       sub:"Mardi 19h–21h · Envoyer une notif ?" },
  { icon:"✅", bg:"rgba(46,204,113,.13)", title:"Notification envoyée",        sub:"20 clients · Taux ouverture 68%" },
];
const ANIMS = ["qfly-left","qfly-up","qfly-upleft","qfly-upright","qfly-downleft","qfly-right"];

/* ─── Dashboard inside phone ─── */
function PhoneDashboard() {
  return (
    <div style={{ width:"100%", height:"100%", display:"flex", flexDirection:"column", background:"#ede8df", borderRadius:44, overflow:"hidden", fontFamily:"Sora,sans-serif" }}>
      {/* status bar */}
      <div style={{ height:42, background:"#0c1424", display:"flex", alignItems:"flex-end", justifyContent:"space-between", padding:"0 24px 8px", flexShrink:0, position:"relative" }}>
        <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)", width:98, height:30, background:"#050a12", borderRadius:"0 0 22px 22px" }} />
        <span style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,.9)", zIndex:1 }}>9:41</span>
        <div style={{ zIndex:1, display:"flex", gap:5, alignItems:"center" }}>
          <svg width="15" height="10" viewBox="0 0 15 10" fill="none"><rect x="0" y="4" width="2.5" height="6" rx=".6" fill="rgba(255,255,255,.4)"/><rect x="3.5" y="2.5" width="2.5" height="7.5" rx=".6" fill="rgba(255,255,255,.55)"/><rect x="7" y="1" width="2.5" height="9" rx=".6" fill="rgba(255,255,255,.75)"/><rect x="10.5" y="0" width="2.5" height="10" rx=".6" fill="white"/></svg>
          <svg width="24" height="10" viewBox="0 0 24 10" fill="none"><rect x=".5" y=".5" width="20" height="9" rx="2.5" stroke="rgba(255,255,255,.45)" strokeWidth="1"/><rect x="2" y="2" width="15" height="6" rx="1.3" fill="white"/><path d="M22 3.3V6.7C23.1 6.3 23.1 3.7 22 3.3Z" fill="rgba(255,255,255,.45)"/></svg>
        </div>
      </div>
      {/* header */}
      <div style={{ background:"#0c1424", padding:"12px 18px 20px", flexShrink:0, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(74,158,255,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(74,158,255,.08) 1px,transparent 1px)", backgroundSize:"22px 22px" }} />
        <div style={{ position:"absolute", width:130, height:130, borderRadius:"50%", background:"radial-gradient(circle,rgba(44,123,229,.3) 0%,transparent 68%)", top:-45, right:-15 }} />
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", position:"relative", zIndex:2, marginBottom:20 }}>
          <div style={{ display:"flex", alignItems:"center", gap:13 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-qarta.png" alt="Qarta" style={{ width:54, height:54, borderRadius:15, objectFit:"cover", border:"1px solid rgba(120,180,255,.25)", flexShrink:0 }} />
            <div>
              <div style={{ fontSize:20, fontWeight:800, color:"#fff", lineHeight:1.1, letterSpacing:"-.02em" }}>Votre commerce</div>
              <div style={{ display:"flex", alignItems:"center", gap:5, marginTop:4, fontSize:11, color:"rgba(255,255,255,.5)", fontWeight:500 }}>
                <div style={{ width:7, height:7, borderRadius:"50%", background:"#2ecc71", boxShadow:"0 0 7px rgba(46,204,113,.8)", flexShrink:0 }} />
                Connecté · Plan Pro
              </div>
            </div>
          </div>
          <div style={{ width:42, height:42, borderRadius:13, background:"rgba(255,255,255,.07)", border:"1px solid rgba(255,255,255,.1)", display:"flex", alignItems:"center", justifyContent:"center", position:"relative", flexShrink:0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            <div style={{ position:"absolute", top:-5, right:-5, width:18, height:18, borderRadius:"50%", background:"#e53935", border:"2.5px solid #0c1424", display:"flex", alignItems:"center", justifyContent:"center", fontSize:8.5, fontWeight:900, color:"#fff" }}>3</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:10, position:"relative", zIndex:2 }}>
          {[{ n:"47", l:"Clients carte" }, { n:"18", l:"Récompenses" }].map(s => (
            <div key={s.l} style={{ flex:1, background:"rgba(6,12,26,.55)", border:"1px solid rgba(255,255,255,.06)", borderRadius:16, padding:"16px 16px 14px" }}>
              <div style={{ fontSize:34, fontWeight:900, color:"#fff", lineHeight:1, marginBottom:6, letterSpacing:"-.03em" }}>{s.n}</div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,.4)", fontWeight:500 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
      {/* body */}
      <div style={{ flex:1, overflowY:"auto", background:"#ede8df", padding:"14px 14px 80px" }}>
        {/* Google CTA */}
        <div style={{ background:"#121f3a", borderRadius:16, padding:"14px 14px 14px 16px", display:"flex", alignItems:"center", gap:11, marginBottom:12 }}>
          <svg width="28" height="28" viewBox="0 0 48 48" style={{ flexShrink:0 }}><circle cx="24" cy="24" r="24" fill="white"/><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
          <div style={{ flex:1, fontSize:13, fontWeight:700, color:"#fff", lineHeight:1.3 }}>Demander un avis<br/>Google</div>
          <div style={{ background:"#7a4e12", borderRadius:10, padding:"6px 9px", fontSize:10.5, fontWeight:800, color:"#f0a830", whiteSpace:"nowrap", flexShrink:0 }}>+5 pts<br/>offerts</div>
        </div>
        {/* Tabs */}
        <div style={{ background:"#fff", borderRadius:14, padding:4, display:"flex", marginBottom:12 }}>
          {["Aujourd'hui","7 jours","30 jours"].map((t,i) => (
            <div key={t} style={{ flex:1, textAlign:"center", padding:"9px 4px", borderRadius:11, fontSize:11.5, fontWeight:700, cursor:"pointer", background: i===0 ? "#111" : "transparent", color: i===0 ? "#fff" : "#9096a4" }}>{t}</div>
          ))}
        </div>
        {/* KPI grid */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
          {[
            { n:"6", l:"Clients aujourd'hui", pill:"↑ +3 vs hier", up:true },
            { n:"9", l:"Tampons ajoutés",      pill:"↑ +4 vs hier", up:true },
            { n:"1", l:"Récompenses",           pill:"= même qu'hier", up:false },
            { n:"2", l:"Nouveaux clients",      pill:"↑ +2 vs hier", up:true },
          ].map(k => (
            <div key={k.l} style={{ background:"#111d35", borderRadius:18, padding:"16px 14px 14px" }}>
              <div style={{ fontSize:40, fontWeight:900, color:"#4a9eff", lineHeight:1, marginBottom:6, letterSpacing:"-.03em" }}>{k.n}</div>
              <div style={{ fontSize:11.5, fontWeight:500, color:"#fff", lineHeight:1.35, marginBottom:12 }}>{k.l}</div>
              <span style={{ display:"inline-flex", alignItems:"center", padding:"4px 10px", borderRadius:20, fontSize:10, fontWeight:700, background: k.up ? "rgba(46,204,113,.1)" : "rgba(144,150,164,.1)", color: k.up ? "#2ecc71" : "#9096a4", border: `1.5px solid ${k.up ? "rgba(46,204,113,.35)" : "rgba(144,150,164,.3)"}` }}>{k.pill}</span>
            </div>
          ))}
        </div>
        {/* Graph */}
        <div style={{ background:"#fff", borderRadius:18, padding:"15px 14px" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
            <span style={{ fontSize:13, fontWeight:800, color:"#111" }}>Évolution des tampons</span>
            <div style={{ display:"flex", gap:7 }}>
              <div style={{ padding:"6px 13px", borderRadius:20, fontSize:10.5, fontWeight:700, background:"#3a80f0", color:"#fff" }}>7j</div>
              <div style={{ padding:"6px 13px", borderRadius:20, fontSize:10.5, fontWeight:700, border:"1.5px solid #d5d0c8", color:"#9096a4" }}>Mois</div>
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"flex-end", gap:6, height:48 }}>
            {[{h:"32%",t:"lo"},{h:"48%",t:"lo"},{h:"65%",t:"hi"},{h:"40%",t:"lo"},{h:"78%",t:"hi"},{h:"55%",t:"lo"},{h:"100%",t:"pk"}].map((b,i) => (
              <div key={i} style={{ flex:1, borderRadius:"5px 5px 0 0", height:b.h, background: b.t==="pk" ? "#4a9eff" : b.t==="hi" ? "#2c7be5" : "rgba(44,123,229,.2)", boxShadow: b.t==="pk" ? "0 0 10px rgba(74,158,255,.45)" : undefined }} />
            ))}
          </div>
        </div>
      </div>
      {/* bottom nav */}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:76, background:"#fff", borderTop:"1px solid rgba(0,0,0,.06)", display:"flex", alignItems:"center", padding:"0 14px 6px", zIndex:30, borderRadius:"0 0 44px 44px" }}>
        <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3a80f0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span style={{ fontSize:9.5, fontWeight:600, color:"#3a80f0" }}>Accueil</span>
        </div>
        <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icone-qr.png" alt="Scanner" style={{ width:52, height:52, objectFit:"contain" }} />
          <span style={{ fontSize:9.5, fontWeight:600, color:"#9096a4" }}>Scanner</span>
        </div>
        <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9096a4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <span style={{ fontSize:9.5, fontWeight:600, color:"#9096a4" }}>Historique</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Main component ─── */
interface Props {
  content?: Record<string, unknown>;
}

export default function ScrollMerchant({ content }: Props) {
  const c = content ?? {};
  const badge         = (c.badge         as string)   ?? "Chapitre 03 · Commerçant";
  const title         = (c.title         as string)   ?? "Un outil";
  const accent        = (c.accent        as string)   ?? "puissant";
  const suffix        = (c.suffix        as string)   ?? "et simple.";
  const subtitle      = (c.subtitle      as string)   ?? "Créez un programme de fidélité pour faire revenir vos clients, envoyer des rappels automatiques et analyser vos ventes. Identifiez vos heures creuses et augmentez votre chiffre d'affaires depuis un tableau de bord simple.";
  const featureLabels = (c.featureLabels as string[]) ?? ["Tampons & récompenses", "Notifications automatiques", "Statistiques en temps réel", "Avis Google intégrés"];

  const ref        = useRef<HTMLElement>(null);
  const sceneRef   = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const ciRef      = useRef(0);
  const aiRef      = useRef(0);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const phoneY      = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const phoneRotate = useTransform(scrollYProgress, [0, 1], [-2, 4]);

  useEffect(() => {
    /* inject keyframes once */
    if (!document.getElementById("qfly-styles")) {
      const style = document.createElement("style");
      style.id = "qfly-styles";
      style.textContent = `
        @keyframes qfly-left      { 0%{opacity:0;transform:translateX(0) translateY(0) scale(.68) rotate(-3deg);}12%{opacity:1;transform:translateX(-22px) translateY(-10px) scale(1) rotate(-1deg);}80%{opacity:1;}100%{opacity:0;transform:translateX(-380px) translateY(-20px) scale(.9) rotate(-5deg);} }
        @keyframes qfly-up        { 0%{opacity:0;transform:translateX(0) translateY(0) scale(.68) rotate(1deg);}12%{opacity:1;transform:translateX(10px) translateY(-22px) scale(1) rotate(0deg);}80%{opacity:1;}100%{opacity:0;transform:translateX(18px) translateY(-360px) scale(.9) rotate(2deg);} }
        @keyframes qfly-upleft    { 0%{opacity:0;transform:translateX(0) translateY(0) scale(.68) rotate(-4deg);}12%{opacity:1;transform:translateX(-15px) translateY(-15px) scale(1) rotate(-2deg);}80%{opacity:1;}100%{opacity:0;transform:translateX(-290px) translateY(-270px) scale(.85) rotate(-8deg);} }
        @keyframes qfly-upright   { 0%{opacity:0;transform:translateX(0) translateY(0) scale(.68) rotate(3deg);}12%{opacity:1;transform:translateX(15px) translateY(-15px) scale(1) rotate(1.5deg);}80%{opacity:1;}100%{opacity:0;transform:translateX(240px) translateY(-250px) scale(.87) rotate(6deg);} }
        @keyframes qfly-downleft  { 0%{opacity:0;transform:translateX(0) translateY(0) scale(.68) rotate(2deg);}12%{opacity:1;transform:translateX(-14px) translateY(12px) scale(1) rotate(1deg);}80%{opacity:1;}100%{opacity:0;transform:translateX(-320px) translateY(140px) scale(.87) rotate(7deg);} }
        @keyframes qfly-right     { 0%{opacity:0;transform:translateX(0) translateY(0) scale(.68) rotate(-2deg);}12%{opacity:1;transform:translateX(18px) translateY(-6px) scale(1) rotate(-1deg);}80%{opacity:1;}100%{opacity:0;transform:translateX(320px) translateY(15px) scale(.9) rotate(5deg);} }
      `;
      document.head.appendChild(style);
    }

    function spawn() {
      const scene = overlayRef.current;
      if (!scene) return;
      const d    = CARDS[ciRef.current % CARDS.length];
      const anim = ANIMS[aiRef.current % ANIMS.length];
      ciRef.current++; aiRef.current++;

      const rect = scene.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const ox = (Math.random() - .5) * 180;
      const oy = (Math.random() - .5) * 160;

      const el = document.createElement("div");
      el.style.cssText = `position:absolute;background:#fff;border-radius:16px;box-shadow:0 12px 40px rgba(0,0,0,.14),0 0 0 1px rgba(0,0,0,.04);padding:12px 14px;display:flex;align-items:center;gap:10px;width:220px;opacity:0;pointer-events:none;font-family:Sora,sans-serif;`;
      el.style.left = (cx + ox - 110) + "px";
      el.style.top  = (cy + oy) + "px";
      el.innerHTML  = `<div style="width:40px;height:40px;border-radius:11px;background:${d.bg};display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">${d.icon}</div><div style="flex:1;min-width:0"><div style="font-size:11px;font-weight:700;color:#0f1828;margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${d.title}</div><div style="font-size:9px;color:#6b7280;line-height:1.4">${d.sub}</div></div>`;

      const dur = 3000 + Math.random() * 1000;
      el.style.animation = `${anim} ${dur}ms cubic-bezier(.22,.61,.36,1) forwards`;
      scene.appendChild(el);
      setTimeout(() => el.remove(), dur + 150);
    }

    let interval: ReturnType<typeof setInterval> | null = null;
    let active = false;

    function startSpawning() {
      if (active) return;
      active = true;
      let t = 0;
      for (let i = 0; i < 4; i++) {
        setTimeout(spawn, t);
        t += 420 + Math.random() * 300;
      }
      interval = setInterval(() => {
        spawn();
        if (Math.random() > .5) setTimeout(spawn, 280 + Math.random() * 250);
      }, 1400);
    }

    function stopSpawning() {
      if (!active) return;
      active = false;
      if (interval) { clearInterval(interval); interval = null; }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries[0].isIntersecting ? startSpawning() : stopSpawning();
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);

    return () => {
      stopSpawning();
      observer.disconnect();
    };
  }, []);

  return (
    <section ref={ref} id="merchant" data-testid="scroll-merchant" className="relative overflow-hidden" style={{ background: "#0b1220" }}>
      <div className="flex items-center py-20 lg:py-28">
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10 w-full grid lg:grid-cols-12 gap-12 items-center">

          {/* ── Left: text ── */}
          <div className="lg:col-span-5">
            <span className="inline-block px-3 py-1 rounded-full bg-white/8 text-[#4a9eff] text-[11px] font-semibold tracking-[0.18em] uppercase border border-white/10">
              {badge}
            </span>
            <h2 className="mt-6 font-display text-white" style={{ fontSize:"clamp(2.3rem,5vw,4.2rem)", lineHeight:1.02, letterSpacing:"0.06em", fontWeight:600 }}>
              {title}{" "}<span className="text-[#4a9eff]">{accent}</span><br />{suffix}
            </h2>
            <p className="mt-6 text-white/70 text-[17px] leading-relaxed max-w-lg">{subtitle}</p>
            <div className="mt-8 grid grid-cols-2 gap-3 max-w-md">
              {featureLabels.slice(0,4).map((label, idx) => {
                const Icon = FEATURE_ICONS[idx % FEATURE_ICONS.length];
                return (
                  <div key={label} className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 border border-[#faf8f4]/40 backdrop-blur-sm">
                    <div className="w-9 h-9 rounded-xl bg-[#4a9eff]/15 flex items-center justify-content-center flex items-center justify-center">
                      {idx === 0 ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="#4a9eff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width:18, height:18 }}><path d="M5 13l4 4L19 7"/></svg>
                      ) : idx === 3 ? (
                        <svg viewBox="0 0 24 24" style={{ width:18, height:18 }}>
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                      ) : (
                        <Icon size={16} color="#4a9eff" strokeWidth={2} />
                      )}
                    </div>
                    <span className="text-[13px] font-medium text-white/85">{label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Right: phone + flying cards ── */}
          <div
            ref={sceneRef}
            className="lg:col-span-7 relative flex items-center justify-center"
            data-testid="merchant-phone-stage"
            style={{ minHeight:680 }}
          >
            {/* overlay for flying cards — above the phone */}
            <div ref={overlayRef} style={{ position:"absolute", inset:0, zIndex:20, pointerEvents:"none" }} />

            <motion.div style={{ y: phoneY, rotate: phoneRotate }} className="relative z-10">
              {/* phone shell */}
              <div style={{ width:300, height:640, background:"#0b1322", borderRadius:52, padding:10, border:"1.5px solid rgba(80,140,255,.2)", position:"relative" }}>
                {/* side buttons */}
                <div style={{ position:"absolute", right:-3.5, top:120, width:3.5, height:64, background:"#18253a", borderRadius:"0 3px 3px 0" }} />
                <div style={{ position:"absolute", left:-3.5, top:90,  width:3.5, height:28, background:"#18253a", borderRadius:"3px 0 0 3px" }} />
                <div style={{ position:"absolute", left:-3.5, top:128, width:3.5, height:54, background:"#18253a", borderRadius:"3px 0 0 3px" }} />
                <div style={{ position:"absolute", left:-3.5, top:192, width:3.5, height:54, background:"#18253a", borderRadius:"3px 0 0 3px" }} />
                <PhoneDashboard />
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
