import { redirect } from "next/navigation";

export default function HomePageIndex() {
  redirect("/pages/home/hero");
}