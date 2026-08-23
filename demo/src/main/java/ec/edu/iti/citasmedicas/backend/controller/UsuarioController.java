package ec.edu.iti.citasmedicas.backend.controller;

import ec.edu.iti.citasmedicas.backend.dto.UsuarioDTO;
import ec.edu.iti.citasmedicas.backend.model.Usuario;
import ec.edu.iti.citasmedicas.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // ============================================
    // LISTAR TODOS LOS USUARIOS (SOLO ADMIN)
    // ============================================
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<UsuarioDTO> listarTodos() {
        return usuarioRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // ============================================
    // CREAR USUARIO (SOLO ADMIN)
    // ============================================
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> crear(@RequestBody UsuarioDTO dto) {
        if (usuarioRepository.existsByUsername(dto.getUsername())) {
            return ResponseEntity.status(409).body("El usuario ya existe");
        }

        Usuario usuario = new Usuario();
        usuario.setUsername(dto.getUsername());
        usuario.setPassword(passwordEncoder.encode(dto.getPassword()));
        usuario.setRol(dto.getRol());
        usuario.setActivo(true);

        Usuario guardado = usuarioRepository.save(usuario);
        return ResponseEntity.ok(toDTO(guardado));
    }

    // ============================================
    // ACTUALIZAR USUARIO (SOLO ADMIN)
    // ============================================
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody UsuarioDTO dto) {
        Usuario usuario = usuarioRepository.findById(id).orElse(null);
        if (usuario == null) {
            return ResponseEntity.notFound().build();
        }

        usuario.setUsername(dto.getUsername());
        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            usuario.setPassword(passwordEncoder.encode(dto.getPassword()));
        }
        usuario.setRol(dto.getRol());

        Usuario actualizado = usuarioRepository.save(usuario);
        return ResponseEntity.ok(toDTO(actualizado));
    }

    // ============================================
    // ELIMINAR USUARIO (SOLO ADMIN)
    // ============================================
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (!usuarioRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        usuarioRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ============================================
    // CONVERTIR ENTIDAD A DTO
    // ============================================
    private UsuarioDTO toDTO(Usuario usuario) {
        UsuarioDTO dto = new UsuarioDTO();
        dto.setId(usuario.getId());
        dto.setUsername(usuario.getUsername());
        dto.setRol(usuario.getRol());
        dto.setActivo(usuario.getActivo());
        return dto;
    }
}
