package ec.edu.iti.citasmedicas.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Entidad que representa un horario disponible de un médico.
 * Mapea la tabla 'horarios' de la base de datos.
 */
@Entity
@Table(name = "horarios")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Horario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;                      // ID auto-incrementable

    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;                // Relación con Doctor (ManyToOne)

    @Column(nullable = false)
    private LocalDate fecha;              // Fecha del horario

    @Column(name = "hora_inicio", nullable = false)
    private LocalTime horaInicio;         // Hora de inicio (ej: 09:00)

    @Column(name = "hora_fin", nullable = false)
    private LocalTime horaFin;            // Hora de fin (ej: 09:30)

    @Column(nullable = false)
    private Boolean disponible;           // true = libre, false = ocupado
}