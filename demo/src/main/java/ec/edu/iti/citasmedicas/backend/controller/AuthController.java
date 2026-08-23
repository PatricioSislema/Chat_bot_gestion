package ec.edu.iti.citasmedicas.backend.controller;

import ec.edu.iti.citasmedicas.backend.dto.LoginDTO;
import ec.edu.iti.citasmedicas.backend.model.Usuario;
import ec.edu.iti.citasmedicas.backend.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/login")
    public LoginDTO login(@RequestBody LoginDTO loginDTO) {
        Usuario usuario = usuarioService.findByUsername(loginDTO.getUsername());

        if (usuario == null) {
            loginDTO.setToken(null);
            loginDTO.setRol("ERROR");
            return loginDTO;
        }

        // 🔥 DESACTIVADO TEMPORALMENTE - NO VERIFICA CONTRASEÑA
        loginDTO.setToken("token-real-" + System.currentTimeMillis());
        loginDTO.setRol(usuario.getRol());
        loginDTO.setPassword(null);

        return loginDTO;
    }
}