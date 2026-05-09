package com.example.financeapp.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Entity
@Table(name = "goals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Goal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private BigDecimal targetAmount;

    @Column(nullable = false)
    private BigDecimal currentAmount;

    @Column(nullable = false)
    private LocalDateTime targetDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    /**
     * Calculates the dynamically adjusted target amount based on expected inflation rate and time to target date.
     * @param annualInflationRate e.g., 0.05 for 5%
     * @return the inflation-adjusted target amount
     */
    public BigDecimal calculateInflationAdjustedTarget(double annualInflationRate) {
        if (targetDate == null || targetDate.isBefore(LocalDateTime.now())) {
            return targetAmount;
        }

        long daysUntilTarget = ChronoUnit.DAYS.between(LocalDateTime.now(), targetDate);
        double yearsUntilTarget = daysUntilTarget / 365.25;

        // Formula: targetAmount * (1 + inflationRate)^years
        BigDecimal inflationFactor = BigDecimal.valueOf(Math.pow(1 + annualInflationRate, yearsUntilTarget));
        return this.targetAmount.multiply(inflationFactor);
    }
}
