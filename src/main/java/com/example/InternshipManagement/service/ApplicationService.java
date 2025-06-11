package com.example.InternshipManagement.service;

import com.example.InternshipManagement.ApplicationNotFoundException;
import com.example.InternshipManagement.model.Application;
import com.example.InternshipManagement.repository.ApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    @Autowired ApplicationRepository applicationRepository;

    @Autowired
    public ApplicationService(ApplicationRepository applicationRepository) {
        this.applicationRepository = applicationRepository;
    }


    public Application saveApplication(Application application) {
        return applicationRepository.save(application);
    }


    public Application getApplicationByUniqueId(String uniqueId) {

        return applicationRepository.findByUniqueId(uniqueId)
                .orElseThrow(() -> new ApplicationNotFoundException("Application with unique ID " + uniqueId + " not found."));
    }


    public List<String> getAllUniqueIds() {

        return applicationRepository.findAll()
                .stream()
                .map(Application::getUniqueId)
                .collect(Collectors.toList());
    }
}