import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Character } from "../types/UnitStruct";
import { getClass } from "../defaultData/Fire Emblem Fates/defaultClassData";
import "../styles/Units.css";
import { applyBoonBaneAdjustments } from "../utils/characterAdjustments";
import UnitGrid from "../components/UnitGrid";
import { defaultCharacters } from "../defaultData/Fire Emblem Fates/defaultCharacters";

const Units = () => {
  const unitOne = defaultCharacters[0];
  const unitTwo = defaultCharacters[1];
  const unitThree = defaultCharacters[2];

  const { gameId } = useParams<{ gameId: string }>();
  const [isOverlayAddCharacterOpen, setIsOverlayAddCharacterOpen] = useState(false);
  const [units, setUnits] = useState<Character[]>([]);

  const [corrinGender, setCorrinGender] = useState<"Male" | "Female">("Male");
  const [corrinBoon, setCorrinBoon] = useState<string>("Robust");
  const [corrinBane, setCorrinBane] = useState<string>("Unlucky");
  const [corrinTalent, setCorrinTalent] = useState<string>("Cavalier");

  // Define conflicting boon/bane pairs
  const conflictingPairs: Record<string, string> = {
    Robust: "Sickly",
    Strong: "Weak",
    Clever: "Dull",
    Deft: "Clumsy",
    Quick: "Slow",
    Lucky: "Unlucky",
    Sturdy: "Fragile",
    Calm: "Excitable",
  };

  // Available options for boons and banes
  const boonOptions = [
    "Robust",
    "Strong",
    "Clever",
    "Deft",
    "Quick",
    "Lucky",
    "Sturdy",
    "Calm",
  ];
  const baneOptions = [
    "Sickly",
    "Weak",
    "Dull",
    "Clumsy",
    "Slow",
    "Unlucky",
    "Fragile",
    "Excitable",
  ];

  // Filter bane options based on selected boon
  const filteredBaneOptions = baneOptions.filter(
    (bane) => conflictingPairs[corrinBoon] !== bane
  );

  // Filter boon options based on selected bane
  const filteredBoonOptions = boonOptions.filter(
    (boon) => conflictingPairs[boon] !== corrinBane
  );

  // Reset bane if it conflicts with the selected boon
  useEffect(() => {
    if (conflictingPairs[corrinBoon] === corrinBane) {
      const newBane = filteredBaneOptions[0] || baneOptions[0]; // Fallback to first bane if no filtered options
      setCorrinBane(newBane);
    }
  }, [corrinBoon]);

  // Reset boon if it conflicts with the selected bane
  useEffect(() => {
    if (boonOptions.some((boon) => conflictingPairs[boon] === corrinBane && boon === corrinBoon)) {
      const newBoon = filteredBoonOptions[0] || boonOptions[0]; // Fallback to first boon if no filtered options
      setCorrinBoon(newBoon);
    }
  }, [corrinBane]);

  const handleSetCorrinGender = (gender: "Male" | "Female") => {
    setCorrinTalent("Cavalier");
    setCorrinGender(gender);
  };

  const toggleOverlayAddCharacter = () => {
    setIsOverlayAddCharacterOpen(!isOverlayAddCharacterOpen);
  };

  const addUnit = (unit: Character) => {
    setUnits([...units, unit]);
  };

  const createMainCharacter = () => {
    let corrin: Character =
      corrinGender === "Male" ? defaultCharacters[0] : defaultCharacters[1];

    corrin.base_class_set.heart_seal_classes = [getClass(corrinTalent)];
    corrin = applyBoonBaneAdjustments(corrin, corrinBoon, corrinBane);

    addUnit(corrin);
    toggleOverlayAddCharacter();
  };

  const shouldPromptCorrinCreation =
    units.length === 0 && gameId === "Fire Emblem Fates";

  return (
    <div className="page-container">
      <h1 className="top-margin">Unit Manager: {gameId}</h1>
      <div className="grids-container">
        {units.length > 0 &&
          units.map((unit, index) => (
            <UnitGrid key={index} unit={unit} gameId={gameId} />
          ))}
        <div className="add-character-grid" onClick={toggleOverlayAddCharacter}>
          Add Unit?
        </div>
      </div>

      {isOverlayAddCharacterOpen && (
        <div className="overlay">
          <div className="overlay-content">
            <button
              className="close-button"
              onClick={toggleOverlayAddCharacter}
            >
              ✕
            </button>
            {shouldPromptCorrinCreation ? (
              <>
                <h2>Create A Corrin</h2>
                <div className="corrin-form">
                  <div className="form-field">
                    <label>Gender:</label>
                    <select
                      value={corrinGender}
                      onChange={(e) =>
                        handleSetCorrinGender(
                          e.target.value as "Male" | "Female"
                        )
                      }
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label>Boon:</label>
                    <select
                      value={corrinBoon}
                      onChange={(e) => setCorrinBoon(e.target.value)}
                    >
                      {filteredBoonOptions.map((boon) => (
                        <option key={boon} value={boon}>
                          {boon}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-field">
                    <label>Bane:</label>
                    <select
                      value={corrinBane}
                      onChange={(e) => setCorrinBane(e.target.value)}
                    >
                      {filteredBaneOptions.map((bane) => (
                        <option key={bane} value={bane}>
                          {bane}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-field">
                    <label>Talent:</label>
                    <select
                      value={corrinTalent}
                      onChange={(e) => setCorrinTalent(e.target.value)}
                    >
                      <option value="Cavalier">Cavalier</option>
                      <option value="Knight">Knight</option>
                      <option value="Fighter">Fighter</option>
                      <option value="Mercenary">Mercenary</option>
                      <option value="Outlaw">Outlaw</option>
                      <option value="Samurai">Samurai</option>
                      <option value="Oni Savage">Oni Savage</option>
                      <option value="Spear Fighter">Spear Fighter</option>
                      <option value="Diviner">Diviner</option>
                      <option
                        value={
                          corrinGender === "Female" ? "Shrine Maiden" : "Monk"
                        }
                      >
                        {corrinGender === "Female" ? "Shrine Maiden" : "Monk"}
                      </option>
                      <option value="Sky Knight">Sky Knight</option>
                      <option value="Archer">Archer</option>
                      <option value="Wyvern Rider">Wyvern Rider</option>
                      <option value="Ninja">Ninja</option>
                      <option value="Dark Mage">Dark Mage</option>
                      <option value="Troubadour">Troubadour</option>
                      <option value="Apothecary">Apothecary</option>
                    </select>
                  </div>
                  <button
                    className="create-corrin-button"
                    onClick={createMainCharacter}
                  >
                    Create Corrin
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2>Add a New Unit</h2>
                <div className="add-unit-options">
                  <button
                    onClick={() => {
                      addUnit(unitOne);
                      toggleOverlayAddCharacter();
                    }}
                  >
                    Add Unit 1
                  </button>
                  <button
                    onClick={() => {
                      addUnit(unitTwo);
                      toggleOverlayAddCharacter();
                    }}
                  >
                    Add Unit 2
                  </button>
                  <button
                    onClick={() => {
                      addUnit(unitThree);
                      toggleOverlayAddCharacter();
                    }}
                  >
                    Add Unit 3
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Units;