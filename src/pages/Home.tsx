import "../styles/Home.css";
import { NavLink, Link } from "react-router-dom";
import FatesImage from "../assets/images/fates.webp";
import InProg from "../assets/images/inprog.jpg";
const Home = () => {
    return (
        <main>
            <div className="page-container">
                <h1 className="home-text">
                    Welcome to FEverything
                </h1>
                <h2>
                    FEverything is a resource for Fire Emblem players to simulate combat, manage units, and see if their units are above or below average.
                </h2>
                <div className="home-page-container">
                    <div className="home-page-grid">
                        <div className="grid-content-home">
                            <NavLink to="/Login" className="home-image-container">
                                <img src={FatesImage} alt="Fire Emblem Fates" />
                                <div className="image-overlay-text">Fire Emblem Fates</div>
                            </NavLink>
                        </div>
                        <div className="grid-content-home">
                            <div className="home-image-container">
                                <img src={InProg} alt="In Progress" />
                            </div>
                        </div>
                        <div className="grid-content-home">
                            <div className="home-image-container">
                                <img src={InProg} alt="In Progress" />
                            </div>
                        </div>
                        <div className="grid-content-home">
                            <div className="home-image-container">
                                <img src={InProg} alt="In Progress" />
                            </div>
                        </div>
                        <div className="grid-content-home">
                            <div className="home-image-container">
                                <img src={InProg} alt="In Progress" />
                            </div>
                        </div>
                        <div className="grid-content-home">
                            <div className="home-image-container">
                                <img src={InProg} alt="In Progress" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Home;