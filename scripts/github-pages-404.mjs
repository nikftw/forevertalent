import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dataset = JSON.parse(
  readFileSync(join(root, "src/data/talents.json"), "utf8"),
);
const slugs = dataset.classes.map((cls) => cls.slug);
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Redirecting…</title>
    <script>
      (function () {
        var base = ${JSON.stringify(base)};
        var slugs = ${JSON.stringify(slugs)};
        var path = location.pathname;
        var rest = path;
        if (base && path.indexOf(base) === 0) rest = path.slice(base.length);
        var parts = rest.split("/").filter(Boolean);
        var cls = parts[0];
        var build = parts[1];
        if (cls && slugs.indexOf(cls) !== -1) {
          location.replace(base + "/" + cls + "/" + (build ? "#" + build : ""));
          return;
        }
        location.replace(base + "/mage/");
      })();
    </script>
  </head>
  <body></body>
</html>
`;

writeFileSync(join(root, "out/404.html"), html);
