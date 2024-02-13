import Logo from "./Logo";
// import Search from "./Search";
// import NumResults from "./NumResults";
function Navbar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

export default Navbar;
