import { FaSearch } from "react-icons/fa";
import Cards from "./cards";
import "./cards.css";
import "./search.css";

export default function Search() {
  return (
    <div className="search-container">
      <form className="search-form">
        <span className="search-icon">
          <FaSearch />
        </span>
        <input type="text" className="search-input" />
      </form>
      <Cards />
    </div>
  );
}
