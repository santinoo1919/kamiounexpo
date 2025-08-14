const palette = {
  neutral100: "#f5fbfe",
  neutral200: "#e2e6e9",
  neutral300: "#8b9ba7",
  neutral400: "#586874",
  neutral500: "#424e57",
  neutral600: "#2c343a",

  primary100: "#1F4898",
  primary200: "#1f3c7e",
  primary300: "#1d3064",
  primary400: "#1a264b",
  primary500: "#161b33",
  primary600: "#0f111d",

  secondary100: "#DCDDE9",
  secondary200: "#BCC0D6",
  secondary300: "#9196B9",
  secondary400: "#626894",
  secondary500: "#41476E",

  accent100: "#FBC916",
  accent200: "#cca41b",
  accent300: "#a0811c",
  accent400: "#765f1a",
  accent500: "#4e4016",
  accent600: "#2a2210",

  angry100: "#b41c2b",
  angry200: "#851d22",
  angry300: "#581919",
  angry400: "#2f1310",

  success100: "#009f42",
  success200: "#167533",
  success300: "#184d25",
  success400: "#132916",

  warning100: "#f0ad4e",
  warning200: "#af7f3c",
  warning300: "#71532a",
  warning400: "#392b19",

  overlay20: "rgba(25, 16, 21, 0.2)",
  overlay50: "rgba(25, 16, 21, 0.5)",
} as const

export const colors = {
  /**
   * The palette is available to use, but prefer using the name.
   * This is only included for rare, one-off cases. Try to use
   * semantic names as much as possible.
   */
  palette,
  /**
   * A helper for making something see-thru.
   */
  transparent: "rgba(0, 0, 0, 0)",
  /**
   * The default text color in many components.
   */
  text: palette.neutral500,
  /**
   * Secondary text information.
   */
  textDim: palette.neutral400,
  /**
   * The default color of the screen background.
   */
  background: palette.neutral100,
  /**
   * The default border color.
   */
  border: palette.neutral200,
  /**
   * The main tinting color.
   */
  tint: palette.primary500,
  /**
   * The inactive tinting color.
   */
  tintInactive: palette.neutral300,
  /**
   * A subtle color used for lines.
   */
  separator: palette.neutral300,
  /**
   * Error messages.
   */
  error: palette.angry100,
  /**
   * Error Background.
   */
  errorBackground: palette.angry400,
} as const
