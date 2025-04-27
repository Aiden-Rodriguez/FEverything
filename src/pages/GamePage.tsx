import { useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import "../styles/Common.css";
import "../styles/GamePage.css";
import FEUnits from "../assets/images/FEUnits.png";
import statistics from "../assets/images/statistics.png";
import InProg from "../assets/images/inprog.jpg";
import fatesbattle from "../assets/images/fatesbattle.png";

const GamePage = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [chooseAPathText, setChooseAPathText] = useState<string>("Choose A Path");
  const isFates = gameId === "Fire Emblem Fates";

  const handleSelectRoute = (route: string) => {
    if (route != "Conquest") {
      setChooseAPathText("Only Conquest Route is supported as of now.")
      setSelectedRoute(route)
    } else {
      setChooseAPathText("You selected: Conquest");
      setSelectedRoute(route)
    }
  };

  //Temp as only 1 route is implented as of
  const featuresDisabled = isFates && selectedRoute != "Conquest";

  return (
    <main>
      <div className="page-container">
        <h1>{gameId}</h1>

        {isFates && (
          <div className="route-selector">
            <h2> {chooseAPathText} </h2>
            <div className="button-group">
              <button onClick={() => handleSelectRoute("Birthright")}>Birthright</button>
              <button onClick={() => handleSelectRoute("Conquest")}>Conquest</button>
              <button onClick={() => handleSelectRoute("Revelation")}>Revelation</button>
            </div>
          </div>
        )}

        <div className="features-grid">
          <div className="features-grid-contents">
            <NavLink to={`/${gameId}/units`} state= {{ selectedRoute }} className={`button-link ${featuresDisabled ? "disabled" : ""}`}>
              Unit Manager
            </NavLink>
            <div className="features-grid-picture">
              <img src={FEUnits} alt="Fire Emblem Units" />
            </div>
          </div>

          <div className="features-grid-contents">
            <NavLink to={`/${gameId}/combatsimulator`} state= {{ selectedRoute }} className={`button-link ${featuresDisabled ? "disabled" : ""}`}>
              Combat Simulator
            </NavLink>
            <div className="features-grid-picture">
              <img src={fatesbattle} alt="Fire Emblem Fates Combat Scene" />
            </div>
          </div>

          <div className="features-grid-contents">
            <NavLink to={`/${gameId}/averages`} state= {{ selectedRoute }} className={`button-link ${featuresDisabled ? "disabled" : ""}`}>
              Stat Averages
            </NavLink>
            <div className="features-grid-picture">
              <img src={statistics} alt="Statistics" />
            </div>
          </div>

          <div className="features-grid-contents">
            <NavLink to={`/game/${gameId}`} state= {{ selectedRoute }} className={`button-link ${featuresDisabled ? "disabled" : ""}`}>
              Coming Soon ...
            </NavLink>
            <div className="features-grid-picture">
              <img src={InProg} alt="Fire Emblem Units" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default GamePage;
