import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Spinner, Row, Col, Badge } from 'react-bootstrap';
import api from '../api/axiosConfig';
import ModalForm from '../components/ModalForm';
import ConfirmModal from '../components/ConfirmModal';
import ToastMessage from '../components/ToastMessage';
import SearchBar from '../components/SearchBar';
import TooltipIcon from '../components/TooltipIcon';
import PaginationBar from '../components/PaginationBar';
import CampoTexto from '../components/forms/CampoTexto';
import CampoSelect from '../components/forms/CampoSelect';
import { isRequired } from '../utils/validations';
import 'bootstrap-icons/font/bootstrap-icons.css';

function Usuarios() {
    // ============================================
    // ESTADOS
    // ============================================
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [form, setForm] = useState({
        username: '',
        password: '',
        rol: ''
    });
    const [errors, setErrors] = useState({});
    const [editingId, setEditingId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const rol = localStorage.getItem('rol');

    // ============================================
    // 🔒 SOLO ADMIN PUEDE VER ESTA PANTALLA
    // ============================================
    if (rol !== 'ADMIN') {
        return (
            <Container className="text-center mt-5">
                <h2>⛔ Acceso denegado</h2>
                <p>No tienes permisos para ver esta página.</p>
            </Container>
        );
    }

    // ============================================
    // EFECTO: CARGAR USUARIOS AL INICIAR
    // ============================================
    useEffect(() => {
        fetchUsuarios();
    }, []);

    // ============================================
    // EFECTO: RESETEAR PÁGINA AL BUSCAR
    // ============================================
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // ============================================
    // FUNCIÓN: OBTENER USUARIOS DEL BACKEND
    // ============================================
    const fetchUsuarios = async () => {
        try {
            const response = await api.get('/usuarios');
            setUsuarios(response.data);
        } catch (error) {
            console.error('Error al cargar usuarios:', error);
            showToast('Error al cargar usuarios', 'danger');
        } finally {
            setLoading(false);
        }
    };

    // ============================================
    // FUNCIÓN: MOSTRAR TOAST
    // ============================================
    const showToast = (message, variant = 'success') => {
        setToast({ show: true, message, variant });
        setTimeout(() => setToast({ show: false, message: '', variant: 'success' }), 3000);
    };

    // ============================================
    // FUNCIÓN: ABRIR MODAL (CREAR/EDITAR)
    // ============================================
    const openModal = (usuario = null) => {
        if (usuario) {
            setForm({
                username: usuario.username || '',
                password: '',
                rol: usuario.rol || ''
            });
            setEditingId(usuario.id);
        } else {
            setForm({
                username: '',
                password: '',
                rol: ''
            });
            setEditingId(null);
        }
        setErrors({});
        setShowModal(true);
    };

    // ============================================
    // FUNCIÓN: VALIDAR FORMULARIO
    // ============================================
    const validateForm = () => {
        const newErrors = {};

        if (!isRequired(form.username)) {
            newErrors.username = 'El nombre de usuario es obligatorio (*)';
        } else if (form.username.length < 3) {
            newErrors.username = 'El nombre de usuario debe tener al menos 3 caracteres';
        }

        if (!editingId && !isRequired(form.password)) {
            newErrors.password = 'La contraseña es obligatoria (*)';
        } else if (!editingId && form.password.length < 4) {
            newErrors.password = 'La contraseña debe tener al menos 4 caracteres';
        }

        if (!isRequired(form.rol)) {
            newErrors.rol = 'Debe seleccionar un rol (*)';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ============================================
    // FUNCIÓN: GUARDAR (CREAR O ACTUALIZAR)
    // ============================================
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setSaving(true);
        try {
            const data = {
                username: form.username.toLowerCase(),
                password: form.password,
                rol: form.rol
            };

            if (editingId) {
                if (!data.password) {
                    delete data.password;
                }
                await api.put(`/usuarios/${editingId}`, data);
                showToast('Usuario actualizado con éxito');
            } else {
                await api.post('/usuarios', data);
                showToast('Usuario creado con éxito');
            }
            setShowModal(false);
            fetchUsuarios();
        } catch (error) {
            console.error('Error al guardar usuario:', error);
            if (error.response?.status === 409) {
                setErrors({ username: 'El nombre de usuario ya existe' });
            } else {
                showToast('Error al guardar usuario', 'danger');
            }
        } finally {
            setSaving(false);
        }
    };

    // ============================================
    // FUNCIÓN: CONFIRMAR ELIMINACIÓN
    // ============================================
    const confirmDelete = (id) => {
        setDeleteId(id);
        setShowConfirm(true);
    };

    // ============================================
    // FUNCIÓN: ELIMINAR
    // ============================================
    const handleDelete = async () => {
        setDeleting(true);
        try {
            await api.delete(`/usuarios/${deleteId}`);
            setShowConfirm(false);
            showToast('Usuario eliminado con éxito');
            fetchUsuarios();
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            showToast('Error al eliminar usuario', 'danger');
        } finally {
            setDeleting(false);
            setDeleteId(null);
        }
    };

    // ============================================
    // FUNCIONES PARA AUTOCOMPLETADO
    // ============================================
    const getSuggestionLabel = (usuario) => `${usuario.username} (${usuario.rol})`;
    const handleSelectSuggestion = (suggestion) => {
        setSearchTerm(suggestion.username);
    };

    // ============================================
    // OBTENER COLOR DEL BADGE SEGÚN ROL
    // ============================================
    const getRolBadge = (rol) => {
        switch (rol) {
            case 'ADMIN': return 'danger';
            case 'EDITOR': return 'warning';
            case 'VIEWER': return 'secondary';
            default: return 'secondary';
        }
    };

    // ============================================
    // FILTRAR DATOS
    // ============================================
    const filteredData = usuarios.filter(item =>
        `${item.username} ${item.rol}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    // ============================================
    // PAGINACIÓN
    // ============================================
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    // ============================================
    // RENDERIZADO: SPINNER
    // ============================================
    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" variant="primary" />
                <p>Cargando usuarios...</p>
            </Container>
        );
    }

    // ============================================
    // RENDERIZADO: CONTENIDO PRINCIPAL
    // ============================================
    return (
        <Container>
            {/* ============================================
          TÍTULO Y BOTÓN AGREGAR
      ============================================ */}
            <Row className="mb-4 align-items-center">
                <Col>
                    <h1>👥 Usuarios</h1>
                </Col>
                <Col xs="auto">
                    <Button variant="primary" onClick={() => openModal()}>
                        <i className="bi bi-plus-circle me-2"></i> Agregar
                    </Button>
                </Col>
            </Row>

            {/* ============================================
          BARRA DE BÚSQUEDA CON AUTOCOMPLETADO
      ============================================ */}
            <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Buscar usuario por nombre o rol..."
                suggestions={usuarios}
                onSelectSuggestion={handleSelectSuggestion}
                getSuggestionLabel={getSuggestionLabel}
            />

            {/* ============================================
          TABLA DE USUARIOS
      ============================================ */}
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Usuario</th>
                        <th>Rol</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="text-center">No hay usuarios registrados</td>
                        </tr>
                    ) : (
                        currentItems.map((usuario) => (
                            <tr key={usuario.id}>
                                <td>{usuario.id}</td>
                                <td>{usuario.username}</td>
                                <td>
                                    <Badge bg={getRolBadge(usuario.rol)}>
                                        {usuario.rol}
                                    </Badge>
                                </td>
                                <td>
                                    <Badge bg={usuario.activo ? 'success' : 'danger'}>
                                        {usuario.activo ? 'Activo' : 'Inactivo'}
                                    </Badge>
                                </td>
                                <td>
                                    <TooltipIcon
                                        icon="bi bi-pencil"
                                        text="Editar usuario"
                                        variant="warning"
                                        onClick={() => openModal(usuario)}
                                        className="me-2"
                                    />
                                    <TooltipIcon
                                        icon="bi bi-trash"
                                        text="Eliminar usuario"
                                        variant="danger"
                                        onClick={() => confirmDelete(usuario.id)}
                                        disabled={usuario.username === 'admin'}
                                    />
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>

            {/* ============================================
          BARRA DE PAGINACIÓN
      ============================================ */}
            <PaginationBar
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                itemsPerPage={itemsPerPage}
                totalItems={filteredData.length}
            />

            {/* ============================================
          MODAL CREAR/EDITAR
      ============================================ */}
            <ModalForm
                show={showModal}
                onHide={() => setShowModal(false)}
                onSubmit={handleSubmit}
                title={editingId ? 'Editar usuario' : 'Nuevo usuario'}
                loading={saving}
                submitText={editingId ? 'Actualizar' : 'Crear'}
                size="lg"
            >
                <Row>
                    <Col md={6}>
                        <CampoTexto
                            label="Usuario"
                            name="username"
                            value={form.username}
                            onChange={(e) => setForm({ ...form, username: e.target.value })}
                            placeholder="Nombre de usuario"
                            error={errors.username}
                            required
                        />
                    </Col>
                    <Col md={6}>
                        <CampoSelect
                            label="Rol"
                            name="rol"
                            value={form.rol}
                            onChange={(e) => setForm({ ...form, rol: e.target.value })}
                            options={[
                                { value: 'ADMIN', label: 'Administrador' },
                                { value: 'EDITOR', label: 'Editor' },
                                { value: 'VIEWER', label: 'Visualizador' }
                            ]}
                            placeholder="Seleccionar rol"
                            error={errors.rol}
                            required
                        />
                    </Col>
                </Row>

                <Row>
                    <Col md={12}>
                        <CampoTexto
                            label={editingId ? 'Nueva contraseña (opcional)' : 'Contraseña'}
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            placeholder={editingId ? 'Dejar en blanco para no cambiar' : '******'}
                            error={errors.password}
                            required={!editingId}
                        />
                    </Col>
                </Row>
            </ModalForm>

            {/* ============================================
          MODAL CONFIRMAR ELIMINACIÓN
      ============================================ */}
            <ConfirmModal
                show={showConfirm}
                onHide={() => setShowConfirm(false)}
                onConfirm={handleDelete}
                message="¿Estás seguro de eliminar este usuario?"
                loading={deleting}
            />

            {/* ============================================
          TOAST (MENSAJES EMERGENTES)
      ============================================ */}
            <ToastMessage
                show={toast.show}
                onClose={() => setToast({ ...toast, show: false })}
                message={toast.message}
                variant={toast.variant}
            />
        </Container>
    );
}

export default Usuarios;