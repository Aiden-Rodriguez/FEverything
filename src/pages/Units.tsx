import { defaultCharacters } from "../defaultData/defaultCharacters.tsx";
import "../styles/Units.css";
import { NavLink } from "react-router-dom";

const Units = () => {
  const defaultUnit = defaultCharacters[0]; // Corrin (M)

  return (
    <div className="page-container">
        <h1>Unit Manager</h1>

        <main className="units-grid">
            <div className="units-grid-top-content">
                ASC
            </div>
            <div>
                ASC
            </div>
            <div>
                ASC
            </div>
            <div className="units-grid-left">
                <div>
                    ABC
                </div>
            </div>
            <div className="units-grid-middle">
                <div>
                    ABC
                </div>
            </div>
            <div className="units-grid-right">
                <div>
                    ABC
                </div>
            </div>
        </main>
        <div>
            <img 
            src={defaultUnit.image} 
            alt={defaultUnit.name} 
            style={{ width: "150px", height: "auto", borderRadius: "10px" }} 
            />
            <h2>{defaultUnit.name}</h2>
            <p>Class: {defaultUnit.class}</p>
            <p>Personal Skill: {defaultUnit.personal_skill}</p>
        </div>
    </div>
  );
};

export default Units;