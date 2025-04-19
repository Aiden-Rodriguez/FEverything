import { useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";
import "../styles/Common.css";
import "../styles/GamePage.css";
import FEUnits from "../assets/images/FEUnits.png"
import statistics from "../assets/images/statistics.png"
import InProg from "../assets/images/inprog.jpg";
import fatesbattle from "../assets/images/fatesbattle.png";

const GamePage = () => {
  const { gameId } = useParams<{ gameId: string }>();

  return (
    <main>
        <div className="page-container">
            <h1>{gameId}</h1>
            <div className="features-grid">
                <div className="features-grid-contents">
                    <NavLink to={`/${gameId}/units`} className="button-link">
                        Unit Manager
                    </NavLink>
                    <div className="features-grid-picture">
                        <img src={FEUnits} alt="Fire Emblem Units" />
                    </div>
                </div>
                <div className="features-grid-contents">
                    <NavLink to={`/${gameId}/combatsimulator`} className="button-link">
                        Combat Simulator
                    </NavLink>
                    <div className="features-grid-picture">
                        <img src={fatesbattle} alt="Fire Emblem Fates Combat Scene" />
                    </div>
                </div>
                <div className="features-grid-contents">
                    <NavLink to={`/${gameId}/averages`} className="button-link">
                        Stat Averages
                    </NavLink>
                    <div className="features-grid-picture">
                        <img src={statistics} alt="Statistics" />
                    </div>
                </div>
                <div className="features-grid-contents">
                    <NavLink to={`/game/${gameId}`} className="button-link">
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
