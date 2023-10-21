import {ElementRef, useEffect, useMemo, useRef, useState} from "react";

const outerDiameter = 500;
const degtorad = Math.PI / 180;
const halfOuterDiameter = outerDiameter / 2;

function getSlicePath(a1: number, a2: number) {
    const x = outerDiameter / 2;
    const cr = halfOuterDiameter - 5;
    const cx1 = Math.cos(degtorad * a2) * cr + x;
    const cy1 = -Math.sin(degtorad * a2) * cr + x;
    const cx2 = Math.cos(degtorad * a1) * cr + x;
    const cy2 = -Math.sin(degtorad * a1) * cr + x;

    return (
        "M" +
        x +
        " " +
        x +
        " " +
        cx1 +
        " " +
        cy1 +
        " A" +
        cr +
        " " +
        cr +
        " 0 0 1 " +
        cx2 +
        " " +
        cy2 +
        "Z"
    );
}

function getColor(i: number) {
    const backgroundColors = [
        "#333333",
        "#2E8B57",
        "#8B4513",
        "#800080",
        "#6A5ACD",
        "#CD853F",
        "#B22222",
        "#9932CC",
        "#A0522D",
    ];
    return backgroundColors[i % backgroundColors.length];
}

const getRandomNumber = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
};

interface SpinnerProps {
    names: string[];
    handleWinner: (speed: number) => void;
}

export default function Spinner({names, handleWinner}: SpinnerProps) {
    const slices = useMemo(() => {
        return names.map((_, index) => {
            const span = 360 / names.length;
            const a1 = index * span;
            const a2 = a1 + span;
            return (
                <path
                    key={index}
                    id={`p${index}`}
                    d={getSlicePath(a1, a2)}
                    stroke="white"
                    strokeWidth="2"
                    fill={getColor(index)}
                ></path>
            );
        });
    }, [names]);

    const slicesLabels = useMemo(() => {
        return names.map((name, index) => {
            return (
                <text
                    dy={100}
                    textLength={name.length * 20}
                    key={index}
                    style={{
                        fontSize: "24px",
                    }}
                >
                    <textPath
                        xlinkHref={`#p${index}`}
                        startOffset="50%"
                        textAnchor="middle"
                        fill="white"
                    >
                        {name}
                    </textPath>
                </text>
            );
        });
    }, [names]);

    const accDelta = getRandomNumber(5, 10);
    const deaccDelta = getRandomNumber(1, 5);
    const maintainSpeed = getRandomNumber(10, 20);
    const circleRef = useRef<ElementRef<"svg">>(null);
    const smallCircleRef = useRef<ElementRef<"svg">>(null);
    const [start, setStart] = useState(false);
    const [speed, setSpeed] = useState(0.5);
    const [increasing, setIncreasing] = useState(true);
    const [accFactor, setAccFactor] = useState(0);
    const [holdVelocity, setHoldVelocity] = useState(0);

    useEffect(() => {
        if (!circleRef.current || !start) {
            return;
        }

        const interval = setInterval(() => {
            if (increasing) {
                if (speed < 500) {
                    setSpeed(speed + accFactor);
                    setAccFactor(() => accFactor + accDelta);
                } else {
                    if (holdVelocity >= maintainSpeed) {
                        setIncreasing(false);
                    } else {
                        setHoldVelocity(() => holdVelocity + 1);
                        setSpeed(speed + accFactor);
                    }
                }
            } else {
                if (accFactor > 0) {
                    setSpeed(speed + accFactor);
                    setAccFactor(() => accFactor - deaccDelta);
                } else {
                    handleWinner(speed);
                    setStart(false);
                    setAccFactor(0);
                    setSpeed(0);
                    setIncreasing(true);
                    clearInterval(interval);
                }
            }

            circleRef.current!.style.transform = `rotate(${speed}deg)`;
        }, 40);

        return () => {
            clearInterval(interval);
        };
    }, [
        increasing,
        speed,
        accFactor,
        holdVelocity,
        start,
        accDelta,
        deaccDelta,
        maintainSpeed,
        handleWinner,
    ]);

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                gap: "20px",
            }}
        >
            <div className="spinner">
                <svg
                    width={outerDiameter}
                    height={outerDiameter}
                    ref={circleRef}
                >
                    {slices.map((slice) => slice)}
                    {slicesLabels.map((labels) => labels)}
                </svg>
                <svg ref={smallCircleRef} className={"smallCircle"} height="100" width="100">
                    <circle cx="50" cy="50" r="40" stroke={"white"} fill="white"/>
                </svg>
                <div className={"pointer"} />
            </div>
            <button
                type="button"
                style={{
                    display: "block",
                    zIndex: 99,
                    paddingInline: "3.5rem",
                    paddingBlock: "0.8rem",
                    borderRadius: "10px",
                }}
                onClick={() => setStart(true)}
            >
                Spin It!
            </button>
        </div>
    );
}
