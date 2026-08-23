// ============================================
// VALIDACIONES REUTILIZABLES
// ============================================

// ============================================
// 1. Validar que el campo no esté vacío
// ============================================
export const isRequired = (value) => {
    return value && value.trim().length > 0;
};

// ============================================
// 2. Validar que solo contenga letras y espacios
// ============================================
export const isOnlyLetters = (value) => {
    return /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/.test(value);
};

// ============================================
// 3. Validar teléfono (10 dígitos)
// ============================================
export const isValidPhone = (value) => {
    return /^\d{10}$/.test(value);
};

// ============================================
// 4. Validar email (formato básico)
// ============================================
export const isValidEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

// ============================================
// 5. Normalizar: convertir a mayúsculas
// ============================================
export const toUpperCase = (value) => {
    return value ? value.toUpperCase().trim() : '';
};

// ============================================
// 6. Validar fecha (no vacía y formato válido)
// ============================================
export const isValidDate = (value) => {
    if (!value) return false;
    const date = new Date(value);
    return date instanceof Date && !isNaN(date);
};