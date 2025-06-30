import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../../api/auth";
import { useAuth } from "../../../contexts/AuthContext";
import "./LoginPage.css";

interface FormValues {
  username: string;
  password: string;
}

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    try {
      await loginUser(data.username, data.password);
      await login({ username: data.username, password: data.password });
      navigate("/profile");
    } catch (e) {
      console.error("Login error:", e);
      alert("Невалидни данни за вход.");
    }
  };

  return (
    <main className="login">
      <h2>Вход</h2>
      <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
        <label>
          Потребител
          <input {...register("username", { required: "Задължително поле" })} />
          {errors.username && (
            <span className="error">{errors.username.message}</span>
          )}
        </label>

        <label>
          Парола
          <input
            type="password"
            {...register("password", { required: "Задължително поле" })}
          />
          {errors.password && (
            <span className="error">{errors.password.message}</span>
          )}
        </label>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Влизане..." : "Влез"}
        </button>
      </form>

      <p className="login-register-cta">
        Нямаш профил? <Link to="/register">Създай нов</Link>
      </p>
    </main>
  );
};

export default LoginPage;
