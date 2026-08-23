import React from 'react';
import { OverlayTrigger, Tooltip, Button } from 'react-bootstrap';

/**
 * Icono con tooltip flotante (texto al pasar el mouse).
 * 
 * @param {string} icon - Clase del ícono (ej: 'bi bi-pencil').
 * @param {string} text - Texto del tooltip.
 * @param {string} variant - Color del botón (primary, danger, warning, etc.).
 * @param {function} onClick - Función al hacer clic.
 * @param {string} size - Tamaño del botón (sm, lg).
 * @param {string} className - Clases CSS adicionales.
 */
function TooltipIcon({
    icon,
    text,
    variant = 'primary',
    onClick,
    size = 'sm',
    className = '',
    disabled = false
}) {
    return (
        <OverlayTrigger
            placement="top"
            overlay={<Tooltip>{text}</Tooltip>}
        >
            <Button
                variant={variant}
                size={size}
                onClick={onClick}
                className={className}
                disabled={disabled}
            >
                <i className={icon}></i>
            </Button>
        </OverlayTrigger>
    );
}

export default TooltipIcon;