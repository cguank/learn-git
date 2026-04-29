import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/ssr", label: "SSR" },
  { href: "/csr", label: "CSR" },
  { href: "/ssg", label: "SSG" },
  { href: "/isr", label: "ISR" },
  { href: "/server-to-client", label: "Props" },
  { href: "/interview", label: "Interview" }
];

export default function ModeNav() {
  return (
    <nav className="modeNav" aria-label="Rendering mode navigation">
      {links.map((link) => (
        <Link className="modeNavLink" href={link.href} key={link.href}>
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
