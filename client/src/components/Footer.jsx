import { Link } from "react-router-dom";
import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div>
          <p className="footer-logo">Wanderly</p>
          <p className="footer-tagline">Find your next adventure, together.</p>
        </div>
      </div>
      <p className="footer-copy">© {new Date().getFullYear()} Wanderly. All rights reserved.</p>
    </footer>
  );
}

export default Footer;