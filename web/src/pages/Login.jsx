import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../schemas/auth.schema";
import { loginUser } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await loginUser(data);
      login(res.accessToken); // store token in memory
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Invalid credentials");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto" }}>
      <h2>Login</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Email</label>
        <input {...register("email")} type="email" />
        {errors.email && <p>{errors.email.message}</p>}

        <label>Password</label>
        <input {...register("password")} type="password" />
        {errors.password && <p>{errors.password.message}</p>}

        <button disabled={isSubmitting} style={{ marginTop: 20 }}>
          {isSubmitting ? "Loading..." : "Login"}
        </button>
      </form>
    </div>
  );
}
