import { useState } from "react";
import styles from "./ChangePassword.module.css";
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import showPassword from "../../../assets/images/SignUp/eyeOff.svg";

export default function ChangePassword() {
  const {t} = useTranslation();
  const [passwordShown, setPasswordShown] = useState(false);
  const [passwordConfirmShown, setPasswordConfirmShown] = useState(false);
  let newPassword;
  
  const { register, handleSubmit, watch, formState: {errors} } = useForm({mode: 'onChange',});
  newPassword = watch("newPassword", "");

  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };
  const togglePasswordConfirmVisiblity = () => {
    setPasswordConfirmShown(passwordConfirmShown ? false : true);
  };

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <>

              <div className={styles.topic}>{t('profile.changePassword.topic')}</div>

              <form className={styles.registerForm} onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.inputForm}>
                  
                  <div className={styles.row}>

                    <div className={styles.inputGroup}>
                      <label>{t('profile.changePassword.oldPasswordTopic')}</label>
                      <input {...register("oldPassword", { 
                        required: `${t('common.required')}`
                      })} 
                      type={passwordShown ? "text" : "password"} placeholder={t('profile.changePassword.placeholderOldPassword')} autoComplete="off"/>
                      <i className={styles.passwordShown} onClick={togglePasswordVisiblity}><img className={styles.backgroundGoals} src={showPassword} alt="Show password" /></i>
                      <p>{errors.oldPassword?.message}</p>
                    </div>

                    <div className={styles.inputGroup}>
                      <label>{t('profile.changePassword.FATopic')}</label>
                      <input {...register("FACode", { 
                        required: `${t('common.required')}`
                      })} 
                      type={passwordConfirmShown ? "text" : "password"} placeholder={t('profile.changePassword.placeholderFA')} autoComplete="off"/>
                      <i className={styles.passwordConfirmShown} onClick={togglePasswordConfirmVisiblity}><img className={styles.backgroundGoals} src={showPassword} alt="Show password" /></i>
                      <p>{errors.FACode?.message}</p>
                    </div>

                  </div>

                  <div className={styles.row}>

                    <div className={styles.inputGroup}>
                      <label>{t('profile.changePassword.newPasswordTopic')}</label>
                      <input {...register("newPassword", { 
                        required: `${t('common.required')}`, 
                        minLength:{ 
                          value: 6, 
                          message: `${t('profile.changePassword.patternNewPassword')}`
                        }
                      })} 
                      type={passwordShown ? "text" : "password"} placeholder={t('profile.changePassword.placeholderNewPassword')} autoComplete="off"/>
                      <i className={styles.passwordShown} onClick={togglePasswordVisiblity}><img className={styles.backgroundGoals} src={showPassword} alt="Show password" /></i>
                      <p>{errors.newPassword?.message}</p>
                    </div>

                    <div className={styles.inputGroup}>
                      <label>{t('profile.changePassword.confirmNewPassword')}</label>
                      <input {...register("confirmPassword", { 
                        required: `${t('common.required')}`,
                        validate: (value) => value === newPassword || `${t('profile.changePassword.patternConfirmPassword')}`
                        }
                      )} 
                      type={passwordConfirmShown ? "text" : "password"}placeholder={t('profile.changePassword.placeholderConfirmPassword')} autoComplete="off"/>
                      <i className={styles.passwordConfirmShown} onClick={togglePasswordConfirmVisiblity}><img className={styles.backgroundGoals} src={showPassword} alt="Show password" /></i>
                      <p>{errors.confirmPassword?.message}</p>
                    </div>

                  </div>
                </div>
                <div className={styles.buttonWrapper}>
                  <button className={styles.button} type="submit">{t('profile.changePassword.save')}</button>
              </div>
              </form>
              

    </>

  );
}
