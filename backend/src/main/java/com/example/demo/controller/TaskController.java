package com.example.demo.controller;

import com.example.demo.dto.CreateTaskRequest;
import com.example.demo.dto.TaskDto;
import com.example.demo.entity.Task;
import com.example.demo.entity.TaskStatus;
import com.example.demo.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping("/projects/{projectId}/tasks")
    public List<Task> getProjectTasks(@PathVariable Long projectId) {
        return taskService.getTasksByProject(projectId);
    }

    @PostMapping("/projects/{projectId}/tasks")
    public TaskDto createTask(
            @PathVariable Long projectId,
            @Valid @RequestBody CreateTaskRequest request) {

        Task task = new Task();

        task.setTitle(request.title());
        task.setProjectId(projectId);

        if (request.priority() != null) {
            task.setPriority(request.priority());
        }

        Task savedTask = taskService.createTask(task);

        return new TaskDto(
                savedTask.getId(),
                savedTask.getTitle(),
                savedTask.getStatus().name(),
                savedTask.getPriority().name());
    }

    @PutMapping("/tasks/{taskId}/status")
    public Task updateStatus(
            @PathVariable Long taskId,
            @RequestParam TaskStatus status) {

        return taskService.updateStatus(taskId, status);
    }

    @DeleteMapping("/tasks/{taskId}")
    public String deleteTask(@PathVariable Long taskId) {
        taskService.deleteTask(taskId);
        return "Task deleted successfully";
    }
}