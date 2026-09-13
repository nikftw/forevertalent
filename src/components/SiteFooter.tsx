const BMC_PAGE_URL = "https://buymeacoffee.com/nikftw";
const DISCORD_URL = "https://discord.gg/WGXYpu2UXr";

/**
 * Site footer: Blizzard copyright disclaimer + CTAs (same pattern as blizzcon.bingo).
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
      <div className="site-footer-actions">
        <a
          href={BMC_PAGE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="site-footer-cta site-footer-cta-bmc"
        >
          <span aria-hidden="true" className="site-footer-cta-icon">
            🎟️
          </span>
          Buy me tokens
        </a>
        <a
          href={DISCORD_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="site-footer-cta site-footer-cta-discord"
        >
          <span aria-hidden="true" className="site-footer-cta-icon">
            💬
          </span>
          Join Fake Fresh
        </a>
      </div>
    </footer>
  );
}
