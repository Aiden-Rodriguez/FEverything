import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/Units.css";
import UnitGrid from "../components/UnitGrid";
import { BaseCharacter } from "../types/Fire Emblem Fates/UnitStruct";
import { applyBoonBaneAdjustments } from "../utils/Fire Emblem Fates/characterAdjustments";
import { getClass } from "../defaultData/Fire Emblem Fates/defaultClassData";
import { defaultCharactersConquest } from "../defaultData/Fire Emblem Fates/defaultCharactersConquest";
import {
  boonOptions,
  baneOptions,
  conflictingPairs,
} from "../types/Fire Emblem Fates/UnitStruct";

interface UnitsProps {
  units: BaseCharacter[];
  updateUnit: (gameId: string, unit: BaseCharacter) => void;
  deleteUnitByName: (gameId: string, path: string, unitName: string) => void;
  deleteAllUnits: (gameId: string, path: string) => void;
}

const Units: React.FC<UnitsProps> = ({
  units,
  updateUnit,
  deleteUnitByName,
  deleteAllUnits,
}) => {
  const { state } = useLocation();
  const selectedRoute = state?.selectedRoute || "";
  const gameId = useParams<{ gameId?: string }>().gameId ?? "";

  const [isOverlayAddCharacterOpen, setIsOverlayAddCharacterOpen] =
    useState(false);
  const [isOverlayDeleteCharacterOpen, setIsOverlayDeleteCharacterOpen] =
    useState(false);
  const [selectedCharacter, setSelectedCharacter] =
    useState<BaseCharacter | null>(null);
  const [createdCorrinGender, setCreatedCorrinGender] = useState<
    "Male" | "Female" | null
  >(null);
  const [corrinGender, setCorrinGender] = useState<"Male" | "Female">("Male");
  const [corrinBoon, setCorrinBoon] = useState<string>("Robust");
  const [corrinBane, setCorrinBane] = useState<string>("Unlucky");
  const [corrinTalent, setCorrinTalent] = useState<string>("Cavalier");

  const filteredBaneOptions = baneOptions.filter(
    (bane) => conflictingPairs[corrinBoon] !== bane,
  );

  const filteredBoonOptions = boonOptions.filter(
    (boon) => conflictingPairs[boon] !== corrinBane,
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
        (boon) => conflictingPairs[boon] === corrinBane && boon === corrinBoon,
      )
    ) {
      const newBoon = filteredBoonOptions[0] || boonOptions[0];
      setCorrinBoon(newBoon);
    }
  }, [corrinBane]);

  useEffect(() => {
    if (units.some((unit) => unit.name === "Corrin (M)")) {
      setCreatedCorrinGender("Male");
    } else if (units.some((unit) => unit.name === "Corrin (F)")) {
      setCreatedCorrinGender("Female");
    } else {
      setCreatedCorrinGender(null);
    }
  }, [units]);

  const availableCharacters = defaultCharactersConquest.filter((character) => {
    if (units.some((unit) => unit.name === character.name)) {
      return false;
    }
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

    if (createdCorrinGender === "Male") {
      if (character.name === "Jakob" && character.level !== 13) {
        return false;
      }
      if (character.name === "Felicia" && character.level !== 1) {
        return false;
      }
    } else if (createdCorrinGender === "Female") {
      if (character.name === "Jakob" && character.level !== 1) {
        return false;
      }
      if (character.name === "Felicia" && character.level !== 13) {
        return false;
      }
    }
    return true;
  });

  useEffect(() => {
    setSelectedCharacter(
      availableCharacters.length > 0 ? availableCharacters[0] : null,
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

  const addNewUnit = () => {
    if (selectedCharacter) {
      updateUnit(gameId, selectedCharacter);
      toggleOverlayAddCharacter();
    }
  };

  const createMainCharacter = () => {
    const baseCorrin =
      corrinGender === "Male"
        ? defaultCharactersConquest[0]
        : defaultCharactersConquest[1];

    let corrin: BaseCharacter = structuredClone(baseCorrin);

    corrin.base_class_set.heart_seal_classes = [getClass(corrinTalent)];
    corrin.talent = corrinTalent;
    corrin.boon = corrinBoon;
    corrin.bane = corrinBane;

    corrin = applyBoonBaneAdjustments(corrin, corrinBoon, corrinBane);

    corrin.class_line[0] = [0, 1, corrin.class, corrin.stats];
    updateUnit(gameId, corrin);
    console.log(corrin);
    setCreatedCorrinGender(corrinGender);
    toggleOverlayAddCharacter();
  };

  const handleDeleteAllUnits = () => {
    deleteAllUnits(gameId, selectedRoute);
    setCreatedCorrinGender(null);
    toggleOverlayDeleteCharacter();
  };

  const shouldPromptCorrinCreation =
    (units.length === 0 || createdCorrinGender === null) &&
    gameId === "Fire Emblem Fates";

  return (
    <main className="page-container">
      <h1 className="top-margin">
        Unit Manager: {gameId} {selectedRoute}
      </h1>
      <section className="grids-container" aria-label="Unit Management">
        {units.length > 0 &&
          units.map((unit, index) => (
            <UnitGrid
              key={`${unit.name}-${index}`}
              unit={unit}
              gameId={gameId}
              updateUnit={updateUnit}
              deleteUnitByName={deleteUnitByName}
              units={units}
            />
          ))}
      </section>
      <div className="button-container">
        <div
          className="add-remove-character-grid"
          onClick={toggleOverlayAddCharacter}
          role="button"
          aria-label="Add a new unit"
        >
          Add Unit?
        </div>
        <div
          className="add-remove-character-grid"
          onClick={toggleOverlayDeleteCharacter}
          role="button"
          aria-label="Delete your units?"
        >
          Delete All Units?
        </div>
      </div>

      {isOverlayAddCharacterOpen && (
        <motion.div
          className="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="overlay-content">
            <button
              className="close-button"
              onClick={toggleOverlayAddCharacter}
              aria-label="Close add unit"
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
                          e.target.value as "Male" | "Female",
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
                          (char: BaseCharacter) => char.name === e.target.value,
                        );
                        setSelectedCharacter(selected || null);
                      }}
                    >
                      {availableCharacters.length > 0 ? (
                        availableCharacters.map(
                          (char: BaseCharacter, index: number) => (
                            <option
                              key={`${char.name}-${index}`}
                              value={char.name}
                            >
                              {char.name}
                            </option>
                          ),
                        )
                      ) : (
                        <option value="" disabled>
                          No characters available
                        </option>
                      )}
                    </select>
                  </div>
                  <button
                    className="create-unit-button"
                    onClick={addNewUnit}
                    disabled={!selectedCharacter}
                  >
                    Add Unit
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}

      {isOverlayDeleteCharacterOpen && (
        <motion.div
          className="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="overlay">
            <div className="overlay-content">
              <button
                className="close-button"
                onClick={toggleOverlayDeleteCharacter}
                aria-label="Close delete units"
              >
                ✕
              </button>
              <h2>Delete all created units?</h2>
              <h3>This action cannot be undone.</h3>
              <button
                className="overlay-button"
                onClick={toggleOverlayDeleteCharacter}
              >
                Keep units
              </button>
              <button className="overlay-button" onClick={handleDeleteAllUnits}>
                Delete all units
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </main>
  );
};

export default Units;
