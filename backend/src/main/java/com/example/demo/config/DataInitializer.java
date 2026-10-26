package com.example.demo.config;

import com.example.demo.Role;
import com.example.demo.entity.Task;
import com.example.demo.entity.TaskPriority;
import com.example.demo.entity.TaskStatus;
import com.example.demo.model.Project;
import com.example.demo.model.User;
import com.example.demo.repository.ProjectRepository;
import com.example.demo.repository.TaskRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner seedData(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            ProjectRepository projectRepository,
            TaskRepository taskRepository) {

        return args -> {

            // ── 1. Default user ──────────────────────────────────────────
            String defaultEmail = "nimal@gmail.com";
            if (userRepository.findByEmail(defaultEmail).isEmpty()) {
                User user = new User();
                user.setName("Nimal User");
                user.setEmail(defaultEmail);
                user.setPassword(passwordEncoder.encode("password789"));
                user.setRole(Role.OWNER);
                userRepository.save(user);
                System.out.println("✔ Created default user: " + defaultEmail);
            }

            // ── 2. Seed projects if none exist ───────────────────────────
            if (projectRepository.count() == 0) {

                Project p1 = new Project();
                p1.setName("Demo Project");
                p1.setDescription("Auto-seeded starter project");
                p1.setOrganizationId(1L);
                p1 = projectRepository.save(p1);

                Project p2 = new Project();
                p2.setName("Backend API");
                p2.setDescription("Spring Boot REST API project");
                p2.setOrganizationId(1L);
                projectRepository.save(p2);

                System.out.println("✔ Seeded 2 demo projects");
            }

            // ── 3. Seed tasks if none exist ───────────────────────────
            if (taskRepository.count() == 0) {
                var allProjects = projectRepository.findAll();
                if (!allProjects.isEmpty()) {
                    Project firstProject = allProjects.get(0);
                    Object[][] taskData = {
                        {"Set up project structure",  TaskStatus.TODO,        TaskPriority.HIGH},
                        {"Implement login flow",       TaskStatus.IN_PROGRESS, TaskPriority.URGENT},
                        {"Code review – auth module",  TaskStatus.REVIEW,      TaskPriority.MEDIUM},
                        {"Deploy to staging",          TaskStatus.DONE,        TaskPriority.LOW},
                    };

                    for (Object[] td : taskData) {
                        Task t = new Task();
                        t.setTitle((String)  td[0]);
                        t.setStatus((TaskStatus)   td[1]);
                        t.setPriority((TaskPriority) td[2]);
                        t.setProjectId(firstProject.getId());
                        taskRepository.save(t);
                    }
                    System.out.println("✔ Seeded 4 sample tasks in \"" + firstProject.getName() + "\"");
                }
            }
        };
    }
}

