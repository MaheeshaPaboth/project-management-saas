package com.example.demo.dto;

import com.example.demo.entity.TaskPriority;
import jakarta.validation.constraints.NotBlank;

public record CreateTaskRequest(

        @NotBlank(message = "Title cannot be empty!") String title,

        Long projectId,

        TaskPriority priority) {
}