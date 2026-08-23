// ============================================
// IMPORTACIONES
// ============================================
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner, Alert, Table, Badge } from 'react-bootstrap';
import api from '../api/axiosConfig';

function Dashboard() {
    // ============================================
    // ESTADOS
    // ============================================
    const [stats, setStats] = useState({
        medicos: 0,
        pacientes: 0,
        citas: 0,
        citasHoy: 0
    });
    const [citasProximas, setCitasProximas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userName = localStorage.getItem('username') || 'Usuario';

    // ============================================
    // EFECTO: CARGAR ESTADÍSTICAS
    // ============================================
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [medicosRes, pacientesRes, citasRes] = await Promise.all([
                    api.get('/doctores'),
                    api.get('/pacientes'),
                    api.get('/citas')
                ]);

                const citas = citasRes.data;
                const hoy = new Date().toISOString().split('T')[0];
                const citasHoy = citas.filter(c => c.fecha === hoy && c.estado !== 'Cancelada');

                // Obtener próximas 5 citas (ordenadas por fecha)
                const proximas = citas
                    .filter(c => c.fecha >= hoy && c.estado !== 'Cancelada')
                    .sort((a, b) => a.fecha.localeCompare(b.fecha))
                    .slice(0, 5);

                setStats({
                    medicos: medicosRes.data.length,
                    pacientes: pacientesRes.data.length,
                    citas: citas.length,
                    citasHoy: citasHoy.length
                });
                setCitasProximas(proximas);
            } catch (error) {
                console.error('Error al cargar estadísticas:', error);
                setError('No se pudieron cargar las estadísticas');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    // ============================================
    // OBTENER COLOR DEL BADGE SEGÚN ESTADO
    // ============================================
    const getEstadoBadge = (estado) => {
        switch (estado) {
            case 'Agendada': return 'primary';
            case 'Confirmada': return 'success';
            case 'Atendida': return 'info';
            case 'Cancelada': return 'danger';
            default: return 'secondary';
        }
    };

    // ============================================
    // RENDERIZADO: SPINNER
    // ============================================
    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Cargando estadísticas...</p>
            </Container>
        );
    }

    // ============================================
    // RENDERIZADO: ERROR
    // ============================================
    if (error) {
        return (
            <Container className="mt-4">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    // ============================================
    // RENDERIZADO: CONTENIDO
    // ============================================
    return (
        <Container>
            {/* ============================================
          BIENVENIDA
      ============================================ */}
            <div className="mb-4">
                <h1 className="display-4">
                    🏥 Bienvenido a <span style={{ color: '#0d6efd' }}>Salud Para Todos</span>
                </h1>
                <p className="lead text-muted">Sistema de Gestión Médica</p>
                <hr />
                <p className="text-muted">
                    👋 Hola, <strong>{userName}</strong>. Aquí tienes un resumen del sistema.
                </p>
            </div>

            {/* ============================================
          TARJETAS DE ESTADÍSTICAS
      ============================================ */}
            <Row className="mb-4">
                <Col md={3}>
                    <Card className="text-center shadow-sm border-primary">
                        <Card.Body>
                            <Card.Title className="text-primary">👨‍⚕️ Médicos</Card.Title>
                            <Card.Text style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
                                {stats.medicos}
                            </Card.Text>
                            <Card.Text className="text-muted small">Activos en el sistema</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={3}>
                    <Card className="text-center shadow-sm border-success">
                        <Card.Body>
                            <Card.Title className="text-success">🧑‍⚕️ Pacientes</Card.Title>
                            <Card.Text style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
                                {stats.pacientes}
                            </Card.Text>
                            <Card.Text className="text-muted small">Registrados en el sistema</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={3}>
                    <Card className="text-center shadow-sm border-warning">
                        <Card.Body>
                            <Card.Title className="text-warning">📅 Citas</Card.Title>
                            <Card.Text style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
                                {stats.citas}
                            </Card.Text>
                            <Card.Text className="text-muted small">Totales agendadas</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={3}>
                    <Card className="text-center shadow-sm border-info">
                        <Card.Body>
                            <Card.Title className="text-info">📌 Hoy</Card.Title>
                            <Card.Text style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
                                {stats.citasHoy}
                            </Card.Text>
                            <Card.Text className="text-muted small">Citas para hoy</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* ============================================
          PRÓXIMAS CITAS
      ============================================ */}
            <Row>
                <Col md={12}>
                    <Card className="shadow-sm">
                        <Card.Header className="bg-primary text-white">
                            <h5 className="mb-0">📋 Próximas citas</h5>
                        </Card.Header>
                        <Card.Body>
                            {citasProximas.length === 0 ? (
                                <p className="text-muted text-center mb-0">No hay citas próximas</p>
                            ) : (
                                <Table striped bordered hover responsive className="mb-0">
                                    <thead>
                                        <tr>
                                            <th>Paciente</th>
                                            <th>Médico</th>
                                            <th>Fecha</th>
                                            <th>Hora</th>
                                            <th>Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {citasProximas.map((cita) => (
                                            <tr key={cita.id}>
                                                <td>{cita.pacienteNombre}</td>
                                                <td>{cita.doctorNombre}</td>
                                                <td>{cita.fecha}</td>
                                                <td>{cita.hora}</td>
                                                <td>
                                                    <Badge bg={getEstadoBadge(cita.estado)}>
                                                        {cita.estado}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Dashboard;