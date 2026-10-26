package com.example.demo.dto;

public record TaskDto(
        Long id,
        String title,
        String status,
        String priority) {
}