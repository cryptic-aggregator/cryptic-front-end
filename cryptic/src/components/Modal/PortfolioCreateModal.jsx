import React from "react";
import styles from "../../components/styles/PortfolioCreateModal.module.css";
import { useState, useEffect } from "react";
import i18next from "i18next";
import { useTranslation } from 'react-i18next';
import avatarSave from "../../assets/images/PortfoliosCreateModals/avatarSave.svg";
import close from "../../assets/images/PortfoliosCreateModals/close.svg";
import { useForm } from 'react-hook-form';
import { useDispatch } from "react-redux";
import { fetchPortfolios,addPortfolio  } from "../../store/slices/portfolioSlice";
import {useNavigate} from "react-router-dom";

export default function SettingsModal({ isOpen, onClose,children }) {
    const {t} = useTranslation();
    const [avatar, setAvatar] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onModalClick = (event) => {
        // Закрити модалку, якщо клік був по врапперу
        if (event.target.classList.contains(styles.modalWrapper)) {
            onClose();
        }
    };
    const { register, handleSubmit, formState: {errors} } = useForm({mode: 'onChange',});

    const onSubmit = async (data) => {
        dispatch(addPortfolio({ name: `${data.namePortfolios}` }));
        onClose();
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const imageUrl = URL.createObjectURL(file);
          setAvatar(imageUrl);
          console.log(imageUrl)
        }
      };

    return (
        <>
            {isOpen && (
                <div className={styles.modalWrapper} onClick={onModalClick}>
  
                        <form className={styles.createPortfoliosModal} onSubmit={handleSubmit(onSubmit)}>
                            <button className={styles.closeButton} onClick={() => onClose()}>
                                <img src={close} alt="Close"  />
                            </button>
                            <div  className={styles.topic} >Create Porfolio</div>
                            <div className={styles.inputForm}>

                                <div className={styles.inputGroup}>
                                    <label>Name</label>
                                    <input {...register("namePortfolios", { 
                                        required: `${t('signIn.required')}`,
                                    })} 
                                    placeholder={'Enter name portfolios'} autoComplete="off"
                                    />
                                    <p>{errors.namePortfolios?.message}</p>
                                </div>

                                <div className={styles.inputGroup}>
                                    <label>Choose avatar</label>
                                    <input
                                    type="file"
                                    accept="image/*"
                                    {...register("avatar")}
                                    onChange={handleAvatarChange}
                                    className={styles.inputAvatar}
                                    id="avatarInput"
                                    />
                                    {/* Контейнер із зображенням, що відкриває інпут при кліку */}
                                    <div className={styles.avatarWrapper} onClick={() => document.getElementById("avatarInput").click()}>
                                    {avatar ? (
                                        <img src={avatar} alt="Selected Avatar" className={styles.avatarPreview} />
                                    ) : (
                                        <>
                                            <div className={styles.avatarText}>
                                                <img className={styles.avatarChose} src={avatarSave} alt="Choose Avatar"  />
                                                <span className={styles.uploadPlaceholder}>Upload the required image</span>
                                            </div>
                                        </>

                                    )}
                                    </div>
                                    <p>{errors.password?.message}</p>
                                </div>
                            </div>
                            <button className={styles.createButton} type="submit" >Create</button>
                        </form>
                        
                    </div>

            )}
        </>
    );
}
