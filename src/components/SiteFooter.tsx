const BMC_PAGE_URL = "https://buymeacoffee.com/nikftw";

/**
 * Site footer: Blizzard copyright disclaimer + Buy me tokens (same as blizzcon.bingo).
 */
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <p className="site-footer-copy">
        World of Warcraft® and Blizzard Entertainment® are registered trademarks
        of Blizzard Entertainment, Inc. All game names, logos, and assets used on
        this fan-made talent calculator are the property of Blizzard
        Entertainment, Inc. This project is not affiliated with or endorsed in
        any way.
      </p>
      <a
        href={BMC_PAGE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="site-footer-bmc"
      >
        <span aria-hidden="true" className="site-footer-bmc-icon">
          🎟️
        </span>
        Buy me tokens
      </a>
    </footer>
  );
}
