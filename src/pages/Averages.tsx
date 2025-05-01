import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { parse } from "flatted";
import { Character } from "../types/Fire Emblem Fates/UnitStruct";
import "../styles/Averages.css";
// Define interface for location state
interface LocationState {
  selectedRoute?: string;
}

const Averages = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const { state } = useLocation();
  const selectedRoute = state?.selectedRoute;

  const [units, setUnits] = useState<Character[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<Character | null>(null);

  // Load units from localStorage on component mount
  useEffect(() => {
    if (gameId && selectedRoute) {
      const storedUnits = localStorage.getItem(`units_${gameId}_${selectedRoute}`);
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

  // Handle dropdown selection
  const handleUnitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = event.target.value;
    const unit = units.find((u) => u.name === selectedName) || null;
    setSelectedUnit(unit);
  };

  const unitDataStyle: React.CSSProperties = {
    textAlign: "left",
    maxWidth: "600px",
    margin: "0 auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    backgroundColor: "#f9f9f9",
  };

  return (
    <div className="page-container">
      <h1 className="top-margin">
        Stat Averages: {gameId} {selectedRoute}
      </h1>
      <div>
        <select
          value={selectedUnit?.name || ""}
          onChange={handleUnitChange}
          disabled={units.length === 0}
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
          <div>
          <h2>{selectedUnit.name}</h2>
          <p><strong>Level:</strong> {selectedUnit.level}</p>
          <p><strong>Class:</strong> {selectedUnit.class?.className || "Unknown"}</p>
          </div>
          <div>
          <h3>Stats</h3>
          <ul>
            {Object.entries(selectedUnit.stats).map(([stat, value]) => (
              <li key={stat}>{`${stat}: ${value}`}</li>
            ))}
          </ul>
          </div>
          <div>
          <h3>Growth Rates</h3>
          <ul>
            {Object.entries(selectedUnit.base_growths).map(([stat, value]) => (
              <li key={stat}>{`${stat}: ${value}%`}</li>
            ))}
          </ul>
          </div>
          <div>
          <h3>Stat Caps (Modifiers)</h3>
          <ul>
            {Object.entries(selectedUnit.maxStatModifiers).map(([stat, value]) => (
              <li key={stat}>{`${stat}: ${value}`}</li>
            ))}
          </ul>
          </div>
        </div>
        <div>
          ABC
        </div>
        </div>
      ) : (
        <p>
          No units available.
        </p>
      )}
    </div>
  );
};

export default Averages;