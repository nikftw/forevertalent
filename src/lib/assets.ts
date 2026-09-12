const ICON_BASE = "https://wow.zamimg.com/images/wow/icons";

export function iconUrl(icon: string, size: "medium" | "large" = "large"): string {
  return `${ICON_BASE}/${size}/${icon.toLowerCase()}.jpg`;
}

export function treeBackgroundUrl(classSlug: string, treeName: string): string {
  const file = treeName.toLowerCase().replace(/\s+/g, "-");
  return `/backgrounds/${classSlug}/${file}.jpg`;
}

export function classIconUrl(icon: string): string {
  return iconUrl(icon, "medium");
}
