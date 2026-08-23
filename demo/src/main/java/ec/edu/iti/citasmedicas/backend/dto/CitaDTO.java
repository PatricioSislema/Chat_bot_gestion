package ec.edu.iti.citasmedicas.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CitaDTO {
    private Long id;
    private String asunto;
    private String motivo;
    private LocalDate fecha;
    private LocalTime hora;
    private String sintomas;
    private String enfermedades;
    private String medicamentos;
    private String notasAdicionales;
    private String estado;
    private Long pacienteId;
    private String pacienteNombre;
    private Long doctorId;
    private String doctorNombre;
    private Long horarioId;
}