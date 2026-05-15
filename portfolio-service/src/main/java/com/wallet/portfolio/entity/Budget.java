package com.wallet.portfolio.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "budgets")
public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String category;

    @Column(name = "limit_amount", nullable = false)
    private BigDecimal limitAmount;

    @Column(nullable = false)
    private String period = "MONTHLY";

    public Budget() {}
    public Budget(Long id, User user, String category, BigDecimal limitAmount, String period) {
        this.id = id; this.user = user; this.category = category; this.limitAmount = limitAmount; this.period = period;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public BigDecimal getLimitAmount() { return limitAmount; }
    public void setLimitAmount(BigDecimal limitAmount) { this.limitAmount = limitAmount; }
    public String getPeriod() { return period; }
    public void setPeriod(String period) { this.period = period; }
}
