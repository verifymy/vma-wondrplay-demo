export type Brand = "verifymy" | "wondrplay";

export interface BrandConfig {
  id: Brand;
  label: string;
  headerTitle: string;
  showPartnerLogo: boolean;
}

export const BRANDS: Record<Brand, BrandConfig> = {
  verifymy: {
    id: "verifymy",
    label: "VerifyMy",
    headerTitle: "VerifyMy",
    showPartnerLogo: false,
  },
  wondrplay: {
    id: "wondrplay",
    label: "Wondrplay",
    headerTitle: "VerifyMy x Wondrplay",
    showPartnerLogo: true,
  },
};
