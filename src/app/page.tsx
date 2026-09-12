import { withBasePath } from "@/lib/basePath";

const mageHref = withBasePath("/mage/");

export default function Home() {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `location.replace(${JSON.stringify(mageHref)});`,
        }}
      />
      <p>
        <a href={mageHref}>Open the Mage talent calculator</a>
      </p>
    </>
  );
}
