import { useCallback, useEffect, useMemo, useState } from "react";
import * as markov from "markov";
import lowerCase from "lodash/lowerCase";
import initialTrainingText from "./alice_in_wonderland.txt?raw";

export default function () {
  const [trainingTextClamp, setTrainingTextClamp] = useState(5000);
  const [trainingText, setTrainingText] = useState(initialTrainingText);
  const [completingText, setCompletingText] = useState(
    "This a scratch text area to test the autocomplete in"
  );

  const trainedModel = useMemo(() => {
    const start = Date.now();

    let clampedText = trainingText;

    if (clampedText.length > trainingTextClamp) {
      clampedText = clampedText.substring(0, trainingTextClamp);
    }
    const trainedModel = markov.train(clampedText);

    const end = Date.now();
    const total = end - start;

    setTrainingTextClamp((trainingTextClamp * 30) / total);

    return trainedModel;
  }, [trainingText]);

  const lastWord = useMemo(
    () => computeLastWord(completingText),
    [completingText]
  );

  const nextWords = useMemo(() => {
    if (lastWord == null) {
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
    const onKeyUp = (e) => {
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
      <div className="flex flex-col pb-10">
        <h2 className="w-full text-3xl pb-5">Training</h2>
        <textarea
          className="text-lg w-full border border-gray-500 p-3"
          onChange={(e) => {
            setTrainingText(e.target.value);
          }}
          rows={10}
          value={trainingText}
        />
      </div>
      <div className="flex flex-row justify-between pb-10">
        <div style={{ width: "60%" }} className="flex flex-col">
          <h2 className="w-full text-xl font-bold pb-2">Scratch</h2>
          <textarea
            className="text-lg w-full border border-gray-500 p-3"
            onChange={(e) => setCompletingText(e.target.value)}
            rows={20}
            value={completingText}
          />
        </div>
        <div
          className="text-right"
          style={{
            alignSelf: "start",
          }}
        >
          <h2 className="w-full text-xl font-bold pb-2">Possible Next Words</h2>
          <ul className="w-full">
            <li>
              <button className="border p-2 w-9/12" onClick={autocompleteWord}>
                Choose Word
              </button>
            </li>
            {nextWords != null ? (
              nextWords.map((word) => (
                <li
                  key={word}
                  className="hover:translate-x-2 cursor-pointer transition-all"
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
      </div>
    </>
  );
}

/** @param text { string }
 * @returns { string[] } */
function seperateWords(text) {
  return text.split(" ").filter((s) => s.length > 0);
}

/** @param text { string }
 * @returns { string | null }*/
function computeLastWord(text) {
  const words = seperateWords(text);

  if (words.length == 0) {
    return null;
  }

  return lowerCase(words[words.length - 1]);
}
