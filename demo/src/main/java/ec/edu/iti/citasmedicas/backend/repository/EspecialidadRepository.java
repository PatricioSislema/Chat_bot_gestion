package ec.edu.iti.citasmedicas.backend.repository;

import ec.edu.iti.citasmedicas.backend.model.Especialidad;  // ✅ Cambiado
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repositorio para gestionar operaciones CRUD de la entidad Especialidad.
 * Extiende JpaRepository, que proporciona métodos como:
 * - save()         → Guardar o actualizar una especialidad.
 * - findAll()      → Obtener todas las especialidades.
 * - findById()     → Obtener una especialidad por su ID.
 * - deleteById()   → Eliminar una especialidad por su ID.
 * - count()        → Contar cuántas especialidades hay.
 */
@Repository
public interface EspecialidadRepository extends JpaRepository<Especialidad, Long> {
    // Aquí puedes agregar métodos de consulta personalizados si los necesitas
}