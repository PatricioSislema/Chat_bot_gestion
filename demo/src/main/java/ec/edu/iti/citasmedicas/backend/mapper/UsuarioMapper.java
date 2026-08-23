package ec.edu.iti.citasmedicas.backend.mapper;

import ec.edu.iti.citasmedicas.backend.dto.LoginDTO;
import ec.edu.iti.citasmedicas.backend.model.Usuario;
import org.springframework.stereotype.Component;

/**
 * Mapper para convertir entre Usuario y LoginDTO.
 */
@Component
public class UsuarioMapper {

    /**
     * Convierte un LoginDTO a un Usuario (para registro/login).
     */
    public Usuario toEntity(LoginDTO loginDTO) {
        if (loginDTO == null) return null;
        Usuario usuario = new Usuario();
        usuario.setUsername(loginDTO.getUsername());
        usuario.setPassword(loginDTO.getPassword());
        return usuario;
    }

    /**
     * Convierte un Usuario a un LoginDTO (para respuesta con token).
     */
    public LoginDTO toDTO(Usuario usuario, String token) {
        if (usuario == null) return null;
        LoginDTO loginDTO = new LoginDTO();
        loginDTO.setUsername(usuario.getUsername());
        loginDTO.setRol(usuario.getRol());
        loginDTO.setToken(token);
        return loginDTO;
    }
}