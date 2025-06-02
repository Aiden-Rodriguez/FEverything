import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { parse } from "flatted";
import { BaseCharacter } from "../types/Fire Emblem Fates/UnitStruct";
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

const normalCDF = (z: number): number => {
  return 0.5 * (1 + erf(z / Math.SQRT2));
};

const lgamma = (z: number): number => {
  if (z <= 1) return 0;
  let result = 0;
  for (let i = 1; i < z; i++) {
    result += Math.log(i);
  }
  return result;
};

const binomialPMF = (x: number, n: number, p: number): number => {
  if (x < 0 || x > n) return 0;
  const coef = Math.exp(lgamma(n + 1) - lgamma(x + 1) - lgamma(n - x + 1));
  return coef * Math.pow(p, x) * Math.pow(1 - p, n - x);
};

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

const getChartData = (
  n: number,
  p: number,
  k: number,
  statName: string,
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

const getOverallChartData = (averageZScore: number) => {
  const xValues = Array.from({ length: 31 }, (_, i) => i / 5 - 3);
  const probabilities = xValues.map(
    (x) => (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * x ** 2),
  );
  const maxProb = Math.max(...probabilities);
  const normalizedProbs = probabilities.map((p) => p / maxProb);

  const closestIndex = xValues.reduce((closestIdx, x, idx) => {
    return Math.abs(x - averageZScore) <
      Math.abs(xValues[closestIdx] - averageZScore)
      ? idx
      : closestIdx;
  }, 0);

  const backgroundColors = xValues.map((_, idx) =>
    idx === closestIndex
      ? "rgba(255, 99, 132, 0.8)"
      : "rgba(54, 162, 235, 0.8)",
  );

  return {
    labels: xValues.map((x) => x.toFixed(1)),
    datasets: [
      {
        label: `Overall Performance (Normal Approx.)`,
        data: normalizedProbs,
        backgroundColor: backgroundColors,
        borderColor: backgroundColors.map((color) => color.replace("0.8", "1")),
        borderWidth: 1,
      },
    ],
  };
};

const Averages = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const { state } = useLocation();
  const selectedRoute = state?.selectedRoute;

  const [units, setUnits] = useState<BaseCharacter[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<BaseCharacter | null>(null);
  const [averageZScore, setAverageZScore] = useState<number | null>(null);
  const [statZScores, setStatZScores] = useState<number[] | null>(null);
  const [totalGrowthRates, setTotalGrowthRates] = useState<number[] | null>(null);
  const [totalStatGains, setTotalStatGains] = useState<number[] | null>(null);
  const [totalLevelsGained, setTotalLevelsGained] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<string>("overall");
  const [hasAptitudeEquipped, setHasAptitudeEquipped] = useState(false);

  const checkAptitude = () => {
    if (!selectedUnit) return;
    setHasAptitudeEquipped(
      selectedUnit.equipped_skills.some(skill => skill.name === "Aptitude"),
    );
  };

  useEffect(() => {
    checkAptitude();
  }, [selectedUnit]);

  useEffect(() => {
    if (gameId && selectedRoute) {
      const storedUnits = localStorage.getItem(`units_${gameId}_${selectedRoute}`);
      if (storedUnits) {
        try {
          const parsedUnits: BaseCharacter[] = parse(storedUnits);
          setUnits(parsedUnits);
          const initialUnit = parsedUnits.length > 0 ? parsedUnits[0] : null;
          setSelectedUnit(initialUnit);
        } catch (error) {
          console.error("Error parsing stored units:", error);
        }
      }
    }
  }, [gameId, selectedRoute]);

  useEffect(() => {
    if (selectedUnit) {
      calcStatsPerClassChange(selectedUnit);
    }
  }, [selectedUnit, hasAptitudeEquipped]);

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
  };

  const calcStatsPerClassChange = (unit: BaseCharacter) => {
    if (!unit) return;
    const classLineList: [number, number, Class, StatBlock][] = [];
    const classLine = unit.class_line;

    // Initialize with the first class line entry
    if (classLine.length > 0) {
      classLineList.push(classLine[0]);
    }

    // Build classLineList, only adding entries with level or class changes
    for (let i = 1; i < classLine.length; i++) {
      const prev = classLine[i - 1];
      const curr = classLine[i];
      const [prevInternal, prevLevel] = prev;
      const [currInternal, currLevel] = curr;
      if (currLevel !== prevLevel || currInternal !== prevInternal) {
        classLineList.push(curr);
      }
    }

    // Add current unit state if it represents a level increase
    const lastClassLine = classLine[classLine.length - 1] || [unit.internalLevel, unit.level, unit.class, unit.stats];
    const [lastInternal, lastLevel] = lastClassLine;
    if (unit.level > lastLevel || unit.internalLevel !== lastInternal) {
      classLineList.push([unit.internalLevel, unit.level, unit.class, unit.stats]);
    }

    const levelUpData: [number[], number[], number][] = [];
    for (let i = 1; i < classLineList.length; i++) {
      const initialClassData = classLineList[i - 1];
      const secondaryClassData = classLineList[i];

      // Process all periods where levels have increased
      const levelsGained = secondaryClassData[1] - initialClassData[1];
      if (levelsGained <= 0) continue;

      // Apply Aptitude boost (+10%) for graphs and levelUpData
      const aptitudeBoost = hasAptitudeEquipped ? 0.10 : 0;
      const growthRateHp =
        (initialClassData[2].classGrowths.hp + unit.base_growths.hp) / 100 + aptitudeBoost;
      const growthRateStrength =
        (initialClassData[2].classGrowths.strength + unit.base_growths.strength) / 100 + aptitudeBoost;
      const growthRateMagic =
        (initialClassData[2].classGrowths.magic + unit.base_growths.magic) / 100 + aptitudeBoost;
      const growthRateSkill =
        (initialClassData[2].classGrowths.skill + unit.base_growths.skill) / 100 + aptitudeBoost;
      const growthRateSpeed =
        (initialClassData[2].classGrowths.speed + unit.base_growths.speed) / 100 + aptitudeBoost;
      const growthRateLuck =
        (initialClassData[2].classGrowths.luck + unit.base_growths.luck) / 100 + aptitudeBoost;
      const growthRateDefence =
        (initialClassData[2].classGrowths.defence + unit.base_growths.defence) / 100 + aptitudeBoost;
      const growthRateResistance =
        (initialClassData[2].classGrowths.resistance + unit.base_growths.resistance) / 100 + aptitudeBoost;

      const hpGained =
        secondaryClassData[3].hp -
        initialClassData[3].hp +
        (initialClassData[2].classBaseStats.hp - secondaryClassData[2].classBaseStats.hp);
      const strengthGained =
        secondaryClassData[3].strength -
        initialClassData[3].strength +
        (initialClassData[2].classBaseStats.strength - secondaryClassData[2].classBaseStats.strength);
      const magicGained =
        secondaryClassData[3].magic -
        initialClassData[3].magic +
        (initialClassData[2].classBaseStats.magic - secondaryClassData[2].classBaseStats.magic);
      const skillGained =
        secondaryClassData[3].skill -
        initialClassData[3].skill +
        (initialClassData[2].classBaseStats.skill - secondaryClassData[2].classBaseStats.skill);
      const speedGained =
        secondaryClassData[3].speed -
        initialClassData[3].speed +
        (initialClassData[2].classBaseStats.speed - secondaryClassData[2].classBaseStats.speed);
      const luckGained =
        secondaryClassData[3].luck -
        initialClassData[3].luck +
        (initialClassData[2].classBaseStats.luck - secondaryClassData[2].classBaseStats.luck);
      const defenceGained =
        secondaryClassData[3].defence -
        initialClassData[3].defence +
        (initialClassData[2].classBaseStats.defence - secondaryClassData[2].classBaseStats.defence);
      const resistanceGained =
        secondaryClassData[3].resistance -
        initialClassData[3].resistance +
        (initialClassData[2].classBaseStats.resistance - secondaryClassData[2].classBaseStats.resistance);

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

    const zScoresByPeriod: number[][] = [];
    let totalLevelsGained: number = 0;
    const totalStatGains: number[] = [0, 0, 0, 0, 0, 0, 0, 0];
    const weightedGrowthSums: number[] = [0, 0, 0, 0, 0, 0, 0, 0];

    levelUpData.forEach(([growthRates, statGains, levelsGained], periodIndex) => {
      const zScores: number[] = [];
      if (levelsGained <= 0) return;
      totalLevelsGained += levelsGained;

      // Use base growth rates for z-score calculations
      const baseGrowthRates = [
        (classLineList[periodIndex][2].classGrowths.hp + unit.base_growths.hp) / 100,
        (classLineList[periodIndex][2].classGrowths.strength + unit.base_growths.strength) / 100,
        (classLineList[periodIndex][2].classGrowths.magic + unit.base_growths.magic) / 100,
        (classLineList[periodIndex][2].classGrowths.skill + unit.base_growths.skill) / 100,
        (classLineList[periodIndex][2].classGrowths.speed + unit.base_growths.speed) / 100,
        (classLineList[periodIndex][2].classGrowths.luck + unit.base_growths.luck) / 100,
        (classLineList[periodIndex][2].classGrowths.defence + unit.base_growths.defence) / 100,
        (classLineList[periodIndex][2].classGrowths.resistance + unit.base_growths.resistance) / 100,
      ];

      growthRates.forEach((p, statIndex) => {
        const k = statGains[statIndex];
        totalStatGains[statIndex] += k;
        weightedGrowthSums[statIndex] += p * levelsGained;
        const baseP = baseGrowthRates[statIndex];
        const mean = levelsGained * baseP;
        const variance = levelsGained * baseP * (1 - baseP);
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
    });

    let overallAverageZScore = null;
    let lastStatZScores: number[] | null = null;
    let totalGrowthRates: number[] | null = null;
    if (zScoresByPeriod.length > 0) {
      const allZScores: number[] = zScoresByPeriod.flat().filter((z) => isFinite(z));
      lastStatZScores = zScoresByPeriod[zScoresByPeriod.length - 1] || null;
      if (allZScores.length > 0) {
        const sumZScores = allZScores.reduce((sum, z) => sum + z, 0);
        overallAverageZScore = sumZScores / allZScores.length;
      }
      if (totalLevelsGained > 0) {
        totalGrowthRates = weightedGrowthSums.map((sum) => sum / totalLevelsGained);
      }
    }

    setAverageZScore(overallAverageZScore);
    setStatZScores(lastStatZScores);
    setTotalGrowthRates(totalGrowthRates);
    setTotalStatGains(totalStatGains);
    setTotalLevelsGained(totalLevelsGained);
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
                    selectedUnit.base_growths.hp +
                    (hasAptitudeEquipped ? 10 : 0)}
                  %
                </li>
                <li>
                  STR:{" "}
                  {selectedUnit.class.classGrowths.strength +
                    selectedUnit.base_growths.strength +
                    (hasAptitudeEquipped ? 10 : 0)}
                  %
                </li>
                <li>
                  MAG:{" "}
                  {selectedUnit.class.classGrowths.magic +
                    selectedUnit.base_growths.magic +
                    (hasAptitudeEquipped ? 10 : 0)}
                  %
                </li>
                <li>
                  SKL:{" "}
                  {selectedUnit.class.classGrowths.skill +
                    selectedUnit.base_growths.skill +
                    (hasAptitudeEquipped ? 10 : 0)}
                  %
                </li>
                <li>
                  SPD:{" "}
                  {selectedUnit.class.classGrowths.speed +
                    selectedUnit.base_growths.speed +
                    (hasAptitudeEquipped ? 10 : 0)}
                  %
                </li>
                <li>
                  LCK:{" "}
                  {selectedUnit.class.classGrowths.luck +
                    selectedUnit.base_growths.luck +
                    (hasAptitudeEquipped ? 10 : 0)}
                  %
                </li>
                <li>
                  DEF:{" "}
                  {selectedUnit.class.classGrowths.defence +
                    selectedUnit.base_growths.defence +
                    (hasAptitudeEquipped ? 10 : 0)}
                  %
                </li>
                <li>
                  RES:{" "}
                  {selectedUnit.class.classGrowths.resistance +
                    selectedUnit.base_growths.resistance +
                    (hasAptitudeEquipped ? 10 : 0)}
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
                      data={getOverallChartData(averageZScore)}
                      options={chartOptions}
                    />
                  ) : (
                    <Bar
                      data={getChartData(
                        totalLevelsGained,
                        totalGrowthRates[
                          ["hp", "str", "mag", "skl", "spd", "lck", "def", "res"].indexOf(activeTab)
                        ],
                        totalStatGains[
                          ["hp", "str", "mag", "skl", "spd", "lck", "def", "res"].indexOf(activeTab)
                        ],
                        activeTab.toUpperCase(),
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