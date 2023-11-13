import { useEffect, useRef } from "react";

const Mousetrail = () => {
  const blobRef = useRef(null);

  useEffect(() => {
    const blob = blobRef.current;

    const updateBlobPosition = (event) => {
      const { clientX, clientY } = event;
      const scrollX = window.pageXOffset;
      const scrollY = window.pageYOffset;

      blob.animate(
        {
          left: `${clientX + scrollX}px`,
          top: `${clientY + scrollY}px`,
        },
        { duration: 1000, fill: "forwards" }
      );
    };

    const handleClick = () => {
      blob.classList.add("animate-disappear");
      setTimeout(() => {
        blob.classList.remove("animate-disappear");
      }, 3000); // 3 seconds
    };

    document.body.addEventListener("mousemove", updateBlobPosition);
    blob.addEventListener("click", handleClick);

    return () => {
      document.body.removeEventListener("mousemove", updateBlobPosition);
      blob.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div ref={blobRef} className="absolute filter blur-3xl">
      <div
        className="bg-gradient-to-r  from-indigo-950 to-indigo-600 aspect-square h-[200px] inset-x-1/2 inset-y-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
      ></div>
    </div>
  );
};

export default Mousetrail;
