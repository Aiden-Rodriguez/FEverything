import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import "../styles/Units.css";
import UnitGrid from "../components/UnitGrid";

import { Character } from "../types/Fire Emblem Fates/UnitStruct";
import { applyBoonBaneAdjustments } from "../utils/Fire Emblem Fates/characterAdjustments";
import { getClass } from "../defaultData/Fire Emblem Fates/defaultClassData";
import { defaultCharactersConquest } from "../defaultData/Fire Emblem Fates/defaultCharactersConquest";

const Units = () => {
  const { state } = useLocation();
  const selectedRoute = (state as any)?.selectedRoute;

  const { gameId } = useParams<{ gameId: string }>();

  const [isOverlayAddCharacterOpen, setIsOverlayAddCharacterOpen] = useState(false);
  const [isOverlayDeleteCharacterOpen, setIsOverlayDeleteCharacterOpen] = useState(false);
  const [units, setUnits] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [createdCorrinGender, setCreatedCorrinGender] = useState<"Male" | "Female" | null>(null);

  const [corrinGender, setCorrinGender] = useState<"Male" | "Female">("Male");
  const [corrinBoon, setCorrinBoon] = useState<string>("Robust");
  const [corrinBane, setCorrinBane] = useState<string>("Unlucky");
  const [corrinTalent, setCorrinTalent] = useState<string>("Cavalier");

  // Load units from localStorage on component mount
  useEffect(() => {
    const storedUnits = localStorage.getItem(`units_${gameId}_${selectedRoute}`);
    if (storedUnits) {
      try {
        const parsedUnits = JSON.parse(storedUnits);
        const restoredUnits = parsedUnits
          .map((unit: any) => {
            // Find the base character from defaultCharactersConquest
            let baseCharacter: Character | undefined;
            if (unit.name === "Jakob" && createdCorrinGender === "Male") {
              baseCharacter = defaultCharactersConquest.find(
                (char) => char.name === unit.name && char.level === 13
              );
            } else if (unit.name === "Jakob" && createdCorrinGender === "Female") {
              baseCharacter = defaultCharactersConquest.find(
                (char) => char.name === unit.name && char.level === 1
              );
            } else if (unit.name === "Felicia" && createdCorrinGender === "Male") {
              baseCharacter = defaultCharactersConquest.find(
                (char) => char.name === unit.name && char.level === 1
              );
            } else if (unit.name === "Felicia" && createdCorrinGender === "Female") {
              baseCharacter = defaultCharactersConquest.find(
                (char) => char.name === unit.name && char.level === 13
              );
            } else {
              baseCharacter = defaultCharactersConquest.find(
                (char) => char.name === unit.name
              );
            }
            if (!baseCharacter) return null;

            // If it's Corrin, apply boon, bane, and talent
            if (unit.isCorrin) {
              let corrin = { ...baseCharacter };
              corrin.base_class_set.heart_seal_classes = [getClass(unit.talent)];
              corrin = applyBoonBaneAdjustments(corrin, unit.boon, unit.bane);
              return corrin;
            }
            return baseCharacter;
          })
          .filter((unit: Character | null) => unit !== null);

        // Set createdCorrinGender based on restored units
        const corrinUnit = restoredUnits.find(
          (unit: Character) => unit.name === "Corrin (M)" || unit.name === "Corrin (F)"
        );
        if (corrinUnit) {
          setCreatedCorrinGender(corrinUnit.name === "Corrin (M)" ? "Male" : "Female");
        }

        setUnits(restoredUnits as Character[]);
      } catch (error) {
        console.error("Error parsing stored units:", error);
      }
    }
  }, [gameId, selectedRoute]);

  // Save units to localStorage whenever units change
  useEffect(() => {
    if (units.length > 0) {
      const simplifiedUnits = units.map((unit) => {
        const isCorrin = unit.name === "Corrin (M)" || unit.name === "Corrin (F)";
        return {
          name: unit.name,
          level: unit.level, // Include level to differentiate Jakob and Felicia
          isCorrin,
          ...(isCorrin && {
            boon: corrinBoon,
            bane: corrinBane,
            talent: corrinTalent,
          }),
        };
      });
      try {
        localStorage.setItem(
          `units_${gameId}_${selectedRoute}`,
          JSON.stringify(simplifiedUnits)
        );
      } catch (error) {
        console.error("Error saving units to localStorage:", error);
      }
    } else {
      localStorage.removeItem(`units_${gameId}_${selectedRoute}`);
    }
  }, [units, gameId, selectedRoute, corrinBoon, corrinBane, corrinTalent]);

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

  const filteredBaneOptions = baneOptions.filter(
    (bane) => conflictingPairs[corrinBoon] !== bane
  );

  const filteredBoonOptions = boonOptions.filter(
    (boon) => conflictingPairs[boon] !== corrinBane
  );

  useEffect(() => {
    if (conflictingPairs[corrinBoon] === corrinBane) {
      const newBane = filteredBaneOptions[0] || baneOptions[0];
      setCorrinBane(newBane);
    }
  }, [corrinBoon]);

  useEffect(() => {
    if (
      boonOptions.some(
        (boon) => conflictingPairs[boon] === corrinBane && boon === corrinBoon
      )
    ) {
      const newBoon = filteredBoonOptions[0] || boonOptions[0];
      setCorrinBoon(newBoon);
    }
  }, [corrinBane]);

  const availableCharacters = defaultCharactersConquest.filter(
    (character, index) => {
      // Exclude characters already in units
      if (units.some((unit) => unit.name === character.name)) {
        return false;
      }

      // Exclude Corrin (F) if Corrin (M) is in units, and vice versa
      if (
        units.some((unit) => unit.name === "Corrin (M)") &&
        character.name === "Corrin (F)"
      ) {
        return false;
  }
      if (
        units.some((unit) => unit.name === "Corrin (F)") &&
        character.name === "Corrin (M)"
      ) {
        return false;
      }

      // Handle Jakob and Felicia based on createdCorrinGender
      if (createdCorrinGender === "Male") {
        // Only allow Jakob (level 13) and Felicia (level 1)
        if (character.name === "Jakob" && character.level !== 13) {
          return false;
        }
        if (character.name === "Felicia" && character.level !== 1) {
          return false;
        }
      } else if (createdCorrinGender === "Female") {
        // Only allow Jakob (level 1) and Felicia (level 13)
        if (character.name === "Jakob" && character.level !== 1) {
          return false;
        }
        if (character.name === "Felicia" && character.level !== 13) {
          return false;
        }
      } else {
        // If no Corrin is created, exclude both versions of Jakob and Felicia
        if (character.name === "Jakob" || character.name === "Felicia") {
          return false;
        }
      }

      return true;
    }
  );

  useEffect(() => {
    setSelectedCharacter(
      availableCharacters.length > 0 ? availableCharacters[0] : null
    );
  }, [isOverlayAddCharacterOpen, units, createdCorrinGender]);

  const handleSetCorrinGender = (gender: "Male" | "Female") => {
    setCorrinTalent("Cavalier");
    setCorrinGender(gender);
  };

  const toggleOverlayAddCharacter = () => {
    setIsOverlayAddCharacterOpen(!isOverlayAddCharacterOpen);
  };

  const toggleOverlayDeleteCharacter = () => {
    setIsOverlayDeleteCharacterOpen(!isOverlayDeleteCharacterOpen);
  };


  const addUnit = () => {
    if (selectedCharacter) {
      // Ensure correct version of Jakob or Felicia is added based on createdCorrinGender
      let characterToAdd = selectedCharacter;
      if (selectedCharacter.name === "Jakob" && createdCorrinGender === "Male") {
        characterToAdd = defaultCharactersConquest.find(
          (char) => char.name === "Jakob" && char.level === 13
        ) || selectedCharacter;
      } else if (selectedCharacter.name === "Jakob" && createdCorrinGender === "Female") {
        characterToAdd = defaultCharactersConquest.find(
          (char) => char.name === "Jakob" && char.level === 1
        ) || selectedCharacter;
      } else if (selectedCharacter.name === "Felicia" && createdCorrinGender === "Male") {
        characterToAdd = defaultCharactersConquest.find(
          (char) => char.name === "Felicia" && char.level === 1
        ) || selectedCharacter;
      } else if (selectedCharacter.name === "Felicia" && createdCorrinGender === "Female") {
        characterToAdd = defaultCharactersConquest.find(
          (char) => char.name === "Felicia" && char.level === 13
        ) || selectedCharacter;
      }

      setUnits([...units, characterToAdd]);
      toggleOverlayAddCharacter();
    }
  };

  const createMainCharacter = () => {
    let corrin: Character =
      corrinGender === "Male"
        ? defaultCharactersConquest[0]
        : defaultCharactersConquest[1];

    corrin.base_class_set.heart_seal_classes = [getClass(corrinTalent)];
    corrin = applyBoonBaneAdjustments(corrin, corrinBoon, corrinBane);

    setUnits([...units, corrin]);
    setCreatedCorrinGender(corrinGender);
    toggleOverlayAddCharacter();
  };

  const deleteAllUnits = () => {
    // Clear units from localStorage
    localStorage.removeItem(`units_${gameId}_${selectedRoute}`);
    // Reset units state
    setUnits([]);
    // Reset createdCorrinGender to allow new Corrin creation
    setCreatedCorrinGender(null);
    toggleOverlayDeleteCharacter();
  };

  const shouldPromptCorrinCreation =
    units.length === 0 && gameId === "Fire Emblem Fates";

  return (
    <div className="page-container">
      <h1 className="top-margin">
        Unit Manager: {gameId} {selectedRoute}
      </h1>
      <div className="grids-container">
        {units.length > 0 &&
          units.map((unit, index) => (
            <UnitGrid
              key={`${unit.name}-${index}`} // Unique key using name and index
              unit={unit}
              gameId={gameId}
            />
          ))}
        <div className="add-remove-character-grid" onClick={toggleOverlayAddCharacter}>
          Add Unit?
        </div>
        <div className="add-remove-character-grid" onClick={toggleOverlayDeleteCharacter}>
          Delete All Units?
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
                <div className="corrin-form">
                  <div className="form-field">
                    <label>Select Character:</label>
                    <select
                      value={selectedCharacter?.name || ""}
                      onChange={(e) => {
                        const selected = availableCharacters.find(
                          (char) => char.name === e.target.value
                        );
                        setSelectedCharacter(selected || null);
                      }}
                    >
                      {availableCharacters.length > 0 ? (
                        availableCharacters.map((char, index) => (
                          <option
                            key={`${char.name}-${index}`} // Unique key for dropdown
                            value={char.name}
                          >
                            {char.name}
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>
                          No characters available
                        </option>
                      )}
                    </select>
                  </div>
                  <button
                    className="create-corrin-button"
                    onClick={addUnit}
                    disabled={!selectedCharacter}
                  >
                    Add Unit
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
            {isOverlayDeleteCharacterOpen &&
        <div className="overlay">
          <div className="overlay-content">
            <button
              className="close-button"
              onClick={toggleOverlayDeleteCharacter}
            >
              ✕
            </button>
            <h2>Delete all created units?</h2>
            <h3>This action cannot be undone.</h3>
            <button className="deletion-buttons" onClick={toggleOverlayDeleteCharacter}>Keep units</button>
            <button className="deletion-buttons" onClick={deleteAllUnits}>Delete all units</button>

          </div>
        </div>
      }
    </div>
  );
};

export default Units;