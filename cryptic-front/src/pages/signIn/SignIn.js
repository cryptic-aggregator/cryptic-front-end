import { useState } from "react";
import { useForm } from 'react-hook-form';
import showPassword from "../../assets/images/SignUpPage/eyeOff.svg";
import styles from "./SignIn.module.css";

export default function SignIn() {
      //show password
      const [passwordShown, setPasswordShown] = useState(false);

      const togglePasswordVisiblity = () => {
        setPasswordShown(passwordShown ? false : true);
      };

    const { register, handleSubmit, formState: {errors} } = useForm({mode: 'onChange',});
    const onSubmit = (data) => {
      console.log(data);
    };
  
  return (
    <>
    <div className={styles.signIn}>
    <form className={styles.registerForm} onSubmit={handleSubmit(onSubmit)}>
        <h1>Sign In</h1>
        <div className={styles.inputForm}>

            <div className={styles.inputGroup}>
              <label>Email</label>
              <input {...register("email", { 
                required: "This is required.",
              })} 
              placeholder="Enter your email" autoComplete="off"
              />
              <p>{errors.email?.message}</p>
            </div>
            <div className={styles.inputGroup}>
              <label>Password</label>
              <input {...register("password", { 
                required: "This is required.", 

              })} 
              type={passwordShown ? "text" : "password"} placeholder="Enter your password" autoComplete="off"/>
              <i className={styles.passwordShown} onClick={togglePasswordVisiblity}><img className={styles.backgroundGoals} src={showPassword} alt="Show password" /></i>
              <p>{errors.password?.message}</p>
            </div>
        </div>
        <a className={styles.forgotPassword} href="recovery">Forgot Password</a>
        <button className={styles.signInButton} type="submit" >Sign In</button>
        <label className={styles.signUp} >Don’t have an account? <a href="signup">Sign Up</a></label>
      </form>
    </div>
    </>

  );
}
