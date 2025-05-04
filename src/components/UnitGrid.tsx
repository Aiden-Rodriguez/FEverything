import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

import { Character } from "../types/Fire Emblem Fates/UnitStruct.tsx";
import { Class, WeaponRank } from "../types/Fire Emblem Fates/ClassStruct.tsx";
import { Skill } from "../types/Fire Emblem Fates/SkillStruct.tsx";

interface UnitGridProps {
  unit: Character;
  gameId?: string;
  updateUnit: (updatedUnit: Character) => void;
}

// Define interfaces for dynamically imported modules
// Since planned to scale down the line I am dynamically importing the initiation module. This prevents unneccisary importation of data.
interface InitModule {
  initializeData: () => void;
}

interface ClassDataModule {
  getClass: (className: string) => Class;
}

interface SkillsModule {
  getSkill: (skillName: string) => Skill;
}

const UnitGrid: React.FC<UnitGridProps> = ({ unit, gameId, updateUnit }) => {
  const [getClassFn, setGetClassFn] = useState<
    ((className: string) => Class) | null
  >(null);
  const [getSkillFn, setGetSkillFn] = useState<
    ((skillName: string) => Skill) | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isClassChanging, setIsClassChanging] = useState<boolean>(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [selectedClassName, setSelectedClassName] = useState<string>(
    unit.class.className,
  );
  const [error, setError] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const statFields: { key: keyof typeof unit.stats; label: string }[] = [
    { key: "hp", label: "HP" },
    { key: "strength", label: "STR" },
    { key: "magic", label: "MAG" },
    { key: "skill", label: "SKL" },
    { key: "speed", label: "SPD" },
    { key: "luck", label: "LCK" },
    { key: "defence", label: "DEF" },
    { key: "resistance", label: "RES" },
    { key: "move", label: "MOV" },
  ];

  type WeaponRankKey =
    | "WeaponRankSwordKatana"
    | "WeaponRankLanceNaginata"
    | "WeaponRankAxeClub"
    | "WeaponRankTomeScroll"
    | "WeaponRankKnifeShuriken"
    | "WeaponRankBowYumi"
    | "WeaponRankStaffRod"
    | "WeaponRankStone";

  const weaponRankFields: { key: WeaponRankKey; label: string }[] = [
    { key: "WeaponRankSwordKatana", label: "Sword/Katana" },
    { key: "WeaponRankLanceNaginata", label: "Lance/Naginata" },
    { key: "WeaponRankAxeClub", label: "Axe/Club" },
    { key: "WeaponRankTomeScroll", label: "Tome/Scroll" },
    { key: "WeaponRankKnifeShuriken", label: "Knife/Shuriken" },
    { key: "WeaponRankBowYumi", label: "Bow/Yumi" },
    { key: "WeaponRankStaffRod", label: "Staff/Rod" },
    { key: "WeaponRankStone", label: "Stone" },
  ];

  const filteredFields = weaponRankFields.filter(
    ({ key }) => unit.class.MaxWeaponRank[key] !== "n",
  );

  const allWeaponRanks: WeaponRank[] = ["n", "E", "D", "C", "B", "A", "S"];

  const getWeaponRankOptions = (
    field: keyof typeof unit.weapon_ranks,
  ): WeaponRank[] => {
    const maxRank = unit.class.MaxWeaponRank[field];
    if (maxRank === "n") {
      return ["n"];
    }
    const maxIndex = allWeaponRanks.indexOf(maxRank);
    return allWeaponRanks.slice(0, maxIndex + 1);
  };

  const handleWeaponRankChange = (
    field: keyof typeof unit.weapon_ranks,
    value: WeaponRank,
  ) => {
    const updatedUnit: Character = {
      ...unit,
      weapon_ranks: {
        ...unit.weapon_ranks,
        [field]: value,
      },
    };
    updateUnit(updatedUnit);
  };

  const getAvailableClasses = (): Class[] => {
    const classes: Class[] = [];
    const gender = unit.gender;

    // Helper function to filter gender-compatible classes
    const filterGenderCompatible = (cls: Class) =>
      !(cls.className === "Maid" && gender === "Male") &&
      !(cls.className === "Butler" && gender === "F");

    // Base class tree
    if (
      unit.base_class_set.starting_class_tree &&
      unit.base_class_set.starting_class_tree.classTree
    ) {
      classes.push(
        ...unit.base_class_set.starting_class_tree.classTree.filter(
          filterGenderCompatible,
        ),
      );
    }

    // Heart Seal classes
    if (unit.base_class_set.heart_seal_classes) {
      unit.base_class_set.heart_seal_classes.forEach((cls) => {
        if (cls.classTree) {
          classes.push(...cls.classTree.filter(filterGenderCompatible));
        }
      });
    }

    // Friendship Seal classes
    if (
      unit.base_class_set.friendship_seal_base_class &&
      unit.base_class_set.friendship_seal_base_class.classTree
    ) {
      classes.push(
        ...unit.base_class_set.friendship_seal_base_class.classTree.filter(
          filterGenderCompatible,
        ),
      );
    }

    // Partner Seal classes
    if (
      unit.base_class_set.partner_seal_base_class &&
      unit.base_class_set.partner_seal_base_class.classTree
    ) {
      classes.push(
        ...unit.base_class_set.partner_seal_base_class.classTree.filter(
          filterGenderCompatible,
        ),
      );
    }

    return classes;
  };

  const handleClassChange = (className: string) => {
    setSelectedClassName(className);
  };

  const commitClassChange = () => {
    if (!getClassFn) return;
    const newClass = getClassFn(selectedClassName);
    const updatedUnit: Character = {
      ...unit,
      class: newClass,
    };
    updateUnit(updatedUnit);
    setIsClassChanging(false);
  };

  const cancelClassChange = () => {
    setIsClassChanging(false);
    setSelectedClassName(unit.class.className);
  };

  useEffect(() => {
    if (!gameId) {
      console.warn("No gameId provided; skipping data initialization");
      setIsLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        const initModule = (await import(
          `../defaultData/${gameId}/init.tsx`
        )) as InitModule;
        initModule.initializeData();

        const classModule = (await import(
          `../defaultData/${gameId}/defaultClassData.tsx`
        )) as ClassDataModule;
        const skillModule = (await import(
          `../defaultData/${gameId}/defaultSkills.tsx`
        )) as SkillsModule;

        setGetClassFn(() => classModule.getClass);
        setGetSkillFn(() => skillModule.getSkill);
      } catch (error) {
        console.error(`Failed to load modules for gameId: ${gameId}`, error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [gameId]);

  useEffect(() => {
    if (editingField && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingField]);

  const handleToggleExpand = () => {
    setIsExpanded((prev) => !prev);
    setIsEditing(false);
    setIsClassChanging(false);
    setEditingField(null);
    setError("");
  };

  const handleToggleEdit = () => {
    setIsEditing((prev) => !prev);
    setIsClassChanging(false);
    setEditingField(null);
    setError("");
  };

  const handleToggleClassChange = () => {
    setIsClassChanging((prev) => !prev);
    setIsEditing(false);
    setEditingField(null);
    setError("");
    setSelectedClassName(unit.class.className);
  };

  const startEditing = (field: string, value: number) => {
    if (!isEditing) return;
    setEditingField(field);
    setEditValue(value.toString());
    setError("");
  };

  const validateInput = (field: string, value: string): boolean => {
    const num = parseInt(value);
    if (isNaN(num)) {
      setError(`${field} must be a number`);
      return false;
    }
    if (field === "level" && (num < 1 || num > 20)) {
      setError("Level must be between 1 and 20 (TEMP IMPLEMENTATION)");
      return false;
    }
    if (field !== "level" && (num < 0 || num > 99)) {
      setError(`${field} must be between 0 and 99 (TEMP IMPLEMENTATION)`);
      return false;
    }
    return true;
  };

  const saveEdit = () => {
    if (!editingField || !validateInput(editingField, editValue)) {
      return;
    }

    const numValue = parseInt(editValue);
    let updatedUnit: Character;

    if (editingField === "level") {
      updatedUnit = { ...unit, level: numValue };
    } else {
      updatedUnit = {
        ...unit,
        stats: { ...unit.stats, [editingField]: numValue },
      };
    }

    updateUnit(updatedUnit);
    setEditingField(null);
    setEditValue("");
    setError("");
  };

  const cancelEdit = () => {
    setEditingField(null);
    setEditValue("");
    setError("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      saveEdit();
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  };

  if (isLoading || !getClassFn || !getSkillFn) {
    return (
      <h3>
        Loading... <br /> If this takes more than a few seconds the gameID is
        incorrect.
      </h3>
    );
  }

  const cellVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3 } },
  };

  return (
    <motion.main
      className={`units-grid ${isExpanded ? "expanded" : ""}`}
      layout
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="grid-cell top-left">
        <div className="top-left-content">
          <h3>{unit.name}</h3>
          {unit.nickname && <p>Nickname: {unit.nickname}</p>}
          <span
            className="expand-icon"
            onClick={handleToggleExpand}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleToggleExpand();
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={`Toggle expand grid for ${unit.name}`}
            aria-expanded={isExpanded}
          >
            {isExpanded ? "View Less" : "View Detailed"}
          </span>
        </div>
      </div>

      <div className="grid-cell top-middle">
        <h3>
          {unit.class.className}
          {isClassChanging &&
            selectedClassName !== unit.class.className &&
            ` --> ${selectedClassName}`}
        </h3>
        {isExpanded && !isEditing && !isClassChanging && (
          <span
            className="edit-icon"
            onClick={handleToggleClassChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleToggleClassChange();
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={`Toggle class change mode for ${unit.name}`}
          >
            Commit Class Change?
          </span>
        )}
        {isClassChanging && (
          <div>
            <select
              value={selectedClassName}
              onChange={(e) => handleClassChange(e.target.value)}
              className="inline-select"
              aria-label={`Select new class for ${unit.name}`}
            >
              {getAvailableClasses().map((cls) => (
                <option key={cls.className} value={cls.className}>
                  {cls.className}
                </option>
              ))}
            </select>
            <button
              onClick={commitClassChange}
              className="inline-button"
              aria-label={`Confirm class change for ${unit.name}`}
            >
              Confirm
            </button>
            <button
              onClick={cancelClassChange}
              className="inline-button"
              aria-label={`Cancel class change for ${unit.name}`}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="grid-cell top-right">
        {editingField === "level" ? (
          <input
            type="number"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={saveEdit}
            onKeyDown={handleKeyDown}
            min="1"
            max="20"
            className="inline-input"
            ref={inputRef}
            aria-label={`Edit level for ${unit.name}`}
          />
        ) : (
          <h3
            onClick={() => startEditing("level", unit.level)}
            role="button"
            className={isEditing ? "editable" : ""}
          >
            Level: {unit.level}
          </h3>
        )}
        {editingField === "level" && error && (
          <p className="inline-error">{error}</p>
        )}
        {isExpanded && (
          <span
            className="edit-icon"
            onClick={handleToggleEdit}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleToggleEdit();
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={`Toggle edit mode for ${unit.name}`}
            aria-expanded={isEditing}
          >
            {isEditing ? "Stop Editing" : "Edit Unit"}
          </span>
        )}
      </div>

      {isExpanded && (
        <motion.div
          className="grid-cell top-extra"
          variants={cellVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <h3>{unit.title}</h3>
        </motion.div>
      )}

      <div className="grid-cell bottom-left">
        <h3>Stats</h3>
        <div className="bottom-row-grid">
          {statFields.map(({ key, label }) => (
            <div key={key}>
              {editingField === key ? (
                <input
                  type="number"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={saveEdit}
                  onKeyDown={handleKeyDown}
                  min="0"
                  max="99"
                  className="inline-input"
                  ref={inputRef}
                  aria-label={`Edit ${label} for ${unit.name}`}
                />
              ) : (
                <p
                  onClick={() => startEditing(key, unit.stats[key])}
                  className={isEditing ? "editable" : ""}
                  role="button"
                >
                  {label}: {unit.stats[key]}
                </p>
              )}
              {editingField === key && error && (
                <p className="inline-error">{error}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid-cell bottom-middle">
        <h3>Skills</h3>
        <div className="bottom-row-grid">
          <p> {unit.personal_skill?.name} </p>
          <p> {unit.basic_skills[0].name} </p>
          <p> {unit.basic_skills[1].name} </p>
          <p> {unit.basic_skills[2].name} </p>
          <p> {unit.basic_skills[3].name} </p>
          <p> {unit.basic_skills[4].name} </p>
        </div>
      </div>

      <div className="grid-cell bottom-right">
        <div>
          <img
            src={`/characters/${gameId}/${unit.name}.png`}
            alt={unit.name}
            className="character-image"
          />
        </div>
      </div>

      {isExpanded && (
        <>
          <motion.div
            className="grid-cell bottom-extra1"
            variants={cellVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <h3>Unit Stat Caps</h3>
            <div className="bottom-row-grid">
              <p> HP: {unit.class.MaxStatCaps.hp} </p>
              <p>
                {" "}
                STR:{" "}
                {unit.maxStatModifiers.strength +
                  unit.class.MaxStatCaps.strength}{" "}
              </p>
              <p>
                {" "}
                MAG:{" "}
                {unit.maxStatModifiers.magic +
                  unit.class.MaxStatCaps.magic}{" "}
              </p>
              <p>
                {" "}
                SKL:{" "}
                {unit.maxStatModifiers.skill +
                  unit.class.MaxStatCaps.skill}{" "}
              </p>
              <p>
                {" "}
                SPD:{" "}
                {unit.maxStatModifiers.speed +
                  unit.class.MaxStatCaps.speed}{" "}
              </p>
              <p>
                {" "}
                LCK:{" "}
                {unit.maxStatModifiers.luck + unit.class.MaxStatCaps.luck}{" "}
              </p>
              <p>
                {" "}
                DEF:{" "}
                {unit.maxStatModifiers.defence +
                  unit.class.MaxStatCaps.defence}{" "}
              </p>
              <p>
                {" "}
                RES:{" "}
                {unit.maxStatModifiers.resistance +
                  unit.class.MaxStatCaps.resistance}{" "}
              </p>
            </div>
          </motion.div>
          <motion.div
            className="grid-cell bottom-extra2"
            variants={cellVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <h3>Weapon Ranks</h3>
            <div className="bottom-row-grid">
              {filteredFields.map(({ key, label }) => {
                const options = getWeaponRankOptions(key);
                const isEditable = options.length > 1;

                return (
                  <div key={key} className="weapon-rank-item">
                    {isEditing && isEditable ? (
                      <div className="weapon-rank-edit">
                        <span className="weapon-rank-label">{label}:</span>
                        <select
                          value={unit.weapon_ranks[key]}
                          onChange={(e) =>
                            handleWeaponRankChange(
                              key,
                              e.target.value as WeaponRank,
                            )
                          }
                          className="inline-select"
                          aria-label={`Edit ${label} rank for ${unit.name}`}
                        >
                          {options
                            .filter((rank) => rank !== "n")
                            .map((rank) => (
                              <option key={rank} value={rank}>
                                {rank}
                              </option>
                            ))}
                        </select>
                      </div>
                    ) : (
                      <p>{label}: {unit.weapon_ranks[key]}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
          <motion.div
            className="grid-cell bottom-extra3"
            variants={cellVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <h3>Growth Rates Total</h3>
            <div className="bottom-row-grid">
              <p>
                {" "}
                HP Growth: {unit.base_growths.hp + unit.class.classGrowths.hp}
                %{" "}
              </p>
              <p>
                {" "}
                STR Growth:{" "}
                {unit.base_growths.strength + unit.class.classGrowths.strength}
                %{" "}
              </p>
              <p>
                {" "}
                MAG Growth:{" "}
                {unit.base_growths.magic + unit.class.classGrowths.magic}%{" "}
              </p>
              <p>
                {" "}
                SKL Growth:{" "}
                {unit.base_growths.skill + unit.class.classGrowths.skill}%{" "}
              </p>
              <p>
                {" "}
                SPD Growth:{" "}
                {unit.base_growths.speed + unit.class.classGrowths.speed}%{" "}
              </p>
              <p>
                {" "}
                LCK Growth:{" "}
                {unit.base_growths.luck + unit.class.classGrowths.luck}%{" "}
              </p>
              <p>
                {" "}
                DEF Growth:{" "}
                {unit.base_growths.defence + unit.class.classGrowths.defence}
                %{" "}
              </p>
              <p>
                {" "}
                RES Growth:{" "}
                {unit.base_growths.resistance +
                  unit.class.classGrowths.resistance}
                %{" "}
              </p>
            </div>
          </motion.div>
          <motion.div
            className="grid-cell bottom-extra4"
            variants={cellVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <h3>Class Sets</h3>
            <div className="class-sets-content">
              <div className="class-set-column">
                <div className="class-set-label">Base</div>
                <div className="class-sets-classes">
                  {unit.base_class_set.starting_class_tree &&
                  unit.base_class_set.starting_class_tree.classTree &&
                  unit.base_class_set.starting_class_tree.classTree.length >
                    0 ? (
                    unit.base_class_set.starting_class_tree.classTree
                      .filter((promotedClass) =>
                        promotedClass.className === "Maid" &&
                        unit.gender === "Male"
                          ? false
                          : promotedClass.className === "Butler" &&
                              unit.gender === "F"
                            ? false
                            : true,
                      )
                      .map((promotedClass, index) => (
                        <span key={index}>{promotedClass.className}</span>
                      ))
                  ) : (
                    <span>No Base Classes</span>
                  )}
                </div>
              </div>
              <div className="class-set-column">
                <div className="class-set-label">Heart Seal</div>
                <div className="class-sets-classes">
                  {unit.base_class_set.heart_seal_classes &&
                  unit.base_class_set.heart_seal_classes.length > 0 ? (
                    unit.base_class_set.heart_seal_classes.map(
                      (cls, clsIndex) =>
                        cls.classTree && cls.classTree.length > 0 ? (
                          cls.classTree
                            .filter((promotedClass) =>
                              promotedClass.className === "Maid" &&
                              unit.gender === "M"
                                ? false
                                : promotedClass.className === "Butler" &&
                                    unit.gender === "F"
                                  ? false
                                  : true,
                            )
                            .map((promotedClass, treeIndex) => (
                              <span key={`${clsIndex}-${treeIndex}`}>
                                {promotedClass.className}
                              </span>
                            ))
                        ) : (
                          <span key={clsIndex}>No Promotions</span>
                        ),
                    )
                  ) : (
                    <span>No Heart Seal Classes</span>
                  )}
                </div>
              </div>
              <div className="class-set-column">
                <div className="class-set-label">Friendship Seal</div>
                <div className="class-sets-classes">
                  {unit.base_class_set.friendship_seal_base_class &&
                  unit.base_class_set.friendship_seal_base_class.classTree &&
                  unit.base_class_set.friendship_seal_base_class.classTree
                    .length > 0 ? (
                    unit.base_class_set.friendship_seal_base_class.classTree
                      .filter((promotedClass) =>
                        promotedClass.className === "Maid" &&
                        unit.gender === "M"
                          ? false
                          : promotedClass.className === "Butler" &&
                              unit.gender === "F"
                            ? false
                            : true,
                      )
                      .map((promotedClass, index) => (
                        <span key={index}>{promotedClass.className}</span>
                      ))
                  ) : (
                    <span>No Friendship Seal Classes Yet</span>
                  )}
                </div>
              </div>
              <div className="class-set-column">
                <div className="class-set-label">Partner Seal</div>
                <div className="class-sets-classes">
                  {unit.base_class_set.partner_seal_base_class &&
                  unit.base_class_set.partner_seal_base_class.classTree &&
                  unit.base_class_set.partner_seal_base_class.classTree.length >
                    0 ? (
                    unit.base_class_set.partner_seal_base_class.classTree
                      .filter((promotedClass) =>
                        promotedClass.className === "Maid" &&
                        unit.gender === "M"
                          ? false
                          : promotedClass.className === "Butler" &&
                              unit.gender === "F"
                            ? false
                            : true,
                      )
                      .map((promotedClass, index) => (
                        <span key={index}>{promotedClass.className}</span>
                      ))
                  ) : (
                    <span>No Partner Seal Classes Yet</span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </motion.main>
  );
};

export default UnitGrid;