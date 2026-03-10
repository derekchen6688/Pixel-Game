import React, { useState, useEffect } from 'react';

const GameScreen = ({ questions, bossUrls, onFinish, errorMsg }) => {
    const [currentIdx, setCurrentIdx] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [bossSeedIdx, setBossSeedIdx] = useState(0);

    // When progressing to the next question, pick a random boss image
    useEffect(() => {
        setBossSeedIdx(Math.floor(Math.random() * bossUrls.length));
    }, [currentIdx, bossUrls]);

    const handleSelect = (optionKey) => {
        const currentQuestion = questions[currentIdx];

        const newAnswers = [...answers, {
            no: currentQuestion.no,
            question: currentQuestion.question,
            selected: optionKey
        }];

        setAnswers(newAnswers);

        if (currentIdx + 1 < questions.length) {
            setCurrentIdx(currentIdx + 1);
        } else {
            // Finished
            onFinish(newAnswers);
        }
    };

    if (!questions || questions.length === 0) return <div>NO QUESTIONS LOADED</div>;

    const q = questions[currentIdx];

    return (
        <div>
            <div className="stats-bar">
                <span>STAGE {currentIdx + 1} / {questions.length}</span>
                {errorMsg && <span className="error-msg">{errorMsg}</span>}
            </div>

            <h2>BOSS ENCOUNTER!</h2>

            <div className="boss-container">
                <img src={bossUrls[bossSeedIdx]} alt="Pixel Boss" />
            </div>

            <div className="question-box">
                <p>Q{currentIdx + 1}: {q.question}</p>
            </div>

            <div className="options-grid">
                {['A', 'B', 'C', 'D'].map(key => {
                    if (!q[key]) return null;
                    return (
                        <button
                            key={key}
                            className="option-btn"
                            onClick={() => handleSelect(key)}
                        >
                            {key}. {q[key]}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default GameScreen;
