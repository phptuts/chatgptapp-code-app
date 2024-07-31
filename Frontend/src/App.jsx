import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

const App = () => {
  const [quiz, setQuiz] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/quiz")
      .then((response) => setQuiz(response.data))
      .catch((error) => console.error("Error fetching quiz:", error));
  }, []);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleNextQuestion = () => {
    if (quiz[currentQuestionIndex].correct.indexOf(selectedOption) >= 0) {
      setScore(score + 1);
    }
    setSelectedOption("");
    if (currentQuestionIndex < quiz.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowScore(true);
    }
  };

  return (
    <Container className="mt-5">
      {showScore ? (
        <Row>
          <Col>
            <h2>
              Your Score: {score}/{quiz.length}
            </h2>
          </Col>
        </Row>
      ) : (
        <Row>
          <Col>
            {quiz.length > 0 && (
              <Card>
                <Card.Body>
                  <Card.Title>{quiz[currentQuestionIndex].question}</Card.Title>
                  {quiz[currentQuestionIndex].options.map((option, index) => (
                    <Button
                      key={index}
                      variant="outline-primary"
                      className="d-block mb-2"
                      onClick={() => handleOptionSelect(option)}
                      active={selectedOption === option}
                    >
                      {option}
                    </Button>
                  ))}
                  <Button
                    variant="primary"
                    onClick={handleNextQuestion}
                    disabled={!selectedOption}
                  >
                    Next
                  </Button>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default App;
