import React, { useEffect, useState } from 'react';
import './App.css';

const Toast = ({ message, type, duration, onClose }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    if (!visible) return null;

    return (
        <div className={`toast toast-${type}`}>
            {message}
        </div>
    );
};

export default Toast;