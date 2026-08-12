import { cookies } from "next/headers";
import type { Region } from "./types";

export async function getRegion(): Promise<Region> {
  const v = (await cookies()).get("tl_region")?.value;
  return v === "BR" || v === "WA" ? v : "FL";
}
