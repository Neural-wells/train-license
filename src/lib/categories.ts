import type { CategoryMeta } from "./types";

export const CATEGORIES: CategoryMeta[] = [
  {
    slug: "signs-danger-priority",
    reading: ["signs-danger-priority"],
    icon: "⚠️",
    title: {
      nl: "Gevaarsborden & voorrangsborden",
      fr: "Signaux de danger et de priorité",
      en: "Danger & priority signs",
    },
  },
  {
    slug: "signs-prohibition-obligation",
    reading: ["signs-prohibition-obligation"],
    icon: "🚫",
    title: {
      nl: "Verbodsborden & gebodsborden",
      fr: "Signaux d'interdiction et d'obligation",
      en: "Prohibition & mandatory signs",
    },
  },
  {
    slug: "signs-parking-indication",
    reading: ["signs-parking-indication"],
    icon: "🅿️",
    title: {
      nl: "Parkeerborden, aanwijzingsborden & markeringen",
      fr: "Signaux de stationnement, d'indication et marquages",
      en: "Parking & indication signs, road markings",
    },
  },
  {
    slug: "priority",
    reading: ["priority"],
    icon: "🔀",
    title: {
      nl: "Voorrangsregels",
      fr: "Règles de priorité",
      en: "Priority rules",
    },
  },
  {
    slug: "speed",
    reading: ["speed"],
    icon: "🏎️",
    title: {
      nl: "Snelheid & volgafstand",
      fr: "Vitesse et distance de sécurité",
      en: "Speed & following distance",
    },
  },
  {
    slug: "maneuvers",
    reading: ["maneuvers"],
    icon: "↩️",
    title: {
      nl: "Manoeuvres, inhalen & lichten",
      fr: "Manœuvres, dépassement et feux",
      en: "Maneuvers, overtaking & lights",
    },
  },
  {
    slug: "parking",
    reading: ["stopping-parking"],
    icon: "🚏",
    title: {
      nl: "Stilstaan & parkeren",
      fr: "Arrêt et stationnement",
      en: "Stopping & parking",
    },
  },
  {
    slug: "vulnerable-users",
    reading: ["vulnerable-users"],
    icon: "🚲",
    title: {
      nl: "Kwetsbare weggebruikers & bijzondere zones",
      fr: "Usagers vulnérables et zones particulières",
      en: "Vulnerable road users & special zones",
    },
  },
  {
    slug: "motorways-special",
    reading: ["motorways"],
    icon: "🛣️",
    title: {
      nl: "Autosnelwegen, tunnels & overwegen",
      fr: "Autoroutes, tunnels et passages à niveau",
      en: "Motorways, tunnels & level crossings",
    },
  },
  {
    slug: "driver-fitness-documents",
    reading: ["driver-vehicle","fitness-alcohol","accidents-emergencies"],
    icon: "🪪",
    title: {
      nl: "Rijgeschiktheid, documenten & voertuig",
      fr: "Aptitude à conduire, documents et véhicule",
      en: "Fitness to drive, documents & vehicle",
    },
  },
];

export function categoryMeta(slug: string): CategoryMeta | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
