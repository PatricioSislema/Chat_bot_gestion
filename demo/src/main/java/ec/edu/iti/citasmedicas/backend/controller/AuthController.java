package ec.edu.iti.citasmedicas.backend.controller;

import ec.edu.iti.citasmedicas.backend.dto.LoginDTO;
import ec.edu.iti.citasmedicas.backend.model.Usuario;
import ec.edu.iti.citasmedicas.backend.security.JwtService;
import ec.edu.iti.citasmedicas.backend.service.UsuarioService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/login")
    public ResponseEntity<LoginDTO> login(@RequestBody LoginDTO loginDTO) {

        Usuario usuario = usuarioService.findByUsername(loginDTO.getUsername());

        // Usuario no existe
        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Usuario inactivo
        if (!usuario.getActivo()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Verificar contraseña contra BCrypt
        boolean passwordCorrecta = usuarioService.verificarContraseña(
                loginDTO.getPassword(),
                usuario.getPassword());

        // Contraseña incorrecta
        if (!passwordCorrecta) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Generar JWT real
        String token = jwtService.generateToken(usuario);

        loginDTO.setToken(token);
        loginDTO.setRol(usuario.getRol());
        loginDTO.setPassword(null);

        return ResponseEntity.ok(loginDTO);
    }
}