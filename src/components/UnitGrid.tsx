import React from "react";
import { Character } from "../types/UnitStruct.tsx";

interface UnitGridProps {
  unit: Character;
  unitDetails?: React.ReactNode;
  stats?: React.ReactNode;
  skills?: React.ReactNode;
  equipment?: React.ReactNode;
  actions?: React.ReactNode;
}

const UnitGrid: React.FC<UnitGridProps> = ({
  unit,
  unitDetails,
  stats,
  skills,
  equipment,
  actions,
}) => {
  return (
    <main className="units-grid">
      {/* Top Row */}
      <div className="grid-cell top-left">
        {unitDetails || (
          <>
            <h3>Name: {unit.name}</h3>
            {unit.nickname && <p>Nickname: {unit.nickname}</p>}
            {/* <p>Royalty: {unit.royalty_status ? "Yes" : "No"}</p> */}
          </>
        )}
      </div>

      <div className="grid-cell top-middle">
        {stats || (
          <>
            <h3>Level: {unit.level}</h3>
          </>
        )}
      </div>

      <div className="grid-cell top-right">
      {actions || (
          <>
            <h3>{unit.class}</h3>
          </>
        )}
      </div>

      {/* Bottom Row */}
      <div className="grid-cell bottom-left">
      {equipment || (
          <>
            <h3>Stats</h3>
            <p>
              HP: {unit.stats.hp}<br />
              STR: {unit.stats.strength}<br />
              MAG: {unit.stats.magic}<br />
              SKL: {unit.stats.skill}<br />
              SPD: {unit.stats.speed}<br />
              LCK: {unit.stats.luck}<br />
              DEF: {unit.stats.defense}<br />
              RES: {unit.stats.resistance}<br />
            </p>
          </>
        )}

      </div>

      <div className="grid-cell bottom-middle">
        {skills || (
          <>
            <h3>Skills</h3>
            <p>Personal: {unit.personal_skill}</p>
            <p>
              {unit.basic_skills.skill1}, {unit.basic_skills.skill2},<br />
              {unit.basic_skills.skill3}, {unit.basic_skills.skill4}, {unit.basic_skills.skill5}
            </p>
          </>
        )}
      </div>

      <div className="grid-cell bottom-right">
        <h3>Character Info</h3>
        <div>
          <img
            src={unit.image}
            alt={unit.name}
            className="character-image"
          />
          <h4>{unit.name}</h4>
          
          
        </div>
      </div>
    </main>
  );
};

export default UnitGrid;
