import { useState } from "react";
import { useForm } from 'react-hook-form';
import showPassword from "../../assets/images/SignUpPage/eyeOff.svg";
import styles from "./SignUp.module.css";

export default function SignUp() {
    //show password
    const [passwordShown, setPasswordShown] = useState(false);
    const [passwordConfirmShown, setPasswordConfirmShown] = useState(false);
    let password;
    
    const togglePasswordVisiblity = () => {
      setPasswordShown(passwordShown ? false : true);
    };
    const togglePasswordConfirmVisiblity = () => {
      setPasswordConfirmShown(passwordConfirmShown ? false : true);
    };
  
    const { register, handleSubmit, watch, formState: {errors} } = useForm({mode: 'onChange',});
    password = watch("password", "");

    const onSubmit = (data) => {
      console.log(data);
    };

  return (
    <>
    <div className={styles.signUp}>
    <form className={styles.registerForm} onSubmit={handleSubmit(onSubmit)}>
        <h1>Sign Up</h1>
        <div className={styles.inputForm}>
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>Login</label>
              <input {...register("login", { 
                required: "This is required." 
              })} 
              placeholder="Enter your login" autoComplete="off"/>
              <p>{errors.login?.message}</p>
            </div>
            <div className={styles.inputGroup}>
              <label>Email</label>
              <input {...register("email", { 
                required: "This is required.", 
                pattern:{
                  value: /^[A-Z0-9._%+-]+@[a-z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: 'Invalid email address',
                },
              })} 
              placeholder="Enter your email" autoComplete="off"
              />
              <p>{errors.email?.message}</p>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>Password</label>
              <input {...register("password", { 
                required: "This is required.", 
                minLength:{ 
                  value: 6, 
                  message: "Min lenght is 6."
                }
              })} 
              type={passwordShown ? "text" : "password"} placeholder="Enter your password" autoComplete="off"/>
              <i className={styles.passwordShown} onClick={togglePasswordVisiblity}><img className={styles.backgroundGoals} src={showPassword} alt="Show password" /></i>
              <p>{errors.password?.message}</p>
            </div>
            <div className={styles.inputGroup}>
              <label>Confirm password</label>
              <input {...register("confirmPassword", { 
                required: "This is required.",
                validate: (value) => value === password || "Passwords do not match."
                }
              )} 
              type={passwordConfirmShown ? "text" : "password"}placeholder="Repeat your password" autoComplete="off"/>
              <i className={styles.passwordConfirmShown} onClick={togglePasswordConfirmVisiblity}><img className={styles.backgroundGoals} src={showPassword} alt="Show password" /></i>
              <p>{errors.confirmPassword?.message}</p>
            </div>
          </div>
        </div>

        <div className={styles.checkboxTerms}>
          <input id="check" type="checkbox" {...register("agreeUseTerms", { 
            required: "This is required." 
          })}/>
          <label htmlFor="check">I agree with the terms of use</label>
        </div>
        <p>{errors.agreeUseTerms?.message}</p>

        <button className={styles.signUpButton} type="submit" >Sign Up</button>
        <label className={styles.signIn} >Already have an Account <a href="signin">Sign In</a></label>
      </form>
    </div>
    </>

  );
}
