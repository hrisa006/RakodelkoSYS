import { useForm } from "react-hook-form";
import { registerUser } from "../../../api/auth";
import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "./RegisterPage.css";

interface FormValues {
  username: string;
  password: string;
  confirm: string;
}

const RegisterPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    try {
      await registerUser(data.username, data.password);
      await login({ username: data.username, password: data.password });
      navigate("/");
    } catch (err) {
      console.error("Register error", err);
      alert("Грешка при регистрация. Опитайте отново.");
    }
  };

  return (
    <main className="register">
      <h2>Създай профил</h2>
      <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
        <label>
          Потребителско име
          <input
            {...register("username", {
              required: "Задължително поле",
              minLength: { value: 3, message: "Минимум 3 символа" },
            })}
          />
          {errors.username && (
            <span className="error">{errors.username.message}</span>
          )}
        </label>

        <label>
          Парола
          <input
            type="password"
            {...register("password", {
              required: "Задължително поле",
              minLength: { value: 6, message: "Минимум 6 символа" },
            })}
          />
          {errors.password && (
            <span className="error">{errors.password.message}</span>
          )}
        </label>

        <label>
          Потвърди паролата
          <input
            type="password"
            {...register("confirm", {
              validate: (val) =>
                val === watch("password") || "Паролите не съвпадат",
            })}
          />
          {errors.confirm && (
            <span className="error">{errors.confirm.message}</span>
          )}
        </label>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Създаване..." : "Регистрирай ме"}
        </button>
      </form>
    </main>
  );
};

export default RegisterPage;
