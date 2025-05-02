import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { parse } from "flatted";
import { Character } from "../types/Fire Emblem Fates/UnitStruct";
import normalcurve from "../assets/images/nomal curve.png";
import "../styles/Averages.css";

const Averages = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const { state } = useLocation();
  const selectedRoute = state?.selectedRoute;

  const [units, setUnits] = useState<Character[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<Character | null>(null);

  // Load units from localStorage on component mount
  useEffect(() => {
    if (gameId && selectedRoute) {
      const storedUnits = localStorage.getItem(
        `units_${gameId}_${selectedRoute}`,
      );
      if (storedUnits) {
        try {
          const parsedUnits: Character[] = parse(storedUnits);
          setUnits(parsedUnits);
          // Set default selected unit to the first unit, if available
          setSelectedUnit(parsedUnits.length > 0 ? parsedUnits[0] : null);
        } catch (error) {
          console.error("Error parsing stored units:", error);
        }
      }
    }
  }, [gameId, selectedRoute]);

  // Dropdown selection
  const handleUnitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = event.target.value;
    const unit = units.find((u) => u.name === selectedName) || null;
    setSelectedUnit(unit);
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
    </div>
  );
};

export default Averages;
