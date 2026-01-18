
const Logo = ({ className = "h-10" }) => {
    return (
        <svg
            viewBox="0 0 400 120"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <defs>
                <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#8D8741', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#659DBD', stopOpacity: 1 }} />
                </linearGradient>

                <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{ stopColor: '#BC986A', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#DAAD86', stopOpacity: 1 }} />
                </linearGradient>

                <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                    <feOffset dx="0" dy="2" result="offsetblur" />
                    <feComponentTransfer>
                        <feFuncA type="linear" slope="0.3" />
                    </feComponentTransfer>
                    <feMerge>
                        <feMergeNode />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            <g transform="translate(30, 30)" filter="url(#shadow)">
                <path d="M 30 15 C 30 8 24 3 18 3 C 15 3 12 4.5 10 7 C 8 4.5 5 3 2 3 C -4 3 -10 8 -10 15 C -10 25 0 35 10 45 C 20 35 30 25 30 15 Z"
                    fill="url(#brandGradient)"
                    stroke="#fff"
                    strokeWidth="2" />

                <ellipse cx="-5" cy="-5" rx="7" ry="9"
                    fill="url(#brandGradient)"
                    stroke="#fff"
                    strokeWidth="1.5"
                    transform="rotate(-20 -5 -5)" />

                <ellipse cx="10" cy="-8" rx="7" ry="9"
                    fill="url(#brandGradient)"
                    stroke="#fff"
                    strokeWidth="1.5" />

                <ellipse cx="25" cy="-5" rx="7" ry="9"
                    fill="url(#brandGradient)"
                    stroke="#fff"
                    strokeWidth="1.5"
                    transform="rotate(20 25 -5)" />

                <path d="M 10 18 C 10 16 9 15 8 15 C 7.5 15 7 15.3 6.5 16 C 6 15.3 5.5 15 5 15 C 4 15 3 16 3 18 C 3 20 5 22 6.5 24 C 8 22 10 20 10 18 Z"
                    fill="#fff"
                    opacity="0.9" />
            </g>

            <g transform="translate(100, 45)">
                <text x="0" y="0"
                    fontFamily="'Poppins', 'Arial', sans-serif"
                    fontSize="42"
                    fontWeight="700"
                    fill="#1f2937">
                    PetCare
                </text>

                <text x="178" y="0"
                    fontFamily="'Poppins', 'Arial', sans-serif"
                    fontSize="42"
                    fontWeight="700"
                    fill="url(#accentGradient)">
                    +
                </text>

                <text x="0" y="25"
                    fontFamily="'Inter', 'Arial', sans-serif"
                    fontSize="13"
                    fontWeight="500"
                    fill="#6b7280"
                    letterSpacing="1">
                    Premium Pet Products
                </text>
            </g>

            <circle cx="95" cy="25" r="2" fill="url(#accentGradient)" opacity="0.6" />
            <circle cx="385" cy="75" r="3" fill="url(#brandGradient)" opacity="0.4" />
            <circle cx="370" cy="30" r="2" fill="url(#accentGradient)" opacity="0.5" />

            <g transform="translate(320, 65)" opacity="0.15">
                <ellipse cx="0" cy="0" rx="3" ry="4" fill="#8D8741" />
                <ellipse cx="-3" cy="-4" rx="2" ry="2.5" fill="#8D8741" />
                <ellipse cx="2" cy="-5" rx="2" ry="2.5" fill="#8D8741" />
                <ellipse cx="5" cy="-2" rx="2" ry="2.5" fill="#8D8741" />
            </g>

            <g transform="translate(340, 75)" opacity="0.12">
                <ellipse cx="0" cy="0" rx="2.5" ry="3.5" fill="#659DBD" />
                <ellipse cx="-2.5" cy="-3.5" rx="1.8" ry="2.2" fill="#659DBD" />
                <ellipse cx="1.7" cy="-4" rx="1.8" ry="2.2" fill="#659DBD" />
                <ellipse cx="4.2" cy="-1.7" rx="1.8" ry="2.2" fill="#659DBD" />
            </g>
        </svg>
    );
};

export default Logo;
