import { IoLocationSharp } from "react-icons/io5";
import "./footer.css";
import tree from "../assets/tree.png";
import grass from "../assets/grass.jpg";

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
          <p style={{backgroundImage: grass }} className="footer-contributor-name">Crow</p>
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
          <p style={{backgroundImage: grass }} className="footer-contributor-name">Ri₵h</p>
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
          <p style={{backgroundImage: grass }} className="footer-contributor-name">Majestik</p>
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
          <p style={{backgroundImage: grass }} className="footer-contributor-name">Joshua</p>
          </div>
        </div>
      </div>
          <h3 className="footer-footer">&copy;2025 Created by</h3>
    </div>
  );
}
