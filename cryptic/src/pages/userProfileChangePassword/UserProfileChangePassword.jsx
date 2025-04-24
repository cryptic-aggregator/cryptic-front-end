import { useState } from "react";
import styles from "./UserProfileChangePassword.module.css";
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import showPassword from "../../assets/images/SignUpPage/eyeOff.svg";

export default function UserProfileChangePassword() {
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

              <div className={styles.topic}>{t('userProfileChangePassword.topic')}</div>

              <form className={styles.registerForm} onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.inputForm}>
                  
                  <div className={styles.row}>

                    <div className={styles.inputGroup}>
                      <label>{t('userProfileChangePassword.oldPasswordTopic')}</label>
                      <input {...register("oldPassword", { 
                        required: `${t('userProfileChangePassword.required')}`
                      })} 
                      type={passwordShown ? "text" : "password"} placeholder={t('userProfileChangePassword.placeholderOldPassword')} autoComplete="off"/>
                      <i className={styles.passwordShown} onClick={togglePasswordVisiblity}><img className={styles.backgroundGoals} src={showPassword} alt="Show password" /></i>
                      <p>{errors.oldPassword?.message}</p>
                    </div>

                    <div className={styles.inputGroup}>
                      <label>{t('userProfileChangePassword.FATopic')}</label>
                      <input {...register("FACode", { 
                        required: `${t('userProfileChangePassword.required')}`
                      })} 
                      type={passwordConfirmShown ? "text" : "password"} placeholder={t('userProfileChangePassword.placeholderFA')} autoComplete="off"/>
                      <i className={styles.passwordConfirmShown} onClick={togglePasswordConfirmVisiblity}><img className={styles.backgroundGoals} src={showPassword} alt="Show password" /></i>
                      <p>{errors.FACode?.message}</p>
                    </div>

                  </div>

                  <div className={styles.row}>

                    <div className={styles.inputGroup}>
                      <label>{t('userProfileChangePassword.newPasswordTopic')}</label>
                      <input {...register("newPassword", { 
                        required: `${t('userProfileChangePassword.required')}`, 
                        minLength:{ 
                          value: 6, 
                          message: `${t('userProfileChangePassword.patternNewPassword')}`
                        }
                      })} 
                      type={passwordShown ? "text" : "password"} placeholder={t('userProfileChangePassword.placeholderNewPassword')} autoComplete="off"/>
                      <i className={styles.passwordShown} onClick={togglePasswordVisiblity}><img className={styles.backgroundGoals} src={showPassword} alt="Show password" /></i>
                      <p>{errors.newPassword?.message}</p>
                    </div>

                    <div className={styles.inputGroup}>
                      <label>{t('userProfileChangePassword.confirmNewPassword')}</label>
                      <input {...register("confirmPassword", { 
                        required: `${t('userProfileChangePassword.required')}`,
                        validate: (value) => value === newPassword || `${t('userProfileChangePassword.patternConfirmPassword')}`
                        }
                      )} 
                      type={passwordConfirmShown ? "text" : "password"}placeholder={t('userProfileChangePassword.placeholderConfirmPassword')} autoComplete="off"/>
                      <i className={styles.passwordConfirmShown} onClick={togglePasswordConfirmVisiblity}><img className={styles.backgroundGoals} src={showPassword} alt="Show password" /></i>
                      <p>{errors.confirmPassword?.message}</p>
                    </div>

                  </div>
                </div>
                <div className={styles.buttonWrapper}>
                  <button className={styles.button} type="submit">{t('userProfileChangePassword.save')}</button>
              </div>
              </form>
              

    </>

  );
}
