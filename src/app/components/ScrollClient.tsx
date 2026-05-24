"use client";
import React, { useRef, useEffect } from "react";
import { QrCode, Home, Wallet, Sparkles, type LucideIcon } from "lucide-react";

interface Props {
  content?: Record<string, unknown>;
}

const FEATURE_ICONS: LucideIcon[] = [QrCode, Wallet, Sparkles, Home];

/* ─── Animation logic (vanilla JS, scoped to stage container) ─── */
function startAnim(stage: HTMLDivElement, cv: HTMLCanvasElement, visibleRef: React.MutableRefObject<boolean>) {
  const q = (id: string) => stage.querySelector<HTMLElement>("#" + id)!;
  const wait = (ms: number, fn: () => void) => setTimeout(fn, ms);
  const ss = (el: HTMLElement, css: Partial<CSSStyleDeclaration>) => Object.assign(el.style, css);

  /* canvas sizing */
  const ctx = cv.getContext("2d")!;
  let W = 0, H = 0;
  function resize() {
    const r = stage.getBoundingClientRect();
    W = cv.width  = r.width;
    H = cv.height = r.height;
  }
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(stage);

  /* confetti */
  type Pt = { x:number;y:number;vx:number;vy:number;life:number;decay:number;grav:number;c:string;dust:boolean;w?:number;h?:number;rot?:number;rs?:number;r?:number };
  const pts: Pt[] = [];
  function burst(cx: number, cy: number) {
    for (let i = 0; i < 55; i++) {
      const a = Math.random()*Math.PI*2, sp = 2.5+Math.random()*10;
      pts.push({ x:cx+(Math.random()-.5)*55, y:cy+(Math.random()-.5)*35, vx:Math.cos(a)*sp+(Math.random()<.5?-1:1)*1.5, vy:Math.sin(a)*sp-2.5, life:1, decay:.012+Math.random()*.018, w:3+Math.random()*11, h:2+Math.random()*7, rot:Math.random()*Math.PI*2, rs:(Math.random()-.5)*.14, grav:.065+Math.random()*.055, c:`hsl(${28+~~(Math.random()*18)},${16+~~(Math.random()*18)}%,${76+~~(Math.random()*18)}%)`, dust:false });
    }
    for (let i = 0; i < 80; i++) {
      const a = Math.random()*Math.PI*2, sp = .4+Math.random()*4.5;
      pts.push({ x:cx+(Math.random()-.5)*90, y:cy+(Math.random()-.5)*65, vx:Math.cos(a)*sp, vy:Math.sin(a)*sp-.4, life:1, decay:.007+Math.random()*.013, r:.4+Math.random()*2.2, grav:.025, c:`rgba(${170+~~(Math.random()*80)},${130+~~(Math.random()*65)},${70+~~(Math.random()*65)},.75)`, dust:true });
    }
  }
  function frame() {
    ctx.clearRect(0,0,W,H);
    for (let i = pts.length-1; i >= 0; i--) {
      const p = pts[i];
      p.x+=p.vx; p.y+=p.vy; p.vy+=p.grav; p.vx*=.984; p.vy*=.992;
      if (!p.dust) p.rot = (p.rot??0)+(p.rs??0);
      p.life-=p.decay;
      if (p.life <= 0) { pts.splice(i,1); continue; }
      ctx.save();
      ctx.globalAlpha = Math.min(p.life,1)*Math.min(p.life*3,1);
      if (p.dust) {
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r??1,0,Math.PI*2);
        ctx.fillStyle=p.c; ctx.fill();
      } else {
        ctx.translate(p.x,p.y); ctx.rotate(p.rot??0);
        ctx.fillStyle=p.c; ctx.fillRect(-(p.w??4)/2,-(p.h??4)/2,p.w??4,p.h??4);
      }
      ctx.restore();
    }
    if (pts.length) requestAnimationFrame(frame);
  }

  /* easing + tween */
  function easeOutBack(t: number) { const c1=1.70158,c3=c1+1; return 1+c3*Math.pow(t-1,3)+c1*Math.pow(t-1,2); }
  function lerp(a: number, b: number, t: number) { return a+(b-a)*t; }
  function tween(el: HTMLElement, from: {opacity?:number;scale?:number;translateY?:number}, to: {opacity?:number;scale?:number;translateY?:number}, dur: number, ease: (t:number)=>number, cb?: ()=>void) {
    const start = performance.now();
    function step(now: number) {
      const t = Math.min((now-start)/dur,1), e = ease(t);
      if (from.opacity    !== undefined) el.style.opacity   = String(lerp(from.opacity,   to.opacity!,   e));
      let tr = "";
      if (from.scale      !== undefined) tr += `scale(${lerp(from.scale,      to.scale!,      e)}) `;
      if (from.translateY !== undefined) tr += `translateY(${lerp(from.translateY, to.translateY!, e)}px)`;
      if (tr) el.style.transform = tr.trim();
      if (t < 1) requestAnimationFrame(step); else cb?.();
    }
    requestAnimationFrame(step);
  }

  const CX = W/2, CY = H/2;

  /* ── reset all elements to initial state ── */
  function reset() {
    const snap = (el: HTMLElement, css: Partial<CSSStyleDeclaration>) => {
      el.style.transition = "none"; el.style.animation = "";
      Object.assign(el.style, css);
    };
    snap(q("anim-cw"),    { opacity:"0", transform:"scale(0.88) translateY(18px)" });
    snap(q("anim-hl"),    { transform:"", opacity:"1" });
    snap(q("anim-hr"),    { transform:"", opacity:"1" });
    snap(q("anim-crack"), { opacity:"0" });
    ["anim-co0","anim-co1","anim-co2","anim-co3","anim-co4",
     "anim-cn0","anim-cn1","anim-cn2"].forEach(id => {
      snap(q(id), { opacity:"0", transform:"translateY(12px)" });
    });
    snap(q("anim-pw"),    { opacity:"0", transform:"scale(0.04)" });
    snap(q("anim-qLogo"), { opacity:"0" });
    snap(q("anim-dots"),  { opacity:"0" });
    q("anim-tag").style.opacity = "0";
    snap(q("anim-scan"),  { opacity:"0" });
    ["anim-tw0","anim-tw1","anim-tw2"].forEach(id => {
      snap(q(id), { opacity:"0", transform:"translateY(14px)" });
    });
  }

  /* ── one full run, calls onDone when phone is floating ── */
  function runOnce(onDone: () => void) {
  wait(300, () => {
    tween(q("anim-cw"), {opacity:0,scale:.88,translateY:18}, {opacity:1,scale:1,translateY:0}, 700, easeOutBack, () => {

      /* caption "Fini les cartes en papier." */
      ["anim-co0","anim-co1","anim-co2","anim-co3","anim-co4"].forEach((id,i) => {
        wait(i*120, () => {
          const el = q(id);
          el.style.transition = "opacity .45s ease, transform .45s ease";
          el.style.opacity = "1"; el.style.transform = "translateY(0)";
        });
      });

      /* shake */
      wait(900, () => {
        const cw = q("anim-cw");
        cw.style.animation = "qhero-shake .55s ease-in-out";
        cw.addEventListener("animationend", () => { cw.style.animation = ""; }, { once: true });

        /* crack */
        wait(180, () => {
          ss(q("anim-crack"), { opacity:"1", transition:"opacity .12s" });

          /* burst + halves fly */
          wait(220, () => {
            burst(CX, CY); requestAnimationFrame(frame);
            wait(60, () => {
              const hl = q("anim-hl"), hr = q("anim-hr");
              hl.style.transition = "transform .75s cubic-bezier(.22,.68,0,1.2), opacity .6s .15s";
              hr.style.transition = "transform .75s cubic-bezier(.22,.68,0,1.2), opacity .6s .15s";
              hl.style.transform = "translateX(-900px) rotate(-22deg)";
              hr.style.transform = "translateX(900px) rotate(22deg)";
              hl.style.opacity = "0"; hr.style.opacity = "0";
              ss(q("anim-crack"), { opacity:"0", transition:"opacity .3s" });

              /* fade old caption */
              wait(300, () => {
                ["anim-co0","anim-co1","anim-co2","anim-co3","anim-co4"].forEach((id,i) => {
                  wait(i*60, () => {
                    const el = q(id);
                    el.style.transition = "opacity .3s, transform .3s";
                    el.style.opacity = "0"; el.style.transform = "translateY(-12px)";
                  });
                });

                /* "Place au digital." */
                wait(450, () => {
                  ["anim-cn0","anim-cn1","anim-cn2"].forEach((id,i) => {
                    wait(i*130, () => {
                      const el = q(id);
                      el.style.transition = "opacity .5s ease, transform .5s ease";
                      el.style.opacity = "1"; el.style.transform = "translateY(0)";
                    });
                  });

                  /* phone materializes */
                  wait(600, () => {
                    const pw = q("anim-pw");
                    pw.style.transition = "opacity .8s ease, transform .9s cubic-bezier(.34,1.56,.64,1)";
                    pw.style.opacity = "1"; pw.style.transform = "scale(1)";

                    wait(600, () => {
                      const ql = q("anim-qLogo");
                      ql.style.transition = "opacity .5s ease"; ql.style.opacity = "1";

                      wait(500, () => {
                        const dots = q("anim-dots");
                        dots.style.transition = "opacity .4s ease"; dots.style.opacity = "1";
                        const sc = q("anim-scan");
                        sc.style.opacity = "1"; sc.style.animation = "qhero-scan 2s linear infinite";

                        wait(700, () => {
                          dots.style.opacity = "0";
                          q("anim-tag").style.opacity = "1";
                          ["anim-tw0","anim-tw1","anim-tw2"].forEach((id,i) => {
                            wait(i*120, () => {
                              const el = q(id);
                              el.style.transition = "opacity .45s ease, transform .45s ease";
                              el.style.opacity = "1"; el.style.transform = "translateY(0)";
                            });
                          });
                          wait(600, () => {
                            pw.style.transition = "none";
                            pw.style.animation = "qhero-float 5s ease-in-out infinite";
                            onDone();
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
  } /* end runOnce */

  /* ── loop: fade out → reset → replay ── */
  function loop() {
    runOnce(() => {
      wait(3000, () => {
        /* fade out phone + new caption */
        const pw = q("anim-pw");
        pw.style.transition = "opacity .6s ease";
        pw.style.animation  = "";
        pw.style.opacity    = "0";
        ["anim-cn0","anim-cn1","anim-cn2"].forEach(id => {
          const el = q(id);
          el.style.transition = "opacity .4s ease";
          el.style.opacity    = "0";
        });
        /* after fade, snap back and restart only when visible */
        wait(700, () => {
          reset();
          function tryLoop() {
            if (visibleRef.current) { loop(); } else { wait(300, tryLoop); }
          }
          tryLoop();
        });
      });
    });
  }

  loop();
}

/* ─── Card content sub-components ─── */
const BARS = [28,15,28,13,26,18,28,11,28,20,22,28,13,25,19,28];

function PaperCardInner() {
  return (
    <div style={{ width:"100%", height:"100%", borderRadius:14, background:"linear-gradient(140deg,#f7f2ea,#ede6d6 45%,#e8dfc8)", position:"relative", overflow:"hidden" }}>
      {/* grid texture */}
      <div style={{ position:"absolute", inset:0, borderRadius:14, backgroundImage:"repeating-linear-gradient(0deg,rgba(0,0,0,.025) 0,rgba(0,0,0,.025) 1px,transparent 1px,transparent 22px),repeating-linear-gradient(90deg,rgba(0,0,0,.025) 0,rgba(0,0,0,.025) 1px,transparent 1px,transparent 22px)" }} />
      {/* top */}
      <div style={{ position:"absolute", top:0, left:0, right:0, padding:"16px 22px 12px", borderBottom:"1px solid rgba(100,75,40,.18)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
          <span style={{ fontSize:7.5, fontWeight:700, letterSpacing:4, textTransform:"uppercase", color:"#7a6040" }}>Boutique</span>
          <span style={{ fontSize:18, fontWeight:700, color:"#3d2a10", lineHeight:1 }}>Le Comptoir</span>
        </div>
        <div style={{ width:52, height:52, border:"2px solid rgba(120,90,45,.5)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", transform:"rotate(-14deg)", position:"relative", flexShrink:0 }}>
          <span style={{ fontSize:6, fontWeight:700, color:"#7a6040", textTransform:"uppercase", letterSpacing:1.5, textAlign:"center", lineHeight:1.4 }}>Valide<br/>2024</span>
        </div>
      </div>
      {/* mid */}
      <div style={{ position:"absolute", top:"50%", left:0, right:0, transform:"translateY(-54%)", display:"flex", flexDirection:"column", alignItems:"center", gap:6, padding:"0 22px" }}>
        <span style={{ fontSize:9, fontWeight:700, letterSpacing:5, textTransform:"uppercase", color:"#9b7f58" }}>Programme</span>
        <span style={{ fontSize:22, fontWeight:700, color:"#2e1e08", textAlign:"center", lineHeight:1.1 }}>Carte de<br/>Fidélité</span>
        <div style={{ width:40, height:1.5, background:"linear-gradient(90deg,transparent,rgba(120,90,45,.38),transparent)", margin:"2px 0" }} />
        <div style={{ display:"flex", gap:4 }}>
          {Array.from({length:8}).map((_,i) => (
            <div key={i} style={{ width:22, height:22, border:`1.5px solid rgba(120,90,45,${i<5?.7:.48})`, borderRadius:4, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:"#7a6040", background: i<5 ? "rgba(120,90,45,.16)" : undefined }}>★</div>
          ))}
        </div>
      </div>
      {/* bottom */}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"10px 22px", borderTop:"1px solid rgba(100,75,40,.14)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <span style={{ fontSize:8, letterSpacing:2.5, color:"#9b7f58", fontFamily:"Courier New,monospace" }}>N° 4821·7634·0012·8845</span>
        <div style={{ display:"flex", gap:1.5, alignItems:"flex-end", height:28 }}>
          {BARS.map((h,i) => <span key={i} style={{ display:"block", background:"#5a3f26", borderRadius:.5, height:h, width: h>21 ? 2 : 1.5 }} />)}
        </div>
      </div>
    </div>
  );
}

/* ─── Main component ─── */
export default function ScrollClient({ content }: Props) {
  const c = content ?? {};
  const badge         = (c.badge        as string)   ?? "Chapitre 02 · Expérience Client";
  const titleLine1    = (c.titleLine1   as string)   ?? "Simple.";
  const titleLine2    = (c.titleLine2   as string)   ?? "Écologique.";
  const titleLine3    = (c.titleLine3   as string)   ?? "Efficace.";
  const subtitle      = (c.subtitle     as string)   ?? "Papiers froissés au fond du portefeuille… Toutes vos cartes de fidélité, instantanément réunies, organisées, et prêtes à l'emploi.";
  const featureLabels = (c.featureLabels as string[]) ?? ["QR code unique", "Google & Apple Wallet", "Récompenses auto", "Vos commerces préférés"];

  const stageRef    = useRef<HTMLDivElement>(null);
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const animStarted = useRef(false);
  const visibleRef  = useRef(false);

  useEffect(() => {
    /* inject keyframes once */
    if (!document.getElementById("qhero-styles")) {
      const style = document.createElement("style");
      style.id = "qhero-styles";
      style.textContent = `
        @keyframes qhero-shake{0%,100%{transform:translate(0,0) rotate(0deg)}10%{transform:translate(-7px,-2px) rotate(-1.5deg)}20%{transform:translate(8px,2px) rotate(1.7deg)}30%{transform:translate(-6px,-1px) rotate(-1.2deg)}40%{transform:translate(8px,2px) rotate(1.4deg)}50%{transform:translate(-5px,0) rotate(-.9deg)}60%{transform:translate(6px,1px) rotate(.9deg)}70%{transform:translate(-4px,0) rotate(-.6deg)}80%{transform:translate(4px,0) rotate(.45deg)}90%{transform:translate(-1px,0) rotate(-.2deg)}}
        @keyframes qhero-scan{from{top:0}to{top:100%}}
        @keyframes qhero-float{0%{transform:scale(1) translateY(0) rotate(0deg)}25%{transform:scale(1.012) translateY(-8px) rotate(.45deg)}50%{transform:scale(1) translateY(-13px) rotate(0deg)}75%{transform:scale(.989) translateY(-8px) rotate(-.45deg)}100%{transform:scale(1) translateY(0) rotate(0deg)}}
        @keyframes qhero-glow{0%,100%{opacity:.5;transform:translate(-50%,-56%) scale(1)}50%{opacity:1;transform:translate(-50%,-56%) scale(1.2)}}
        @keyframes qhero-dot{0%,100%{opacity:.2;transform:scale(.8)}50%{opacity:1;transform:scale(1.2)}}
        .qhero-paused *{animation-play-state:paused !important;}
      `;
      document.head.appendChild(style);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries[0].isIntersecting;
        visibleRef.current = visible;
        /* pause / resume CSS animations */
        stageRef.current?.classList.toggle("qhero-paused", !visible);
        /* start on first visibility */
        if (visible && !animStarted.current) {
          animStarted.current = true;
          if (stageRef.current && canvasRef.current) {
            startAnim(stageRef.current, canvasRef.current, visibleRef);
          }
        }
      },
      { threshold: 0.1 }
    );
    if (stageRef.current) observer.observe(stageRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="client"
      data-testid="scroll-client"
      className="relative overflow-x-clip"
      style={{ background: "#faf8f4" }}
    >
      <div className="flex flex-col items-center justify-center py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 w-full grid lg:grid-cols-2 gap-16 items-center">

          {/* ── Left: text ── */}
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-[#eaf2fd] text-[#2c7be5] text-[11px] font-semibold tracking-[0.18em] uppercase">
              {badge}
            </span>
            <h2
              className="mt-6 font-display text-[#0f2044] flex flex-col"
              style={{ fontSize:"clamp(2.4rem,5.4vw,4.6rem)", letterSpacing:"0.06em", fontWeight:600, lineHeight:1, gap:"0.12em" }}
            >
              <span>{titleLine1}</span>
              <span className="text-[#2c7be5]">{titleLine2}</span>
              <span>{titleLine3}</span>
            </h2>
            <p className="mt-6 text-[#47526a] text-[17px] leading-relaxed max-w-lg">
              {subtitle}
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3 max-w-md">
              {featureLabels.slice(0,4).map((label, idx) => {
                const Icon = FEATURE_ICONS[idx % FEATURE_ICONS.length];
                return (
                  <div key={label} className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border-2 border-[#0f2044]"
                    style={{ boxShadow:"0 4px 14px -8px rgba(15,32,68,.12)" }}>
                    <div className="w-9 h-9 rounded-xl bg-[#eaf2fd] flex items-center justify-center">
                      {idx === 1 ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src="/google-wallet.png" alt="Google Wallet" style={{ width:"100%", height:"100%", objectFit:"contain", padding:4 }} />
                      ) : (
                        <Icon size={16} color="#2c7be5" strokeWidth={2} />
                      )}
                    </div>
                    <span className="text-[13px] font-medium text-[#0f2044]">{label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Right: hero animation ── */}
          <div
            ref={stageRef}
            data-testid="client-cards-stage"
            className="relative h-[620px] flex items-center justify-center"
          >
            {/* particles canvas */}
            <canvas
              ref={canvasRef}
              style={{ position:"absolute", inset:0, pointerEvents:"none", zIndex:40, width:"100%", height:"100%" }}
            />

            {/* Paper card wrapper */}
            <div id="anim-cw" style={{ position:"absolute", width:400, height:252, zIndex:10, opacity:0, transform:"scale(0.88) translateY(18px)", filter:"none" }}>
              {/* left half */}
              <div id="anim-hl" style={{ position:"absolute", inset:0, clipPath:`path("M0 0 L200 0 L196 24 L207 48 L193 72 L208 96 L192 120 L206 144 L191 168 L205 192 L190 216 L200 240 L200 252 L0 252 Z")` }}>
                <PaperCardInner />
              </div>
              {/* right half */}
              <div id="anim-hr" style={{ position:"absolute", inset:0, clipPath:`path("M200 0 L400 0 L400 252 L200 252 L200 240 L190 216 L205 192 L191 168 L206 144 L192 120 L208 96 L193 72 L207 48 L196 24 Z")` }}>
                <PaperCardInner />
              </div>
              {/* crack */}
              <div id="anim-crack" style={{ position:"absolute", top:0, left:200, width:1, height:252, background:"linear-gradient(to bottom,transparent,rgba(255,255,255,.95) 20%,#fff 50%,rgba(255,255,255,.95) 80%,transparent)", zIndex:15, opacity:0, boxShadow:"0 0 8px rgba(255,255,255,.9),0 0 20px rgba(210,185,140,.5)", pointerEvents:"none" }} />
            </div>

            {/* Old caption */}
            <div style={{ position:"absolute", left:"50%", transform:"translateX(-50%)", whiteSpace:"nowrap", pointerEvents:"none", zIndex:20, display:"flex", gap:6, top:"calc(50% - 170px)" }}>
              {(["Fini","les","cartes","en","papier."] as const).map((word, i) => (
                <span key={i} id={`anim-co${i}`} style={{ opacity:0, transform:"translateY(12px)", display:"inline-block", fontSize:22, fontWeight:700, letterSpacing:"-.3px", color:"#0f2044", fontFamily:"Plus Jakarta Sans,sans-serif" }}>
                  {word}
                </span>
              ))}
            </div>

            {/* New caption */}
            <div style={{ position:"absolute", left:"50%", transform:"translateX(-50%)", whiteSpace:"nowrap", pointerEvents:"none", zIndex:20, display:"flex", gap:6, top:"14px" }}>
              {(["Place","au","digital."] as const).map((word, i) => (
                <span key={i} id={`anim-cn${i}`} style={{ opacity:0, transform:"translateY(12px)", display:"inline-block", fontSize:22, fontWeight:700, letterSpacing:"-.3px", color:"#0f2044", fontFamily:"Plus Jakarta Sans,sans-serif" }}>
                  {word}
                </span>
              ))}
            </div>

            {/* Phone */}
            <div id="anim-pw" style={{ position:"absolute", width:252, height:509, zIndex:5, opacity:0, transform:"scale(0.04)" }}>
              <div style={{ width:"100%", height:"100%", borderRadius:50, background:"linear-gradient(170deg,#202020,#121212 60%,#0e0e0e)", border:"1px solid #282828", position:"relative", overflow:"hidden", boxShadow:"inset 0 .5px 0 rgba(255,255,255,.11),inset 0 -.5px 0 rgba(255,255,255,.04)" }}>
                {/* side buttons */}
                <div style={{ position:"absolute", right:-3, top:91, width:3, height:36, background:"#1c1c1c", borderRadius:"0 2px 2px 0", boxShadow:"0 55px 0 #1c1c1c" }} />
                <div style={{ position:"absolute", left:-3, top:130, width:3, height:65, background:"#1c1c1c", borderRadius:"2px 0 0 2px" }} />
                {/* notch */}
                <div style={{ position:"absolute", top:13, left:"50%", transform:"translateX(-50%)", width:103, height:31, background:"#000", borderRadius:22, zIndex:20, boxShadow:"0 2px 6px rgba(0,0,0,.7),inset 0 .5px 0 rgba(255,255,255,.06)" }} />
                {/* screen */}
                <div style={{ position:"absolute", inset:1, borderRadius:49, background:"#07101f", overflow:"hidden", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"67px 22px 46px" }}>
                  <div style={{ position:"absolute", top:0, left:0, right:0, height:"52%", background:"linear-gradient(180deg,rgba(255,255,255,.05),transparent)", borderRadius:"49px 49px 0 0", pointerEvents:"none" }} />
                  {/* glow */}
                  <div style={{ position:"absolute", width:216, height:216, borderRadius:"50%", background:"radial-gradient(circle,rgba(56,125,248,.2),rgba(56,125,248,.05) 45%,transparent 70%)", top:"50%", left:"50%", transform:"translate(-50%,-56%)", animation:"qhero-glow 3.2s ease-in-out infinite", pointerEvents:"none" }} />
                  {/* scan line */}
                  <div id="anim-scan" style={{ position:"absolute", left:0, right:0, height:96, background:"linear-gradient(180deg,transparent,rgba(56,125,248,.07),transparent)", top:0, opacity:0, pointerEvents:"none" }} />
                  {/* logo */}
                  <div id="anim-qLogo" style={{ opacity:0, marginBottom:22, position:"relative", zIndex:2 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/logo-qarta.png" alt="Qarta" width={91} height={91} style={{ borderRadius:20, display:"block", objectFit:"cover", filter:"drop-shadow(0 0 12px rgba(56,125,248,.4))" }} />
                  </div>
                  {/* dots */}
                  <div id="anim-dots" style={{ display:"flex", gap:6, marginBottom:29, opacity:0, position:"relative", zIndex:2 }}>
                    {[0,1,2].map(i => (
                      <div key={i} style={{ width:6, height:6, borderRadius:"50%", background:"#387df8", animation:`qhero-dot 1.4s ease-in-out infinite`, animationDelay:`${i*0.22}s` }} />
                    ))}
                  </div>
                  {/* tagline */}
                  <div id="anim-tag" style={{ display:"flex", gap:5, opacity:0, position:"relative", zIndex:2 }}>
                    {(["Qarta","est","là."] as const).map((word, i) => (
                      <span key={i} id={`anim-tw${i}`} style={{ display:"inline-block", opacity:0, transform:"translateY(14px)", fontSize:18, fontWeight:500, color:"rgba(255,255,255,.9)", letterSpacing:"-.2px" }}>
                        {word}
                      </span>
                    ))}
                  </div>
                  {/* shine */}
                  <div style={{ position:"absolute", bottom:0, left:0, right:0, height:96, background:"linear-gradient(0deg,rgba(56,125,248,.04),transparent)", borderRadius:"0 0 49px 49px", pointerEvents:"none" }} />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
