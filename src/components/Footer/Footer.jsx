import "./Footer.css";

const tree =
  "https://6tlg35rybd.ufs.sh/f/JT0pvUmaDUtZIdbw8gAjGwgyepxTk47RCPfotcAalOuXUd0E";

export default function Footer() {
  return (
    <div className="footer">
      <div className="footer__contributors">
        <div className="footer__contributor">
          <div className="footer__image">
            <img
              src={tree}
              alt="Drawing of a tree"
              className="footer__tree footer__tree-crow"
            />{" "}
          </div>
          <div
            title="Link to Crow's GitHub"
            className="footer__contributor-container"
          >
            <a
              href="https://github.com/Buffalo-Crow"
              className="footer__contributor-name"
              target="_blank"
              rel="noopener noreferrer"
            >
              Crow
            </a>
          </div>
        </div>
        <div className="footer__contributor">
          <div className="footer__image">
            <img
              src={tree}
              alt="Drawing of a tree"
              className="footer__tree footer__tree-rich"
            />
          </div>
          <div
            title="Link to Ri₵h's GitHub"
            className="footer__contributor-container"
          >
            <a
              href="https://github.com/TonyRiches17"
              className="footer__contributor-name"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ri₵h
            </a>
          </div>
        </div>
        <div className="footer__contributor">
          <div className="footer__image">
            <img
              src={tree}
              alt="Drawing of a tree"
              className="footer__tree footer__tree-majestyk"
            />
          </div>
          <div
            title="Link to Majestyk's GitHub"
            className="footer__contributor-container"
          >
            <a
              href="https://github.com/Majestyk1"
              className="footer__contributor-name"
              target="_blank"
              rel="noopener noreferrer"
            >
              Magic
            </a>
          </div>
        </div>
        <div className="footer__contributor">
          <div className="footer__image">
            <img
              src={tree}
              alt="Drawing of a tree"
              className="footer__tree footer__tree-joshua"
            />
          </div>
          <div
            title="Link to Joshua's GitHub"
            className="footer__contributor-container"
          >
            <a
              href="https://github.com/ThePaladin000"
              className="footer__contributor-name"
              target="_blank"
              rel="noopener noreferrer"
            >
              Joshua
            </a>
          </div>
        </div>
      </div>
      <h3 className="footer__footer">&copy;2025 Created by</h3>
    </div>
  );
}
