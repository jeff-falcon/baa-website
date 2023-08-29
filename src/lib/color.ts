export function getContrastYIQFromColor(color: string) {
  if (typeof color !== 'string') {
    throw Error('not a string');
  }
  if (color.startsWith('#')) {
    return getContrastYIQFromHex(color);
  }
  if (color.startsWith('rgb')) {
    return getContrastYIQFromCssRGB(color);
  }
  throw Error('not a supported color');
}

export function getContrastYIQFromHex(hexcolor: string) {
  const hex = hexcolor.replace(/[^A-z0-9]/g, '');
  const is3 = hex.length === 3;
  if (!is3 && hex.length !== 6) {
    throw Error(`not a valid hex color ${hexcolor} ${hex}`);
  }
  const r = parseInt(is3 ? hex[0] : hex.substring(0, 2), 16);
  const g = parseInt(is3 ? hex[1] : hex.substring(2, 4), 16);
  const b = parseInt(is3 ? hex[2] : hex.substring(4, 6), 16);
  return getContrastYIQFromRGB(r, g, b);
}

export function getContrastYIQFromCssRGB(rgb: string) {
  const matches = rgb.match(/\d+/g);
  if (!matches) {
    throw Error('not a valid rgb string')
  }
  const [r, g, b] = matches.map(Number);
  return getContrastYIQFromRGB(r, g, b);
}

export function getContrastYIQFromRGB(r: number, g: number, b: number) {
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return (yiq >= 128) ? 'black' : 'white';
}