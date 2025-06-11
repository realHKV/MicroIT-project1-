package com.example.InternshipManagement.controller;

import com.example.InternshipManagement.model.Application;
import com.example.InternshipManagement.service.ApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;


import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
public class ApplicationController {

    private final ApplicationService applicationService;

    @Autowired
    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }


    @PostMapping
    public ResponseEntity<Application> createApplication(@Valid @RequestBody Application application) {
        // Calls the service layer to save the application. The uniqueId will be generated automatically.
        Application savedApplication = applicationService.saveApplication(application);
        return new ResponseEntity<>(savedApplication, HttpStatus.CREATED); // Returns 201 Created status code.
    }

    @GetMapping("/{certificateId}")
    public ResponseEntity<Application> getApplicationByCertificateId(@PathVariable String certificateId) {
        // Calls the service layer to retrieve the application by its unique ID.
        Application application = applicationService.getApplicationByUniqueId(certificateId);
        return new ResponseEntity<>(application, HttpStatus.OK); // Returns 200 OK status code.
    }


    @GetMapping
    public ResponseEntity<List<String>> getAllCertificateIds() {
        // Calls the service layer to get all unique IDs.
        List<String> uniqueIds = applicationService.getAllUniqueIds();
        return new ResponseEntity<>(uniqueIds, HttpStatus.OK); // Returns 200 OK status code.
    }
}