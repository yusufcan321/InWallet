package com.wallet.portfolio.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "recurring_transactions")
public class RecurringTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @com.fasterxml.jackson.annotation.JsonProperty(access = com.fasterxml.jackson.annotation.JsonProperty.Access.WRITE_ONLY)
    private User user;

    private String description;
    private String category;
    private String type; // INCOME, EXPENSE
    private BigDecimal amount;
    private String frequency;

    @Column(name = "next_run_date")
    private java.time.OffsetDateTime nextRunDate;

    @Column(name = "last_run_date")
    private java.time.OffsetDateTime lastRunDate;

    private boolean active = true;

    public RecurringTransaction() {}
    public RecurringTransaction(Long id, User user, String description, String category, String type, BigDecimal amount, String frequency, java.time.OffsetDateTime nextRunDate, java.time.OffsetDateTime lastRunDate, boolean active) {
        this.id = id; this.user = user; this.description = description; this.category = category; this.type = type;
        this.amount = amount; this.frequency = frequency; this.nextRunDate = nextRunDate; this.lastRunDate = lastRunDate; this.active = active;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public String getFrequency() { return frequency; }
    public void setFrequency(String frequency) { this.frequency = frequency; }
    public java.time.OffsetDateTime getNextRunDate() { return nextRunDate; }
    public void setNextRunDate(java.time.OffsetDateTime nextRunDate) { this.nextRunDate = nextRunDate; }
    public java.time.OffsetDateTime getLastRunDate() { return lastRunDate; }
    public void setLastRunDate(java.time.OffsetDateTime lastRunDate) { this.lastRunDate = lastRunDate; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    @PrePersist
    protected void onCreate() {
        if (nextRunDate == null) {
            nextRunDate = OffsetDateTime.now();
        }
    }
}
