export type WallArtSize = "xs" | "s" | "m" | "l" | "xl";

export const REFERENCE_WALL_WIDTH_CM = 350; // 3.5 meters

export interface WallArtDimension {
    width: number; // cm
    height: number; // cm
    label: string;
}

export const WALL_ART_SIZES: Record<WallArtSize, WallArtDimension> = {
    xs: { width: 30, height: 40, label: "XS" },
    s: { width: 40, height: 50, label: "S" },
    m: { width: 50, height: 70, label: "M" },
    l: { width: 70, height: 100, label: "L" },
    xl: { width: 100, height: 140, label: "XL" },
};
