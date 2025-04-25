import React from "react";
import { useParams } from "react-router-dom";
import "../styles/Units.css";
import UnitGrid from "../components/UnitGrid";

import { defaultCharacters } from "../defaultData/Fire Emblem Fates/defaultCharacters";

const Units = () => {
  const unitOne = defaultCharacters[0];
  const unitTwo = defaultCharacters[1];
  const unitThree = defaultCharacters[2];

  const { gameId } = useParams<{ gameId: string }>();

  return (
    <div className="page-container">
      <h1 className="top-margin">Unit Manager: {gameId}</h1>
      <div className="grids-container">
        <UnitGrid unit={unitOne} gameId={gameId} />
        <UnitGrid unit={unitTwo} gameId={gameId} />
        <UnitGrid unit={unitThree} gameId={gameId} />
        <UnitGrid unit={unitOne} gameId={gameId} />
        <UnitGrid unit={unitTwo} gameId={gameId} />
        <UnitGrid unit={unitThree} gameId={gameId} />
        <UnitGrid unit={unitOne} gameId={gameId} />
        <UnitGrid unit={unitTwo} gameId={gameId} />
        <div className="add-character-grid">Add Unit?</div>
      </div>
    </div>
  );
};

export default Units;
