import { useRef } from "react";

const MAX_ROTATION = 10;

export default function TiltPanel({ children, className = "", as: Component = "div" }) {
  const ref = useRef(null);

  const handlePointerMove = (event) => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const bounds = element.getBoundingClientRect();
    const percentX = (event.clientX - bounds.left) / bounds.width;
    const percentY = (event.clientY - bounds.top) / bounds.height;
    const rotateY = (percentX - 0.5) * MAX_ROTATION;
    const rotateX = (0.5 - percentY) * MAX_ROTATION;

    element.style.setProperty("--rotate-x", `${rotateX.toFixed(2)}deg`);
    element.style.setProperty("--rotate-y", `${rotateY.toFixed(2)}deg`);
    element.style.setProperty("--glow-x", `${(percentX * 100).toFixed(2)}%`);
    element.style.setProperty("--glow-y", `${(percentY * 100).toFixed(2)}%`);
  };

  const resetTilt = () => {
    const element = ref.current;

    if (!element) {
      return;
    }

    element.style.setProperty("--rotate-x", "0deg");
    element.style.setProperty("--rotate-y", "0deg");
    element.style.setProperty("--glow-x", "50%");
    element.style.setProperty("--glow-y", "50%");
  };

  return (
    <Component
      ref={ref}
      className={`tilt-panel${className ? ` ${className}` : ""}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
    >
      {children}
    </Component>
  );
}
