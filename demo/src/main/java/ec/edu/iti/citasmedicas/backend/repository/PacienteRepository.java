package ec.edu.iti.citasmedicas.backend.repository;

import ec.edu.iti.citasmedicas.backend.model.Paciente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repositorio para gestionar operaciones CRUD de la entidad Paciente.
 */
@Repository
public interface PacienteRepository extends JpaRepository<Paciente, Long> {

    // Buscar paciente por Telegram ID (útil para el chatbot)
    Optional<Paciente> findByTelegramId(String telegramId);

    // Buscar paciente por email
    Optional<Paciente> findByEmail(String email);
}
