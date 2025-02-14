import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";

// Heart Animation
const floatingHearts = keyframes`
  0% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(-100vh); opacity: 0; }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
`;

const confettiAnimation = keyframes`
  0% { transform: translateY(0) rotate(0); opacity: 1; }
  100% { transform: translateY(-100vh) rotate(720deg); opacity: 0; }
`;

const Background = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  background: #ff758c;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 20px;
`;

const Container = styled.div`
  text-align: center;
  background: rgba(255, 255, 255, 0.95);
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  animation: ${fadeIn} 0.5s ease-in-out;
`;

const Title = styled.h1`
  color: #ff4d6d;
  font-family: "Cursive", sans-serif;
  font-size: 2rem;
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Input = styled.input`
  padding: 12px;
  width: 100%;
  max-width: 350px;
  border: 2px solid #ff4d6d;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  text-align: center;
  background: #fff;
  color: #000;
  &:focus {
    border-color: #d43f5e;
  }
`;

const Button = styled.button`
  background: #ff4d6d;
  color: white;
  padding: 12px;
  font-size: 18px;
  border: none;
  cursor: pointer;
  border-radius: 8px;
  margin-top: 10px;
  transition: background 0.3s;
  width: 100%;
  max-width: 350px;
  &:hover {
    background: #d43f5e;
  }
`;

const ResetButton = styled(Button)`
  background: #ccc;
  color: #000;
  &:hover {
    background: #999;
  }
`;

const Result = styled.h2`
  color: #d43f5e;
  font-size: 24px;
  margin-top: 20px;
  opacity: 0;
  animation: ${fadeIn} 0.5s ease-in-out forwards;
  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const HistoryContainer = styled.div`
  margin-top: 20px;
  background: #fff;
  padding: 10px;
  border-radius: 8px;
  width: 100%;
  max-width: 350px;
  text-align: left;
  font-size: 14px;
  color: #333;
`;

const flamesLogic = (name1, name2) => {
  let str = (name1 + name2).toLowerCase().replace(/\s/g, "");
  let uniqueChars = new Set(str);
  let totalCount = uniqueChars.size;
  let flames = ["Friend", "Love", "Affection", "Marriage", "Enemy", "Sibling"];

  while (flames.length > 1) {
    let index = (totalCount % flames.length) - 1;
    if (index >= 0) {
      flames = [...flames.slice(index + 1), ...flames.slice(0, index)];
    } else {
      flames.pop();
    }
  }
  return flames[0];
};

const FlamesGame = () => {
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const resultSound = new Audio("/result-sound.mp3");

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("flamesHistory")) || [];
    setHistory(savedHistory);
  }, []);

  const handleSubmit = () => {
    if (name1.trim() && name2.trim()) {
      const flamesResult = flamesLogic(name1, name2);
      setResult(flamesResult);
      resultSound.play();
      const newHistory = [{ name1, name2, result: flamesResult }, ...history];
      setHistory(newHistory);
      localStorage.setItem("flamesHistory", JSON.stringify(newHistory));
    }
  };

  const handleReset = () => {
    setName1("");
    setName2("");
    setResult(null);
    setHistory([]);
    localStorage.removeItem("flamesHistory");
  };

  return (
    <Background>
      <Container>
        <Title>FLAMES - Love Calculator 💖</Title>
        <Input type="text" placeholder="Your Name" value={name1} onChange={(e) => setName1(e.target.value)} />
        <Input type="text" placeholder="Crush's Name" value={name2} onChange={(e) => setName2(e.target.value)} />
        <Button onClick={handleSubmit}>Check Relationship</Button>
        {result && <Result>💘 {result} 💘</Result>}
        <ResetButton onClick={handleReset}>Reset</ResetButton>
        {history.length > 0 && (
          <HistoryContainer>
            <h3>History:</h3>
            <ul>
              {history.map((entry, index) => (
                <li key={index}>{entry.name1} & {entry.name2} ➡ {entry.result}</li>
              ))}
            </ul>
          </HistoryContainer>
        )}
      </Container>
    </Background>
  );
};

export default FlamesGame;
