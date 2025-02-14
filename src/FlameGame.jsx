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
  gap: 12px;

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
  text-align: center;

  &:focus {
    border-color: #d43f5e;
  }
`;

const Button = styled.button`
  background: ${({ disabled }) => (disabled ? "#d3d3d3" : "#ff4d6d")};
  color: white;
  padding: 12px;
  font-size: 18px;
  border: none;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  border-radius: 8px;
  margin-top: 10px;
  width: 100%;
  max-width: 350px;

  &:hover {
    background: ${({ disabled }) => (disabled ? "#d3d3d3" : "#d43f5e")};
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
`;

const ShareButton = styled.button`
  background: rgb(157, 17, 127);
  color: white;
  padding: 10px;
  font-size: 16px;
  border: none;
  cursor: pointer;
  border-radius: 8px;
  margin-top: 10px;
  transition: background 0.3s;
  width: 100%;
  max-width: 350px;

  &:hover {
    background: rgb(150, 37, 181);
  }

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 8px;
  }
`;


// FLAMES logic function
const flamesLogic = (name1, name2) => {
  const cleanName1 = name1.toLowerCase().replace(/\s/g, "");
  const cleanName2 = name2.toLowerCase().replace(/\s/g, "");

  let name1Arr = cleanName1.split("");
  let name2Arr = cleanName2.split("");

  for (let i = 0; i < name1Arr.length; i++) {
    const indexInName2 = name2Arr.indexOf(name1Arr[i]);
    if (indexInName2 !== -1) {
      name1Arr[i] = "";
      name2Arr[indexInName2] = "";
    }
  }

  const remainingCount =
    name1Arr.filter(letter => letter !== "").length +
    name2Arr.filter(letter => letter !== "").length;

  let flames = ["Friend", "Love", "Affection", "Marriage", "Enemy", "Sibling"];
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
  const [isLoading, setIsLoading] = useState(false);

  const heartPositions = useMemo(
    () =>
      Array.from({ length: 30 }, () => ({
        left: Math.random() * 100,
        duration: 4 + Math.random() * 3,
      })),
    []
  );

  const handleChange1 = useCallback(e => setName1(e.target.value), []);
  const handleChange2 = useCallback(e => setName2(e.target.value), []);

  const playSound = () => {
    const audio = new Audio("/sound.mp3");
    audio.play().catch(error => console.error("Audio play failed:", error));
  };

  const googleFormSubmit = (name1, name2, result) => {
    const formUrl =
    "https://docs.google.com/forms/d/e/1FAIpQLSckzZpp7loEfc3tXQdbR7Qtavkmd919ERX9v3SYlIl9YFp6Lw/formResponse";
   
    const formData = new URLSearchParams();
    formData.append("entry.952635422", name1);  // Your Name (Name)
    formData.append("entry.1791477733", name2);  // Crush's Name (Cname)
    formData.append("entry.1988919414", result);   // Result (Result)

    fetch(formUrl, { method: "POST", mode: "no-cors", body: formData })
      .then(() => console.log("Submitted successfully"))
      .catch(err => console.error("Google Form submission error:", err));
  };

  const handleSubmit = () => {
    if (!name1.trim() || !name2.trim()) return alert("Enter both names!");
    if (name1.toLowerCase() === name2.toLowerCase()) return alert("Names should be different!");

    setIsLoading(true);
    setResult(null);

    setTimeout(() => {
      const flamesResult = flamesLogic(name1, name2);
      setResult(flamesResult);
      playSound();
      googleFormSubmit(name1, name2, flamesResult);
      setIsLoading(false);
    }, 2000);
  };
  const handleShare = async () => {
    if (!result) return;

    const shareMessage = `💌 FLAMES Result 💌 \n${name1} ❤️ ${name2} = ${result} 💘\nTry it now! https://flames-matcher.vercel.app/`;

    if (navigator.share) {
      await navigator.share({ text: shareMessage });
    } else {
      await navigator.clipboard.writeText(shareMessage);
      alert("Copied to clipboard! Share it with your friends. 📋");
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
        <Input type="text" placeholder="Your Name" value={name1} onChange={handleChange1} />
        <Input type="text" placeholder="Crush's Name" value={name2} onChange={handleChange2} />
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Checking..." : "Check Relationship"}
        </Button>
        {result && <Result>💘 {result} 💘</Result>}
        <ShareButton  onClick={handleShare}>
          📤 Share 
        </ShareButton>
      </Container>
    </Background>
  );
};

export default FlamesGame;
