package ec.edu.iti.citasmedicas.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "especialidades")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Especialidad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombre;

    public Especialidad(String nombre) {
        this.nombre = nombre;
    }
}