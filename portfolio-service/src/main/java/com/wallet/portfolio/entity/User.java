package com.wallet.portfolio.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "users")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    private String firstName;
    private String lastName;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role = "ROLE_USER";

    @Column(nullable = false)
    private boolean isEnabled = true;

    private String verificationCode;
    private BigDecimal monthlyIncome;
    private BigDecimal monthlyExpense;
    
    @Column(name = "created_at")
    private java.time.OffsetDateTime createdAt;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private java.util.List<Asset> assets = new java.util.ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private java.util.List<Goal> goals = new java.util.ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private java.util.List<Transaction> transactions = new java.util.ArrayList<>();

    public User() {}
    public User(Long id, String username, String email, String firstName, String lastName, String password, String role, boolean isEnabled, String verificationCode, BigDecimal monthlyIncome, BigDecimal monthlyExpense, java.time.OffsetDateTime createdAt) {
        this.id = id; this.username = username; this.email = email; this.firstName = firstName; this.lastName = lastName;
        this.password = password; this.role = role; this.isEnabled = isEnabled; this.verificationCode = verificationCode;
        this.monthlyIncome = monthlyIncome; this.monthlyExpense = monthlyExpense; this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public boolean isEnabled() { return isEnabled; }
    public void setEnabled(boolean enabled) { isEnabled = enabled; }
    public String getVerificationCode() { return verificationCode; }
    public void setVerificationCode(String verificationCode) { this.verificationCode = verificationCode; }
    public BigDecimal getMonthlyIncome() { return monthlyIncome; }
    public void setMonthlyIncome(BigDecimal monthlyIncome) { this.monthlyIncome = monthlyIncome; }
    public BigDecimal getMonthlyExpense() { return monthlyExpense; }
    public void setMonthlyExpense(BigDecimal monthlyExpense) { this.monthlyExpense = monthlyExpense; }
    public java.time.OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(java.time.OffsetDateTime createdAt) { this.createdAt = createdAt; }
    public java.util.List<Asset> getAssets() { return assets; }
    public void setAssets(java.util.List<Asset> assets) { this.assets = assets; }
    public java.util.List<Goal> getGoals() { return goals; }
    public void setGoals(java.util.List<Goal> goals) { this.goals = goals; }
    public java.util.List<Transaction> getTransactions() { return transactions; }
    public void setTransactions(java.util.List<Transaction> transactions) { this.transactions = transactions; }
    
    public static UserBuilder builder() {
        return new UserBuilder();
    }

    public static class UserBuilder {
        private Long id;
        private String username;
        private String email;
        private String firstName;
        private String lastName;
        private String password;
        private String role = "ROLE_USER";
        private boolean isEnabled = true;
        private String verificationCode;
        private BigDecimal monthlyIncome;
        private BigDecimal monthlyExpense;
        private java.time.OffsetDateTime createdAt;

        public UserBuilder id(Long id) { this.id = id; return this; }
        public UserBuilder username(String username) { this.username = username; return this; }
        public UserBuilder email(String email) { this.email = email; return this; }
        public UserBuilder firstName(String firstName) { this.firstName = firstName; return this; }
        public UserBuilder lastName(String lastName) { this.lastName = lastName; return this; }
        public UserBuilder password(String password) { this.password = password; return this; }
        public UserBuilder role(String role) { this.role = role; return this; }
        public UserBuilder isEnabled(boolean isEnabled) { this.isEnabled = isEnabled; return this; }
        public UserBuilder verificationCode(String verificationCode) { this.verificationCode = verificationCode; return this; }
        public UserBuilder monthlyIncome(BigDecimal monthlyIncome) { this.monthlyIncome = monthlyIncome; return this; }
        public UserBuilder monthlyExpense(BigDecimal monthlyExpense) { this.monthlyExpense = monthlyExpense; return this; }
        public UserBuilder createdAt(java.time.OffsetDateTime createdAt) { this.createdAt = createdAt; return this; }

        public User build() {
            return new User(id, username, email, firstName, lastName, password, role, isEnabled, verificationCode, monthlyIncome, monthlyExpense, createdAt);
        }
    }

    @PrePersist
    protected void onCreate() {
        createdAt = java.time.OffsetDateTime.now();
    }
}
