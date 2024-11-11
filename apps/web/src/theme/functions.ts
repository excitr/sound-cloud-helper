const PX_PER_REM = 16;

/**
 * Converts given px to rem : 16px = 1rem
 */
export const rem = (px: string | number): string => {
  const pixels = typeof px === 'string' ? parseFloat(px) : px;
  return `${(pixels / PX_PER_REM).toFixed(2)}rem`;
};
