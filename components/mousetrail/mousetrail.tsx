import React, { useEffect, useRef } from "react";

const Mousetrail: React.FC = () => {
  const blobRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const blob = blobRef.current;

    const updateBlobPosition = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      const scrollX = window.pageXOffset;
      const scrollY = window.pageYOffset;

      if (blob) {
        blob.animate(
          {
            left: `${clientX + scrollX}px`,
            top: `${clientY + scrollY}px`,
          },
          { duration: 1000, fill: "forwards" }
        );
      }
    };

    const handleClick = () => {
      if (blob) {
        blob.classList.add("animate-disappear");
        setTimeout(() => {
          blob.classList.remove("animate-disappear");
        }, 3000);
      }
    };

    document.body.addEventListener("mousemove", updateBlobPosition);
    if (blob) {
      blob.addEventListener("click", handleClick);
    }

    return () => {
      document.body.removeEventListener("mousemove", updateBlobPosition);
      if (blob) {
        blob.removeEventListener("click", handleClick);
      }
    };
  }, []);

  return (
    <div ref={blobRef} className="absolute filter blur-3xl">
      <div className="bg-gradient-to-r from-transparent to-indigo-600 aspect-square h-[200px] inset-x-1/2 inset-y-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"></div>
    </div>
  );
};

export default Mousetrail;
