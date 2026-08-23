package ec.edu.iti.citasmedicas.backend.controller;

import ec.edu.iti.citasmedicas.backend.dto.CitaDTO;
import ec.edu.iti.citasmedicas.backend.service.CitaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/citas")
public class CitaController {

    @Autowired
    private CitaService citaService;

    @GetMapping
    public List<CitaDTO> listarTodas() {
        return citaService.listarTodas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CitaDTO> obtenerPorId(@PathVariable Long id) {
        CitaDTO dto = citaService.obtenerPorId(id);
        if (dto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/paciente/{pacienteId}")
    public List<CitaDTO> listarPorPaciente(@PathVariable Long pacienteId) {
        return citaService.listarPorPaciente(pacienteId);
    }

    @GetMapping("/doctor/{doctorId}")
    public List<CitaDTO> listarPorDoctor(@PathVariable Long doctorId) {
        return citaService.listarPorDoctor(doctorId);
    }

    @GetMapping("/fecha")
    public List<CitaDTO> listarPorFecha(@RequestParam String fecha) {
        LocalDate fechaParsed = LocalDate.parse(fecha);
        return citaService.listarPorFecha(fechaParsed);
    }

    @GetMapping("/estado")
    public List<CitaDTO> listarPorEstado(@RequestParam String estado) {
        return citaService.listarPorEstado(estado);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<?> crear(@RequestBody CitaDTO dto) {
        CitaDTO creada = citaService.crear(dto);
        if (creada == null) {
            return ResponseEntity.badRequest().body("Datos inválidos: paciente, doctor o horario no encontrado");
        }
        return ResponseEntity.ok(creada);
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<CitaDTO> actualizarEstado(@PathVariable Long id, @RequestParam String estado) {
        CitaDTO actualizada = citaService.actualizarEstado(id, estado);
        if (actualizada == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(actualizada);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelarCita(@PathVariable Long id) {
        boolean cancelada = citaService.cancelarCita(id);
        if (!cancelada) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }
}