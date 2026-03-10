import React, { useState, useEffect, useMemo } from 'react';
import LoginScreen from './components/LoginScreen';
import GameScreen from './components/GameScreen';
import ResultScreen from './components/ResultScreen';

function App() {
    const [gameState, setGameState] = useState('login'); // login, loading, game, submitting, result
    const [userId, setUserId] = useState('');
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]); // user's selected answers
    const [scoreData, setScoreData] = useState(null); // Result from server
    const [errorMsg, setErrorMsg] = useState('');

    // Pre-generate boss URLs so they are ready
    const bossUrls = useMemo(() => {
        return Array.from({ length: 100 }).map((_, i) =>
            `https://api.dicebear.com/9.x/pixel-art/svg?seed=BossHero${i * 42}`
        );
    }, []);

    const handleLogin = async (id) => {
        setUserId(id);
        setGameState('loading');
        setErrorMsg('');

        try {
            const apiUrl = import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL;
            const count = import.meta.env.VITE_QUESTION_COUNT || 5;

            if (!apiUrl) {
                // Fallback for development/preview without .env
                setTimeout(() => {
                    setQuestions([
                        { no: 1, question: "What is 1 + 1?", A: "1", B: "2", C: "3", D: "4" },
                        { no: 2, question: "Which is a color?", A: "Apple", B: "Red", C: "Car", D: "Dog" },
                        { no: 3, question: "Is water wet?", A: "Yes", B: "No", C: "Maybe", D: "Never" }
                    ]);
                    setGameState('game');
                }, 1000);
                return;
            }

            const res = await fetch(`${apiUrl}?action=getQuestions&count=${count}`);
            const data = await res.json();

            if (data.status === 'success') {
                setQuestions(data.questions);
                setGameState('game');
            } else {
                throw new Error(data.message || 'Failed to fetch questions');
            }
        } catch (err) {
            setErrorMsg(err.message || 'Error communicating with server');
            setGameState('login');
        }
    };

    const handleGameFinish = async (userAnswers) => {
        setAnswers(userAnswers);
        setGameState('submitting');
        setErrorMsg('');

        try {
            const apiUrl = import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL;
            if (!apiUrl) {
                // Sandbox test finish
                setTimeout(() => {
                    setScoreData({
                        totalScore: 100,
                        correctCount: 3,
                        passed: true,
                        message: "Mock Result (No API URL configured)"
                    });
                    setGameState('result');
                }, 1000);
                return;
            }

            // We need to send answers to the backend to evaluate
            const submitData = {
                action: 'submitScore',
                userId: userId,
                threshold: parseInt(import.meta.env.VITE_PASS_THRESHOLD || '3', 10),
                answers: userAnswers.map(ans => ({
                    no: ans.no,
                    selected: ans.selected
                }))
            };

            const res = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8',
                },
                body: JSON.stringify(submitData)
            });

            const result = await res.json();
            if (result.status === 'success') {
                // Evaluate pass threshold
                const threshold = parseInt(import.meta.env.VITE_PASS_THRESHOLD || '3', 10);
                const passed = result.correctCount >= threshold;
                setScoreData({
                    ...result,
                    passed,
                    threshold
                });
                setGameState('result');
            } else {
                throw new Error(result.message || 'Failed to submit score');
            }
        } catch (err) {
            setErrorMsg(err.message || 'Error communicating with server');
            setGameState('game'); // Return to game so they can retry submitting
        }
    };

    const handleRestart = () => {
        setQuestions([]);
        setAnswers([]);
        setScoreData(null);
        setGameState('login');
    };

    return (
        <div className="app-wrapper">
            <div style={{ position: 'relative', zIndex: 10 }}>
                {gameState === 'login' && <LoginScreen onStart={handleLogin} errorMsg={errorMsg} />}
                {gameState === 'loading' && <div><h1 className="loading">LOADING STAGES...</h1></div>}
                {gameState === 'game' && <GameScreen questions={questions} bossUrls={bossUrls} onFinish={handleGameFinish} errorMsg={errorMsg} />}
                {gameState === 'submitting' && <div><h1 className="loading">CALCULATING SCORE...</h1></div>}
                {gameState === 'result' && <ResultScreen scoreData={scoreData} onRestart={handleRestart} userId={userId} />}
            </div>
        </div>
    );
}

export default App;
