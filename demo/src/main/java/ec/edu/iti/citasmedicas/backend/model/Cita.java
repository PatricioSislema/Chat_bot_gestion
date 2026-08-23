package ec.edu.iti.citasmedicas.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Entidad que representa una cita médica en el sistema.
 * Mapea la tabla 'citas' de la base de datos.
 */
@Entity
@Table(name = "citas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Cita {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;                      // ID auto-incrementable

    @Column(nullable = false, length = 100)
    private String asunto;                // Asunto de la cita

    @Column(length = 255)
    private String motivo;                // Motivo de la consulta

    @Column(nullable = false)
    private LocalDate fecha;              // Fecha de la cita

    @Column(nullable = false)
    private LocalTime hora;               // Hora de la cita

    @Column(columnDefinition = "TEXT")
    private String sintomas;              // Síntomas del paciente

    @Column(columnDefinition = "TEXT")
    private String enfermedades;          // Enfermedades del paciente

    @Column(columnDefinition = "TEXT")
    private String medicamentos;          // Medicamentos del paciente

    @Column(name = "notas_adicionales", columnDefinition = "TEXT")
    private String notasAdicionales;      // Notas extra

    @Column(length = 20)
    private String estado;                // 'Pendiente', 'Confirmada', 'Atendida', 'Cancelada'

    @ManyToOne
    @JoinColumn(name = "id_paciente", nullable = false)
    private Paciente paciente;            // Relación con Paciente (ManyToOne)

    @ManyToOne
    @JoinColumn(name = "id_doctor", nullable = false)
    private Doctor doctor;                // Relación con Doctor (ManyToOne)

    @ManyToOne
    @JoinColumn(name = "id_horario")
    private Horario horario;              // Relación con Horario (ManyToOne)
}