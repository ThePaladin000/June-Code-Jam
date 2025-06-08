import { IoLocationSharp } from "react-icons/io5";
import "./footer.css";
import grass from "../assets/grass.jpg";

const tree =
  "https://6tlg35rybd.ufs.sh/f/JT0pvUmaDUtZIdbw8gAjGwgyepxTk47RCPfotcAalOuXUd0E";

export default function Footer() {
  return (
    <div className="footer">
      {/* <h3 className="footer-header">Green Finder Developers</h3> */}
      <div className="footer-contributors">
        <div className="footer-contributor">
          <div className="footer-image">
            <img src={tree} alt="Drawing of a tree" className="footer-tree" />
            <div>
              <IoLocationSharp
                className="footer-icon-crow"
                title="contributor-icon"
              />
            </div>
          </div>
          <div className="footer-contributor-container">
            <a
              href="https://github.com/Buffalo-Crow"
              style={{ backgroundImage: grass }}
              className="footer-contributor-name"
              target="_blank"
              rel="noopener noreferrer"
            >
              Crow
            </a>
          </div>
        </div>
        <div className="footer-contributor">
          <div className="footer-image">
            <img src={tree} alt="Drawing of a tree" className="footer-tree" />
            <div>
              <IoLocationSharp
                className="footer-icon-rich"
                title="contributor-icon"
              />
            </div>
          </div>
          <div className="footer-contributor-container">
            <a
              href="https://github.com/TonyRiches17"
              style={{ backgroundImage: grass }}
              className="footer-contributor-name"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ri₵h
            </a>
          </div>
        </div>
        <div className="footer-contributor">
          <div className="footer-image">
            <img src={tree} alt="Drawing of a tree" className="footer-tree" />
            <div>
              <IoLocationSharp
                className="footer-icon-majestik"
                title="contributor-icon"
              />
            </div>
          </div>
          <div className="footer-contributor-container">
            <a
              href="https://github.com/Majestyk1"
              style={{ backgroundImage: grass }}
              className="footer-contributor-name"
              target="_blank"
              rel="noopener noreferrer"
            >
              Majestik
            </a>
          </div>
        </div>
        <div className="footer-contributor">
          <div className="footer-image">
            <img src={tree} alt="Drawing of a tree" className="footer-tree" />
            <div>
              <IoLocationSharp
                className="footer-icon-joshua"
                title="contributor-icon"
              />
            </div>
          </div>
          <div className="footer-contributor-container">
            <a
              href="https://github.com/ThePaladin000"
              style={{ backgroundImage: grass }}
              className="footer-contributor-name"
              target="_blank"
              rel="noopener noreferrer"
            >
              Joshua
            </a>
          </div>
        </div>
      </div>
      <h3 className="footer-footer">&copy;2025 Created by</h3>
    </div>
  );
}
