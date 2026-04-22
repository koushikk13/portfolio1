import { useEffect, useRef } from "react";

const MOBILE_BREAKPOINT = 768;

export default function AmbientCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return undefined;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return undefined;
    }

    let width = window.innerWidth;
    let height = window.innerHeight;
    let animationFrame = 0;
    const pointer = {
      x: width * 0.65,
      y: height * 0.35,
    };

    const setCanvasSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const ratio = window.devicePixelRatio || 1;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const buildParticles = () => {
      const count = width < MOBILE_BREAKPOINT ? 28 : 52;

      return Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 2.2 + 0.8,
        alpha: Math.random() * 0.6 + 0.18,
      }));
    };

    let particles = buildParticles();

    const resize = () => {
      setCanvasSize();
      particles = buildParticles();
    };

    const render = () => {
      context.clearRect(0, 0, width, height);

      const bloom = context.createRadialGradient(
        pointer.x,
        pointer.y,
        0,
        pointer.x,
        pointer.y,
        Math.max(width, height) * 0.55,
      );

      bloom.addColorStop(0, "rgba(120, 255, 226, 0.18)");
      bloom.addColorStop(0.35, "rgba(78, 147, 255, 0.12)");
      bloom.addColorStop(1, "rgba(8, 11, 30, 0)");

      context.fillStyle = bloom;
      context.fillRect(0, 0, width, height);

      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < -20 || particle.x > width + 20) {
          particle.vx *= -1;
        }

        if (particle.y < -20 || particle.y > height + 20) {
          particle.vy *= -1;
        }

        for (let targetIndex = index + 1; targetIndex < particles.length; targetIndex += 1) {
          const target = particles[targetIndex];
          const deltaX = particle.x - target.x;
          const deltaY = particle.y - target.y;
          const distance = Math.hypot(deltaX, deltaY);

          if (distance < 140) {
            context.strokeStyle = `rgba(118, 169, 255, ${0.12 - distance / 1400})`;
            context.lineWidth = 1;
            context.beginPath();
            context.moveTo(particle.x, particle.y);
            context.lineTo(target.x, target.y);
            context.stroke();
          }
        }

        const influenceX = pointer.x - particle.x;
        const influenceY = pointer.y - particle.y;
        const influenceDistance = Math.hypot(influenceX, influenceY);

        if (influenceDistance < 170) {
          particle.x -= influenceX * 0.0014;
          particle.y -= influenceY * 0.0014;
        }

        context.beginPath();
        context.fillStyle = `rgba(216, 248, 255, ${particle.alpha})`;
        context.shadowColor = "rgba(120, 255, 226, 0.28)";
        context.shadowBlur = 14;
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fill();
      });

      context.shadowBlur = 0;
      animationFrame = window.requestAnimationFrame(render);
    };

    const handlePointerMove = (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    };

    setCanvasSize();
    render();

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="ambient-canvas" aria-hidden="true" />;
}
