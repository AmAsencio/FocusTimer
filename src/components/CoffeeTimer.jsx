import React, { useState, useRef, useEffect } from 'react';
import './CoffeeTimer.css';

const MODES = [
    { key: 'pomodoro', label: 'Pomodoro (25/5)' },
    { key: 'quick', label: 'Focus rápido' },
    { key: 'custom', label: 'Personalizado' }
];

function roundToInt(val) {
    return Math.round(Number(val));
}

export default function CoffeeTimer() {
    const [mode, setMode] = useState('pomodoro');
    const [totalMinutes, setTotalMinutes] = useState(60);
    const [minutes, setMinutes] = useState(25);
    const [breakMinutes, setBreakMinutes] = useState(5);
    const [sessionType, setSessionType] = useState('work');
    const [secondsLeft, setSecondsLeft] = useState(minutes * 60);
    const [cyclesLeft, setCyclesLeft] = useState(Math.floor(totalMinutes / (25 + 5)));
    const [running, setRunning] = useState(false);
    const [transitionMessage, setTransitionMessage] = useState('');
    const [endModal, setEndModal] = useState(false);
    const interval = useRef();

    const realMinutes = Math.max(1, minutes);
    const realBreak = Math.max(1, breakMinutes);

    function calculateCustomCycles(tot, work, rest) {
        if (work < 1) work = 1;
        if (rest < 1) rest = 1;
        const cycles = Math.floor((tot * 60) / ((work + rest) * 60));
        return Math.max(1, cycles);
    }

    function validPomodoroTotal(total) {
        return Math.max(25, roundToInt(total));
    }

    useEffect(() => {
        if (mode === 'pomodoro') {
            setMinutes(25);
            setBreakMinutes(5);
            const correctedTotal = validPomodoroTotal(totalMinutes);
            setTotalMinutes(correctedTotal);
            setCyclesLeft(Math.floor(correctedTotal / 30));
            setSessionType('work');
            setSecondsLeft(25 * 60);
        }
        if (mode === 'quick') {
            setMinutes(Math.max(1, totalMinutes));
            setSessionType('work');
            setSecondsLeft(roundToInt(totalMinutes * 60));
        }
        if (mode === 'custom') {
            setSessionType('work');
            setCyclesLeft(calculateCustomCycles(totalMinutes, minutes, breakMinutes));
            setSecondsLeft(roundToInt(minutes * 60));
        }
        setRunning(false);
        // eslint-disable-next-line
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
            if (mode === 'pomodoro' && cyclesLeft > 1) {
                if (sessionType === 'work') {
                    setSessionType('break');
                    setSecondsLeft(5 * 60);
                    setTransitionMessage('¡Descanso!');
                    setTimeout(() => setTransitionMessage(''), 2400);
                } else {
                    setSessionType('work');
                    setCyclesLeft(c => c - 1);
                    setSecondsLeft(25 * 60);
                    setTransitionMessage('¡Vuelve el foco!');
                    setTimeout(() => setTransitionMessage(''), 2400);
                }
            } else if (mode === 'pomodoro' && cyclesLeft === 1) {
                setRunning(false);
                setEndModal(true);
                setTimeout(() => setEndModal(false), 4500);
            }
            else if (mode === 'custom' && cyclesLeft > 1) {
                if (sessionType === 'work') {
                    setSessionType('break');
                    setSecondsLeft(roundToInt(realBreak * 60));
                    setTransitionMessage('¡Descanso!');
                    setTimeout(() => setTransitionMessage(''), 2400);
                } else {
                    setSessionType('work');
                    setCyclesLeft(c => c - 1);
                    setSecondsLeft(roundToInt(realMinutes * 60));
                    setTransitionMessage('¡Vuelve el foco!');
                    setTimeout(() => setTransitionMessage(''), 2400);
                }
            } else if (mode === 'custom' && cyclesLeft === 1) {
                setRunning(false);
                setEndModal(true);
                setTimeout(() => setEndModal(false), 4500);
            }
            else {
                setRunning(false);
            }
        }
    }, [running, secondsLeft, sessionType, cyclesLeft, mode, realMinutes, realBreak]);

    const reset = () => {
        setRunning(false);
        if (mode === 'pomodoro') {
            setSessionType('work');
            setCyclesLeft(Math.floor(validPomodoroTotal(totalMinutes) / 30));
            setSecondsLeft(25 * 60);
        }
        else if (mode === 'quick') {
            setSessionType('work');
            setSecondsLeft(roundToInt(totalMinutes * 60));
        }
        else {
            setSessionType('work');
            setCyclesLeft(calculateCustomCycles(totalMinutes, minutes, breakMinutes));
            setSecondsLeft(roundToInt(minutes * 60));
        }
    };

    const sessionDuration = sessionType === 'work' ? realMinutes : realBreak;
    const coffeeLevel = sessionType === 'work'
        ? secondsLeft / (sessionDuration * 60)
        : 1 - secondsLeft / (sessionDuration * 60);

    return (
        <div className="focus-card">
            <div className="focus-title">Focus Timer</div>
            <div className='focus-box'>
                <div className="focus-label">Modo de enfoque:</div>
                <div className="mode-row">
                    {MODES.map(m => (
                        <button
                            key={m.key}
                            className={`option-btn${mode === m.key ? ' selected' : ''}`}
                            onClick={() => !running && setMode(m.key)}
                            disabled={running}
                        >
                            {m.label}
                        </button>
                    ))}
                </div>
            </div>
            {mode !== 'quick' && (
                <div className="minutos-totales-row">
                    <input
                        type="number"
                        min={mode === 'pomodoro' ? 25 : 1}
                        max={240}
                        className="input-minutes"
                        value={totalMinutes}
                        disabled={running}
                        onChange={e => setTotalMinutes(mode === 'pomodoro' ? validPomodoroTotal(e.target.value) : Math.max(1, e.target.value))}
                    />
                    <span className="minutos-txt">minutos totales</span>
                </div>
            )}
            {mode === 'custom' && (
                <div className="input-row">
                    <div className="input-block">
                        <label className="input-label" htmlFor="trabajo">Trabajo:</label>
                        <input
                            id="trabajo"
                            type="number"
                            min={1}
                            max={120}
                            className="input-minutes"
                            value={minutes}
                            disabled={running}
                            onChange={e => setMinutes(Math.max(1, e.target.value))}
                        />
                        <span className="input-units">min</span>
                    </div>
                    <div className="input-block">
                        <label className="input-label" htmlFor="descanso">Descanso:</label>
                        <input
                            id="descanso"
                            type="number"
                            min={1}
                            max={120}
                            className="input-minutes"
                            value={breakMinutes}
                            disabled={running}
                            onChange={e => setBreakMinutes(Math.max(1, e.target.value))}
                        />
                        <span className="input-units">min</span>
                    </div>
                </div>
            )}
            <div className="session-info">
                Sesión actual: {sessionType === 'work' ? 'Trabajo' : 'Descanso'}
                {(mode === 'pomodoro' || mode === 'custom') && ` (${cyclesLeft} ciclo(s) restantes)`}
            </div>
            {transitionMessage && (
                <div className="transition-message">{transitionMessage}</div>
            )}
            {endModal && (
                <div className="focus-modal-bg">
                    <div className="focus-modal">
                        <h2>¡Sesión finalizada!</h2>
                        <p>¡Buen trabajo! Has completado todos los ciclos.</p>
                        <button className="modal-btn" onClick={() => setEndModal(false)}>
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 180 }}>
                <svg
                    viewBox="0 0 56 75"
                    width="95"
                    height="127"
                    style={{ imageRendering: "pixelated", display: "block", margin: "0 auto" }}
                >
                    {/* Pajita */}
                    <rect x="26" y="3" width="5" height="13" fill="#af97e2" stroke="#28283a" strokeWidth="2" />
                    {/* Tapa */}
                    <rect x="7" y="14" width="41" height="8" fill="#e9f5fd" stroke="#28283a" strokeWidth="2" />
                    {/* Bandas azules de la tapa */}
                    <rect x="9" y="17" width="37" height="2" fill="#bedbf1" />
                    <rect x="11" y="19" width="32" height="2" fill="#7eb6e7" />
                    {/* Vaso */}
                    <rect x="11" y="23" width="34" height="45" fill="#fde3bc" stroke="#28283a" strokeWidth="2" />
                    {/* Bubble tea animado */}
                    <rect
                        x="13"
                        y={65 - Math.round(40 * coffeeLevel)}
                        width="30"
                        height={Math.round(40 * coffeeLevel)}
                        fill="#ecb772ff"
                        stroke="#d9a66a"
                        strokeWidth="1.4"
                        style={{ transition: "all 0.42s cubic-bezier(.66,0,.27,1)", imageRendering: "pixelated" }}
                    />
                    {/* Burbujas boba: redondas, agrupadas, con brillo pixel en la esquina superior izquierda */}
                    <circle cx="17.5" cy="63.8" r="3.1" fill="#53343e" stroke="#3b202a" strokeWidth="1.1" />
                    <ellipse cx="17.1" cy="62.7" rx="0.8" ry="1.2" fill="#fff" opacity="0.22" />
                    <circle cx="24.5" cy="65.1" r="2.4" fill="#795a4a" stroke="#3b202a" strokeWidth="1" />
                    <ellipse cx="24" cy="64" rx="0.63" ry="0.85" fill="#fff" opacity="0.17" />
                    <circle cx="32" cy="64.6" r="3" fill="#a17465" stroke="#3b202a" strokeWidth="1.1" />
                    <ellipse cx="31.7" cy="63.7" rx="0.7" ry="1" fill="#fff" opacity="0.12" />
                    <circle cx="39.5" cy="66.1" r="2.6" fill="#3b202a" stroke="#3b202a" strokeWidth="1.1" />
                    <ellipse cx="39.2" cy="65.1" rx="0.8" ry="1.2" fill="#fff" opacity="0.22" />
                    <circle cx="39.1" cy="66" r="2.5" fill="#35202d" stroke="#3b202a" strokeWidth="1" />
                    <ellipse cx="38.7" cy="65.2" rx="0.6" ry="0.7" fill="#fff" opacity="0.15" />


                    {/* Reflejo/sombra cute */}
                    <rect x="14" y="30" width="7" height="4" fill="#fff" opacity="0.16" />
                </svg>
            </div>
            <div className="timer">
                {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, "0")}
            </div>
            <div className="timer-btn-row">
                <button className="btn-timer" onClick={() => setRunning(!running)}>
                    {running ? "Pausar" : "Iniciar"}
                </button>
                <button className="btn-timer" onClick={reset}>
                    Resetear
                </button>
            </div>
        </div>
    );
}
