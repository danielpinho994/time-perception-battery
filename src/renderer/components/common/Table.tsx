import { FormEvent } from 'react';

export default function Table({ sequences, results, setResults, isEditable }) {
  const onEditable = (
    index: number,
    event: FormEvent<HTMLTableCellElement>,
  ) => {
    const updatedResults = [...results];
    const value = event.currentTarget.textContent; // Assuming the content is text only
    // Attempt to convert the edited content to a number.
    updatedResults[index] = value ? parseInt(value, 10) : 0; // You may need more complex validation
    setResults(updatedResults);
  };

  return (
    <table>
      <tr>
        <td>Intervalo</td>
        {sequences.map((_, index) => (
          <td key={`interval-${index + 1}`}>{index + 1}</td>
        ))}
      </tr>
      <tr>
        <td>Segundos</td>
        {sequences.map((sequence, index) => (
          <td key={`seconds-${index + 1}`}>{sequence / 1000}</td>
        ))}
      </tr>
      <tr className="table-results-row">
        <td>Resultado</td>
        {results.map((result, index) => (
          <td
            key={`result-${index + 1}`}
            contentEditable={isEditable}
            onInput={(e) => onEditable(index, e)}
          >
            {result}
          </td>
        ))}
        {[...Array(9 - results.length)].map((_, index) => (
          <td
            key={`empty-${index + results.length + 1}`}
            contentEditable={
              isEditable && index + results.length === results.length
            }
            onInput={(e) => onEditable(index + results.length, e)}
          />
        ))}
      </tr>
    </table>
  );
}