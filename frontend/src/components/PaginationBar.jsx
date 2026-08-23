// ============================================
// IMPORTACIONES
// ============================================
import React from 'react';
import { Pagination } from 'react-bootstrap';

// ============================================
// COMPONENTE: Barra de paginación
// ============================================
function PaginationBar({
    currentPage,
    totalPages,
    onPageChange,
    itemsPerPage = 5,
    totalItems = 0
}) {
    // ============================================
    // SI NO HAY PÁGINAS, NO MOSTRAR NADA
    // ============================================
    if (totalPages <= 1) return null;

    // ============================================
    // GENERAR NÚMEROS DE PÁGINA
    // ============================================
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5; // Máximo de números visibles

        if (totalPages <= maxVisible) {
            // Si hay pocas páginas, mostrar todas
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Si hay muchas, mostrar con elipsis
            if (currentPage <= 3) {
                pages.push(1, 2, 3, '...', totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }
        return pages;
    };

    // ============================================
    // RENDERIZADO
    // ============================================
    return (
        <div className="d-flex justify-content-between align-items-center mt-3">
            <small className="text-muted">
                Mostrando {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} -{' '}
                {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems} registros
            </small>

            <Pagination>
                {/* Anterior */}
                <Pagination.Prev
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                />

                {/* Números de página */}
                {getPageNumbers().map((page, index) =>
                    page === '...' ? (
                        <Pagination.Ellipsis key={`ellipsis-${index}`} />
                    ) : (
                        <Pagination.Item
                            key={page}
                            active={page === currentPage}
                            onClick={() => onPageChange(page)}
                        >
                            {page}
                        </Pagination.Item>
                    )
                )}

                {/* Siguiente */}
                <Pagination.Next
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                />
            </Pagination>
        </div>
    );
}

export default PaginationBar;