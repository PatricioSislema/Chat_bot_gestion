// ============================================
// IMPORTACIONES
// ============================================
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import api from '../api/axiosConfig';

// ============================================
// COMPONENTE: LOGIN
// ============================================
function Login() {
    // ============================================
    // ESTADOS
    // ============================================
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // ============================================
    // FUNCIÓN: MANEJAR EL ENVÍO
    // ============================================
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/auth/login', { username, password });
            const { token, rol } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('rol', rol);
            localStorage.setItem('username', username);
            navigate('/dashboard');
        } catch (err) {
            setError('❌ Credenciales incorrectas. Verifica usuario y contraseña.');
            console.error('Error de login:', err);
        } finally {
            setLoading(false);
        }
    };

    // ============================================
    // RENDERIZADO
    // ============================================
    return (
        <Container fluid className="vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#f0f2f5' }}>
            <Row className="w-100 justify-content-center">
                <Col md={6} lg={4}>
                    <Card className="shadow-lg border-0">
                        <Card.Body className="p-5">
                            {/* ============================================
                  LOGO Y BIENVENIDA
              ============================================ */}
                            <div className="text-center mb-4">
                                <div style={{ fontSize: '3rem' }}>🏥</div>
                                <h1 className="h3 mb-2" style={{ color: '#0d6efd' }}>Salud Para Todos</h1>
                                <p className="text-muted">Sistema de Gestión Médica</p>
                                <hr />
                                <p className="text-muted small">Inicia sesión para continuar</p>
                            </div>

                            {/* ============================================
                  MENSAJE DE ERROR
              ============================================ */}
                            {error && (
                                <Alert variant="danger" className="text-center">
                                    {error}
                                </Alert>
                            )}

                            {/* ============================================
                  FORMULARIO
              ============================================ */}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Usuario</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="admin"
                                        required
                                        autoFocus
                                        disabled={loading}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label>Contraseña</Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        disabled={loading}
                                    />
                                </Form.Group>

                                <Button
                                    variant="primary"
                                    type="submit"
                                    className="w-100"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Spinner as="span" animation="border" size="sm" className="me-2" />
                                            Iniciando sesión...
                                        </>
                                    ) : (
                                        'Ingresar'
                                    )}
                                </Button>
                            </Form>

                            {/* ============================================
                  PIE DE PÁGINA
              ============================================ */}
                            <div className="text-center mt-3">
                                <small className="text-muted">
                                    Sistema de Citas Médicas v1.0
                                </small>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Login;