package com.wallet.portfolio.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "goals")
public class Goal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @com.fasterxml.jackson.annotation.JsonProperty(access = com.fasterxml.jackson.annotation.JsonProperty.Access.WRITE_ONLY)
    private User user;

    private String name;
    @Column(nullable = false)
    private String type = "OTHER";
    private Integer priority = 1;
    private BigDecimal initialPrice;
    private BigDecimal currentTargetPrice;
    private BigDecimal expectedInflationRate;

    @com.fasterxml.jackson.annotation.JsonFormat(shape = com.fasterxml.jackson.annotation.JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSX")
    private java.time.OffsetDateTime targetDate;

    private BigDecimal completionPercentage;
    private BigDecimal targetAmount;
    private BigDecimal currentAmount;

    public Goal() {}
    public Goal(Long id, User user, String name, String type, Integer priority, BigDecimal initialPrice, BigDecimal currentTargetPrice, BigDecimal expectedInflationRate, java.time.OffsetDateTime targetDate, BigDecimal completionPercentage, BigDecimal targetAmount, BigDecimal currentAmount) {
        this.id = id; this.user = user; this.name = name; this.type = type; this.priority = priority;
        this.initialPrice = initialPrice; this.currentTargetPrice = currentTargetPrice; this.expectedInflationRate = expectedInflationRate;
        this.targetDate = targetDate; this.completionPercentage = completionPercentage; this.targetAmount = targetAmount; this.currentAmount = currentAmount;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public Integer getPriority() { return priority; }
    public void setPriority(Integer priority) { this.priority = priority; }
    public BigDecimal getInitialPrice() { return initialPrice; }
    public void setInitialPrice(BigDecimal initialPrice) { this.initialPrice = initialPrice; }
    public BigDecimal getCurrentTargetPrice() { return currentTargetPrice; }
    public void setCurrentTargetPrice(BigDecimal currentTargetPrice) { this.currentTargetPrice = currentTargetPrice; }
    public BigDecimal getExpectedInflationRate() { return expectedInflationRate; }
    public void setExpectedInflationRate(BigDecimal expectedInflationRate) { this.expectedInflationRate = expectedInflationRate; }
    public java.time.OffsetDateTime getTargetDate() { return targetDate; }
    public void setTargetDate(java.time.OffsetDateTime targetDate) { this.targetDate = targetDate; }
    public BigDecimal getCompletionPercentage() { return completionPercentage; }
    public void setCompletionPercentage(BigDecimal completionPercentage) { this.completionPercentage = completionPercentage; }
    public BigDecimal getTargetAmount() { return targetAmount; }
    public void setTargetAmount(BigDecimal targetAmount) { this.targetAmount = targetAmount; }
    public BigDecimal getCurrentAmount() { return currentAmount; }
    public void setCurrentAmount(BigDecimal currentAmount) { this.currentAmount = currentAmount; }
}
