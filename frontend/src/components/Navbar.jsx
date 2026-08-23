import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button, Badge } from 'react-bootstrap';

function NavBar() {
    const navigate = useNavigate();
    const rol = localStorage.getItem('rol');

    // ============================================
    // Cerrar sesión: elimina token y redirige al login
    // ============================================
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('rol');
        navigate('/login');
    };

    // ============================================
    // Mostrar el rol con colores según el tipo
    // ============================================
    const getRolBadge = () => {
        if (rol === 'ADMIN') return <Badge bg="danger">ADMIN</Badge>;
        if (rol === 'EDITOR') return <Badge bg="warning">EDITOR</Badge>;
        return <Badge bg="secondary">VIEWER</Badge>;
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
            <Container>
                {/* ============================================
            LOGO / NOMBRE DE LA CLÍNICA
        ============================================ */}
                <Navbar.Brand as={Link} to="/dashboard">
                    🏥 Salud Para Todos
                </Navbar.Brand>

                {/* ============================================
            BOTÓN PARA MENÚ EN PANTALLAS PEQUEÑAS
        ============================================ */}
                <Navbar.Toggle aria-controls="basic-navbar-nav" />

                {/* ============================================
            ENLACES DE NAVEGACIÓN
        ============================================ */}
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                        <Nav.Link as={Link} to="/especialidades">Especialidades</Nav.Link>
                        <Nav.Link as={Link} to="/medicos">Médicos</Nav.Link>
                        <Nav.Link as={Link} to="/pacientes">Pacientes</Nav.Link>
                        <Nav.Link as={Link} to="/horarios">Horarios</Nav.Link>
                        <Nav.Link as={Link} to="/citas">Citas</Nav.Link>
                        {rol === 'ADMIN' && (
                            <Nav.Link as={Link} to="/usuarios">Usuarios</Nav.Link>
                        )}
                    </Nav>

                    {/* ============================================
            ROL DEL USUARIO Y BOTÓN DE SALIR
          ============================================ */}
                    <div className="d-flex align-items-center gap-3">
                        <span className="text-light">
                            {getRolBadge()}
                        </span>
                        <Button variant="outline-light" size="sm" onClick={handleLogout}>
                            Cerrar sesión
                        </Button>
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavBar;