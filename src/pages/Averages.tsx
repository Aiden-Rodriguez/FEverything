import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { parse } from "flatted";
import { Character } from "../types/Fire Emblem Fates/UnitStruct";
import { Class } from "../types/Fire Emblem Fates/ClassStruct";
import { StatBlock } from "../types/Fire Emblem Fates/UnitStruct";
import { Bar } from "react-chartjs-2";
import SpriteAnimator from "../components/SpriteAnimator";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "../styles/Averages.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

// Helper function to approximate the error function (erf)
const erf = (x: number): number => {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x >= 0 ? 1 : -1;
  x = Math.abs(x);

  const t = 1.0 / (1.0 + p * x);
  const y =
    1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return sign * y;
};

// Helper function to compute standard normal CDF
const normalCDF = (z: number): number => {
  return 0.5 * (1 + erf(z / Math.SQRT2));
};

// Helper function to compute log-gamma for binomial coefficient
const lgamma = (z: number): number => {
  if (z <= 1) return 0;
  let result = 0;
  for (let i = 1; i < z; i++) {
    result += Math.log(i);
  }
  return result;
};

// Helper function to compute binomial PMF: P(X = x) for X ~ Binomial(n, p)
const binomialPMF = (x: number, n: number, p: number): number => {
  if (x < 0 || x > n) return 0;
  const coef = Math.exp(lgamma(n + 1) - lgamma(x + 1) - lgamma(n - x + 1));
  return coef * Math.pow(p, x) * Math.pow(1 - p, n - x);
};

// Helper function to get percentage text for a z-score
const getZScorePercentage = (z: number, characterName: string): string => {
  if (!isFinite(z) || z === 0) {
    return "Exactly Average";
  }
  const absZ = Math.abs(z);
  const cdf = normalCDF(absZ);
  const percent = Math.round(cdf * 100);
  if (z > 0) {
    return `Better than ~${percent}% of other ${characterName}`;
  }
  return `Worse than ~${percent}% of other ${characterName}`;
};

// Helper function to generate chart data for binomial distribution
const getChartData = (
  n: number,
  p: number,
  k: number,
  statName: string,
  characterName: string,
) => {
  const labels = Array.from({ length: n + 1 }, (_, i) => i.toString());
  const probabilities = labels.map((x) => binomialPMF(parseInt(x), n, p));
  const backgroundColors = labels.map((x) =>
    parseInt(x) === k ? "rgba(255, 99, 132, 0.8)" : "rgba(54, 162, 235, 0.8)",
  );

  return {
    labels,
    datasets: [
      {
        label: `Probability of ${statName} Gains`,
        data: probabilities,
        backgroundColor: backgroundColors,
        borderColor: backgroundColors.map((color) => color.replace("0.8", "1")),
        borderWidth: 1,
      },
    ],
  };
};

// Helper function to generate chart data for overall (normal approximation)
const getOverallChartData = (averageZScore: number, characterName: string) => {
  const xValues = Array.from({ length: 21 }, (_, i) => i / 5 - 2); // -2 to +2
  const probabilities = xValues.map(
    (x) =>
      (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * (x - averageZScore) ** 2),
  );
  const maxProb = Math.max(...probabilities);
  const normalizedProbs = probabilities.map((p) => p / maxProb);

  return {
    labels: xValues.map((x) => x.toFixed(1)),
    datasets: [
      {
        label: `Overall Performance (Normal Approx.)`,
        data: normalizedProbs,
        backgroundColor: "rgba(54, 162, 235, 0.8)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };
};

const Averages = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const { state } = useLocation();
  const selectedRoute = state?.selectedRoute;

  const [units, setUnits] = useState<Character[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<Character | null>(null);
  const [averageZScore, setAverageZScore] = useState<number | null>(null);
  const [statZScores, setStatZScores] = useState<number[] | null>(null);
  const [totalGrowthRates, setTotalGrowthRates] = useState<number[] | null>(
    null,
  );
  const [totalStatGains, setTotalStatGains] = useState<number[] | null>(null);
  const [totalLevelsGained, setTotalLevelsGained] = useState<number | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState<string>("overall");

  useEffect(() => {
    if (gameId && selectedRoute) {
      const storedUnits = localStorage.getItem(
        `units_${gameId}_${selectedRoute}`,
      );
      if (storedUnits) {
        try {
          const parsedUnits: Character[] = parse(storedUnits);
          setUnits(parsedUnits);
          const initialUnit = parsedUnits.length > 0 ? parsedUnits[0] : null;
          setSelectedUnit(initialUnit);
          if (initialUnit) {
            calcStatsPerClassChange(initialUnit);
          }
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
    setAverageZScore(null);
    setStatZScores(null);
    setTotalGrowthRates(null);
    setTotalStatGains(null);
    setTotalLevelsGained(null);
    setActiveTab("overall");
    if (unit) {
      calcStatsPerClassChange(unit);
    }
  };

  const calcStatsPerClassChange = (unit: Character) => {
    // console.log("Starting");
    if (!unit) return;
    const classLineList: [number, number, Class, StatBlock][] = [];
    const classLine = unit.class_line;
    if (classLine.length > 0) {
      classLineList.push(classLine[0]);
    }

    for (let i = 1; i <= classLine.length; i++) {
      const prev = classLine[i - 1];
      const curr: [number, number, Class, StatBlock] =
        i < classLine.length
          ? classLine[i]
          : [unit.internalLevel, unit.level, unit.class, unit.stats];
      const [prevInternal, prevLevel] = prev;
      const [currInternal, currLevel] = curr;
      if (currLevel - prevLevel === 0) {
        // console.log("No change in levels");
        classLineList.pop();
        classLineList.push(curr);
      } else if (currInternal !== prevInternal) {
        // console.log("Promotion detected!");
        classLineList.push(curr);
      } else {
        // console.log("Change in levels");
        classLineList.push(curr);
      }
    }

    const levelUpData: [number[], number[], number][] = [];
    for (let i = 1; i < classLineList.length; i++) {
      const initialClassData = classLineList[i - 1];
      const secondaryClassData = classLineList[i];

      if (initialClassData[0] !== secondaryClassData[0]) {
      } else {
        const growthRateHp =
          (initialClassData[2].classGrowths.hp + unit.base_growths.hp) / 100;
        const growthRateStrength =
          (initialClassData[2].classGrowths.strength +
            unit.base_growths.strength) /
          100;
        const growthRateMagic =
          (initialClassData[2].classGrowths.magic + unit.base_growths.magic) /
          100;
        const growthRateSkill =
          (initialClassData[2].classGrowths.skill + unit.base_growths.skill) /
          100;
        const growthRateSpeed =
          (initialClassData[2].classGrowths.speed + unit.base_growths.speed) /
          100;
        const growthRateLuck =
          (initialClassData[2].classGrowths.luck + unit.base_growths.luck) /
          100;
        const growthRateDefence =
          (initialClassData[2].classGrowths.defence +
            unit.base_growths.defence) /
          100;
        const growthRateResistance =
          (initialClassData[2].classGrowths.resistance +
            unit.base_growths.resistance) /
          100;

        const hpGained =
          secondaryClassData[3].hp -
          initialClassData[3].hp +
          (initialClassData[2].classBaseStats.hp -
            secondaryClassData[2].classBaseStats.hp);
        const strengthGained =
          secondaryClassData[3].strength -
          initialClassData[3].strength +
          (initialClassData[2].classBaseStats.strength -
            secondaryClassData[2].classBaseStats.strength);
        const magicGained =
          secondaryClassData[3].magic -
          initialClassData[3].magic +
          (initialClassData[2].classBaseStats.magic -
            secondaryClassData[2].classBaseStats.magic);
        const skillGained =
          secondaryClassData[3].skill -
          initialClassData[3].skill +
          (initialClassData[2].classBaseStats.skill -
            secondaryClassData[2].classBaseStats.skill);
        const speedGained =
          secondaryClassData[3].speed -
          initialClassData[3].speed +
          (initialClassData[2].classBaseStats.speed -
            secondaryClassData[2].classBaseStats.speed);
        const luckGained =
          secondaryClassData[3].luck -
          initialClassData[3].luck +
          (initialClassData[2].classBaseStats.luck -
            secondaryClassData[2].classBaseStats.luck);
        const defenceGained =
          secondaryClassData[3].defence -
          initialClassData[3].defence +
          (initialClassData[2].classBaseStats.defence -
            secondaryClassData[2].classBaseStats.defence);
        const resistanceGained =
          secondaryClassData[3].resistance -
          initialClassData[3].resistance +
          (initialClassData[2].classBaseStats.resistance -
            secondaryClassData[2].classBaseStats.resistance);

        const levelsGained = secondaryClassData[1] - initialClassData[1];

        levelUpData.push([
          [
            growthRateHp,
            growthRateStrength,
            growthRateMagic,
            growthRateSkill,
            growthRateSpeed,
            growthRateLuck,
            growthRateDefence,
            growthRateResistance,
          ],
          [
            hpGained,
            strengthGained,
            magicGained,
            skillGained,
            speedGained,
            luckGained,
            defenceGained,
            resistanceGained,
          ],
          levelsGained,
        ]);
      }
    }

    const zScoresByPeriod: number[][] = [];
    let totalLevelsGained: number = 0;
    const totalStatGains: number[] = [0, 0, 0, 0, 0, 0, 0, 0];
    const weightedGrowthSums: number[] = [0, 0, 0, 0, 0, 0, 0, 0];

    levelUpData.forEach(
      ([growthRates, statGains, levelsGained], periodIndex) => {
        const zScores: number[] = [];
        if (levelsGained === 0) {
          // console.log(
          //   `Period ${periodIndex}: No level-ups, skipping z-score calculation`
          // );
          return;
        }
        totalLevelsGained += levelsGained;
        growthRates.forEach((p, statIndex) => {
          const k = statGains[statIndex];
          totalStatGains[statIndex] += k;
          weightedGrowthSums[statIndex] += p * levelsGained;
          const mean = levelsGained * p;
          const variance = levelsGained * p * (1 - p);
          const stdDev = Math.sqrt(variance);
          let zScore = 0;
          if (stdDev > 0) {
            zScore = (k - mean) / stdDev;
          } else if (k !== mean) {
            zScore = k > mean ? Infinity : -Infinity;
          }
          zScores.push(zScore);
        });
        zScoresByPeriod.push(zScores);
        // console.log(`Period ${periodIndex} z-scores:`, zScores);
      },
    );

    let overallAverageZScore = null;
    let lastStatZScores: number[] | null = null;
    let totalGrowthRates: number[] | null = null;
    if (zScoresByPeriod.length > 0) {
      const allZScores: number[] = zScoresByPeriod
        .flat()
        .filter((z) => isFinite(z));
      lastStatZScores = zScoresByPeriod[zScoresByPeriod.length - 1] || null;
      if (allZScores.length > 0) {
        const sumZScores = allZScores.reduce((sum, z) => sum + z, 0);
        overallAverageZScore = sumZScores / allZScores.length;
      }
      if (totalLevelsGained > 0) {
        totalGrowthRates = weightedGrowthSums.map(
          (sum) => sum / totalLevelsGained,
        );
      }
    }

    setAverageZScore(overallAverageZScore);
    setStatZScores(lastStatZScores);
    setTotalGrowthRates(totalGrowthRates);
    setTotalStatGains(totalStatGains);
    setTotalLevelsGained(totalLevelsGained);
    // console.log("levelUpData:", levelUpData);
    // console.log("Overall average z-score:", overallAverageZScore);
    // console.log("Last period stat z-scores:", lastStatZScores);
    // console.log("Total growth rates:", totalGrowthRates);
    // console.log("Total stat gains:", totalStatGains);
    // console.log("Total levels gained:", totalLevelsGained);
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1.5,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text:
          activeTab === "overall"
            ? "Overall Performance Distribution"
            : `${activeTab.toUpperCase()} Gain Distribution`,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: activeTab === "overall" ? "Z-Score" : "Stat Gains",
        },
      },
      y: {
        title: {
          display: true,
          text: "Probability",
        },
        beginAtZero: true,
      },
    },
  };

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
        {selectedUnit ? (
          <div className="unit-sprite">
            <div className="sprite-wrapper">
              <SpriteAnimator
                character={selectedUnit.name}
                gender={selectedUnit.gender}
                class={selectedUnit.class.className}
                game={gameId ?? ""}
                displayScale={2}
                classMove={selectedUnit.class.classBaseStats.move}
                faction="Player"
                animationId={0}
              />
            </div>
          </div>
        ) : null}
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
            {averageZScore !== null &&
            statZScores !== null &&
            totalGrowthRates !== null &&
            totalStatGains !== null &&
            totalLevelsGained !== null &&
            totalLevelsGained > 0 ? (
              <div>
                <div className="tab-container">
                  {[
                    "overall",
                    "hp",
                    "str",
                    "mag",
                    "skl",
                    "spd",
                    "lck",
                    "def",
                    "res",
                  ].map((tab) => (
                    <button
                      key={tab}
                      className={`tab-button ${activeTab === tab ? "active" : ""}`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab === "overall" ? "Overall" : tab.toUpperCase()}
                    </button>
                  ))}
                </div>
                <div className="chart-container">
                  {activeTab === "overall" ? (
                    <Bar
                      data={getOverallChartData(
                        averageZScore,
                        selectedUnit.name,
                      )}
                      options={chartOptions}
                    />
                  ) : (
                    <Bar
                      data={getChartData(
                        totalLevelsGained,
                        totalGrowthRates[
                          [
                            "hp",
                            "str",
                            "mag",
                            "skl",
                            "spd",
                            "lck",
                            "def",
                            "res",
                          ].indexOf(activeTab)
                        ],
                        totalStatGains[
                          [
                            "hp",
                            "str",
                            "mag",
                            "skl",
                            "spd",
                            "lck",
                            "def",
                            "res",
                          ].indexOf(activeTab)
                        ],
                        activeTab.toUpperCase(),
                        selectedUnit.name,
                      )}
                      options={chartOptions}
                    />
                  )}
                </div>
                <p>
                  {selectedUnit.name} is {Math.abs(averageZScore).toFixed(2)}{" "}
                  standard deviations {averageZScore >= 0 ? "above" : "below"}{" "}
                  average (
                  {getZScorePercentage(averageZScore, selectedUnit.name)}
                  )! <br />
                  Per-stat standard deviations: <br />
                  Note that at very low change in levels this may be inaccurate
                  due to levels being discrete and not continuous. <br />
                  HP:{" "}
                  {isFinite(statZScores[0])
                    ? `${statZScores[0].toFixed(2)} (${getZScorePercentage(
                        statZScores[0],
                        selectedUnit.name,
                      )})`
                    : "N/A"}{" "}
                  <br />
                  STR:{" "}
                  {isFinite(statZScores[1])
                    ? `${statZScores[1].toFixed(2)} (${getZScorePercentage(
                        statZScores[1],
                        selectedUnit.name,
                      )})`
                    : "N/A"}{" "}
                  <br />
                  MAG:{" "}
                  {isFinite(statZScores[2])
                    ? `${statZScores[2].toFixed(2)} (${getZScorePercentage(
                        statZScores[2],
                        selectedUnit.name,
                      )})`
                    : "N/A"}{" "}
                  <br />
                  SKL:{" "}
                  {isFinite(statZScores[3])
                    ? `${statZScores[3].toFixed(2)} (${getZScorePercentage(
                        statZScores[3],
                        selectedUnit.name,
                      )})`
                    : "N/A"}{" "}
                  <br />
                  SPD:{" "}
                  {isFinite(statZScores[4])
                    ? `${statZScores[4].toFixed(2)} (${getZScorePercentage(
                        statZScores[4],
                        selectedUnit.name,
                      )})`
                    : "N/A"}{" "}
                  <br />
                  LCK:{" "}
                  {isFinite(statZScores[5])
                    ? `${statZScores[5].toFixed(2)} (${getZScorePercentage(
                        statZScores[5],
                        selectedUnit.name,
                      )})`
                    : "N/A"}{" "}
                  <br />
                  DEF:{" "}
                  {isFinite(statZScores[6])
                    ? `${statZScores[6].toFixed(2)} (${getZScorePercentage(
                        statZScores[6],
                        selectedUnit.name,
                      )})`
                    : "N/A"}{" "}
                  <br />
                  RES:{" "}
                  {isFinite(statZScores[7])
                    ? `${statZScores[7].toFixed(2)} (${getZScorePercentage(
                        statZScores[7],
                        selectedUnit.name,
                      )})`
                    : "N/A"}
                </p>
              </div>
            ) : (
              <p>No level ups for the unit yet</p>
            )}
          </div>
        </div>
      ) : (
        <p className="no-units">No units available.</p>
      )}
    </div>
  );
};

export default Averages;
