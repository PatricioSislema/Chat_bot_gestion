import React from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';

/**
 * Modal de confirmación para eliminar registros.
 * 
 * @param {boolean} show - Controla si el modal está abierto.
 * @param {function} onHide - Función para cerrar el modal.
 * @param {function} onConfirm - Función para confirmar la eliminación.
 * @param {string} message - Mensaje de confirmación.
 * @param {boolean} loading - Indica si se está procesando la eliminación.
 */
function ConfirmModal({
    show,
    onHide,
    onConfirm,
    message = '¿Estás seguro de eliminar este registro?',
    loading = false
}) {
    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Confirmar eliminación</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p>{message}</p>
                <p className="text-danger">Esta acción no se puede deshacer.</p>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onHide} disabled={loading}>
                    Cancelar
                </Button>
                <Button variant="danger" onClick={onConfirm} disabled={loading}>
                    {loading ? (
                        <>
                            <Spinner as="span" animation="border" size="sm" className="me-2" />
                            Eliminando...
                        </>
                    ) : (
                        'Eliminar'
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ConfirmModal;