import React from "react";
import { Character } from "../types/UnitStruct.tsx";

interface UnitGridProps {
  unit: Character;
  gameId?: string;
  unitDetails?: React.ReactNode;
  stats?: React.ReactNode;
  skills?: React.ReactNode;
  equipment?: React.ReactNode;
  actions?: React.ReactNode;
}

const UnitGrid: React.FC<UnitGridProps> = ({
  unit,
  gameId,
  unitDetails,
  stats,
  skills,
  equipment,
  actions,
}) => {
  return (
    <main className="units-grid">
      <div className="grid-cell top-left">
        {unitDetails || (
          <>
            <h3>{unit.name}</h3>
            {unit.nickname && <p>Nickname: {unit.nickname}</p>}
            {/* <p>Royalty: {unit.royalty_status ? "Yes" : "No"}</p> */}
          </>
        )}
      </div>

      <div className="grid-cell top-middle">
        {stats || (
          <>
            <h3>{unit.class.className}</h3>
          </>
        )}
      </div>

      <div className="grid-cell top-right">
        {actions || (
          <>
            <h3>Level: {unit.level}</h3>
          </>
        )}
      </div>

      <div className="grid-cell bottom-left">
        {equipment || (
          <>
            <h3>Stats</h3>
            <div className="bottom-row-grid">
              <p> HP: {unit.stats.hp} </p>
              <p> STR: {unit.stats.strength} </p>
              <p> MAG: {unit.stats.magic} </p>
              <p> SKL: {unit.stats.skill} </p>
              <p> SPD: {unit.stats.speed} </p>
              <p> LCK: {unit.stats.luck} </p>
              <p> DEF: {unit.stats.defense} </p>
              <p> RES: {unit.stats.resistance} </p>
            </div>
          </>
        )}
      </div>

      <div className="grid-cell bottom-middle">
        {skills || (
          <>
            <h3>Skills</h3>
            <div className="bottom-row-grid">
              <p> {unit.personal_skill} </p>
              <p> {unit.basic_skills.skill1} </p>
              <p> {unit.basic_skills.skill2} </p>
              <p> {unit.basic_skills.skill3} </p>
              <p> {unit.basic_skills.skill4} </p>
              <p> {unit.basic_skills.skill5} </p>
            </div>
          </>
        )}
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
