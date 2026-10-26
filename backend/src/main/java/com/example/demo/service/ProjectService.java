package com.example.demo.service;

import com.example.demo.model.Project;
import com.example.demo.repository.ProjectRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    private String getLoggedInEmail() {
        return SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();
    }

    public Project createProject(Project project) {

        String userEmail = getLoggedInEmail();

        System.out.println(
                "User " + userEmail + " is creating a project!");

        return projectRepository.save(project);
    }

    public List<Project> getProjects(Long orgId) {
        return projectRepository.findByOrganizationId(orgId);
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }
}