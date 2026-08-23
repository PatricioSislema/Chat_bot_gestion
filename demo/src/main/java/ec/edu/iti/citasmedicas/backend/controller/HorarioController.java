package ec.edu.iti.citasmedicas.backend.controller;

import ec.edu.iti.citasmedicas.backend.dto.HorarioDTO;
import ec.edu.iti.citasmedicas.backend.service.HorarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/horarios")
public class HorarioController {

    @Autowired
    private HorarioService horarioService;

    @GetMapping
    public List<HorarioDTO> listarTodos() {
        return horarioService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<HorarioDTO> obtenerPorId(@PathVariable Long id) {
        HorarioDTO dto = horarioService.obtenerPorId(id);
        if (dto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(dto);
    }

    /**
     * Obtener horarios disponibles de un doctor en una fecha específica.
     * GET /api/horarios/disponibles?doctorId=1&fecha=2026-08-20
     */
    @GetMapping("/disponibles")
    public List<HorarioDTO> obtenerDisponibles(
            @RequestParam Long doctorId,
            @RequestParam String fecha) {
        LocalDate fechaParsed = LocalDate.parse(fecha);
        return horarioService.obtenerHorariosDisponibles(doctorId, fechaParsed);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<?> crear(@RequestBody HorarioDTO dto) {
        HorarioDTO creado = horarioService.crear(dto);
        if (creado == null) {
            return ResponseEntity.badRequest().body("Doctor no encontrado");
        }
        return ResponseEntity.ok(creado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<HorarioDTO> actualizar(@PathVariable Long id, @RequestBody HorarioDTO dto) {
        HorarioDTO actualizado = horarioService.actualizar(id, dto);
        if (actualizado == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(actualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        boolean eliminado = horarioService.eliminar(id);
        if (!eliminado) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }
}