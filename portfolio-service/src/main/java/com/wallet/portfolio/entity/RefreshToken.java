package com.wallet.portfolio.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "refresh_tokens")
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @Column(nullable = false, unique = true)
    private String token;

    @Column(nullable = false)
    private java.time.Instant expiryDate;

    public RefreshToken() {}
    public RefreshToken(Long id, User user, String token, java.time.Instant expiryDate) {
        this.id = id; this.user = user; this.token = token; this.expiryDate = expiryDate;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public java.time.Instant getExpiryDate() { return expiryDate; }
    public void setExpiryDate(java.time.Instant expiryDate) { this.expiryDate = expiryDate; }

    public static RefreshTokenBuilder builder() {
        return new RefreshTokenBuilder();
    }

    public static class RefreshTokenBuilder {
        private Long id;
        private User user;
        private String token;
        private java.time.Instant expiryDate;

        public RefreshTokenBuilder id(Long id) { this.id = id; return this; }
        public RefreshTokenBuilder user(User user) { this.user = user; return this; }
        public RefreshTokenBuilder token(String token) { this.token = token; return this; }
        public RefreshTokenBuilder expiryDate(java.time.Instant expiryDate) { this.expiryDate = expiryDate; return this; }

        public RefreshToken build() {
            return new RefreshToken(id, user, token, expiryDate);
        }
    }
}
