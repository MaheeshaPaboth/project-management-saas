
package com.example.demo.controller;

import com.example.demo.model.Project;
import com.example.demo.service.ProjectService;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PostMapping
    public Project create(@RequestBody Project project) {
        return projectService.createProject(project);
    }

    @GetMapping("/org/{orgId}")
    public List<Project> getByOrg(@PathVariable Long orgId) {
        return projectService.getProjects(orgId);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN')")
    public String delete(@PathVariable Long id) {
        projectService.deleteProject(id);
        return "Project deleted!";
    }
}
