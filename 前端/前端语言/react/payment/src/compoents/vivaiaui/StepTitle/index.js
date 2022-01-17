import React, { Fragment } from "react";
import styles from './style.module.scss';

const StepTitle = ({ step, title = '', rightMain }) => {
    let step_ok = <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="15.5" fill="#E3F4E4" stroke="#E3F4E4" />
        <path d="M9.45459 16.5L13.9546 21L23.5 11" stroke="#26652C" strokeWidth="2" />
    </svg>;
    let step_3 = <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="15.5" fill="black" stroke="black" />
        <path d="M16.448 9.304C17.44 9.304 18.264 9.552 18.92 10.048C19.576 10.528 19.904 11.192 19.904 12.04C19.904 12.664 19.728 13.24 19.376 13.768C19.04 14.28 18.6 14.728 18.056 15.112C17.512 15.48 16.936 15.776 16.328 16C17.08 16.016 17.792 16.16 18.464 16.432C19.136 16.688 19.688 17.08 20.12 17.608C20.552 18.136 20.768 18.816 20.768 19.648C20.768 20.56 20.504 21.384 19.976 22.12C19.448 22.856 18.744 23.48 17.864 23.992C17 24.52 16.04 24.92 14.984 25.192C13.944 25.48 12.912 25.624 11.888 25.624V25.192C12.704 25.176 13.504 25.04 14.288 24.784C15.072 24.544 15.776 24.192 16.4 23.728C17.04 23.264 17.544 22.688 17.912 22C18.296 21.312 18.488 20.528 18.488 19.648C18.488 18.704 18.256 17.928 17.792 17.32C17.344 16.696 16.728 16.352 15.944 16.288C15.704 16.384 15.488 16.472 15.296 16.552C15.12 16.616 14.96 16.648 14.816 16.648C14.56 16.648 14.432 16.544 14.432 16.336C14.432 16.192 14.496 16.08 14.624 16C14.752 15.92 14.896 15.88 15.056 15.88C15.184 15.88 15.312 15.896 15.44 15.928C15.584 15.944 15.736 15.96 15.896 15.976C16.552 15.48 17.024 14.936 17.312 14.344C17.6 13.736 17.744 13.128 17.744 12.52C17.744 11.768 17.552 11.224 17.168 10.888C16.8 10.536 16.296 10.36 15.656 10.36C15 10.36 14.392 10.536 13.832 10.888C13.288 11.24 12.832 11.776 12.464 12.496L12.056 12.304C12.296 11.776 12.608 11.288 12.992 10.84C13.376 10.376 13.848 10.008 14.408 9.736C14.984 9.448 15.664 9.304 16.448 9.304Z" fill="white" />
    </svg>;
    return <div className={styles.step}>
        <div className={styles.step_left}>
            {step === 3 ? step_3 : step_ok}
            <span className={styles.title}>{title}</span>
        </div>
        {rightMain}
    </div>
}

export default StepTitle;
