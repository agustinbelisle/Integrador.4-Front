import LoginForm from "../components/LoginForm/LoginForm";
import { useLocation } from "react-router-dom";

const LoginPage = () => {
  const location = useLocation();

  // Asegurarse que from sea siempre un string
  const from = location.state?.from?.pathname || "/";

  return (
    <div style={{ margin: "80px 0 130px 0", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h2 style={{ marginBottom: "20px", fontWeight: "500" }}>Iniciar sesión</h2>
      <LoginForm from={from} />
    </div>
  );
};

export default LoginPage;
