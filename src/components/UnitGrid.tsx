import React, { useState } from "react"; // Import useState
import { Character } from "../types/UnitStruct.tsx";

interface UnitGridProps {
  unit: Character;
  gameId?: string;
}

const UnitGrid: React.FC<UnitGridProps> = ({ unit, gameId }) => {
  const [showGrowthRates, setShowGrowthRates] = useState<boolean>(false);

  const handleToggle = () => {
    setShowGrowthRates((prev: boolean) => !prev);
  };

  return (
    <main className="units-grid">
      <div className="grid-cell top-left">
        <h3>{unit.name}</h3>
        {unit.nickname && <p>Nickname: {unit.nickname}</p>}
      </div>

      <div className="grid-cell top-middle">
        <h3>{unit.class.className}</h3>
      </div>

      <div className="grid-cell top-right">
        <h3>Level: {unit.level}</h3>
      </div>

      <div
        className="grid-cell bottom-left"
        onClick={handleToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleToggle();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={`Toggle between ${unit.name}'s stats and growth rates`}
      >
        <h3>{showGrowthRates ? "Growth Rates" : "Stats"}</h3>
        <div className="bottom-row-grid">
          {showGrowthRates ? (
            <>
              <p> HP Growth: {unit.base_growths.hp + unit.class.classGrowths.hp}% </p>
              <p> STR Growth: {unit.base_growths.strength + unit.class.classGrowths.strength}% </p>
              <p> MAG Growth: {unit.base_growths.magic + unit.class.classGrowths.magic}% </p>
              <p> SKL Growth: {unit.base_growths.skill + unit.class.classGrowths.skill}% </p>
              <p> SPD Growth: {unit.base_growths.speed + unit.class.classGrowths.speed}% </p>
              <p> LCK Growth: {unit.base_growths.luck + unit.class.classGrowths.luck}% </p>
              <p> DEF Growth: {unit.base_growths.defense + unit.class.classGrowths.defense}% </p>
              <p> RES Growth: {unit.base_growths.resistance + unit.class.classGrowths.resistance}% </p>
            </>
          ) : (
            <>
              <p> HP: {unit.stats.hp} </p>
              <p> STR: {unit.stats.strength} </p>
              <p> MAG: {unit.stats.magic} </p>
              <p> SKL: {unit.stats.skill} </p>
              <p> SPD: {unit.stats.speed} </p>
              <p> LCK: {unit.stats.luck} </p>
              <p> DEF: {unit.stats.defense} </p>
              <p> RES: {unit.stats.resistance} </p>
            </>
          )}
        </div>
      </div>

      <div className="grid-cell bottom-middle">
        <h3>Skills</h3>
        <div className="bottom-row-grid">
          <p> {unit.personal_skill} </p>
          <p> {unit.basic_skills.skill1} </p>
          <p> {unit.basic_skills.skill2} </p>
          <p> {unit.basic_skills.skill3} </p>
          <p> {unit.basic_skills.skill4} </p>
          <p> {unit.basic_skills.skill5} </p>
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
    </main>
  );
};

export default UnitGrid;