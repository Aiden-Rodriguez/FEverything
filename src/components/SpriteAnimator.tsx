import React, { useRef, useEffect } from "react";
import { getSpriteAdjustments } from "../components/SpriteAdjustment";

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
  gender,
  class: unitClass,
  game,
  displayScale = 4,
  classMove,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameIndexRef = useRef(0);
  const lastTimeRef = useRef(0);
  const directionRef = useRef(1);
  const loopRef = useRef(true);

  const frameCount = 4;
  const fps = 4;

  const offsetX = 2;
  const offsetY = 2;

  let isMounted = classMove >= 7 || unitClass === "Ballistician";

  let characterYOffset = isMounted ? 0 + 32 : 3;
  let characterFrameWidth = isMounted ? 16 : 32;
  let characterXOffsetAdjustment = isMounted ? 6 : 0;

  const frameWidth = 32;
  const frameHeight = 32;

  const classYOffset = 1656;

  const characterSrc = `/spritesheets/${game}/character/${character}.png`;
  const genderedClassSrc = `/spritesheets/${game}/class/${unitClass} ${gender}.png`; //if class sprite is gendered
  const fallbackClassSrc = `/spritesheets/${game}/class/${unitClass}.png`; //if class sprite is not gendered

  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    // Load class sprite with gender fallback
    const classImg = new Image();
    classImg.src = genderedClassSrc;

    classImg.onload = () => {
      loadedImages[0] = classImg;
      maybeStart();
    };

    classImg.onerror = () => {
      // fallback to non-gendered class image
      const fallbackImg = new Image();
      fallbackImg.src = fallbackClassSrc;
      fallbackImg.onload = () => {
        loadedImages[0] = fallbackImg;
        maybeStart();
      };
      fallbackImg.onerror = () => console.error("Failed to load class image");
    };

    // Load character image
    const characterImg = new Image();
    characterImg.src = characterSrc;
    characterImg.onload = () => {
      loadedImages[1] = characterImg;
      maybeStart();
    };
    characterImg.onerror = () =>
      console.error("Failed to load character image");

    function maybeStart() {
      loadedCount++;
      if (loadedCount === 2) {
        imagesRef.current = loadedImages;
        requestAnimationFrame(update);
      }

      if (loadedCount === 2) {
        imagesRef.current = loadedImages;

        // Grab loop setting from the sprite adjustment logic
        const { loop } = getSpriteAdjustments(unitClass, gender, 0);
        loopRef.current = loop;

        requestAnimationFrame(update);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [character, unitClass, gender, game, classMove]);

  const update = (timestamp: number) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const now = timestamp;
    const elapsed = now - lastTimeRef.current;

    if (elapsed > 1000 / fps) {
      lastTimeRef.current = now;

      if (loopRef.current) {
        frameIndexRef.current = (frameIndexRef.current + 1) % frameCount;
      } else {
        frameIndexRef.current += directionRef.current;
        if (
          frameIndexRef.current === frameCount - 1 ||
          frameIndexRef.current === 0
        ) {
          directionRef.current *= -1;
        }
      }

      context.clearRect(0, 0, canvas.width, canvas.height);

      let characterYOffsetAdjustment = 0;
      let characterXOffset = isMounted ? 6 : 0;

      const adjustment = getSpriteAdjustments(
        unitClass,
        gender,
        frameIndexRef.current,
      );
      characterYOffsetAdjustment = adjustment.yOffsetAdjustment;
      characterXOffset += adjustment.xOffsetAdjustment;

      if (adjustment.xOffsetOverride !== undefined) {
        characterXOffset = adjustment.xOffsetOverride;
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
          characterYOffsetAdjustment,
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
