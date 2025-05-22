import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { parse } from "flatted";
import { Character } from "../types/Fire Emblem Fates/UnitStruct";
import { Class } from "../types/Fire Emblem Fates/ClassStruct";
import { StatBlock } from "../types/Fire Emblem Fates/UnitStruct";
import normalcurve from "../assets/images/nomal curve.png";
import "../styles/Averages.css";

const Averages = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const { state } = useLocation();
  const selectedRoute = state?.selectedRoute;

  const [units, setUnits] = useState<Character[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<Character | null>(null);

  useEffect(() => {
    if (gameId && selectedRoute) {
      const storedUnits = localStorage.getItem(
        `units_${gameId}_${selectedRoute}`,
      );
      if (storedUnits) {
        try {
          const parsedUnits: Character[] = parse(storedUnits);
          setUnits(parsedUnits);
          setSelectedUnit(parsedUnits.length > 0 ? parsedUnits[0] : null);
        } catch (error) {
          console.error("Error parsing stored units:", error);
        }
      }
    }
  }, [gameId, selectedRoute]);

  const handleUnitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = event.target.value;
    const unit = units.find((u) => u.name === selectedName) || null;
    setSelectedUnit(unit);
  };

  const calcStatsPerClassChange = () => {
    console.log("Starting");
    const classLineList = []
    if (!selectedUnit) return;
    classLineList.push(selectedUnit.class_line[0]) //Initialize w/ first instance 
    const classLine = selectedUnit.class_line;
    for (let i = 1; i <= classLine.length; i++) {
      const prev = classLine[i - 1];
      const curr: [number, number, Class, StatBlock] = i < classLine.length
        ? classLine[i]
        : [selectedUnit.internalLevel, selectedUnit.level, selectedUnit.class, selectedUnit.stats]; // final comparison to current unit
      const [prevInternal, prevLevel] = prev;
      const [currInternal, currLevel] = curr;
      if (currLevel - prevLevel === 0) {
        //Can discard info in here mostly
        console.log("No change in levels");
        classLineList.pop() // replace class as the change is irrelevant to growths
        classLineList.push(curr)      
      } else if (currInternal !== prevInternal) {
        //Can also discard info for here
        console.log("Promotion detected!");
      } else {
        console.log("Change in levels");
        classLineList.push(curr);
      }
    }
    console.log(selectedUnit.class_line);
    console.log(classLineList);
  };
  

  // const factorial = (n: number): number => {
  //   if (n <= 1) return 1;
  //   return n * factorial(n - 1);
  // };

  // // gets the major statistics for a stat
  // const getStats = (unit: Character) => {
  //   const n = unit.level - 1; // Number of level-ups
  //   const p = (unit.class.classGrowths.strength + unit.base_growths.strength) / 100; // Probability of strength increase
  //   const initialStrength = 8; // Assumed starting strength (adjust based on game data)
  //   const mean = n * p;
  //   const variance = n * p * (1 - p);
  //   const stdDev = Math.sqrt(variance);
  //   const zScore = (unit.stats.strength - initialStrength - mean) / stdDev;

  //   // Generate binomial PMF
  //   const x = Array.from({ length: n + 1 }, (_, i) => i);
  //   const pmf = x.map((k) => {
  //     const binomCoefficient = factorial(n) / (factorial(k) * factorial(n - k));
  //     return binomCoefficient * Math.pow(p, k) * Math.pow(1 - p, n - k);
  //   });

  //   const actualIncreases = unit.stats.strength - initialStrength;

  //   return { zScore, mean, stdDev, x, pmf, actualIncreases, initialStrength };
  // };

  return (
    <div className="page-container">
      <h1 className="top-margin">
        Stat Averages: {gameId} {selectedRoute}
      </h1>
      <div className="select-container">
        <select
          value={selectedUnit?.name || ""}
          onChange={handleUnitChange}
          disabled={units.length === 0}
          aria-describedby={
            units.length === 0 ? "no-units-message" : "List of your units"
          }
        >
          {units.length === 0 ? (
            <option value="" disabled>
              No units available
            </option>
          ) : (
            units.map((unit) => (
              <option key={unit.name} value={unit.name}>
                {unit.name}
              </option>
            ))
          )}
        </select>
      </div>
      {selectedUnit ? (
        <div className="averages-grid">
          <div className="grid-unit-info">
            <div className="averages-grid-top-contents">
              <h2>{selectedUnit.name}</h2>
              <p>
                <strong>Level:</strong> {selectedUnit.level}
              </p>
              <p>
                <strong>Class:</strong>{" "}
                {selectedUnit.class?.className || "Unknown"}
              </p>
              <div>
                <img
                  src={`/characters/${gameId}/${selectedUnit.name}.png`}
                  alt={selectedUnit.name}
                  className="character-image"
                />
              </div>
            </div>
            <div className="averages-grid-top-contents">
              <h2>Stats</h2>
              <ul>
                <li>HP: {selectedUnit.stats.hp}</li>
                <li>STR: {selectedUnit.stats.strength}</li>
                <li>MAG: {selectedUnit.stats.magic}</li>
                <li>SKL: {selectedUnit.stats.skill}</li>
                <li>SPD: {selectedUnit.stats.speed}</li>
                <li>LCK: {selectedUnit.stats.luck}</li>
                <li>DEF: {selectedUnit.stats.defence}</li>
                <li>RES: {selectedUnit.stats.resistance}</li>
                <li>MOV: {selectedUnit.stats.move}</li>
              </ul>
            </div>
            <div className="averages-grid-top-contents">
              <h2>Growth Rates</h2>
              <ul>
                <li>
                  HP:{" "}
                  {selectedUnit.class.classGrowths.hp +
                    selectedUnit.base_growths.hp}
                  %
                </li>
                <li>
                  STR:{" "}
                  {selectedUnit.class.classGrowths.strength +
                    selectedUnit.base_growths.strength}
                  %
                </li>
                <li>
                  MAG:{" "}
                  {selectedUnit.class.classGrowths.magic +
                    selectedUnit.base_growths.magic}
                  %
                </li>
                <li>
                  SKL:{" "}
                  {selectedUnit.class.classGrowths.skill +
                    selectedUnit.base_growths.skill}
                  %
                </li>
                <li>
                  SPD:{" "}
                  {selectedUnit.class.classGrowths.speed +
                    selectedUnit.base_growths.speed}
                  %
                </li>
                <li>
                  LCK:{" "}
                  {selectedUnit.class.classGrowths.luck +
                    selectedUnit.base_growths.luck}
                  %
                </li>
                <li>
                  DEF:{" "}
                  {selectedUnit.class.classGrowths.defence +
                    selectedUnit.base_growths.defence}
                  %
                </li>
                <li>
                  RES:{" "}
                  {selectedUnit.class.classGrowths.resistance +
                    selectedUnit.base_growths.resistance}
                  %
                </li>
              </ul>
            </div>
            <div className="averages-grid-top-contents">
              <h2>Stat Caps</h2>
              <ul>
                <li>HP: {selectedUnit.class.MaxStatCaps.hp}</li>
                <li>
                  STR:{" "}
                  {selectedUnit.maxStatModifiers.strength +
                    selectedUnit.class.MaxStatCaps.strength}
                </li>
                <li>
                  MAG:{" "}
                  {selectedUnit.maxStatModifiers.magic +
                    selectedUnit.class.MaxStatCaps.magic}
                </li>
                <li>
                  SKL:{" "}
                  {selectedUnit.maxStatModifiers.skill +
                    selectedUnit.class.MaxStatCaps.skill}
                </li>
                <li>
                  SPD:{" "}
                  {selectedUnit.maxStatModifiers.speed +
                    selectedUnit.class.MaxStatCaps.speed}
                </li>
                <li>
                  LCK:{" "}
                  {selectedUnit.maxStatModifiers.luck +
                    selectedUnit.class.MaxStatCaps.luck}
                </li>
                <li>
                  DEF:{" "}
                  {selectedUnit.maxStatModifiers.defence +
                    selectedUnit.class.MaxStatCaps.defence}
                </li>
                <li>
                  RES:{" "}
                  {selectedUnit.maxStatModifiers.resistance +
                    selectedUnit.class.MaxStatCaps.resistance}
                </li>
              </ul>
            </div>
          </div>
          <div className="averages-grid-bottom">
            <img
              className="normal-curve-image"
              src={normalcurve}
              alt="Normal curve"
            />
            {selectedUnit.name} is X standard deviations above/below average!
          </div>
        </div>
      ) : (
        <p className="no-units">No units available.</p>
      )}
      <button onClick={calcStatsPerClassChange}>TEST</button>
    </div>
  );
};

export default Averages;

// import React, { useEffect, useState } from "react";
// import { useParams, useLocation } from "react-router-dom";
// import { parse } from "flatted";
// import { Character } from "../types/Fire Emblem Fates/UnitStruct";
// import Plot from "react-plotly.js";
// import "../styles/Averages.css";

// const Averages = () => {
//   const { gameId } = useParams<{ gameId: string }>();
//   const { state } = useLocation();
//   const selectedRoute = state?.selectedRoute;

//   const [units, setUnits] = useState<Character[]>([]);
//   const [selectedUnit, setSelectedUnit] = useState<Character | null>(null);
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);

//   // Load units from localStorage on component mount
//   useEffect(() => {
//     if (gameId && selectedRoute) {
//       const storedUnits = localStorage.getItem(
//         `units_${gameId}_${selectedRoute}`,
//       );
//       if (storedUnits) {
//         try {
//           const parsedUnits: Character[] = parse(storedUnits);
//           setUnits(parsedUnits);
//           setSelectedUnit(parsedUnits.length > 0 ? parsedUnits[0] : null);
//         } catch (error) {
//           console.error("Error parsing stored units:", error);
//           setErrorMessage("Failed to load units. Please try again.");
//         }
//       } else {
//         setErrorMessage("No units found for this game and route.");
//       }
//     } else {
//       setErrorMessage("Invalid game or route selected.");
//     }
//   }, [gameId, selectedRoute]);

//   // Dropdown selection
//   const handleUnitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//     const selectedName = event.target.value;
//     const unit = units.find((u) => u.name === selectedName) || null;
//     setSelectedUnit(unit);
//   };

//   // Calculate binomial distribution and z-score for strength
//   const getStrengthStats = (unit: Character) => {
//     const n = unit.level - 1; // Number of level-ups
//     const p = (unit.class.classGrowths.strength + unit.base_growths.strength) / 100; // Probability of strength increase
//     const initialStrength = 8; // Assumed starting strength (adjust based on game data)
//     const mean = n * p;
//     const variance = n * p * (1 - p);
//     const stdDev = Math.sqrt(variance);
//     const zScore = (unit.stats.strength - initialStrength - mean) / stdDev;

//     // Generate binomial PMF
//     const x = Array.from({ length: n + 1 }, (_, i) => i);
//     const pmf = x.map((k) => {
//       const binomCoefficient = factorial(n) / (factorial(k) * factorial(n - k));
//       return binomCoefficient * Math.pow(p, k) * Math.pow(1 - p, n - k);
//     });

//     const actualIncreases = unit.stats.strength - initialStrength;

//     return { zScore, mean, stdDev, x, pmf, actualIncreases, initialStrength };
//   };

//   // Factorial function for binomial coefficient
//   const factorial = (n: number): number => {
//     if (n <= 1) return 1;
//     return n * factorial(n - 1);
//   };

//   // Generate Plotly data and layout
//   const getPlotData = (unit: Character) => {
//     const { x, pmf, actualIncreases, mean, stdDev } = getStrengthStats(unit);

//     return [
//       {
//         x,
//         y: pmf,
//         type: "bar",
//         name: "Binomial Distribution",
//         marker: { color: "skyblue", opacity: 0.7 },
//       },
//       {
//         x: [actualIncreases],
//         y: [pmf[actualIncreases] || 0],
//         type: "bar",
//         name: "Actual Strength",
//         marker: { color: "orange" },
//       },
//       {
//         x: [mean],
//         y: [0, Math.max(...pmf)],
//         type: "scatter",
//         mode: "lines",
//         name: `Mean: ${mean.toFixed(2)}`,
//         line: { color: "green", dash: "dash" },
//       },
//       {
//         x: [mean - stdDev, mean + stdDev],
//         y: [0, 0],
//         type: "scatter",
//         mode: "lines",
//         name: "±1 Std Dev",
//         line: { color: "red", dash: "dot" },
//         showlegend: true,
//       },
//     ];
//   };

//   const getPlotLayout = (unit: Character) => ({
//     title: `Strength Increases for ${unit.name}`,
//     xaxis: { title: "Number of Strength Increases" },
//     yaxis: { title: "Probability" },
//     showlegend: true,
//     margin: { t: 50, b: 50, l: 50, r: 50 },
//     plot_bgcolor: "#fff",
//     paper_bgcolor: "#fff",
//     height: 400,
//     autosize: true,
//   });

//   return (
//     <main>
//       <a href="#main-content" className="skip-link">
//         Skip to main content
//       </a>
//       <div className="page-container" id="main-content">
//         <h1 className="top-margin">
//           Stat Averages: {gameId} {selectedRoute}
//         </h1>
//         {errorMessage && (
//           <p className="error-message" role="alert">
//             {errorMessage}
//           </p>
//         )}
//         <div className="select-container">
//           <label htmlFor="unit-select" className="visually-hidden">
//             Select a unit to view stat averages
//           </label>
//           <select
//             id="unit-select"
//             value={selectedUnit?.name || ""}
//             onChange={handleUnitChange}
//             disabled={units.length === 0}
//             aria-describedby={units.length === 0 ? "no-units-message" : undefined}
//           >
//             {units.length === 0 ? (
//               <option value="" disabled>
//                 No units available
//               </option>
//             ) : (
//               units.map((unit) => (
//                 <option key={unit.name} value={unit.name}>
//                   {unit.name}
//                 </option>
//               ))
//             )}
//           </select>
//         </div>
//         {selectedUnit ? (
//           <section className="averages-grid" aria-label="Unit stat averages">
//             <article className="grid-unit-info">
//               <div className="averages-grid-top-contents">
//                 <h2>{selectedUnit.name}</h2>
//                 <p>
//                   <strong>Level:</strong> {selectedUnit.level}
//                 </p>
//                 <p>
//                   <strong>Class:</strong>{" "}
//                   {selectedUnit.class?.className || "Unknown"}
//                 </p>
//                 <div>
//                   <img
//                     src={`/characters/${gameId}/${selectedUnit.name}.png`}
//                     alt={`Portrait of ${selectedUnit.name} in Fire Emblem Fates`}
//                     className="character-image"
//                   />
//                 </div>
//               </div>
//               <div className="averages-grid-top-contents">
//                 <h2 id="stats-heading">Stats</h2>
//                 <ul aria-labelledby="stats-heading">
//                   <li>HP: {selectedUnit.stats.hp}</li>
//                   <li>STR: {selectedUnit.stats.strength}</li>
//                   <li>MAG: {selectedUnit.stats.magic}</li>
//                   <li>SKL: {selectedUnit.stats.skill}</li>
//                   <li>SPD: {selectedUnit.stats.speed}</li>
//                   <li>LCK: {selectedUnit.stats.luck}</li>
//                   <li>DEF: {selectedUnit.stats.defence}</li>
//                   <li>RES: {selectedUnit.stats.resistance}</li>
//                   <li>MOV: {selectedUnit.stats.move}</li>
//                 </ul>
//               </div>
//               <div className="averages-grid-top-contents">
//                 <h2 id="growth-rates-heading">Growth Rates</h2>
//                 <ul aria-labelledby="growth-rates-heading">
//                   <li>
//                     HP:{" "}
//                     {selectedUnit.class.classGrowths.hp +
//                       selectedUnit.base_growths.hp}
//                     %
//                   </li>
//                   <li>
//                     STR:{" "}
//                     {selectedUnit.class.classGrowths.strength +
//                       selectedUnit.base_growths.strength}
//                     %
//                   </li>
//                   <li>
//                     MAG:{" "}
//                     {selectedUnit.class.classGrowths.magic +
//                       selectedUnit.base_growths.magic}
//                     %
//                   </li>
//                   <li>
//                     SKL:{" "}
//                     {selectedUnit.class.classGrowths.skill +
//                       selectedUnit.base_growths.skill}
//                     %
//                   </li>
//                   <li>
//                     SPD:{" "}
//                     {selectedUnit.class.classGrowths.speed +
//                       selectedUnit.base_growths.speed}
//                     %
//                   </li>
//                   <li>
//                     LCK:{" "}
//                     {selectedUnit.class.classGrowths.luck +
//                       selectedUnit.base_growths.luck}
//                     %
//                   </li>
//                   <li>
//                     DEF:{" "}
//                     {selectedUnit.class.classGrowths.defence +
//                       selectedUnit.base_growths.defence}
//                     %
//                   </li>
//                   <li>
//                     RES:{" "}
//                     {selectedUnit.class.classGrowths.resistance +
//                       selectedUnit.base_growths.resistance}
//                     %
//                   </li>
//                 </ul>
//               </div>
//               <div className="averages-grid-top-contents">
//                 <h2 id="stat-caps-heading">Stat Caps</h2>
//                 <ul aria-labelledby="stat-caps-heading">
//                   <li>HP: {selectedUnit.class.MaxStatCaps.hp}</li>
//                   <li>
//                     STR:{" "}
//                     {selectedUnit.maxStatModifiers.strength +
//                       selectedUnit.class.MaxStatCaps.strength}
//                   </li>
//                   <li>
//                     MAG:{" "}
//                     {selectedUnit.maxStatModifiers.magic +
//                       selectedUnit.class.MaxStatCaps.magic}
//                   </li>
//                   <li>
//                     SKL:{" "}
//                     {selectedUnit.maxStatModifiers.skill +
//                       selectedUnit.class.MaxStatCaps.skill}
//                   </li>
//                   <li>
//                     SPD:{" "}
//                     {selectedUnit.maxStatModifiers.speed +
//                       selectedUnit.class.MaxStatCaps.speed}
//                   </li>
//                   <li>
//                     LCK:{" "}
//                     {selectedUnit.maxStatModifiers.luck +
//                       selectedUnit.class.MaxStatCaps.luck}
//                   </li>
//                   <li>
//                     DEF:{" "}
//                     {selectedUnit.maxStatModifiers.defence +
//                       selectedUnit.class.MaxStatCaps.defence}
//                   </li>
//                   <li>
//                     RES:{" "}
//                     {selectedUnit.maxStatModifiers.resistance +
//                       selectedUnit.class.MaxStatCaps.resistance}
//                   </li>
//                 </ul>
//               </div>
//             </article>
//             <div className="averages-grid-bottom">
//               <figure>
//                 <Plot
//                   data={getPlotData(selectedUnit)}
//                   layout={getPlotLayout(selectedUnit)}
//                   config={{ responsive: true }}
//                   style={{ width: "100%" }}
//                 />
//                 <figcaption className="visually-hidden">
//                   Binomial distribution of strength increases for {selectedUnit.name} in Fire Emblem Fates, showing the probability of strength gains over {selectedUnit.level - 1} level-ups, with the actual strength, mean, and standard deviation highlighted.
//                 </figcaption>
//               </figure>
//               <p aria-live="polite">
//                 {selectedUnit.name}’s strength is{" "}
//                 {Math.abs(getStrengthStats(selectedUnit).zScore).toFixed(2)} standard deviations{" "}
//                 {getStrengthStats(selectedUnit).zScore >= 0 ? "above" : "below"} the average.
//               </p>
//             </div>
//           </section>
//         ) : (
//           <p className="no-units" id="no-units-message" role="alert">
//             No units available.
//           </p>
//         )}
//       </div>
//     </main>
//   );
// };

// export default Averages;
