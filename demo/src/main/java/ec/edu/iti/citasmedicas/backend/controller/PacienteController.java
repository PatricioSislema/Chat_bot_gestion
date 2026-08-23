package ec.edu.iti.citasmedicas.backend.controller;

import ec.edu.iti.citasmedicas.backend.dto.PacienteDTO;
import ec.edu.iti.citasmedicas.backend.service.PacienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pacientes")
public class PacienteController {

    @Autowired
    private PacienteService pacienteService;

    @GetMapping
    public List<PacienteDTO> listarTodos() {
        return pacienteService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PacienteDTO> obtenerPorId(@PathVariable Long id) {
        PacienteDTO dto = pacienteService.obtenerPorId(id);
        if (dto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(dto);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PacienteDTO crear(@RequestBody PacienteDTO dto) {
        return pacienteService.crear(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PacienteDTO> actualizar(@PathVariable Long id, @RequestBody PacienteDTO dto) {
        PacienteDTO actualizado = pacienteService.actualizar(id, dto);
        if (actualizado == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(actualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        boolean eliminado = pacienteService.eliminar(id);
        if (!eliminado) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }
}