package com.example.InternshipManagement.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "applications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name cannot be blank")
    private String name;

    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Invalid email format")
    private String email;

    @Column(unique = true)
    private String uniqueId;

    @NotBlank(message = "College name cannot be blank")
    private String collegeName;

    @NotBlank(message = "College enrollment number cannot be blank")
    private String collegeEnrollmentNumber;

    @NotBlank(message = "Phone number cannot be blank")
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be 10 digits")
    private String phoneNumber;


    @PrePersist
    public void generateUniqueId() {
        if (this.uniqueId == null) {
            this.uniqueId = UUID.randomUUID().toString();
        }
    }
}