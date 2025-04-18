import { useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";
import "../styles/Common.css";
import "../styles/GamePage.css";


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
                    <div>
                        Feature Shid
                    </div>
                </div>
                <div className="features-grid-contents">
                    <NavLink to={`/${gameId}/combatsimulator`} className="button-link">
                        Combat Simulator
                    </NavLink>
                    <div>
                        Feature Shid
                    </div>
                </div>
                <div className="features-grid-contents">
                    <NavLink to={`/${gameId}/averages`} className="button-link">
                        Stat Averages
                    </NavLink>
                    <div>
                        Feature Shid
                    </div>
                </div>
                <div className="features-grid-contents">
                    <NavLink to={`/game/${gameId}`} className="button-link">
                        Coming Soon ...
                    </NavLink>
                    <div>
                        Feature Shid
                    </div>
                </div>
            </div>
        </div>
    </main>
  );
};

export default GamePage;
