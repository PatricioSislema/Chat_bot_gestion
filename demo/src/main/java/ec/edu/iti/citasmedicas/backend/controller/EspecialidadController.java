package ec.edu.iti.citasmedicas.backend.controller;

import ec.edu.iti.citasmedicas.backend.dto.EspecialidadDTO;
import ec.edu.iti.citasmedicas.backend.service.EspecialidadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para gestionar las especialidades.
 * Expone endpoints para listar, crear, actualizar y eliminar especialidades.
 */
@RestController
@RequestMapping("/api/especialidades")
public class EspecialidadController {

    @Autowired
    private EspecialidadService especialidadService;

    /**
     * Listar todas las especialidades.
     * GET /api/especialidades
     */
    @GetMapping
    public List<EspecialidadDTO> listarTodas() {
        return especialidadService.listarTodas();
    }

    /**
     * Obtener una especialidad por su ID.
     * GET /api/especialidades/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<EspecialidadDTO> obtenerPorId(@PathVariable Long id) {
        EspecialidadDTO dto = especialidadService.obtenerPorId(id);
        if (dto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(dto);
    }

    /**
     * Crear una nueva especialidad.
     * POST /api/especialidades
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EspecialidadDTO crear(@RequestBody EspecialidadDTO dto) {
        return especialidadService.crear(dto);
    }

    /**
     * Actualizar una especialidad existente.
     * PUT /api/especialidades/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<EspecialidadDTO> actualizar(@PathVariable Long id, @RequestBody EspecialidadDTO dto) {
        EspecialidadDTO actualizada = especialidadService.actualizar(id, dto);
        if (actualizada == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(actualizada);
    }

    /**
     * Eliminar una especialidad por su ID.
     * DELETE /api/especialidades/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        boolean eliminada = especialidadService.eliminar(id);
        if (!eliminada) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }
}