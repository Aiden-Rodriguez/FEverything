import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import SpriteAnimator from "../components/SpriteAnimator";
import { Character } from "../types/Fire Emblem Fates/UnitStruct.tsx";
import { Class, WeaponRank } from "../types/Fire Emblem Fates/ClassStruct.tsx";
import { Skill } from "../types/Fire Emblem Fates/SkillStruct.tsx";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { useUnits } from "../defaultData/Fire Emblem Fates/UnitsContext";

interface UnitGridProps {
  unit: Character;
  gameId?: string;
  updateUnit: (updatedUnit: Character) => void;
}

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
  const { units } = useUnits();
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
    unit.class.className
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
    ({ key }) => unit.class.MaxWeaponRank[key] !== "n"
  );

  const allWeaponRanks: WeaponRank[] = ["n", "E", "D", "C", "B", "A", "S"];

  const getWeaponRankOptions = (
    field: keyof typeof unit.weapon_ranks
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
    value: WeaponRank
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

    const filterClasses = (cls: Class) =>
      cls.className !== unit.class.className &&
      !(cls.className === "Maid" && gender === "Male") &&
      !(cls.className === "Butler" && gender === "F");

    if (
      unit.base_class_set.starting_class_tree &&
      unit.base_class_set.starting_class_tree.classTree
    ) {
      classes.push(
        ...unit.base_class_set.starting_class_tree.classTree.filter(
          filterClasses
        )
      );
    }

    if (unit.base_class_set.heart_seal_classes) {
      unit.base_class_set.heart_seal_classes.forEach((cls) => {
        if (cls.classTree) {
          classes.push(...cls.classTree.filter(filterClasses));
        }
      });
    }

    if (
      unit.base_class_set.friendship_seal_base_class &&
      unit.base_class_set.friendship_seal_base_class.classTree
    ) {
      classes.push(
        ...unit.base_class_set.friendship_seal_base_class.classTree.filter(
          filterClasses
        )
      );
    }

    if (
      unit.base_class_set.partner_seal_base_class &&
      unit.base_class_set.partner_seal_base_class.classTree
    ) {
      classes.push(
        ...unit.base_class_set.partner_seal_base_class.classTree.filter(
          filterClasses
        )
      );
    }

    const finalClasses = classes.filter((cls) => {
      if (unit.class.promotionStatus === false) {
        return (
          cls.promotionStatus === false ||
          cls.promotionStatus === null ||
          (cls.promotionStatus === true && unit.level >= 10)
        );
      } else if (unit.class.promotionStatus === true) {
        return cls.promotionStatus !== false;
      } else if (unit.class.promotionStatus === null) {
        if (unit.level > 20) {
          return cls.promotionStatus !== false;
        } else {
          return cls.promotionStatus !== true;
        }
      }
      return false;
    });

    return finalClasses;
  };

  const handleClassChange = (className: string) => {
    setSelectedClassName(className);
  };

  const commitClassChange = () => {
    if (!getClassFn) return;
    const newClass = getClassFn(selectedClassName);
    let newLevel = unit.level;
    let newInternalLevel = unit.baseInternalLevel;
    if (
      unit.class.promotionStatus === false &&
      newClass.promotionStatus === true
    ) {
      newLevel = 1;
      newInternalLevel = 10 + Math.floor(unit.level / 2);
    } else if (
      unit.class.promotionStatus === null &&
      newClass.promotionStatus === true
    ) {
      newLevel = unit.level - 20;
      newInternalLevel = 20;
    }
    const newClassLine: [number, number, Class] = [
      newInternalLevel,
      newLevel,
      newClass,
    ];
    const newStats = {
      hp:
        unit.stats.hp -
        unit.class.classBaseStats.hp +
        newClass.classBaseStats.hp,
      strength:
        unit.stats.strength -
        unit.class.classBaseStats.strength +
        newClass.classBaseStats.strength,
      magic:
        unit.stats.magic -
        unit.class.classBaseStats.magic +
        newClass.classBaseStats.magic,
      skill:
        unit.stats.skill -
        unit.class.classBaseStats.skill +
        newClass.classBaseStats.skill,
      speed:
        unit.stats.speed -
        unit.class.classBaseStats.speed +
        newClass.classBaseStats.speed,
      luck:
        unit.stats.luck -
        unit.class.classBaseStats.luck +
        newClass.classBaseStats.luck,
      defence:
        unit.stats.defence -
        unit.class.classBaseStats.defence +
        newClass.classBaseStats.defence,
      resistance:
        unit.stats.resistance -
        unit.class.classBaseStats.resistance +
        newClass.classBaseStats.resistance,
      move: newClass.classBaseStats.move,
    };

    const updatedUnit: Character = {
      ...unit,
      class: newClass,
      class_line: [...unit.class_line, newClassLine],
      stats: newStats,
      level: newLevel,
      baseInternalLevel: newInternalLevel,
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
    const newIsClassChanging = !isClassChanging;
    setIsClassChanging(newIsClassChanging);
    setIsEditing(false);
    setEditingField(null);
    setError("");
    if (newIsClassChanging) {
      const availableClasses = getAvailableClasses();
      if (availableClasses.length > 0) {
        setSelectedClassName(availableClasses[0].className);
      }
    } else {
      setSelectedClassName(unit.class.className);
    }
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
    if (field === "level" && (num < 1 || num > 40)) {
      setError("Level must be between 1 and 40 (TEMP IMPLEMENTATION)");
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
        <div>
          <Tippy
            content={
              <>
                <strong>{unit.class.className}</strong>
                <p className="tooltip-text">{unit.class.description}</p>
              </>
            }
          >
            <h3>{unit.class.className}</h3>
          </Tippy>
          <div className="unit-sprite">
            <div className="sprite-wrapper">
              <SpriteAnimator
                character={unit.name}
                gender={unit.gender}
                class={unit.class.className}
                game={gameId ?? ""}
                displayScale={2}
                classMove={unit.class.classBaseStats.move}
                faction="Player"
                animationId={0}
              />
            </div>
          </div>
          {isClassChanging && selectedClassName !== unit.class.className && (
            <span className="class-change-arrow">
              {unit.class.className + " --> " + selectedClassName}
            </span>
          )}
        </div>

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
          <div className="class-change-column">
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
            <div className="two-button-container">
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
        <div className="three-wide-grid">
          {unit.personal_skill?.name !== "N/A" && (
            <div className="skill-image-container">
              <Tippy
                content={
                  <>
                    <strong>{unit.personal_skill.name}</strong>
                    <p className="tooltip-text">
                      {unit.personal_skill.description}
                    </p>
                  </>
                }
              >
                <img
                  src={`/skills/${gameId}/${unit.personal_skill.name}.png`}
                  alt={unit.name}
                  className="skill-image"
                />
              </Tippy>
            </div>
          )}
          {unit.equipped_skills
            .filter((skill) => skill.name !== "N/A")
            .map((skill, index) => (
              <div key={index} className="skill-image-container">
                <Tippy
                  content={
                    <>
                      <strong>{skill.name}</strong>
                      <p className="tooltip-text">{skill.description}</p>
                    </>
                  }
                >
                  <img
                    src={`/skills/${gameId}/${skill.name}.png`}
                    alt={skill.name}
                    className="skill-image"
                  />
                </Tippy>
              </div>
            ))}
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
                              e.target.value as WeaponRank
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
                      <p>
                        {label}: {unit.weapon_ranks[key]}
                      </p>
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
              <Tippy
                content={
                  <>
                    <p className="tooltip-text">
                      Personal HP Growth: {unit.base_growths.hp}%
                    </p>
                    <p className="tooltip-text">
                      {unit.class.className} HP Growth:{" "}
                      {unit.class.classGrowths.hp}%
                    </p>
                  </>
                }
              >
                <p>
                  {" "}
                  HP Growth: {unit.base_growths.hp + unit.class.classGrowths.hp}
                  %{" "}
                </p>
              </Tippy>
              <Tippy
                content={
                  <>
                    <p className="tooltip-text">
                      Personal STR Growth: {unit.base_growths.strength}%
                    </p>
                    <p className="tooltip-text">
                      {unit.class.className} STR Growth:{" "}
                      {unit.class.classGrowths.strength}%
                    </p>
                  </>
                }
              >
                <p>
                  {" "}
                  STR Growth:{" "}
                  {unit.base_growths.strength +
                    unit.class.classGrowths.strength}
                  %{" "}
                </p>
              </Tippy>
              <Tippy
                content={
                  <>
                    <p className="tooltip-text">
                      Personal MAG Growth: {unit.base_growths.magic}%
                    </p>
                    <p className="tooltip-text">
                      {unit.class.className} MAG Growth:{" "}
                      {unit.class.classGrowths.magic}%
                    </p>
                  </>
                }
              >
                <p>
                  {" "}
                  MAG Growth:{" "}
                  {unit.base_growths.magic + unit.class.classGrowths.magic}
                  %{" "}
                </p>
              </Tippy>
              <Tippy
                content={
                  <>
                    <p className="tooltip-text">
                      Personal SKL Growth: {unit.base_growths.skill}%
                    </p>
                    <p className="tooltip-text">
                      {unit.class.className} SKL Growth:{" "}
                      {unit.class.classGrowths.skill}%
                    </p>
                  </>
                }
              >
                <p>
                  {" "}
                  SKL Growth:{" "}
                  {unit.base_growths.skill + unit.class.classGrowths.skill}
                  %{" "}
                </p>
              </Tippy>
              <Tippy
                content={
                  <>
                    <p className="tooltip-text">
                      Personal SPD Growth: {unit.base_growths.speed}%
                    </p>
                    <p className="tooltip-text">
                      {unit.class.className} SPD Growth:{" "}
                      {unit.class.classGrowths.speed}%
                    </p>
                  </>
                }
              >
                <p>
                  {" "}
                  SPD Growth:{" "}
                  {unit.base_growths.speed + unit.class.classGrowths.speed}
                  %{" "}
                </p>
              </Tippy>
              <Tippy
                content={
                  <>
                    <p className="tooltip-text">
                      Personal LCK Growth: {unit.base_growths.luck}%
                    </p>
                    <p className="tooltip-text">
                      {unit.class.className} LCK Growth:{" "}
                      {unit.class.classGrowths.luck}%
                    </p>
                  </>
                }
              >
                <p>
                  {" "}
                  LCK Growth:{" "}
                  {unit.base_growths.luck + unit.class.classGrowths.luck}%{" "}
                </p>
              </Tippy>
              <Tippy
                content={
                  <>
                    <p className="tooltip-text">
                      Personal DEF Growth: {unit.base_growths.defence}%
                    </p>
                    <p className="tooltip-text">
                      {unit.class.className} DEF Growth:{" "}
                      {unit.class.classGrowths.defence}%
                    </p>
                  </>
                }
              >
                <p>
                  {" "}
                  DEF Growth:{" "}
                  {unit.base_growths.defence + unit.class.classGrowths.defence}
                  %{" "}
                </p>
              </Tippy>
              <Tippy
                content={
                  <>
                    <p className="tooltip-text">
                      Personal RES Growth: {unit.base_growths.resistance}%
                    </p>
                    <p className="tooltip-text">
                      {unit.class.className} RES Growth:{" "}
                      {unit.class.classGrowths.resistance}%
                    </p>
                  </>
                }
              >
                <p>
                  {" "}
                  RES Growth:{" "}
                  {unit.base_growths.resistance +
                    unit.class.classGrowths.resistance}
                  %{" "}
                </p>
              </Tippy>
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
                          : true
                      )
                      .map((promotedClass, index) => (
                        <Tippy
                          content={
                            <>
                              <strong>{promotedClass.className}</strong>
                              <p className="tooltip-text">
                                {promotedClass.description}
                              </p>
                            </>
                          }
                        >
                          <span key={index}>{promotedClass.className}</span>
                        </Tippy>
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
                                : true
                            )
                            .map((promotedClass, treeIndex) => (
                              <Tippy
                                content={
                                  <>
                                    <strong>{promotedClass.className}</strong>
                                    <p className="tooltip-text">
                                      {promotedClass.description}
                                    </p>
                                  </>
                                }
                              >
                                <span key={`${clsIndex}-${treeIndex}`}>
                                  {promotedClass.className}
                                </span>
                              </Tippy>
                            ))
                        ) : (
                          <span key={clsIndex}>No Promotions</span>
                        )
                    )
                  ) : (
                    <span>No Heart Seal Classes</span>
                  )}
                </div>
              </div>
              <div className="class-set-column">
  <div className="class-set-label">Friendship Seal</div>
  <div className="class-sets-classes">
    {isEditing ? (
      <div className="partner-select">
        {(() => {
          const activeUnitNames = new Set(units.map((u) => u.name));
          const filteredPartners =
            unit.base_class_set.friendship_seal_partners?.filter(
              (partner) => activeUnitNames.has(partner.name)
            ) || [];

          return filteredPartners.length > 0 ? (
            <select
              value={unit.base_class_set.selected_friendship_seal_partner?.name || ""}
              onChange={(e) => {
                const partnerName = e.target.value;
                const updatedUnit: Character = {
                  ...unit,
                  base_class_set: {
                    ...unit.base_class_set,
                    selected_friendship_seal_partner: partnerName
                      ? units.find((p) => p.name === partnerName) || null
                      : null,
                  },
                };
                updateUnit(updatedUnit);
              }}
              className="inline-select"
              aria-label={`Select or change friendship seal partner for ${unit.name}`}
            >
              <option value="">No Partner</option>
              {filteredPartners.map((partner) => (
                <option key={partner.name} value={partner.name}>
                  {partner.name}
                </option>
              ))}
            </select>
          ) : (
            <span>No Viable Friendship Seal Partners</span>
          );
        })()}
      </div>
    ) : (
      (() => {
        const activeUnitNames = new Set(units.map((u) => u.name));
        const selectedPartner = unit.base_class_set.selected_friendship_seal_partner;
        const isValidPartner = selectedPartner && activeUnitNames.has(selectedPartner.name);

        return isValidPartner ? (
          <div className="partner-item">
            <Tippy
              content={
                <>
                  <strong>{selectedPartner.name}</strong>
                  <p className="tooltip-text">{selectedPartner.title}</p>
                </>
              }
            >
              <span>{selectedPartner.name}</span>
            </Tippy>
          </div>
        ) : (
          <span>No Friendship Seal Partner Selected</span>
        );
      })()
    )}
  </div>
</div>
<div className="class-set-column">
  <div className="class-set-label">Partner Seal</div>
  <div className="class-sets-classes">
    {isEditing ? (
      <div className="partner-select">
        {(() => {
          const activeUnitNames = new Set(units.map((u) => u.name));
          const filteredPartners =
            unit.base_class_set.partner_seal_partners?.filter(
              (partner) => activeUnitNames.has(partner.name)
            ) || [];

          return filteredPartners.length > 0 ? (
            <select
              value={unit.base_class_set.selected_partner_seal_partner?.name || ""}
              onChange={(e) => {
                const partnerName = e.target.value;
                const updatedUnit: Character = {
                  ...unit,
                  base_class_set: {
                    ...unit.base_class_set,
                    selected_partner_seal_partner: partnerName
                      ? units.find((p) => p.name === partnerName) || null
                      : null,
                  },
                };
                updateUnit(updatedUnit);
              }}
              className="inline-select"
              aria-label={`Select or change partner seal partner for ${unit.name}`}
            >
              <option value="">No Partner</option>
              {filteredPartners.map((partner) => (
                <option key={partner.name} value={partner.name}>
                  {partner.name}
                </option>
              ))}
            </select>
          ) : (
            <span>No Viable Partner Seal Partners</span>
          );
        })()}
      </div>
    ) : (
      (() => {
        const activeUnitNames = new Set(units.map((u) => u.name));
        const selectedPartner = unit.base_class_set.selected_partner_seal_partner;
        const isValidPartner = selectedPartner && activeUnitNames.has(selectedPartner.name);

        return isValidPartner ? (
          <div className="partner-item">
            <Tippy
              content={
                <>
                  <strong>{selectedPartner.name}</strong>
                  <p className="tooltip-text">{selectedPartner.title}</p>
                </>
              }
            >
              <span>{selectedPartner.name}</span>
            </Tippy>
          </div>
        ) : (
          <span>No Partner Seal Partner Selected</span>
        );
      })()
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