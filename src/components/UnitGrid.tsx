import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

import { Character } from "../types/Fire Emblem Fates/UnitStruct.tsx";
import { Class } from "../types/Fire Emblem Fates/ClassStruct.tsx";
import { Skill } from "../types/Fire Emblem Fates/SkillStruct.tsx";

interface UnitGridProps {
  unit: Character;
  gameId?: string;
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

const UnitGrid: React.FC<UnitGridProps> = ({ unit, gameId }) => {
  const [getClassFn, setGetClassFn] = useState<
    ((className: string) => Class) | null
  >(null);
  const [getSkillFn, setGetSkillFn] = useState<
    ((skillName: string) => Skill) | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

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

  if (isLoading || !getClassFn || !getSkillFn) {
    return (
      <h3>
        Loading... <br /> If this takes more than a few seconds the gameID is
        incorrect.
      </h3>
    );
  }

  const handleToggleExpand = () => {
    setIsExpanded((prev: boolean) => !prev);
  };

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
        <h3>{unit.class.className}</h3>
      </div>

      <div className="grid-cell top-right">
        <h3>Level: {unit.level}</h3>
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
          <p> HP: {unit.stats.hp} </p>
          <p> STR: {unit.stats.strength} </p>
          <p> MAG: {unit.stats.magic} </p>
          <p> SKL: {unit.stats.skill} </p>
          <p> SPD: {unit.stats.speed} </p>
          <p> LCK: {unit.stats.luck} </p>
          <p> DEF: {unit.stats.defence} </p>
          <p> RES: {unit.stats.resistance} </p>
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
            {unit.weapon_ranks.WeaponRankSwordKatana !== "n" && (
              <p>Sword/Katana: {unit.weapon_ranks.WeaponRankSwordKatana}</p>
            )}
            {unit.weapon_ranks.WeaponRankLanceNaginata !== "n" && (
              <p>Lance/Naginata: {unit.weapon_ranks.WeaponRankLanceNaginata}</p>
            )}
            {unit.weapon_ranks.WeaponRankAxeClub !== "n" && (
              <p>Axe/Club: {unit.weapon_ranks.WeaponRankAxeClub}</p>
            )}
            {unit.weapon_ranks.WeaponRankTomeScroll !== "n" && (
              <p>Tome/Scroll: {unit.weapon_ranks.WeaponRankTomeScroll}</p>
            )}
            {unit.weapon_ranks.WeaponRankKnifeShuriken !== "n" && (
              <p>Knife/Shuriken: {unit.weapon_ranks.WeaponRankKnifeShuriken}</p>
            )}
            {unit.weapon_ranks.WeaponRankBowYumi !== "n" && (
              <p>Bow/Yumi: {unit.weapon_ranks.WeaponRankBowYumi}</p>
            )}
            {unit.weapon_ranks.WeaponRankStaffRod !== "n" && (
              <p>Staff/Rod: {unit.weapon_ranks.WeaponRankStaffRod}</p>
            )}
            {unit.weapon_ranks.WeaponRankStone !== "n" && (
              <p>Stone: {unit.weapon_ranks.WeaponRankStone}</p>
            )}
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
              {/* Base Class Tree */}
              <div className="class-set-column">
                <div className="class-set-label">Base</div>
                <div className="class-sets-classes">
                  {unit.base_class_set.starting_class_tree &&
                  unit.base_class_set.starting_class_tree.classTree &&
                  unit.base_class_set.starting_class_tree.classTree.length >
                    0 ? (
                    unit.base_class_set.starting_class_tree.classTree.map(
                      (promotedClass, index) => (
                        <span key={index}>{promotedClass.className}</span>
                      ),
                    )
                  ) : (
                    <span>No Base Classes</span>
                  )}
                </div>
              </div>

              {/* Heart Seal Class Tree */}
              <div className="class-set-column">
                <div className="class-set-label">Heart Seal</div>
                <div className="class-sets-classes">
                  {unit.base_class_set.heart_seal_classes &&
                  unit.base_class_set.heart_seal_classes.length > 0 ? (
                    unit.base_class_set.heart_seal_classes.map(
                      (cls, clsIndex) =>
                        cls.classTree && cls.classTree.length > 0 ? (
                          cls.classTree.map((promotedClass, treeIndex) => (
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

              {/* Friendship Seal Class Tree */}
              <div className="class-set-column">
                <div className="class-set-label">Friendship Seal</div>
                <div className="class-sets-classes">
                  {unit.base_class_set.friendship_seal_base_class &&
                  unit.base_class_set.friendship_seal_base_class.classTree &&
                  unit.base_class_set.friendship_seal_base_class.classTree
                    .length > 0 ? (
                    unit.base_class_set.friendship_seal_base_class.classTree.map(
                      (promotedClass, index) => (
                        <span key={index}>{promotedClass.className}</span>
                      ),
                    )
                  ) : (
                    <span>No Friendship Seal Classes</span>
                  )}
                </div>
              </div>

              {/* Partner Seal Class Tree */}
              <div className="class-set-column">
                <div className="class-set-label">Partner Seal</div>
                <div className="class-sets-classes">
                  {unit.base_class_set.partner_seal_base_class &&
                  unit.base_class_set.partner_seal_base_class.classTree &&
                  unit.base_class_set.partner_seal_base_class.classTree.length >
                    0 ? (
                    unit.base_class_set.partner_seal_base_class.classTree.map(
                      (promotedClass, index) => (
                        <span key={index}>{promotedClass.className}</span>
                      ),
                    )
                  ) : (
                    <span>No Partner Seal Classes</span>
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
