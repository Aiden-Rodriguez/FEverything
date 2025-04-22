import React from "react";
import { defaultCharacters } from "../defaultData/defaultCharacters";
import "../styles/Units.css";
import UnitGrid from "../components/UnitGrid";

const Units = () => {
  const unitOne = defaultCharacters[0];
  const unitTwo = defaultCharacters[1];

  return (
    <div className="page-container">
      <h1>Unit Manager</h1>
      <div className="grids-container">
        <UnitGrid unit={unitOne} />
        <UnitGrid unit={unitTwo} />
      </div>
    </div>
  );
};

export default Units;
