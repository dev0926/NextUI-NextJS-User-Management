import { title, subtitle } from "@/components/primitives";
import { ThemeSwitch } from "@/components/theme-switch";
import UserTable from "@/components/UserTable/App";

import { FetchData } from "@/lib/User";

async function getData() {
  const res = await fetch("http://127.0.0.1:50000/users");
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default async function Home() {
  const data: FetchData = await getData();
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-4xl justify-center">
        <ThemeSwitch />
        <h2 className={subtitle({ class: "mt-4" })}>
          {data.success ? "User Data Loaded" : "User Data Load Failed"}
        </h2>
        <UserTable />
      </div>
    </section>
  );
}
