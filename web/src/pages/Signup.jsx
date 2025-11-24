import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "../schemas/auth.schema";
import { signupUser } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data) => {
    try {
      await signupUser(data);
      alert("Account created! You can now login.");
      navigate("/login");
    } catch (err) {
      console.log(err);
      alert("Signup failed");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto" }}>
      <h2>Signup</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Email</label>
        <input {...register("email")} type="email" />
        {errors.email && <p>{errors.email.message}</p>}

        <label>Password</label>
        <input {...register("password")} type="password" />
        {errors.password && <p>{errors.password.message}</p>}

        <button disabled={isSubmitting} style={{ marginTop: 20 }}>
          {isSubmitting ? "Loading..." : "Create Account"}
        </button>
      </form>
    </div>
  );
}
