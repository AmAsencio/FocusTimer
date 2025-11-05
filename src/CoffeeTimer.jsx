import React, { useState, useRef, useEffect } from 'react';

const MODES = [
    { key: 'pomodoro', label: 'Pomodoro (25/5)', work: 25, break: 5 },
    { key: 'quick', label: 'Focus rápido', work: null, break: null },
    { key: 'custom', label: 'Personalizado', work: null, break: null }
];

export default function CoffeeTimer() {
    const [mode, setMode] = useState('pomodoro');
    const [totalMinutes, setTotalMinutes] = useState(60);
    const [minutes, setMinutes] = useState(25);
    const [breakMinutes, setBreakMinutes] = useState(5);
    const [sessionType, setSessionType] = useState('work'); // 'work' o 'break'
    const [secondsLeft, setSecondsLeft] = useState(minutes * 60);
    const [running, setRunning] = useState(false);
    const [cyclesLeft, setCyclesLeft] = useState(Math.floor(totalMinutes / (25 + 5))); // para Pomodoro
    const interval = useRef();

    useEffect(() => {
        if (mode === 'pomodoro') {
            setMinutes(25);
            setBreakMinutes(5);
            setCyclesLeft(Math.floor(totalMinutes / (25 + 5)));
            setSessionType('work');
            setSecondsLeft(25 * 60);
        }
        if (mode === 'quick') {
            setMinutes(totalMinutes);
            setSessionType('work');
            setSecondsLeft(totalMinutes * 60);
        }
        if (mode === 'custom') {
            setSessionType('work');
            setSecondsLeft(minutes * 60);
            setCyclesLeft(1);
        }
        setRunning(false);
    }, [mode, totalMinutes, minutes, breakMinutes]);

    useEffect(() => {
        if (running && secondsLeft > 0) {
            interval.current = setInterval(() => {
                setSecondsLeft((s) => s - 1);
            }, 1000);
            return () => clearInterval(interval.current);
        }
        clearInterval(interval.current);
        if (running && secondsLeft === 0) {
            // Finalizó el ciclo actual
            if (mode === 'pomodoro' && cyclesLeft > 1) {
                if (sessionType === 'work') {
                    // Cambiar a descanso
                    setSessionType('break');
                    setSecondsLeft(breakMinutes * 60);
                } else {
                    // Cambiar a trabajo, resta ciclo
                    setSessionType('work');
                    setCyclesLeft(c => c - 1);
                    setSecondsLeft(minutes * 60);
                }
            } else if (mode === 'pomodoro' && cyclesLeft === 1) {
                setRunning(false);
            }
            else if (mode === 'custom' || mode === 'quick') {
                setRunning(false);
            }
        }
    }, [running, secondsLeft, sessionType, cyclesLeft, mode, minutes, breakMinutes]);

    const reset = () => {
        setRunning(false);
        if (mode === 'pomodoro') {
            setSessionType('work');
            setCyclesLeft(Math.floor(totalMinutes / (25 + 5)));
            setSecondsLeft(25 * 60);
        }
        else if (mode === 'quick') {
            setSessionType('work');
            setSecondsLeft(totalMinutes * 60);
        }
        else {
            setSessionType('work');
            setSecondsLeft(minutes * 60);
            setCyclesLeft(1);
        }
    };

    // animación café
    const sessionDuration = sessionType === 'work' ? minutes : breakMinutes;
    const progress = secondsLeft / (sessionDuration * 60);
    const coffeeLevel =
        sessionType === 'work'
            ? progress // vacío durante trabajo
            : 1 - progress; // llena durante descanso

    return (
        <div style={{ textAlign: "center", margin: 40 }}>
            <h2 style={{ fontWeight: "bold" }}>Modo de enfoque:</h2>
            <select value={mode} onChange={e => setMode(e.target.value)} disabled={running}>
                {MODES.map(m => <option key={m.key} value={m.key}>{m.label}</option>)}
            </select>
            <br />
            {(mode !== 'quick') && (
                <>
                    <input
                        type="number"
                        min={1}
                        max={240}
                        value={totalMinutes}
                        disabled={running}
                        onChange={e => setTotalMinutes(Number(e.target.value))}
                        style={{ width: 60, fontSize: 18, marginBottom: 10 }}
                    /> minutos totales
                </>
            )}
            {(mode === 'custom') && (
                <>
                    <br />
                    Trabajo: <input type="number" min={1} max={120} value={minutes} disabled={running}
                        onChange={e => setMinutes(Number(e.target.value))} style={{ width: 40 }} /> min
                    Descanso: <input type="number" min={1} max={120} value={breakMinutes} disabled={running}
                        onChange={e => setBreakMinutes(Number(e.target.value))} style={{ width: 40 }} /> min
                </>
            )}
            <div style={{ fontSize: 20, margin: 10 }}>
                Sesión actual: {sessionType === 'work' ? 'Trabajo' : 'Descanso'}
                {(mode === 'pomodoro') && ` (${cyclesLeft} ciclo(s) restante(s))`}
            </div>
            <svg viewBox="0 0 120 180" width={120} height={180}>
                {/* Taza */}
                <rect x="10" y="30" width="100" height="140" rx="30" fill="#eee" />
                {/* Café animado */}
                <rect
                    x="10"
                    y={30 + (1 - coffeeLevel) * 140}
                    width="100"
                    height={140 * coffeeLevel}
                    rx="30"
                    fill={sessionType === 'work' ? "#73401d" : "#89cff0"}
                    style={{ transition: "all 0.3s" }}
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
