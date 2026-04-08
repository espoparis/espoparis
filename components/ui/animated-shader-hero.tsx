"use client";

import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/navigation";

interface ShaderHeroProps {
  trustBadge?: {
    text: string;
  };
  headline: {
    line1: string;
    line2: string;
  };
  subtitle: string;
  buttons?: {
    primary?: {
      text: string;
      href: string;
    };
    secondary?: {
      text: string;
      href: string;
    };
  };
  className?: string;
  size?: "hero" | "section";
}

interface AnimatedShaderBackdropProps {
  className?: string;
}

type RendererProgram = WebGLProgram & {
  resolution?: WebGLUniformLocation | null;
  time?: WebGLUniformLocation | null;
  move?: WebGLUniformLocation | null;
  touch?: WebGLUniformLocation | null;
  pointerCount?: WebGLUniformLocation | null;
  pointers?: WebGLUniformLocation | null;
  inkColor?: WebGLUniformLocation | null;
  glowColor?: WebGLUniformLocation | null;
};

type RgbTuple = [number, number, number];

const defaultShaderSource = `#version 300 es
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform float time;
uniform vec3 inkColor;
uniform vec3 glowColor;
#define FC gl_FragCoord.xy
#define T time
#define R resolution
#define MN min(R.x,R.y)

float rnd(vec2 p) {
  p = fract(p * vec2(12.9898, 78.233));
  p += dot(p, p + 34.56);
  return fract(p.x * p.y);
}

float noise(in vec2 p) {
  vec2 i = floor(p), f = fract(p), u = f * f * (3.0 - 2.0 * f);
  float a = rnd(i);
  float b = rnd(i + vec2(1.0, 0.0));
  float c = rnd(i + vec2(0.0, 1.0));
  float d = rnd(i + 1.0);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float t = 0.0, a = 1.0;
  mat2 m = mat2(1.0, -0.5, 0.2, 1.2);
  for (int i = 0; i < 5; i++) {
    t += a * noise(p);
    p *= 2.0 * m;
    a *= 0.5;
  }
  return t;
}

float clouds(vec2 p) {
  float d = 1.0, t = 0.0;
  for (float i = 0.0; i < 3.0; i++) {
    float a = d * fbm(i * 10.0 + p.x * 0.2 + 0.2 * (1.0 + i) * p.y + d + i * i + p);
    t = mix(t, d, a);
    d = a;
    p *= 2.0 / (i + 1.0);
  }
  return t;
}

void main(void) {
  vec2 uv = (FC - 0.5 * R) / MN, st = uv * vec2(2.0, 1.0);
  vec3 col = vec3(0.0);
  float bg = clouds(vec2(st.x + T * 0.5, -st.y));
  uv *= 1.0 - 0.3 * (sin(T * 0.2) * 0.5 + 0.5);
  for (float i = 1.0; i < 12.0; i++) {
    uv += 0.1 * cos(i * vec2(0.1 + 0.01 * i, 0.8) + i * i + T * 0.5 + 0.1 * uv.x);
    vec2 p = uv;
    float d = length(p);
    col += 0.00125 / d * (cos(sin(i) * vec3(1.0, 2.0, 3.0)) + 1.0);
    float b = noise(i + p + bg * 1.731);
    col += 0.002 * b / length(max(p, vec2(b * p.x * 0.02, p.y)));
    vec3 ink = inkColor;
    vec3 glow = glowColor;
    col = mix(col, mix(ink, glow, clamp(bg, 0.0, 1.0)), d);
  }
  O = vec4(col, 1.0);
}`;

function hslToRgb(h: number, s: number, l: number): RgbTuple {
  const saturation = s / 100;
  const lightness = l / 100;
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const segment = h / 60;
  const x = chroma * (1 - Math.abs((segment % 2) - 1));
  let red = 0;
  let green = 0;
  let blue = 0;

  if (segment >= 0 && segment < 1) {
    red = chroma;
    green = x;
  } else if (segment < 2) {
    red = x;
    green = chroma;
  } else if (segment < 3) {
    green = chroma;
    blue = x;
  } else if (segment < 4) {
    green = x;
    blue = chroma;
  } else if (segment < 5) {
    red = x;
    blue = chroma;
  } else {
    red = chroma;
    blue = x;
  }

  const match = lightness - chroma / 2;
  return [
    Math.round((red + match) * 255),
    Math.round((green + match) * 255),
    Math.round((blue + match) * 255),
  ];
}

function parseThemeHsl(value: string): RgbTuple | null {
  const parts = value.trim().replace(/\s+/g, " ").split(" ");
  if (parts.length < 3) return null;

  const hue = Number.parseFloat(parts[0]);
  const saturation = Number.parseFloat(parts[1].replace("%", ""));
  const lightness = Number.parseFloat(parts[2].replace("%", ""));

  if ([hue, saturation, lightness].some(Number.isNaN)) {
    return null;
  }

  return hslToRgb(hue, saturation, lightness);
}

function withAlpha([r, g, b]: RgbTuple, alpha: number) {
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

class WebGLRenderer {
  private canvas: HTMLCanvasElement;
  private gl: WebGL2RenderingContext;
  private program: RendererProgram | null = null;
  private vs: WebGLShader | null = null;
  private fs: WebGLShader | null = null;
  private buffer: WebGLBuffer | null = null;
  private scale: number;
  private shaderSource = defaultShaderSource;
  private mouseMove = [0, 0];
  private mouseCoords = [0, 0];
  private pointerCoords = [0, 0];
  private nbrOfPointers = 0;
  private inkColor: RgbTuple = [12, 20, 30];
  private glowColor: RgbTuple = [47, 144, 187];

  private readonly vertexSrc = `#version 300 es
precision highp float;
in vec4 position;
void main() { gl_Position = position; }`;

  private readonly vertices = [-1, 1, -1, -1, 1, 1, 1, -1];

  constructor(canvas: HTMLCanvasElement, scale: number) {
    this.canvas = canvas;
    this.scale = scale;
    this.gl = canvas.getContext("webgl2") as WebGL2RenderingContext;
    this.gl.viewport(0, 0, canvas.width * scale, canvas.height * scale);
  }

  updateMove(deltas: number[]) {
    this.mouseMove = deltas;
  }

  updateMouse(coords: number[]) {
    this.mouseCoords = coords;
  }

  updatePointerCoords(coords: number[]) {
    this.pointerCoords = coords;
  }

  updatePointerCount(nbr: number) {
    this.nbrOfPointers = nbr;
  }

  updateScale(scale: number) {
    this.scale = scale;
    this.gl.viewport(
      0,
      0,
      this.canvas.width * scale,
      this.canvas.height * scale,
    );
  }

  updatePalette(inkColor: RgbTuple, glowColor: RgbTuple) {
    this.inkColor = inkColor;
    this.glowColor = glowColor;
  }

  compile(shader: WebGLShader, source: string) {
    const gl = this.gl;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
  }

  test(source: string) {
    const gl = this.gl;
    const shader = gl.createShader(gl.FRAGMENT_SHADER);
    if (!shader) return "Shader creation failed";
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const result = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
      ? null
      : gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    return result;
  }

  reset() {
    const gl = this.gl;
    if (
      this.program &&
      !gl.getProgramParameter(this.program, gl.DELETE_STATUS)
    ) {
      if (this.vs) {
        gl.detachShader(this.program, this.vs);
        gl.deleteShader(this.vs);
      }
      if (this.fs) {
        gl.detachShader(this.program, this.fs);
        gl.deleteShader(this.fs);
      }
      gl.deleteProgram(this.program);
    }
  }

  setup() {
    const gl = this.gl;
    this.vs = gl.createShader(gl.VERTEX_SHADER);
    this.fs = gl.createShader(gl.FRAGMENT_SHADER);
    this.program = gl.createProgram() as RendererProgram | null;
    if (!this.vs || !this.fs || !this.program) return;

    this.compile(this.vs, this.vertexSrc);
    this.compile(this.fs, this.shaderSource);
    gl.attachShader(this.program, this.vs);
    gl.attachShader(this.program, this.fs);
    gl.linkProgram(this.program);
  }

  init() {
    const gl = this.gl;
    const program = this.program;
    if (!program) return;

    this.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(this.vertices),
      gl.STATIC_DRAW,
    );

    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    program.resolution = gl.getUniformLocation(program, "resolution");
    program.time = gl.getUniformLocation(program, "time");
    program.move = gl.getUniformLocation(program, "move");
    program.touch = gl.getUniformLocation(program, "touch");
    program.pointerCount = gl.getUniformLocation(program, "pointerCount");
    program.pointers = gl.getUniformLocation(program, "pointers");
    program.inkColor = gl.getUniformLocation(program, "inkColor");
    program.glowColor = gl.getUniformLocation(program, "glowColor");
  }

  render(now = 0) {
    const gl = this.gl;
    const program = this.program;
    if (!program) return;

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

    gl.uniform2f(program.resolution!, this.canvas.width, this.canvas.height);
    gl.uniform1f(program.time!, now * 1e-3);
    gl.uniform2f(program.move!, this.mouseMove[0], this.mouseMove[1]);
    gl.uniform2f(program.touch!, this.mouseCoords[0], this.mouseCoords[1]);
    gl.uniform1i(program.pointerCount!, this.nbrOfPointers);
    gl.uniform2fv(program.pointers!, this.pointerCoords);
    gl.uniform3f(
      program.inkColor!,
      this.inkColor[0] / 255,
      this.inkColor[1] / 255,
      this.inkColor[2] / 255,
    );
    gl.uniform3f(
      program.glowColor!,
      this.glowColor[0] / 255,
      this.glowColor[1] / 255,
      this.glowColor[2] / 255,
    );
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
}

class PointerHandler {
  private scale: number;
  private active = false;
  private pointers = new Map<number, number[]>();
  private lastCoords = [0, 0];
  private moves = [0, 0];

  constructor(element: HTMLCanvasElement, scale: number) {
    this.scale = scale;

    const map = (x: number, y: number) => [
      x * this.scale,
      element.height - y * this.scale,
    ];

    element.addEventListener("pointerdown", (event) => {
      this.active = true;
      this.pointers.set(event.pointerId, map(event.clientX, event.clientY));
    });

    const release = (event: PointerEvent) => {
      if (this.count === 1) {
        this.lastCoords = this.first;
      }
      this.pointers.delete(event.pointerId);
      this.active = this.pointers.size > 0;
    };

    element.addEventListener("pointerup", release);
    element.addEventListener("pointerleave", release);

    element.addEventListener("pointermove", (event) => {
      if (!this.active) return;
      this.lastCoords = [event.clientX, event.clientY];
      this.pointers.set(event.pointerId, map(event.clientX, event.clientY));
      this.moves = [
        this.moves[0] + event.movementX,
        this.moves[1] + event.movementY,
      ];
    });
  }

  updateScale(scale: number) {
    this.scale = scale;
  }

  get count() {
    return this.pointers.size;
  }

  get move() {
    return this.moves;
  }

  get coords() {
    return this.pointers.size > 0
      ? Array.from(this.pointers.values()).flat()
      : [0, 0];
  }

  get first() {
    return this.pointers.values().next().value || this.lastCoords;
  }
}

function useShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const rendererRef = useRef<WebGLRenderer | null>(null);
  const pointersRef = useRef<PointerHandler | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const dpr = Math.max(1, 0.5 * window.devicePixelRatio);

    const resize = () => {
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      rendererRef.current?.updateScale(dpr);
      pointersRef.current?.updateScale(dpr);
    };

    const loop = (now: number) => {
      if (!rendererRef.current || !pointersRef.current) return;
      rendererRef.current.updateMouse(pointersRef.current.first);
      rendererRef.current.updatePointerCount(pointersRef.current.count);
      rendererRef.current.updatePointerCoords(pointersRef.current.coords);
      rendererRef.current.updateMove(pointersRef.current.move);
      rendererRef.current.render(now);
      animationFrameRef.current = window.requestAnimationFrame(loop);
    };

    rendererRef.current = new WebGLRenderer(canvas, dpr);
    (
      canvas as HTMLCanvasElement & {
        __shaderRenderer?: WebGLRenderer;
      }
    ).__shaderRenderer = rendererRef.current;
    pointersRef.current = new PointerHandler(canvas, dpr);
    rendererRef.current.setup();
    rendererRef.current.init();

    if (rendererRef.current.test(defaultShaderSource) === null) {
      resize();
      loop(0);
    }

    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      if (animationFrameRef.current)
        window.cancelAnimationFrame(animationFrameRef.current);
      rendererRef.current?.reset();
    };
  }, []);

  return canvasRef;
}

function useShaderThemeStyles(canvasRef: React.RefObject<HTMLCanvasElement>) {
  const [heroStyles, setHeroStyles] = useState(() => ({
    base: "rgb(12, 20, 30)",
    overlay:
      "radial-gradient(circle at center, rgba(12, 20, 30, 0.12) 0%, rgba(12, 20, 30, 0.2) 34%, rgba(12, 20, 30, 0.62) 70%, rgba(12, 20, 30, 0.88) 100%)",
    text: "rgba(250, 252, 255, 0.98)",
    textMuted: "rgba(250, 252, 255, 0.76)",
    badgeBackground: "rgba(250, 252, 255, 0.08)",
    badgeBorder: "rgba(47, 144, 187, 0.28)",
    secondaryBackground: "rgba(250, 252, 255, 0.06)",
    secondaryBorder: "rgba(250, 252, 255, 0.16)",
  }));

  useEffect(() => {
    const root = document.documentElement;

    const syncPalette = () => {
      const styles = getComputedStyle(root);
      const primary = parseThemeHsl(styles.getPropertyValue("--primary")) ?? [
        47, 144, 187,
      ];
      const accent =
        parseThemeHsl(styles.getPropertyValue("--accent")) ?? primary;
      const ink = root.classList.contains("dark")
        ? (parseThemeHsl(styles.getPropertyValue("--background")) ?? [12, 20, 30])
        : (parseThemeHsl(styles.getPropertyValue("--foreground")) ?? [12, 20, 30]);
      const text = root.classList.contains("dark")
        ? (parseThemeHsl(styles.getPropertyValue("--foreground")) ?? [250, 252, 255])
        : (parseThemeHsl(styles.getPropertyValue("--background")) ?? [250, 252, 255]);

      setHeroStyles({
        base: `rgb(${ink[0]}, ${ink[1]}, ${ink[2]})`,
        overlay: `radial-gradient(circle at center, ${withAlpha(
          ink,
          0.12,
        )} 0%, ${withAlpha(ink, 0.2)} 34%, ${withAlpha(ink, 0.62)} 70%, ${withAlpha(ink, 0.88)} 100%)`,
        text: withAlpha(text, 0.98),
        textMuted: withAlpha(text, 0.76),
        badgeBackground: withAlpha(text, 0.08),
        badgeBorder: withAlpha(primary, 0.28),
        secondaryBackground: withAlpha(accent, 0.12),
        secondaryBorder: withAlpha(text, 0.16),
      });

      const canvas = canvasRef.current;
      if (canvas) {
        const renderer = (
          canvas as HTMLCanvasElement & {
            __shaderRenderer?: WebGLRenderer;
          }
        ).__shaderRenderer;
        renderer?.updatePalette(ink, primary);
      }
    };

    syncPalette();
    const observer = new MutationObserver(syncPalette);
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });
    return () => observer.disconnect();
  }, [canvasRef]);

  return heroStyles;
}

export function AnimatedShaderBackdrop({
  className = "",
}: AnimatedShaderBackdropProps) {
  const canvasRef = useShaderBackground();
  const heroStyles = useShaderThemeStyles(canvasRef);

  return (
    <div
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{ backgroundColor: heroStyles.base }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full touch-none"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ backgroundImage: heroStyles.overlay }}
      />
    </div>
  );
}

export default function AnimatedShaderHero({
  trustBadge,
  headline,
  subtitle,
  buttons,
  className = "",
  size = "section",
}: ShaderHeroProps) {
  const canvasRef = useShaderBackground();
  const heroStyles = useShaderThemeStyles(canvasRef);

  return (
    <section
      className={`relative w-full overflow-hidden border-y border-border/50 ${className}`}
      style={{ backgroundColor: heroStyles.base }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full touch-none"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ backgroundImage: heroStyles.overlay }}
      />

      <div
        className={`relative z-10 mx-auto flex w-full max-w-[112rem] flex-col items-center justify-center px-6 text-center sm:px-10 lg:px-14 xl:px-16 ${
          size === "hero"
            ? "h-auto py-28 sm:py-32 lg:py-36"
            : "min-h-[34rem] py-20 lg:min-h-[38rem]"
        }`}
      >
        {trustBadge ? (
          <div
            className="mb-8 inline-flex items-center text-white gap-2 rounded-full px-5 py-2 text-sm font-medium backdrop-blur-md"
            style={{
              border: `1px solid ${heroStyles.badgeBorder}`,
              backgroundColor: heroStyles.badgeBackground,
              // color: "hsl(var(--primary))",
            }}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-70" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
            </span>
            <span>{trustBadge.text}</span>
          </div>
        ) : null}

        <div className="max-w-5xl space-y-6">
          <div className="space-y-2">
            <h2
              className="font-display text-[clamp(3.1rem,10vw,7.2rem)] font-semibold leading-[0.92] tracking-tight"
              style={{ color: heroStyles.text }}
            >
              {headline.line1}
            </h2>
            <h2
              className="font-display text-[clamp(3.1rem,10vw,7.2rem)] font-semibold leading-[0.92] tracking-tight"
              style={{ color: heroStyles.text }}
            >
              {headline.line2}
            </h2>
          </div>

          <p
            className="mx-auto max-w-3xl text-base leading-7 sm:text-lg sm:leading-8 lg:text-xl"
            style={{ color: heroStyles.textMuted }}
          >
            {subtitle}
          </p>
        </div>

        {buttons ? (
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {buttons.primary ? (
              <Button asChild size="xl" className="min-w-[12rem]">
                <Link href={buttons.primary.href}>
                  {buttons.primary.text}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            ) : null}
            {buttons.secondary ? (
              <Button
                asChild
                variant="outline"
                size="xl"
                className="min-w-[12rem] hover:text-foreground"
                style={{
                  backgroundColor: heroStyles.secondaryBackground,
                  borderColor: heroStyles.secondaryBorder,
                  color: heroStyles.text,
                }}
              >
                <Link href={buttons.secondary.href}>
                  {buttons.secondary.text}
                </Link>
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
