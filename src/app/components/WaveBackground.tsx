"use client";
import React, { useEffect, useRef } from "react";

const VERT = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform float u_mouseStrength;

vec3 mod289(vec3 x){return x - floor(x*(1.0/289.0))*289.0;}
vec2 mod289(vec2 x){return x - floor(x*(1.0/289.0))*289.0;}
vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);}
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
  vec4 x12 = x0.xyxy + C.xxzz; x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m; m = m*m;
  vec3 x = 2.0*fract(p*C.www)-1.0;
  vec3 h = abs(x)-0.5;
  vec3 ox = floor(x+0.5);
  vec3 a0 = x-ox;
  m *= 1.79284291400159 - 0.85373472095314*(a0*a0+h*h);
  vec3 g;
  g.x = a0.x*x0.x + h.x*x0.y;
  g.yz = a0.yz*x12.xz + h.yz*x12.yw;
  return 130.0*dot(m, g);
}

vec3 PALETTE[5];

vec3 palette(float t){
  PALETTE[0] = vec3(1.00, 1.00, 1.00);
  PALETTE[1] = vec3(0.92, 0.96, 1.00);
  PALETTE[2] = vec3(0.55, 0.78, 1.00);
  PALETTE[3] = vec3(0.17, 0.48, 0.90);
  PALETTE[4] = vec3(0.06, 0.13, 0.27);
  t = clamp(t, 0.0, 1.0) * 4.0;
  int idx = int(floor(t));
  float f = fract(t);
  vec3 a;
  vec3 b;
  if(idx==0){a=PALETTE[0];b=PALETTE[1];}
  else if(idx==1){a=PALETTE[1];b=PALETTE[2];}
  else if(idx==2){a=PALETTE[2];b=PALETTE[3];}
  else {a=PALETTE[3];b=PALETTE[4];}
  return mix(a,b,smoothstep(0.0,1.0,f));
}

void main(){
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = uv;
  p.x *= u_resolution.x / u_resolution.y;

  vec2 m = u_mouse;
  m.x *= u_resolution.x / u_resolution.y;

  float dM = distance(p, m);

  float t = u_time * 0.12;
  float n1 = snoise(p*1.6 + vec2(t, -t*0.8));
  float n2 = snoise(p*3.2 - vec2(t*0.6, t));
  float n3 = snoise(p*0.8 + vec2(-t*0.4, t*0.3));

  float ripple = sin(dM*14.0 - u_time*2.6) * exp(-dM*2.2);
  ripple += sin(dM*24.0 - u_time*4.0) * exp(-dM*3.4) * 0.5;
  ripple *= u_mouseStrength;

  float vBias = smoothstep(0.0, 1.0, 1.0 - uv.y);

  float field = 0.20 + n1*0.18 + n2*0.08 + n3*0.12 + ripple*0.25 + vBias*0.55;

  float halo = exp(-dM*2.6) * 0.45 * u_mouseStrength;
  field -= halo;

  vec3 col = palette(field);

  float g = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898,78.233))) * 43758.5453);
  col += (g-0.5) * 0.012;

  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, source);
  gl.compileShader(s);
  return s;
}

interface WaveBackgroundProps {
  className?: string;
  intensity?: number;
}

export default function WaveBackground({ className = "", intensity = 1 }: WaveBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    mouse: [0.5, 0.5],
    target: [0.5, 0.5],
    strength: 0,
    targetStrength: intensity,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: true, premultipliedAlpha: false }) as WebGLRenderingContext | null;
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );
    const aPos = gl.getAttribLocation(program, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "u_resolution");
    const uMouse = gl.getUniformLocation(program, "u_mouse");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uStrength = gl.getUniformLocation(program, "u_mouseStrength");

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      stateRef.current.target = [
        (e.clientX - rect.left) / rect.width,
        1 - (e.clientY - rect.top) / rect.height,
      ];
      stateRef.current.targetStrength = intensity * 1.15;
    };
    const onLeave = () => {
      stateRef.current.targetStrength = intensity * 0.3;
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);

    const start = performance.now();
    let raf: number;
    const loop = () => {
      const t = (performance.now() - start) / 1000;
      const s = stateRef.current;
      s.mouse[0] += (s.target[0] - s.mouse[0]) * 0.08;
      s.mouse[1] += (s.target[1] - s.mouse[1]) * 0.08;
      s.strength += (s.targetStrength - s.strength) * 0.04;
      s.targetStrength *= 0.995;

      gl.uniform2f(uMouse, s.mouse[0], s.mouse[1]);
      gl.uniform1f(uTime, t);
      gl.uniform1f(uStrength, s.strength);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      data-testid="wave-background-canvas"
      style={{ display: "block" }}
    />
  );
}
