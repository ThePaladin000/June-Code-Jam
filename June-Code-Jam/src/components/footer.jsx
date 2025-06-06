import { IoLocationSharp } from "react-icons/io5";
import "./footer.css";

export default function Footer() {
  return (
    <div className="footer">
      <h3 className="footer-header">Green Finder Developers</h3>
      <div className="footer-contributors">
        <div className="footer-contributor">
          <IoLocationSharp className="footer-icon" title="contributor-icon" />
          <p className="footer-contributor-name">Crow</p>
        </div>
        <div className="footer-contributor">
          <IoLocationSharp className="footer-icon" title="contributor-icon" />
          <p className="footer-contributor-name">Rich</p>
        </div>
        <div className="footer-contributor">
          <IoLocationSharp className="footer-icon" title="contributor-icon" />
          <p className="footer-contributor-name">Majestik</p>
        </div>
        <div className="footer-contributor">
          <IoLocationSharp className="footer-icon" title="contributor-icon" />
          <p className="footer-contributor-name">Joshua</p>
        </div>
      </div>
    </div>
  );
}
