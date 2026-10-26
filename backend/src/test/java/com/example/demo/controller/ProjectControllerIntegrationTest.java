package com.example.demo.controller;

import com.example.demo.model.Project;
import com.example.demo.model.User;
import com.example.demo.repository.ProjectRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;




import static org.hamcrest.Matchers.containsString;

import static org.mockito.Mockito.times;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
class ProjectControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @MockitoBean
    private com.example.demo.service.ProjectService projectService;

    private String ownerToken;
    private String memberToken;
    private Long projectId;
    private final Long orgId = 1L;

    @BeforeEach
    void setUp() {
        // clean DB
        projectRepository.deleteAll();
        userRepository.deleteAll();

        // create OWNER user
        User owner = new User();
        owner.setName("Owner User");
        owner.setEmail("owner@example.com");
        owner.setPassword(passwordEncoder.encode("ownerPass"));
        owner.setRole(com.example.demo.Role.OWNER);
        userRepository.save(owner);
        ownerToken = jwtService.generateToken(owner.getEmail());

        // create MEMBER user
        User member = new User();
        member.setName("Member User");
        member.setEmail("member@example.com");
        member.setPassword(passwordEncoder.encode("memberPass"));
        member.setRole(com.example.demo.Role.MEMBER);
        userRepository.save(member);
        memberToken = jwtService.generateToken(member.getEmail());

        // create a project belonging to orgId
        Project project = new Project();
        project.setName("Test Project");
        project.setDescription("Desc");
        project.setOrganizationId(orgId);
        project = projectRepository.save(project);
        projectId = project.getId();
    }

    @Test
    void validLogin_returnsToken() throws Exception {
        String loginJson = "{\"email\":\"owner@example.com\",\"password\":\"ownerPass\"}";
        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists());
    }

    @Test
    void deleteWithOwnerToken_successful() throws Exception {
        mockMvc.perform(delete("/projects/" + projectId)
                .header("Authorization", "Bearer " + ownerToken))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("Project deleted")));
    }

    @Test
    void deleteWithMemberToken_forbidden() throws Exception {
        mockMvc.perform(delete("/projects/" + projectId)
                .header("Authorization", "Bearer " + memberToken))
                .andExpect(status().isForbidden());
    }

    @Test
    void deleteWithoutToken_unauthorized() throws Exception {
        mockMvc.perform(delete("/projects/" + projectId))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void getProjectsCaching_secondCallHitsCache() throws Exception {
        // first call – should invoke service
        mockMvc.perform(get("/projects/org/" + orgId)
                .header("Authorization", "Bearer " + ownerToken))
                .andExpect(status().isOk());

        // second call – service should not be invoked again because of cache
        mockMvc.perform(get("/projects/org/" + orgId)
                .header("Authorization", "Bearer " + ownerToken))
                .andExpect(status().isOk());

        // verify that getProjects was called exactly once (cache hit on second request)
        Mockito.verify(projectService, times(1)).getProjects(orgId);
    }
}
