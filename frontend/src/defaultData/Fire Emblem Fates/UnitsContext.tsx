import React, { createContext, useContext, useState, useEffect } from "react";
import { BaseCharacter } from "../../types/Fire Emblem Fates/UnitStruct";
import { parse, stringify } from "flatted";

interface UnitsContextType {
  units: BaseCharacter[];
  setUnits: (units: BaseCharacter[]) => void;
  updateUnit: (unit: BaseCharacter) => void;
  addUnit: (unit: BaseCharacter) => void;
  deleteAllUnits: () => void;
  removeUnit: (name: string) => void;
}

const UnitsContext = createContext<UnitsContextType | undefined>(undefined);

export const UnitsProvider: React.FC<{
  children: React.ReactNode;
  gameId: string;
  route: string;
}> = ({ children, gameId, route }) => {
  const [units, setUnits] = useState<BaseCharacter[]>([]);

  useEffect(() => {
    const storedUnits = localStorage.getItem(`units_${gameId}_${route}`);
    if (storedUnits) {
      try {
        setUnits(parse(storedUnits));
      } catch (error) {
        console.error("Failed to parse units:", error);
      }
    }
  }, [gameId, route]);

  useEffect(() => {
    if (units.length > 0) {
      localStorage.setItem(`units_${gameId}_${route}`, stringify(units));
    } else {
      localStorage.removeItem(`units_${gameId}_${route}`);
    }
  }, [units, gameId, route]);

  const updateUnit = (updatedUnit: BaseCharacter) =>
    setUnits((prev) =>
      prev.map((u) => (u.name === updatedUnit.name ? updatedUnit : u)),
    );

  const addUnit = (unit: BaseCharacter) => setUnits((prev) => [...prev, unit]);

  const deleteAllUnits = () => setUnits([]);

  const removeUnit = (name: string) =>
    setUnits((prev) => prev.filter((u) => u.name !== name));

  return (
    <UnitsContext.Provider
      value={{
        units,
        setUnits,
        updateUnit,
        addUnit,
        deleteAllUnits,
        removeUnit,
      }}
    >
      {children}
    </UnitsContext.Provider>
  );
};

export const useUnits = (): UnitsContextType => {
  const context = useContext(UnitsContext);
  if (!context) throw new Error("useUnits must be used within a UnitsProvider");
  return context;
};
