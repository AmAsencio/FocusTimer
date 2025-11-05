import React, { useState, useRef, useEffect } from "react";

export default function CoffeeTimer({ minutes = 25 }) {
    const [secondsLeft, setSecondsLeft] = useState(minutes * 60);
    const [running, setRunning] = useState(false);
    const interval = useRef();

    useEffect(() => {
        if (running && secondsLeft > 0) {
            interval.current = setInterval(() => {
                setSecondsLeft(s => s - 1);
            }, 1000);
            return () => clearInterval(interval.current);
        }
        clearInterval(interval.current);
    }, [running, secondsLeft]);

    const reset = () => {
        setRunning(false);
        setSecondsLeft(minutes * 60);
    };

    // Para la animación café:
    const progress = secondsLeft / (minutes * 60);

    return (
        <div style={{ textAlign: "center", margin: 40 }}>
            <svg viewBox="0 0 120 180" width={120} height={180}>
                {/* Taza */}
                <rect x="10" y="30" width="100" height="140" rx="30" fill="#eee" />
                {/* Café animado */}
                <rect
                    x="10"
                    y={30 + (1 - progress) * 140}
                    width="100"
                    height={140 * progress}
                    rx="30"
                    fill="#73401d"
                />
                {/* Borde taza */}
                <rect x="10" y="30" width="100" height="140" rx="30" fill="none" stroke="#333" strokeWidth="3" />
            </svg>
            <div style={{ fontSize: 32, margin: 15 }}>
                {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, "0")}
            </div>
            <button onClick={() => setRunning(!running)} style={{ marginRight: 5 }}>
                {running ? "Pausar" : "Iniciar"}
            </button>
            <button onClick={reset}>Resetear</button>
        </div>
    );
}
