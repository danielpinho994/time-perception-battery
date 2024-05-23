import { useNavigate } from 'react-router-dom';

export default function MainMenuButton({ disabled }) {
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
