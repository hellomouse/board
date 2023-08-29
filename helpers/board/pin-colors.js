const LIGHT_MODE_COLOR_MAP = {
    '#77172e': '#faafa8',
    '#692b17': '#f39f76',
    '#7c4a03': '#fff8b8',
    '#264d3b': '#e2f6d3',
    '#0c625d': '#b4ddd3',
    '#256377': '#d4e4ed',
    '#284255': '#aeccdc',
    '#472e5b': '#d3bfdb',
    '#6c394f': '#f6e2dd',
    '#4b443a': '#e9e3d4'
};

/**
 * Map a pin color -> true display color
 * @param {string} hexCode Hex color code
 * @param {bool} isLight Is theme light mode?
 * @param {Number} gradOpacity opacity of overlay
 * @return {object} new color or image 
 */
export function getColor(hexCode, isLight, gradOpacity=0.75) {
    hexCode = hexCode.toUpperCase();
    let gradColor = isLight ? `rgba(255, 255, 255, ${gradOpacity})` : `rgba(0, 0, 0, ${gradOpacity})`;
    let grad = `linear-gradient(${gradColor}, ${gradColor})`;
    if (hexCode === '#AA0000')
        return { type: 'img', src: 'anime.png', grad: grad };
    if (hexCode === '#AA0001')
        return { type: 'img', src: 'code.png', grad: grad };
    if (hexCode === '#AA0002')
        return { type: 'img', src: 'food.png', grad: grad };
    if (hexCode === '#AA0003')
        return { type: 'img', src: 'game.png', grad: grad };
    if (hexCode === '#AA0004')
        return { type: 'img', src: 'japan.png', grad: grad };
    if (hexCode === '#AA0005')
        return { type: 'img', src: 'music.png', grad: grad };
    if (hexCode === '#AA0006')
        return { type: 'img', src: 'nature.png', grad: grad };
    if (hexCode === '#AA0007')
        return { type: 'img', src: 'study.png', grad: grad };
    if (hexCode === '#AA0008')
        return { type: 'img', src: 'travel.png', grad: grad };
    if (isLight)
        hexCode = LIGHT_MODE_COLOR_MAP[hexCode.toLowerCase()] || hexCode;
    return { type: 'color', val: hexCode };
};

/**
 * Return a value for CSS background:
 * @param {object} color From getColor()
 * @return {string}
 */
export function getBackground(color) {
    if (color.type === 'color')
        return color.val;
    return `${color.grad}, url('/pins/${color.src}')`;
}

export const SWATCHES = ',#77172e,#692b17,#7c4a03,#264d3b,#0c625d,#256377,#284255,#472e5b,#6c394f,#4b443a,#AA0000,#AA0001,#AA0002,#AA0003,#AA0004,#AA0005,#AA0006,#AA0007,#AA0008'.split(',');
export const SWATCH_NAMES = [
    'Default',
    'Strawberry',
    'Mesa',
    'Desert',
    'Evergreen',
    'Emerald',
    'Freshwater',
    'Crying Obsidian',
    'Amethyst',
    'Pink Lemonade',
    'Rocky Mountain',
    'Fox Girl',
    'Code',
    'Food',
    'Game',
    'Japan',
    'Music',
    'Nature',
    'Science',
    'Travel'
];
