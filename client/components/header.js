import Link from "next/link";

const Header = ({ currentUser }) => {
  const links = [
    !currentUser && { label: "Sign Up", href: "/auth/signup" },
    !currentUser && { label: "Sign In", href: "/auth/signin" },
    currentUser && { label: "Sign Out", href: "/auth/signout" },
  ]
    .filter((linkCfg) => linkCfg)
    .map(({ label, href }) => {
      return (
        <li key={href} className="nav-item">
          <Link href={href}>
            <a className="nav-link link-light">{label}</a>
          </Link>
        </li>
      );
    });

  return (
    <nav className="navbar navbar-dark bg-dark p-1 mb-5">
      <Link href="/">
        <a className="navbar-brand">
          <img
            src="../static/images/gittix-bg-dark.png"
            style={{
              height: "50px",
            }}
          />
        </a>
      </Link>

      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">{links}</ul>
      </div>
    </nav>
  );
};

export default Header;
