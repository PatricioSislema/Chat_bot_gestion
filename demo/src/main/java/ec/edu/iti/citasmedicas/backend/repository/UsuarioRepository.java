package ec.edu.iti.citasmedicas.backend.repository;

import ec.edu.iti.citasmedicas.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    /**
     * Busca un usuario por su nombre de usuario (username).
     * Usado por Spring Security para autenticación.
     */
    Optional<Usuario> findByUsername(String username);

    /**
     * Verifica si existe un usuario con ese username.
     */
    boolean existsByUsername(String username);
}