// BodyType.ts
export interface BodyShape {
    id: string;
    name: string;
    characteristics: string[];
    stylingTips: string[];
    celebrities: string[];
    proportion: string;
    figure: string;
}

export const BODY_SHAPES: BodyShape[] = [
    {
        id: 'hourglass',
        name: 'Hourglass',
        characteristics: [
            'Balanced shoulders and hips',
            'Defined waist (usually at least 25cm smaller than hips)',
            'Clear bust-waist-hip ratio',
            'Typical S-shaped curve'
        ],
        stylingTips: [
            'Accentuate the waist with belts',
            'Wear pencil skirts or bodycon dresses',
            'Mid-rise jeans work well'
        ],
        celebrities: ['Kim Kardashian', 'Scarlett Johansson'],
        proportion: 'Balanced upper and lower body',
        figure: 'Curvy'
    },
    {
        id: 'inverted_triangle',
        name: 'Inverted Triangle',
        characteristics: [
            'Shoulders wider than hips',
            'Sporty or strong build',
            'Less curves on the lower body'
        ],
        stylingTips: [
            'Choose flared skirts or pants to balance the hips',
            'Avoid shoulder pads or high necklines',
            'Use dark colors for the top and lighter tones for the bottom'
        ],
        celebrities: ['Naomi Campbell', 'Angelina Jolie'],
        proportion: 'Broader upper body',
        figure: 'Athletic'
    },
    {
        id: 'pear',
        name: 'Pear',
        characteristics: [
            'Hips wider than shoulders',
            'Narrow shoulders, prominent lower body',
            'Often a slim waist'
        ],
        stylingTips: [
            'Draw attention to shoulders and upper body',
            'Opt for tops with shoulder details or wide necklines',
            'Avoid tight-fitting pants, prefer A-line skirts'
        ],
        celebrities: ['Jennifer Lopez', 'Beyoncé'],
        proportion: 'Heavier lower body',
        figure: 'Bottom-heavy'
    },
    {
        id: 'rectangle',
        name: 'Rectangle',
        characteristics: [
            'Shoulders, waist, and hips are nearly the same width',
            'Few curves',
            'Straight figure'
        ],
        stylingTips: [
            'Create the illusion of a waist with belts or waist detailing',
            'Choose peplum or flared skirts',
            'Avoid oversized clothing'
        ],
        celebrities: ['Keira Knightley', 'Cameron Diaz'],
        proportion: 'Straight silhouette',
        figure: 'Lean'
    },
    {
        id: 'apple',
        name: 'Apple',
        characteristics: [
            'Larger midsection',
            'Full bust',
            'Slim legs'
        ],
        stylingTips: [
            'Choose A-line or shift dresses',
            'Avoid excessive details around the waist',
            'Use vertical patterns and dark colors on the waist'
        ],
        celebrities: ['Drew Barrymore', 'Oprah Winfrey'],
        proportion: 'Heavier midsection',
        figure: 'Round'
    }
];
