import { ThemeSwitch } from "@/components/theme-switch";
import UserTable from "@/components/UserTable";

export default async function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-4xl justify-center">
        <ThemeSwitch />
        <UserTable />
      </div>
    </section>
  );
}
