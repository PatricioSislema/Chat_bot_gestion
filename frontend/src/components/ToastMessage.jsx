import React from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

/**
 * Componente para mostrar mensajes emergentes de confirmación.
 * 
 * @param {boolean} show - Controla si el mensaje está visible.
 * @param {function} onClose - Función para cerrar el mensaje.
 * @param {string} message - Texto del mensaje.
 * @param {string} variant - Tipo de mensaje (success, danger, info, warning).
 * @param {number} delay - Tiempo en milisegundos antes de ocultarse.
 */
function ToastMessage({
    show,
    onClose,
    message,
    variant = 'success',
    delay = 3000
}) {
    return (
        <ToastContainer position="top-end" className="p-3">
            <Toast
                show={show}
                onClose={onClose}
                delay={delay}
                autohide
                bg={variant}
            >
                <Toast.Header>
                    <strong className="me-auto">
                        {variant === 'success' ? '✅ Éxito' :
                            variant === 'danger' ? '❌ Error' :
                                variant === 'warning' ? '⚠️ Advertencia' : 'ℹ️ Información'}
                    </strong>
                </Toast.Header>
                <Toast.Body className={variant === 'success' ? 'text-white' : ''}>
                    {message}
                </Toast.Body>
            </Toast>
        </ToastContainer>
    );
}

export default ToastMessage;