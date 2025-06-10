import * as React from 'react';

export default function Logo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={253}
      height={498}
      viewBox='0 0 253 498'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      xmlnsXlink='http://www.w3.org/1999/xlink'
      {...props}
    >
      <g filter='url(#filter0_di_2006_2)'>
        <path
          d='M53 69.4402C53 32.7463 82.7463 3 119.44 3V3C195.486 3 211.892 110.059 139.336 132.831L52.9582 159.942C-28.9455 185.648 -10.4256 306.5 75.4174 306.5H161.203C229.408 306.5 262.208 390.16 212.177 436.515L178.974 467.28C130.965 511.762 53 477.713 53 412.265V69.4402Z'
          fill='url(#paint0_radial_2006_2)'
        />
        <path d='M53 69.4402C53 32.7463 82.7463 3 119.44 3V3C195.486 3 211.892 110.059 139.336 132.831L52.9582 159.942C-28.9455 185.648 -10.4256 306.5 75.4174 306.5H161.203C229.408 306.5 262.208 390.16 212.177 436.515L178.974 467.28C130.965 511.762 53 477.713 53 412.265V69.4402Z' />
      </g>
      <defs>
        <filter
          id='filter0_di_2006_2'
          x={0.351562}
          y={0.7}
          width={252.303}
          height={497.013}
          filterUnits='userSpaceOnUse'
          colorInterpolationFilters='sRGB'
        >
          <feFlood floodOpacity={0} result='BackgroundImageFix' />
          <feColorMatrix
            in='SourceAlpha'
            type='matrix'
            values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
            result='hardAlpha'
          />
          <feOffset dx={10} dy={4} />
          <feGaussianBlur stdDeviation={3.15} />
          <feComposite in2='hardAlpha' operator='out' />
          <feColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0' />
          <feBlend mode='normal' in2='BackgroundImageFix' result='effect1_dropShadow_2006_2' />
          <feBlend mode='normal' in='SourceGraphic' in2='effect1_dropShadow_2006_2' result='shape' />
          <feColorMatrix
            in='SourceAlpha'
            type='matrix'
            values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
            result='hardAlpha'
          />
          <feOffset />
          <feGaussianBlur stdDeviation={8.25} />
          <feComposite in2='hardAlpha' operator='arithmetic' k2={-1} k3={1} />
          <feColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0' />
          <feBlend mode='normal' in2='shape' result='effect2_innerShadow_2006_2' />
        </filter>
        <radialGradient
          id='paint0_radial_2006_2'
          cx={0}
          cy={0}
          r={1}
          gradientUnits='userSpaceOnUse'
          gradientTransform='translate(-318 -62.0002) rotate(90) scale(212.5 250)'
        >
          <stop stopColor='#EFFFF2' />
          <stop offset={1} stopColor='#0A9B00' />
        </radialGradient>
      </defs>
    </svg>
  );
}
