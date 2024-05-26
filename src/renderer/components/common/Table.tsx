/* eslint-disable no-plusplus */
import { FormEvent, useRef } from 'react';

export default function EditableTable({
  sequences,
  results,
  setResults,
  isEditable,
  setEditable,
  editButtonDisabled,
}: {
  sequences: number[];
  results: number[];
  setResults: (results: number[]) => void;
  isEditable: boolean;
  setEditable: (isEditable: boolean) => void;
  editButtonDisabled: boolean;
}) {
  const editingValues = useRef<number[]>([...results]);

  const onEditable = (
    index: number,
    event: FormEvent<HTMLTableCellElement>,
  ) => {
    let value = event.currentTarget.textContent;
    if (value) {
      // allow only numbers
      value = value.replace(/[^0-9]/g, '');
      event.currentTarget.textContent = value;

      editingValues.current[index] = parseInt(value, 10);
    } else {
      editingValues.current[index] = 0;
    }
  };

  const toggleEditable = () => {
    if (isEditable) {
      // Remove trailing zero values
      const newResults = [...results];
      while (newResults.length > 0 && newResults[newResults.length - 1] === 0) {
        newResults.pop();
      }
      setResults(newResults);
      editingValues.current = newResults;
    }
    setEditable(!isEditable);
  };

  return (
    <>
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
              onBlur={() => setResults([...editingValues.current])}
            >
              {result}
            </td>
          ))}
          {[...Array(9 - results.length)].map((_, index) => (
            <td
              key={`empty-${index + results.length + 1}`}
              contentEditable={isEditable && index === 0}
              onInput={(e) => onEditable(index + results.length, e)}
              onBlur={() => setResults([...editingValues.current])}
            />
          ))}
        </tr>
      </table>

      <button
        type="button"
        onClick={toggleEditable}
        disabled={editButtonDisabled}
      >
        {isEditable ? 'Guardar Tabela' : 'Ativar Edição'}
      </button>
    </>
  );
}

export function MainMenuTable({
  sequences,
  results,
}: {
  sequences: number[];
  results: number[];
}) {
  return (
    <table>
      <tr>
        <td>Intervalo</td>
        {sequences.map((_, index) => (
          <td>{index + 1}</td>
        ))}
      </tr>
      <tr>
        <td>Segundos</td>
        {sequences.map((sequence) => (
          <td>{sequence / 1000}</td>
        ))}
      </tr>
      <tr className="table-results-row">
        <td>Resultado</td>
        {results.map((result) => (
          <td>{result}</td>
        ))}
        {[...Array(9 - results.length)].map(() => (
          <td />
        ))}
      </tr>
    </table>
  );
}
