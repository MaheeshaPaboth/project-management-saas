
package com.example.demo.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

        private final JwtFilter jwtFilter;

        public SecurityConfig(JwtFilter jwtFilter) {
                this.jwtFilter = jwtFilter;
        }

        @Bean
        public SecurityFilterChain securityFilterChain(
                        HttpSecurity http) throws Exception {

                http
                                // Enable CORS
                                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                                // Disable CSRF for stateless JWT authentication
                                .csrf(csrf -> csrf.disable())

                                // Do not create HTTP sessions
                                .sessionManagement(session -> session.sessionCreationPolicy(
                                                SessionCreationPolicy.STATELESS))

                                // Define endpoint permissions
                                .authorizeHttpRequests(auth -> auth
                                                // Allow all OPTIONS preflight requests
                                                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                                                .requestMatchers(
                                                                "/auth/**",
                                                                "/error")
                                                .permitAll()
                                                .anyRequest().authenticated())

                                // Apply JWT authentication filter
                                .addFilterBefore(
                                                jwtFilter,
                                                UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }

        // Password encryption using BCrypt
        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }

        // CORS configuration
        @Bean
        public CorsConfigurationSource corsConfigurationSource() {

                CorsConfiguration configuration = new CorsConfiguration();

                // Allowed frontend origins (Localhost & Vercel Production)
                configuration.setAllowedOrigins(
                                List.of(
                                                "http://localhost:5173",
                                                "http://localhost:5175",
                                                "https://project-management-saas-flax.vercel.app"));

                // Wildcard pattern for Vercel preview/production subdomains
                configuration.setAllowedOriginPatterns(
                                List.of(
                                                "http://localhost:[*]",
                                                "https://*.vercel.app"));

                // Allowed HTTP methods
                configuration.setAllowedMethods(
                                List.of(
                                                "GET",
                                                "POST",
                                                "PUT",
                                                "DELETE",
                                                "PATCH",
                                                "OPTIONS"));

                // Allowed request headers
                configuration.setAllowedHeaders(
                                List.of(
                                                "Authorization",
                                                "Content-Type",
                                                "X-Requested-With",
                                                "Accept",
                                                "Origin",
                                                "Access-Control-Request-Method",
                                                "Access-Control-Request-Headers"));

                // Expose Authorization header so frontend can read it if returned
                configuration.setExposedHeaders(
                                List.of("Authorization"));

                // Allow credentials (Authorization headers, cookies)
                configuration.setAllowCredentials(true);

                // Preflight cache duration (1 hour)
                configuration.setMaxAge(3600L);

                // Apply CORS rules to all endpoints
                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

                source.registerCorsConfiguration(
                                "/**",
                                configuration);

                return source;
        }
}
