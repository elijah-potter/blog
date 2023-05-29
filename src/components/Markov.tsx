import { useCallback, useEffect, useMemo, useState } from "react";
import { lowerCase } from "lodash-es";
import classes from "./Markov.style.module.css";
import initalTrainingText from "../../public/markov/alice_in_wonderland.txt?raw";

export default function () {
  const [trainingTextClamp, setTrainingTextClamp] = useState(500);
  const [trainingText, setTrainingText] = useState(initalTrainingText);

  const [completingText, setCompletingText] = useState(
    "This a scratch text area to test the autocomplete in"
  );

  const [trainedModel, setTrainedModel] = useState<any>(null);

  useEffect(() => {
    (async () => {
      let markov = await import("markov");

      const start = Date.now();

      let clampedText = trainingText;

      if (clampedText.length > trainingTextClamp) {
        clampedText = clampedText.substring(0, trainingTextClamp);
      }
      setTrainedModel(markov.train(clampedText));

      const end = Date.now();
      const total = end - start;

      setTrainingTextClamp((trainingTextClamp * 30) / total);

      return trainedModel;
    })();
  }, [trainingText]);

  const lastWord = useMemo(
    () => computeLastWord(completingText),
    [completingText]
  );

  const nextWords = useMemo(() => {
    if (lastWord == null || trainedModel == null) {
      return null;
    }

    return trainedModel.compute_next_words(lastWord, 6);
  }, [trainedModel, completingText, lastWord]);

  const autocompleteWord = useCallback(() => {
    if (lastWord != null) {
      const next = trainedModel.random_next_word(
        lastWord,
        Math.random() * 10000
      );

      if (next != null) {
        setCompletingText(completingText + " " + next);
      }
    }
  }, [completingText, trainedModel]);

  useEffect(() => {
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === "ArrowRight") {
        autocompleteWord();
      }
    };

    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [autocompleteWord]);

  useEffect(() => {
    const oldTraining = localStorage.getItem("markov-training");
    const oldCompleting = localStorage.getItem("markov-completing");

    if (oldTraining != null) {
      setTrainingText(oldTraining);
    }

    if (oldCompleting != null) {
      setCompletingText(oldCompleting);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("markov-training", trainingText);
  }, [trainingText]);

  useEffect(() => {
    localStorage.setItem("markov-completing", completingText);
  }, [completingText]);

  return (
    <>
      <div className={classes.section}>
        <h2>Training</h2>
        <textarea
          onChange={(e) => {
            setTrainingText(e.target.value);
          }}
          rows={10}
          value={trainingText}
        />
      </div>
      <div className={classes.section}>
        <h2>Scratch</h2>
        <textarea
          onChange={(e) => setCompletingText(e.target.value)}
          rows={20}
          value={completingText}
        />
      </div>
      <div>
        <div className={classes.row}>
          <h2>Possible Next Words</h2>
          <button className={classes.button} onClick={autocompleteWord}>
            Pick for me [Right Arrow]
          </button>
        </div>
        <ul className={classes.wordlist}>
          {nextWords != null ? (
            nextWords.map((word) => (
              <li
                key={word}
                className={classes.button}
                onClick={() => setCompletingText(completingText + " " + word)}
              >
                {word}
              </li>
            ))
          ) : (
            <></>
          )}
        </ul>
      </div>
    </>
  );
}

function separateWords(text: string): string[] {
  return text.split(" ").filter((s) => s.length > 0);
}

function computeLastWord(text: string): string | null {
  const words = separateWords(text);

  if (words.length == 0) {
    return null;
  }

  return lowerCase(words[words.length - 1]);
}
