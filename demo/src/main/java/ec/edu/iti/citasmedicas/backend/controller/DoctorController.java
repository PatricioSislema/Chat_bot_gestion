package ec.edu.iti.citasmedicas.backend.controller;

import ec.edu.iti.citasmedicas.backend.dto.DoctorDTO;
import ec.edu.iti.citasmedicas.backend.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctores")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    //@PreAuthorize("hasAnyRole('ADMIN', 'EDITOR', 'VIEWER')")
    @GetMapping
    public List<DoctorDTO> listarTodos() {
        return doctorService.listarTodos();
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR', 'VIEWER')")
    @GetMapping("/{id}")
    public ResponseEntity<DoctorDTO> obtenerPorId(@PathVariable Long id) {
        DoctorDTO dto = doctorService.obtenerPorId(id);
        if (dto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(dto);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<?> crear(@RequestBody DoctorDTO dto) {
        DoctorDTO creado = doctorService.crear(dto);
        if (creado == null) {
            return ResponseEntity.badRequest().body("Especialidad no encontrada");
        }
        return ResponseEntity.ok(creado);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody DoctorDTO dto) {
        DoctorDTO actualizado = doctorService.actualizar(id, dto);
        if (actualizado == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(actualizado);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        boolean eliminado = doctorService.eliminar(id);
        if (!eliminado) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }
}