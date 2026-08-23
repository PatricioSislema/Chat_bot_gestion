// ============================================
// IMPORTACIONES
// ============================================
import React, { useState, useRef, useEffect } from 'react';
import { Form, InputGroup, ListGroup } from 'react-bootstrap';

// ============================================
// COMPONENTE: SearchBar con autocompletado
// ============================================
function SearchBar({
    value,
    onChange,
    placeholder = 'Buscar...',
    className = '',
    suggestions = [],       // Lista de sugerencias (ej: ['Cardiología', 'Pediatría'])
    onSelectSuggestion,    // Función al seleccionar una sugerencia
    getSuggestionLabel    // Función para mostrar el texto de la sugerencia
}) {
    // ============================================
    // ESTADOS
    // ============================================
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const wrapperRef = useRef(null);

    // ============================================
    // FILTRAR SUGERENCIAS BASADO EN EL TEXTO
    // ============================================
    useEffect(() => {
        if (value.trim() === '') {
            setFilteredSuggestions([]);
            return;
        }

        const filtered = suggestions.filter(item =>
            getSuggestionLabel(item).toLowerCase().includes(value.toLowerCase())
        );
        setFilteredSuggestions(filtered.slice(0, 5)); // Máximo 5 sugerencias
    }, [value, suggestions, getSuggestionLabel]);

    // ============================================
    // CERRAR SUGERENCIAS AL HACER CLICK FUERA
    // ============================================
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // ============================================
    // MANEJAR SELECCIÓN DE SUGERENCIA
    // ============================================
    const handleSelectSuggestion = (suggestion) => {
        if (onSelectSuggestion) {
            onSelectSuggestion(suggestion);
        }
        setShowSuggestions(false);
    };

    // ============================================
    // MANEJAR CAMBIO EN EL INPUT
    // ============================================
    const handleChange = (e) => {
        const newValue = e.target.value;
        onChange(newValue);
        setShowSuggestions(true);
    };

    // ============================================
    // MANEJAR TECLA ENTER
    // ============================================
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && filteredSuggestions.length > 0) {
            handleSelectSuggestion(filteredSuggestions[0]);
        }
    };

    // ============================================
    // RENDERIZADO
    // ============================================
    return (
        <div ref={wrapperRef} className={`position-relative ${className}`}>
            <InputGroup>
                <InputGroup.Text>🔍</InputGroup.Text>
                <Form.Control
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    onChange={handleChange}
                    onFocus={() => value.trim() !== '' && setShowSuggestions(true)}
                    onKeyDown={handleKeyDown}
                />
                {value && (
                    <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => {
                            onChange('');
                            setFilteredSuggestions([]);
                        }}
                    >
                        ✕
                    </button>
                )}
            </InputGroup>

            {/* ============================================
          LISTA DE SUGERENCIAS
      ============================================ */}
            {showSuggestions && filteredSuggestions.length > 0 && (
                <ListGroup
                    className="position-absolute w-100"
                    style={{
                        zIndex: 1000,
                        maxHeight: '200px',
                        overflowY: 'auto',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    }}
                >
                    {filteredSuggestions.map((item, index) => (
                        <ListGroup.Item
                            key={index}
                            action
                            onClick={() => handleSelectSuggestion(item)}
                            style={{ cursor: 'pointer' }}
                        >
                            {getSuggestionLabel(item)}
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}
        </div>
    );
}

export default SearchBar;