import React, { useRef, useEffect } from "react";
import { getSpriteAdjustments } from "../components/SpriteAdjustment";

interface SpriteAnimatorProps {
  character: string;
  gender: string;
  class: string;
  game: string;
  displayScale?: number;
  classMove: number;
  faction: string;
  animationId: number;
}

const SpriteAnimator: React.FC<SpriteAnimatorProps> = ({
  character,
  gender,
  class: unitClass,
  game,
  displayScale = 4,
  classMove,
  faction,
  animationId,
}) => {
  const classBackgroundCanvasRef = useRef<HTMLCanvasElement>(null);
  const characterBackgroundCanvasRef = useRef<HTMLCanvasElement>(null);
  const classForegroundCanvasRef = useRef<HTMLCanvasElement>(null);
  const characterForegroundCanvasRef = useRef<HTMLCanvasElement>(null);

  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameIndexRef = useRef(0);
  const lastTimeRef = useRef(0);
  const directionRef = useRef(1);
  const loopRef = useRef(true);
  const animationRef = useRef<number>(0);
  const fpsRef = useRef(4); // Default FPS, will be updated by getSpriteAdjustments

  const frameCount = 4;

  const offsetX = 2;
  const offsetY = 2;

  let isMounted = classMove >= 7 || unitClass === "Ballistician";

  let characterYOffset = isMounted ? 0 + 32 : 1; // Should actually be 3 instead of 1, but I use a workaround here so that the sprite below doesnt come into view. Other part visible in spriteadjustment (pt1)
  let characterFrameWidth = isMounted ? 16 : 32;

  const frameWidth = 32;
  const frameHeight = 32;

  let classYOffset;
  if (faction === "Valla") {
    classYOffset = 0;
  } else if (faction === "Ally") {
    classYOffset = 552;
  } else if (faction === "Enemy") {
    classYOffset = 1104;
  } else {
    classYOffset = 1656;
  }

  /* This lines up the correct animation
  0 is standing animation ; 1 is left, 2 is right, 3 is down, 4 is up, 
  5 is down-left, 6 is down-right, 7 is up-left, 8 is up-right, 9 is special animation? (unknown),
  10 is special animation? (unknown), past 11 is out of bounds. 
  */
  if (animationId >= 9 || animationId <= -1) {
    throw console.error("Out of bounds animation - Class.");
  } else if (animationId !== 0) {
    classYOffset += 36 + (animationId - 1) * 32;
  }

  if (animationId >= 9 || animationId <= -1) {
    throw console.error("Out of bounds animation - Character.");
  } else if (animationId !== 0 && isMounted) {
    characterYOffset += 358 + (animationId - 1) * 16;
  } else if (animationId !== 0) {
    characterYOffset += 68 + (animationId - 1) * 32;
  }

  const characterSrc = `/spritesheets/${game}/character/${character}.png`;
  const genderedClassSrc = `/spritesheets/${game}/class/${unitClass} ${gender}.png`;
  const fallbackClassSrc = `/spritesheets/${game}/class/${unitClass}.png`;

  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    const classImg = new Image();
    classImg.src = genderedClassSrc;

    classImg.onload = () => {
      loadedImages[0] = classImg;
      maybeStart();
    };

    classImg.onerror = () => {
      const fallbackImg = new Image();
      fallbackImg.src = fallbackClassSrc;
      fallbackImg.onload = () => {
        loadedImages[0] = fallbackImg;
        maybeStart();
      };
      fallbackImg.onerror = () => console.error("Failed to load class image");
    };

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
        const { loop, fps } = getSpriteAdjustments(
          unitClass,
          gender,
          0,
          isMounted,
        );
        loopRef.current = loop;
        fpsRef.current = fps; // Set initial FPS

        // Start animation
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        animationRef.current = requestAnimationFrame(update);
      }
    }

    // Cleanup function
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [character, unitClass, gender, game, classMove]);

  // Function to extract a mask from an image
  const extractMask = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    x: number,
    y: number,
    width: number,
    height: number,
    maskType: "foreground" | "background",
  ) => {
    // Clear and draw the source image
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(
      img,
      x + offsetX,
      y + offsetY,
      width,
      height,
      0,
      0,
      width,
      height,
    );

    // Get the pixel data
    const imageData = ctx.getImageData(
      0,
      0,
      ctx.canvas.width,
      ctx.canvas.height,
    );
    const data = imageData.data;

    // Process each pixel to create the mask
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const isForegroundPixel = (r === 136 && g === 136 && b === 136) || (r === 255 && g === 255 && b === 255);
      const isBackgroundPixel = (r === 102 && g === 102 && b === 102) || (r === 238 && g === 238 && b === 238);

      // Set alpha based on mask type
      if (maskType === "foreground") {
        data[i + 3] = isForegroundPixel ? 255 : 0;
      } else {
        data[i + 3] = isBackgroundPixel ? 255 : 0;
      }

      // Make all visible pixels white (this will be used as a mask)
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
    }

    ctx.putImageData(imageData, 0, 0);
  };

  // Function to draw a masked sprite layer
  const drawMaskedLayer = (
    canvas: HTMLCanvasElement | null,
    img: HTMLImageElement,
    maskX: number,
    srcX: number,
    srcY: number,
    width: number,
    xOffset: number,
    yOffset: number,
    maskType: "foreground" | "background",
  ) => {
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Create temporary canvas for mask
    const maskCanvas = document.createElement("canvas");
    maskCanvas.width = frameWidth;
    maskCanvas.height = frameHeight;
    const maskCtx = maskCanvas.getContext("2d", { willReadFrequently: true });
    if (!maskCtx) return;

    // Extract the mask
    extractMask(maskCtx, img, maskX, srcY, width, frameHeight, maskType);

    // Draw the sprite content
    ctx.drawImage(
      img,
      srcX + offsetX,
      srcY + offsetY,
      width,
      frameHeight,
      xOffset,
      yOffset,
      width,
      frameHeight,
    );

    // Apply the mask
    ctx.globalCompositeOperation = "destination-in";
    ctx.drawImage(maskCanvas, xOffset, yOffset);

    // Reset composite operation
    ctx.globalCompositeOperation = "source-over";
  };

  const update = (timestamp: number) => {
    const now = timestamp;
    const elapsed = now - lastTimeRef.current;

    if (elapsed > 1000 / fpsRef.current) {
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

      let characterYOffsetAdjustment = 0;
      let characterXOffset = isMounted ? 6 : 0;

      const adjustment = getSpriteAdjustments(
        unitClass,
        gender,
        frameIndexRef.current,
        isMounted,
      );
      characterYOffsetAdjustment = adjustment.yOffsetAdjustment;
      characterXOffset += adjustment.xOffsetAdjustment;
      fpsRef.current = adjustment.fps; // Update FPS each frame

      if (adjustment.xOffsetOverride !== undefined) {
        characterXOffset = adjustment.xOffsetOverride;
      }

      const classImg = imagesRef.current[0];
      const characterImg = imagesRef.current[1];
      if (!classImg || !characterImg) return;

      // Sprite map positions (128 pixels to the right of each frame)
      const spriteMapXOffset =
        frameIndexRef.current * characterFrameWidth + 128;
      const classSpriteMapXOffset = frameIndexRef.current * frameWidth + 128;

      // Draw each layer to its dedicated canvas

      // 1. Class Background (bottom layer)
      drawMaskedLayer(
        classBackgroundCanvasRef.current,
        classImg,
        classSpriteMapXOffset,
        frameIndexRef.current * frameWidth,
        classYOffset,
        frameWidth,
        0,
        0,
        "background",
      );

      // 2. Character Background (second layer)
      drawMaskedLayer(
        characterBackgroundCanvasRef.current,
        characterImg,
        spriteMapXOffset,
        frameIndexRef.current * characterFrameWidth,
        characterYOffset,
        characterFrameWidth,
        characterXOffset,
        characterYOffsetAdjustment,
        "background",
      );

      // 3. Class Foreground (third layer)
      drawMaskedLayer(
        classForegroundCanvasRef.current,
        classImg,
        classSpriteMapXOffset,
        frameIndexRef.current * frameWidth,
        classYOffset,
        frameWidth,
        0,
        0,
        "foreground",
      );

      // 4. Character Foreground (top layer)
      drawMaskedLayer(
        characterForegroundCanvasRef.current,
        characterImg,
        spriteMapXOffset,
        frameIndexRef.current * characterFrameWidth,
        characterYOffset,
        characterFrameWidth,
        characterXOffset,
        characterYOffsetAdjustment,
        "foreground",
      );
    }

    animationRef.current = requestAnimationFrame(update);
  };

  // Container style for stacking canvases
  const containerStyle: React.CSSProperties = {
    position: "relative",
    width: `${frameWidth * displayScale}px`,
    height: `${frameHeight * displayScale}px`,
  };

  // Base canvas style
  const canvasStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    imageRendering: "pixelated",
    width: `${frameWidth * displayScale}px`,
    height: `${frameHeight * displayScale}px`,
  };

  return (
    <div style={containerStyle}>
      {/* Class Background */}
      <canvas
        ref={classBackgroundCanvasRef}
        width={frameWidth}
        height={frameHeight}
        style={{ ...canvasStyle, zIndex: 1 }}
      />

      {/* Character Background */}
      <canvas
        ref={characterBackgroundCanvasRef}
        width={frameWidth}
        height={frameHeight}
        style={{ ...canvasStyle, zIndex: 0 }}
      />

      {/* Class Foreground */}
      <canvas
        ref={classForegroundCanvasRef}
        width={frameWidth}
        height={frameHeight}
        style={{ ...canvasStyle, zIndex: 3 }}
      />

      {/* Character Foreground */}
      <canvas
        ref={characterForegroundCanvasRef}
        width={frameWidth}
        height={frameHeight}
        style={{ ...canvasStyle, zIndex: 2 }}
      />
    </div>
  );
};

export default SpriteAnimator;
