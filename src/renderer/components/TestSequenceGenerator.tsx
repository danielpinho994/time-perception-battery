/* eslint-disable no-plusplus */
const intervals = [7000, 32000, 58000];
const sequencesNumber = 3;

function shuffleArray(arr) {
  const shuffledArray = arr.slice();
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

export default function generateSequences() {
  const sequences: number[] = [];
  for (let i = 0; i < sequencesNumber; i++) {
    shuffleArray(intervals).forEach((element: any) => {
      sequences.push(element);
    });
  }
  return sequences;
}
