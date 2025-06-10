import { BaseCharacter } from "../types/Fire Emblem Fates/UnitStruct";

interface CombatSimulatorProps {
  units: BaseCharacter[]
}

const CombatSimulator = ({units} : CombatSimulatorProps) => {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Combat Simulator</h1>
      <p>...</p>
    </div>
  );
};

export default CombatSimulator;
