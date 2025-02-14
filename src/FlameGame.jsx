import React, { useState, useCallback, useMemo } from "react";
import styled, { keyframes } from "styled-components";

// Heart Animation
const floatingHearts = keyframes`
  0% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(-100vh); opacity: 0; }
`;

const Background = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #ff758c, #ff7eb3);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const Heart = styled.div`
  position: absolute;
  color: #ff4d6d;
  font-size: 20px;
  top: 100%;
  left: ${({ left }) => left}%;
  animation: ${floatingHearts} ${({ duration }) => duration}s linear infinite;
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
  gap: 12px; /* Ensures equal spacing between elements */

  @media (max-width: 768px) {
    padding: 20px;
  }
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
  width: 80%;
  max-width: 350px;
  border: 2px solid #ff4d6d;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition: border 0.3s;
  text-align: center; /* Centers text for a balanced look */

  &:focus {
    border-color: #d43f5e;
  }

  @media (max-width: 768px) {
    font-size: 14px;
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

  @media (max-width: 768px) {
    font-size: 16px;
    padding: 10px;
  }
`;

const Result = styled.h2`
  color: #d43f5e;
  font-size: 24px;
  margin-top: 20px;
  opacity: 0;
  animation: fadeIn 0.5s ease-in-out forwards;
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

// Updated flamesLogic function
const flamesLogic = (name1, name2) => {
  // Clean and prepare names by removing spaces and converting to lowercase
  const cleanName1 = name1.toLowerCase().replace(/\s/g, "");
  const cleanName2 = name2.toLowerCase().replace(/\s/g, "");

  // Split names into arrays for manipulation
  let name1Arr = cleanName1.split("");
  let name2Arr = cleanName2.split("");

  // Remove common letters from both arrays
  for (let i = 0; i < name1Arr.length; i++) {
    const indexInName2 = name2Arr.indexOf(name1Arr[i]);
    if (indexInName2 !== -1) {
      // Mark the letter as removed by setting it to an empty string
      name1Arr[i] = "";
      name2Arr[indexInName2] = "";
    }
  }

  // Count remaining letters in both arrays
  const remainingCount =
    name1Arr.filter(letter => letter !== "").length +
    name2Arr.filter(letter => letter !== "").length;

  // FLAMES list representing relationship outcomes
  let flames = ["Friend", "Love", "Affection", "Marriage", "Enemy", "Sibling"];

  // Elimination process: Remove one outcome each round until one remains.
  let index = 0;
  while (flames.length > 1) {
    index = (index + remainingCount - 1) % flames.length;
    flames.splice(index, 1);
  }

  return flames[0];
};

const FlamesGame = () => {
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [result, setResult] = useState(null);

  // Generate randomized heart positions once to prevent re-renders
  const heartPositions = useMemo(
    () =>
      Array.from({ length: 30 }, () => ({
        left: Math.random() * 100,
        duration: 4 + Math.random() * 3,
      })),
    []
  );

  const handleChange1 = useCallback(e => {
    setName1(e.target.value);
  }, []);

  const handleChange2 = useCallback(e => {
    setName2(e.target.value);
  }, []);

  const handleSubmit = () => {
    if (name1.trim() && name2.trim()) {
      setResult(flamesLogic(name1, name2));
    }
  };

  return (
    <Background>
      {heartPositions.map((pos, i) => (
        <Heart key={i} left={pos.left} duration={pos.duration}>
          ❤️
        </Heart>
      ))}
      <Container>
        <Title>FLAMES - Love Calculator 💖</Title>
        <Input
          type="text"
          placeholder="Your Name"
          value={name1}
          onChange={handleChange1}
        />
        <Input
          type="text"
          placeholder="Crush's Name"
          value={name2}
          onChange={handleChange2}
        />
        <Button onClick={handleSubmit}>Check Relationship</Button>
        {result && <Result>💘 {result} 💘</Result>}
      </Container>
    </Background>
  );
};

export default FlamesGame;
