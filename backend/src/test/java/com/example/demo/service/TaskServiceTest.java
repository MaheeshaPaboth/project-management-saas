package com.example.demo.service;

import com.example.demo.entity.Task;
import com.example.demo.entity.TaskStatus;
import com.example.demo.repository.TaskRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private TaskService taskService;

    @Test
    void updateStatus_Success() {

        // ARRANGE
        Task fakeTask = new Task();
        fakeTask.setId(1L);
        fakeTask.setStatus(TaskStatus.TODO);

        when(taskRepository.findById(1L))
                .thenReturn(Optional.of(fakeTask));

        when(taskRepository.save(any(Task.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        // ACT
        Task updatedTask =
                taskService.updateStatus(1L, TaskStatus.DONE);

        // ASSERT
        assertEquals(TaskStatus.DONE, updatedTask.getStatus());

        verify(taskRepository, times(1))
                .save(any(Task.class));
    }

    @Test
    void updateStatus_TaskNotFound() {

        // ARRANGE
        when(taskRepository.findById(99L))
                .thenReturn(Optional.empty());

        // ACT + ASSERT
        assertThrows(RuntimeException.class, () ->
                taskService.updateStatus(99L, TaskStatus.DONE)
        );

        verify(taskRepository, never())
                .save(any(Task.class));
    }
}
