import * as z from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form";
import { useContext, useState } from "react";
import { EmailIcon, EyeClosedIcon, EyeOpenIcon, GoogleIcon, PasswordIcon, UserIcon } from "./Icons";
import { UniversalInputWidget } from "./Widgets";
import instance, { BASE_URL } from './../config/axiosConfig';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import useAuthStore from "../hooks/useAuthStore";



const LoginForm = ({ toggleForm }) => {

  const [showPassword, setShowPassword] = useState(false);
  const assignUser = useAuthStore((s) => s.assignUser);
  const assignTokens = useAuthStore((s) => s.assignTokens);
  // const navigate = useNavigate();

  const loginFormSchema = z.object({
    email: z.email({
      message: "Invalid email address"
    }),
    password: z.string().min(8, "Password must be at least 8 characters long").regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[a-z]/, "Password must contain at least one lowercase letter").regex(/[0-9]/, "Password must contain at least one number").regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  })

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: ''
    },
  });

  const onSubmit = (data) => {
    instance.post("/auth/login", data).then((response) => {
      console.log("Login successful:", response.data);
      assignUser(response.data.user);
      assignTokens(response.data.accessToken, response.data.refreshToken);
      window.location.hash = "";
      toast.success("Login successful");
    }).catch((error) => {
      toast.error(error?.response?.data?.message || "Login failed");
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="h-full w-full row-start-1 row-span-8 grid grid-rows-5 grid-cols-1 gap-2 place-items-center pb-4">
      <h1 className="row-start-1 row-span-2 text-3xl font-semibold">Login</h1>

      <div className="h-10 w-4/5 row-start-3 row-span-2 place-items-center grid">
        <UniversalInputWidget inputProps={{ ...register("email"), placeholder: "Enter your email", className: "input-formfield pl-8", type: "email" }} leftAbsoluteChildren={<span className="absolute left-4 top-1/2 -translate-1/2 h-6 aspect-square"><UserIcon className="h-full aspect-square text-gray-700" /></span>} rightAbsoluteChildren={""} />
        {/* TODO: Update Warning UI to show as tooltip */}
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      </div>

      <div className="h-10 w-4/5 row-start-5 row-span-2 place-items-center grid">
        <UniversalInputWidget inputProps={{
          ...register("password"), placeholder: "Enter your password", className: `input-formfield pl-8`, type: showPassword ? "text" : "password",
        }} leftAbsoluteChildren={<span className="absolute left-4 top-1/2 -translate-1/2 h-6 aspect-square"> <PasswordIcon className="h-full aspect-square text-gray-700" /> </span>} rightAbsoluteChildren={
          <span className="w-6 aspect-square absolute right-0 top-1/2 -translate-1/2 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOpenIcon className="h-full aspect-square text-gray-700" /> : <EyeClosedIcon className="h-full aspect-square text-gray-700" />}
          </span>
        } />

        {errors.password && <p className="text-red-500">{errors.password.message}</p>}
        <Link to="/forgot-password" className="row-start-6 row-span-1 self-end justify-self-end text-sm text-blue-600 cursor-pointer">Forgot Password?</Link>
      </div>
      <button type="submit" className="button px-4 py-2 mt-4 row-start-7 row-span-1 w-20">Login</button>
    </form>
  )

}

const SignupForm = ({ toggleForm }) => {

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const signupFormSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters long").max(20, "Username must be at most 20 characters long"),
    email: z.email({
      message: "Invalid email address"
    }),
    password: z.string().min(8, "Password must be at least 8 characters long").regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[a-z]/, "Password must contain at least one lowercase letter").regex(/[0-9]/, "Password must contain at least one number").regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters long"),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const onSubmit = (data) => {
    console.log("Signup data:", data);
    instance.post("/auth/register", data).then((response) => {
      toast.success("Signup successful! Please login to continue.");
      toggleForm();
      console.log("Signup successful:", response.data);
    }).catch((error) => {
      toast.error(error?.response?.data?.message || "Signup failed");
    });
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="h-full w-full row-span-8 grid grid-rows-5 place-items-center">
        <h1 className="row-start-1 row-span-1 text-3xl font-semibold">Signup</h1>

        <div className="h-10 row-start-2 row-span-1 place-items-center grid w-4/5">
          <UniversalInputWidget inputProps={{ ...register("username"), placeholder: "Enter your username", className: "input-formfield pl-8", type: "text" }} leftAbsoluteChildren={<span className="absolute left-4 top-1/2 -translate-1/2 h-6 aspect-square"><UserIcon className="h-full aspect-square text-gray-700" /></span>} rightAbsoluteChildren={""} />
          {errors.username && <p className="text-red-500">{errors.username.message}</p>}
        </div>

        <div className="h-10 w-4/5 row-start-3 row-span-1 place-items-center grid">
          <UniversalInputWidget inputProps={{ ...register("email"), placeholder: "Enter your email", className: "input-formfield pl-8", type: "email" }} leftAbsoluteChildren={<span className="absolute left-4 top-1/2 -translate-1/2 h-6 aspect-square"><EmailIcon className="h-full aspect-square text-gray-700" /></span>} rightAbsoluteChildren={""} />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        </div>

        <div className="h-10 w-4/5 row-start-4 row-span-1 place-items-center grid">
          <UniversalInputWidget
            inputProps={{ ...register("password"), placeholder: "Enter your password", className: "input-formfield pl-8", type: showPassword ? "text" : "password" }}
            leftAbsoluteChildren={<span className="absolute left-4 top-1/2 -translate-1/2 h-6 aspect-square"><PasswordIcon className="h-full aspect-square text-gray-700" /></span>}
            rightAbsoluteChildren={
              <span className="w-6 aspect-square absolute right-0 top-1/2 -translate-1/2 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOpenIcon className="h-full aspect-square text-gray-700" /> : <EyeClosedIcon className="h-full aspect-square text-gray-700" />}
              </span>
            }
          />
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}
        </div>

        <div className="h-10 w-4/5 row-start-5 row-span-1 place-items-center grid">
          <UniversalInputWidget
            inputProps={{ ...register("confirmPassword"), placeholder: "Confirm your password", className: "input-formfield pl-8", type: showConfirmPassword ? "text" : "password" }}
            leftAbsoluteChildren={<span className="absolute left-4 top-1/2 -translate-1/2 h-6 aspect-square"><PasswordIcon className="h-full aspect-square text-gray-700" /></span>}
            rightAbsoluteChildren={
              <span className="w-6 aspect-square absolute right-0 top-1/2 -translate-1/2 cursor-pointer" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <EyeOpenIcon className="h-full aspect-square text-gray-700" /> : <EyeClosedIcon className="h-full aspect-square text-gray-700" />}
              </span>
            }
          />
          {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
        </div>

        <button type="submit" className="button row-start-9 h-10 mt-2">
          Sign Up
        </button>

      </form>
    </>
  )
}


const GoogleSigninButton = () => {


  const handleGoogleSignIn = () => {
    const redirectTo = BASE_URL + `/sessions/oauth/google/initiate?redirectTo=/`;
    window.location.href = redirectTo;
  }

  return <button
    className="bg-white text-black border border-gray-500 rounded-4xl px-4 py-2 mt-2 row-span-2 w-60 items-center justify-center gap-4 flex flex-row self-center justify-self-center cursor-pointer hover:bg-gray-100 active:scale-95 transition-all"
    onClick={handleGoogleSignIn}
  >
    <span><GoogleIcon className="w-6 h-6" /></span>
    <span>Sign in with Google</span>
  </button>
}



const LoginSignup = () => {
  const [showLoginForm, setShowLoginForm] = useState(true);

  return (
    <div className="h-full w-full grid grid-rows-12 p-4">
      {showLoginForm ? <LoginForm toggleForm={() => setShowLoginForm(!showLoginForm)} /> : <SignupForm toggleForm={() => setShowLoginForm(!showLoginForm)} />}
      <button onClick={() => setShowLoginForm(!showLoginForm)} className="bg-transparent appearance-none w-fit place-self-center">
        <span className="cursor-pointer text-blue-600">
          {
            showLoginForm ?
              "Switch to Signup" :
              "Switch to Login"
          }
        </span>
      </button>
      <GoogleSigninButton />
    </div>
  )
}

export default LoginSignup