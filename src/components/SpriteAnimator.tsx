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
  const mainCanvasRef = useRef<HTMLCanvasElement>(null);

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

  let characterYOffset = isMounted ? 0 + 32 : 1; // Workaround to prevent sprite below from showing
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

        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        animationRef.current = requestAnimationFrame(update);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [character, unitClass, gender, game, classMove]);

  const extractMask = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    x: number,
    y: number,
    width: number,
    height: number,
    maskType: "foreground" | "background",
  ) => {
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

    const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const isForegroundPixel = (r === 136 && g === 136 && b === 136) || (r === 255 && g === 255 && b === 255);
      const isBackgroundPixel = (r === 102 && g === 102 && b === 102) || (r === 238 && g === 238 && b === 238);

      if (maskType === "foreground") {
        data[i + 3] = isForegroundPixel ? 255 : 0;
      } else {
        data[i + 3] = isBackgroundPixel ? 255 : 0;
      }

      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const drawMaskedLayer = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    maskX: number,
    srcX: number,
    srcY: number,
    width: number,
    xOffset: number,
    yOffset: number,
    maskType: "foreground" | "background",
  ) => {
    // Create temporary canvas for mask
    const maskCanvas = document.createElement("canvas");
    maskCanvas.width = frameWidth;
    maskCanvas.height = frameHeight;
    const maskCtx = maskCanvas.getContext("2d", { willReadFrequently: true });
    if (!maskCtx) return;

    // Extract the mask
    extractMask(maskCtx, img, maskX, srcY, width, frameHeight, maskType);

    // Draw the sprite content onto a temporary canvas first to isolate the layer
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = frameWidth;
    tempCanvas.height = frameHeight;
    const tempCtx = tempCanvas.getContext("2d", { willReadFrequently: true });
    if (!tempCtx) return;

    tempCtx.drawImage(
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

    // Apply the mask to the temporary canvas
    tempCtx.globalCompositeOperation = "destination-in";
    tempCtx.drawImage(maskCanvas, xOffset, yOffset);
    tempCtx.globalCompositeOperation = "source-over";

    // Draw the masked layer onto the main canvas
    ctx.drawImage(tempCanvas, 0, 0);


    // const debugData = ctx.getImageData(0, 0, 1, 1).data;
    // console.log(`Layer drawn at (${xOffset}, ${yOffset}), pixel at (0,0): R=${debugData[0]}, G=${debugData[1]}, B=${debugData[2]}, A=${debugData[3]}`);
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

      // Get the main canvas context
      const canvas = mainCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Clear the canvas for the new frame
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Sprite map positions (128 pixels to the right of each frame)
      const spriteMapXOffset =
        frameIndexRef.current * characterFrameWidth + 128;
      const classSpriteMapXOffset = frameIndexRef.current * frameWidth + 128;

      // Draw all layers onto the main canvas in the correct order
      // 1. Character Background (lowest layer)
      drawMaskedLayer(
        ctx,
        characterImg,
        spriteMapXOffset,
        frameIndexRef.current * characterFrameWidth,
        characterYOffset,
        characterFrameWidth,
        characterXOffset,
        characterYOffsetAdjustment,
        "background",
      );

      // 2. Class Background
      drawMaskedLayer(
        ctx,
        classImg,
        classSpriteMapXOffset,
        frameIndexRef.current * frameWidth,
        classYOffset,
        frameWidth,
        0,
        0,
        "background",
      );

      // 3. Character Foreground
      drawMaskedLayer(
        ctx,
        characterImg,
        spriteMapXOffset,
        frameIndexRef.current * characterFrameWidth,
        characterYOffset,
        characterFrameWidth,
        characterXOffset,
        characterYOffsetAdjustment,
        "foreground",
      );

      // 4. Class Foreground (highest layer)
      drawMaskedLayer(
        ctx,
        classImg,
        classSpriteMapXOffset,
        frameIndexRef.current * frameWidth,
        classYOffset,
        frameWidth,
        0,
        0,
        "foreground",
      );
    }

    animationRef.current = requestAnimationFrame(update);
  };

  // Container style for the single canvas
  const containerStyle: React.CSSProperties = {
    position: "relative",
    width: `${frameWidth * displayScale}px`,
    height: `${frameHeight * displayScale}px`,
  };

  // Canvas style
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
      {/* Single canvas for all layers */}
      <canvas
        ref={mainCanvasRef}
        width={frameWidth}
        height={frameHeight}
        style={canvasStyle}
      />
    </div>
  );
};

export default SpriteAnimator;

//for downloading the pngs...


// import React, { useRef, useEffect } from "react";
// import { getSpriteAdjustments } from "../components/SpriteAdjustment";

// interface SpriteAnimatorProps {
//   character: string;
//   gender: string;
//   class: string;
//   game: string;
//   displayScale?: number;
//   classMove: number;
//   faction: string;
//   animationId: number;
// }

// const SpriteAnimator: React.FC<SpriteAnimatorProps> = ({
//   character,
//   gender,
//   class: unitClass,
//   game,
//   displayScale = 4,
//   classMove,
//   faction,
//   animationId,
// }) => {
//   const mainCanvasRef = useRef<HTMLCanvasElement>(null);
//   const imagesRef = useRef<HTMLImageElement[]>([]);
//   const frameIndexRef = useRef(0);
//   const lastTimeRef = useRef(0);
//   const directionRef = useRef(1);
//   const loopRef = useRef(true);
//   const animationRef = useRef<number>(0);
//   const fpsRef = useRef(4); // Default FPS, will be updated by getSpriteAdjustments
//   const isCapturingRef = useRef(false);
//   const capturedFramesRef = useRef<ImageData[]>([]);

//   const frameCount = 4;

//   const offsetX = 2;
//   const offsetY = 2;

//   let isMounted = classMove >= 7 || unitClass === "Ballistician";

//   let characterYOffset = isMounted ? 0 + 32 : 1; // Workaround to prevent sprite below from showing
//   let characterFrameWidth = isMounted ? 16 : 32;

//   const frameWidth = 32;
//   const frameHeight = 32;

//   let classYOffset;
//   if (faction === "Valla") {
//     classYOffset = 0;
//   } else if (faction === "Ally") {
//     classYOffset = 552;
//   } else if (faction === "Enemy") {
//     classYOffset = 1104;
//   } else {
//     classYOffset = 1656;
//   }

//   if (animationId >= 9 || animationId <= -1) {
//     throw console.error("Out of bounds animation - Class.");
//   } else if (animationId !== 0) {
//     classYOffset += 36 + (animationId - 1) * 32;
//   }

//   if (animationId >= 9 || animationId <= -1) {
//     throw console.error("Out of bounds animation - Character.");
//   } else if (animationId !== 0 && isMounted) {
//     characterYOffset += 358 + (animationId - 1) * 16;
//   } else if (animationId !== 0) {
//     characterYOffset += 68 + (animationId - 1) * 32;
//   }

//   const characterSrc = `/spritesheets/${game}/character/${character}.png`;
//   const genderedClassSrc = `/spritesheets/${game}/class/${unitClass} ${gender}.png`;
//   const fallbackClassSrc = `/spritesheets/${game}/class/${unitClass}.png`;

//   useEffect(() => {
//     const loadedImages: HTMLImageElement[] = [];
//     let loadedCount = 0;

//     const classImg = new Image();
//     classImg.src = genderedClassSrc;

//     classImg.onload = () => {
//       loadedImages[0] = classImg;
//       maybeStart();
//     };

//     classImg.onerror = () => {
//       const fallbackImg = new Image();
//       fallbackImg.src = fallbackClassSrc;
//       fallbackImg.onload = () => {
//         loadedImages[0] = fallbackImg;
//         maybeStart();
//       };
//       fallbackImg.onerror = () => console.error("Failed to load class image");
//     };

//     const characterImg = new Image();
//     characterImg.src = characterSrc;
//     characterImg.onload = () => {
//       loadedImages[1] = characterImg;
//       maybeStart();
//     };
//     characterImg.onerror = () =>
//       console.error("Failed to load character image");

//     function maybeStart() {
//       loadedCount++;
//       if (loadedCount === 2) {
//         imagesRef.current = loadedImages;
//         const { loop, fps } = getSpriteAdjustments(
//           unitClass,
//           gender,
//           0,
//           isMounted,
//         );
//         loopRef.current = loop;
//         fpsRef.current = fps; // Set initial FPS

//         if (animationRef.current) {
//           cancelAnimationFrame(animationRef.current);
//         }
//         animationRef.current = requestAnimationFrame(update);
//       }
//     }

//     return () => {
//       if (animationRef.current) {
//         cancelAnimationFrame(animationRef.current);
//       }
//     };
//   }, [character, unitClass, gender, game, classMove]);

//   const extractMask = (
//     ctx: CanvasRenderingContext2D,
//     img: HTMLImageElement,
//     x: number,
//     y: number,
//     width: number,
//     height: number,
//     maskType: "foreground" | "background",
//   ) => {
//     ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
//     ctx.drawImage(
//       img,
//       x + offsetX,
//       y + offsetY,
//       width,
//       height,
//       0,
//       0,
//       width,
//       height,
//     );

//     const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
//     const data = imageData.data;

//     for (let i = 0; i < data.length; i += 4) {
//       const r = data[i];
//       const g = data[i + 1];
//       const b = data[i + 2];

//       const isForegroundPixel = (r === 136 && g === 136 && b === 136) || (r === 255 && g === 255 && b === 255);
//       const isBackgroundPixel = (r === 102 && g === 102 && b === 102) || (r === 238 && g === 238 && b === 238);

//       if (maskType === "foreground") {
//         data[i + 3] = isForegroundPixel ? 255 : 0;
//       } else {
//         data[i + 3] = isBackgroundPixel ? 255 : 0;
//       }

//       data[i] = 255;
//       data[i + 1] = 255;
//       data[i + 2] = 255;
//     }

//     ctx.putImageData(imageData, 0, 0);
//   };

//   const drawMaskedLayer = (
//     ctx: CanvasRenderingContext2D,
//     img: HTMLImageElement,
//     maskX: number,
//     srcX: number,
//     srcY: number,
//     width: number,
//     xOffset: number,
//     yOffset: number,
//     maskType: "foreground" | "background",
//   ) => {
//     const maskCanvas = document.createElement("canvas");
//     maskCanvas.width = frameWidth;
//     maskCanvas.height = frameHeight;
//     const maskCtx = maskCanvas.getContext("2d", { willReadFrequently: true });
//     if (!maskCtx) return;

//     extractMask(maskCtx, img, maskX, srcY, width, frameHeight, maskType);

//     const tempCanvas = document.createElement("canvas");
//     tempCanvas.width = frameWidth;
//     tempCanvas.height = frameHeight;
//     const tempCtx = tempCanvas.getContext("2d", { willReadFrequently: true });
//     if (!tempCtx) return;

//     tempCtx.drawImage(
//       img,
//       srcX + offsetX,
//       srcY + offsetY,
//       width,
//       frameHeight,
//       xOffset,
//       yOffset,
//       width,
//       frameHeight,
//     );

//     tempCtx.globalCompositeOperation = "destination-in";
//     tempCtx.drawImage(maskCanvas, xOffset, yOffset);
//     tempCtx.globalCompositeOperation = "source-over";

//     ctx.drawImage(tempCanvas, 0, 0);
//   };

//   const update = (timestamp: number) => {
//     const now = timestamp;
//     const elapsed = now - lastTimeRef.current;

//     if (elapsed > 1000 / fpsRef.current) {
//       lastTimeRef.current = now;

//       if (loopRef.current) {
//         frameIndexRef.current = (frameIndexRef.current + 1) % frameCount;
//       } else {
//         frameIndexRef.current += directionRef.current;
//         if (
//           frameIndexRef.current === frameCount - 1 ||
//           frameIndexRef.current === 0
//         ) {
//           directionRef.current *= -1;
//         }
//       }

//       let characterYOffsetAdjustment = 0;
//       let characterXOffset = isMounted ? 6 : 0;

//       const adjustment = getSpriteAdjustments(
//         unitClass,
//         gender,
//         frameIndexRef.current,
//         isMounted,
//       );
//       characterYOffsetAdjustment = adjustment.yOffsetAdjustment;
//       characterXOffset += adjustment.xOffsetAdjustment;
//       fpsRef.current = adjustment.fps; // Update FPS each frame

//       if (adjustment.xOffsetOverride !== undefined) {
//         characterXOffset = adjustment.xOffsetOverride;
//       }

//       const classImg = imagesRef.current[0];
//       const characterImg = imagesRef.current[1];
//       if (!classImg || !characterImg) return;

//       const canvas = mainCanvasRef.current;
//       if (!canvas) return;
//       const ctx = canvas.getContext("2d", { willReadFrequently: true });
//       if (!ctx) return;

//       ctx.clearRect(0, 0, canvas.width, canvas.height);

//       const spriteMapXOffset =
//         frameIndexRef.current * characterFrameWidth + 128;
//       const classSpriteMapXOffset = frameIndexRef.current * frameWidth + 128;

//       // Draw all layers onto the main canvas
//       drawMaskedLayer(
//         ctx,
//         characterImg,
//         spriteMapXOffset,
//         frameIndexRef.current * characterFrameWidth,
//         characterYOffset,
//         characterFrameWidth,
//         characterXOffset,
//         characterYOffsetAdjustment,
//         "background",
//       );

//       drawMaskedLayer(
//         ctx,
//         classImg,
//         classSpriteMapXOffset,
//         frameIndexRef.current * frameWidth,
//         classYOffset,
//         frameWidth,
//         0,
//         0,
//         "background",
//       );

//       drawMaskedLayer(
//         ctx,
//         characterImg,
//         spriteMapXOffset,
//         frameIndexRef.current * characterFrameWidth,
//         characterYOffset,
//         characterFrameWidth,
//         characterXOffset,
//         characterYOffsetAdjustment,
//         "foreground",
//       );

//       drawMaskedLayer(
//         ctx,
//         classImg,
//         classSpriteMapXOffset,
//         frameIndexRef.current * frameWidth,
//         classYOffset,
//         frameWidth,
//         0,
//         0,
//         "foreground",
//       );

//       // Capture frame for PNG download if capturing is active
//       if (isCapturingRef.current) {
//         const imageData = ctx.getImageData(0, 0, frameWidth, frameHeight);
//         capturedFramesRef.current.push(imageData);
//         console.log(`Captured frame ${capturedFramesRef.current.length}, data length: ${imageData.data.length}`);
//         console.log("Sample pixel at (0,0):", ctx.getImageData(0, 0, 1, 1).data);

//         if (capturedFramesRef.current.length >= frameCount) {
//           isCapturingRef.current = false;
//           downloadPNGs();
//         }
//       }
//     }

//     animationRef.current = requestAnimationFrame(update);
//   };

//   const handleDownloadPNGs = () => {
//     console.log("Download PNGs button clicked.");
//     if (capturedFramesRef.current.length >= frameCount) {
//       console.log("Frames already captured, downloading PNGs...");
//       downloadPNGs();
//     } else {
//       console.log("Starting frame capture...");
//       capturedFramesRef.current = [];
//       isCapturingRef.current = true;
//     }
//   };

//   const downloadPNGs = () => {
//     console.log("Downloading PNGs with frames:", capturedFramesRef.current.length);
//     if (capturedFramesRef.current.length !== frameCount) {
//       console.error("Not enough frames to download PNGs.");
//       return;
//     }

//     try {
//       capturedFramesRef.current.forEach((frame, index) => {
//         const tempCanvas = document.createElement("canvas");
//         tempCanvas.width = frameWidth;
//         tempCanvas.height = frameHeight;
//         const tempCtx = tempCanvas.getContext("2d");
//         if (!tempCtx) throw new Error("Failed to get temp canvas context");

//         // Put the frame data onto the temporary canvas
//         tempCtx.putImageData(frame, 0, 0);

//         // Convert to PNG and download
//         tempCanvas.toBlob((blob) => {
//           if (!blob) throw new Error("Failed to create PNG blob");
//           console.log(`Generated PNG blob for frame ${index + 1}, size: ${blob.size}`);
//           const url = URL.createObjectURL(blob);
//           const a = document.createElement("a");
//           a.href = url;
//           a.download = `${character}-${fpsRef.current}fps-${index + 1}.png`;
//           document.body.appendChild(a);
//           a.click();
//           document.body.removeChild(a);
//           URL.revokeObjectURL(url);
//           console.log(`Downloaded frame ${index + 1} as ${a.download}`);
//         }, "image/png");
//       });

//       capturedFramesRef.current = [];
//     } catch (error) {
//       console.error("Error downloading PNGs:", error);
//     }
//   };

//   const containerStyle: React.CSSProperties = {
//     position: "relative",
//     width: `${frameWidth * displayScale}px`,
//     height: `${(frameHeight * displayScale) + 50}px`, // Extra space for button
//   };

//   const canvasStyle: React.CSSProperties = {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     imageRendering: "pixelated",
//     width: `${frameWidth * displayScale}px`,
//     height: `${frameHeight * displayScale}px`,
//   };

//   const buttonStyle: React.CSSProperties = {
//     marginTop: `${frameHeight * displayScale + 10}px`,
//     padding: "5px 10px",
//     backgroundColor: "#007bff",
//     color: "white",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//     display: "block",
//     zIndex: 10,
//   };

//   return (
//     <div style={containerStyle}>
//       <canvas
//         ref={mainCanvasRef}
//         width={frameWidth}
//         height={frameHeight}
//         style={canvasStyle}
//       />
//       <button onClick={handleDownloadPNGs} style={buttonStyle}>
//         Download PNGs
//       </button>
//     </div>
//   );
// };

// export default SpriteAnimator;