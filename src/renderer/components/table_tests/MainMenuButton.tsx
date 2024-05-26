import { useNavigate } from 'react-router-dom';

export default function MainMenuButton({ disabled }: { disabled: boolean }) {
  const navigate = useNavigate();
  const goToMainMenu = () => {
    navigate('/');
  };

  return (
    <button type="button" onClick={goToMainMenu} disabled={disabled}>
      Voltar
    </button>
  );
}
