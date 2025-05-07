import React, { useRef, useEffect } from "react";

interface SpriteAnimatorProps {
  character: string;
  gender: string;
  class: string;
  game: string;
  displayScale?: number;
  classMove: number;
}

const SpriteAnimator: React.FC<SpriteAnimatorProps> = ({
  character,
  class: unitClass,
  game,
  displayScale = 4,
  classMove,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameIndexRef = useRef(0);
  const lastTimeRef = useRef(0);
  const directionRef = useRef(1); // 1 for forward, -1 for backward

  const frameCount = 4;
  const fps = 4;

  const offsetX = 2;
  const offsetY = 2;

  const isMounted = classMove >= 7;
  const characterYOffset = isMounted ? 0 + 32 : 3;
  const characterFrameWidth = isMounted ? 16 : 32;
  const characterXOffset = isMounted ? 6 : 0;

  const frameWidth = 32;
  const frameHeight = 32;

  const classYOffset = 1656;

  const images = [
    `/spritesheets/${game}/${unitClass}.png`,
    `/spritesheets/${game}/${character}.png`,
  ];

  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    images.forEach((src, i) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === images.length) {
          imagesRef.current = loadedImages;
          requestAnimationFrame(update);
        }
      };
      loadedImages[i] = img;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [character, unitClass, game, classMove]);

  const update = (timestamp: number) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const now = timestamp;
    const elapsed = now - lastTimeRef.current;

    if (elapsed > 1000 / fps) {
      lastTimeRef.current = now;

      frameIndexRef.current += directionRef.current;

      if (
        frameIndexRef.current === frameCount - 1 ||
        frameIndexRef.current === 0
      ) {
        directionRef.current *= -1;
      }

      context.clearRect(0, 0, canvas.width, canvas.height);

      //This bit conputes character bobbing when the class is applicable
      let characterYOffsetAdjustment = 0;
      if (unitClass === "Malig Knight") {
        if (frameIndexRef.current === 0) {
          characterYOffsetAdjustment = 1;
        } else if (frameIndexRef.current === 3) {
          characterYOffsetAdjustment = -1;
        }
      }

      const characterImg = imagesRef.current[1];
      if (characterImg) {
        context.drawImage(
          characterImg,
          frameIndexRef.current * characterFrameWidth + offsetX,
          characterYOffset + offsetY,
          characterFrameWidth,
          frameHeight,
          characterXOffset,
          characterYOffsetAdjustment, // this is the line that affects bobbing (only certain classes do this)
          characterFrameWidth,
          frameHeight,
        );
      }

      const classImg = imagesRef.current[0];
      if (classImg) {
        context.drawImage(
          classImg,
          frameIndexRef.current * frameWidth + offsetX,
          classYOffset + offsetY,
          frameWidth,
          frameHeight,
          0,
          0,
          frameWidth,
          frameHeight,
        );
      }
    }

    requestAnimationFrame(update);
  };

  return (
    <canvas
      ref={canvasRef}
      width={frameWidth}
      height={frameHeight}
      style={{
        imageRendering: "pixelated",
        width: `${frameWidth * displayScale}px`,
        height: `${frameHeight * displayScale}px`,
      }}
    />
  );
};

export default SpriteAnimator;

// +2px height/ width offset

// 128 px wide NON MOUNT HEAD
// 64 px tall NON MOUNT HEAD

// 32px wide each

// 64 px wide MOUNT HEAD
// 32 px tall MOUNT HEAD

// 16px wide each
