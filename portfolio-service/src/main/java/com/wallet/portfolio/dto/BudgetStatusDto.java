package com.wallet.portfolio.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

public class BudgetStatusDto {
    private String category;
    private BigDecimal limitAmount;
    private BigDecimal spentAmount;
    private double usagePercentage;
    private String status; // ON_TRACK, NEAR_LIMIT, EXCEEDED

    public BudgetStatusDto() {}
    public BudgetStatusDto(String category, BigDecimal limitAmount, BigDecimal spentAmount, double usagePercentage, String status) {
        this.category = category; this.limitAmount = limitAmount; this.spentAmount = spentAmount;
        this.usagePercentage = usagePercentage; this.status = status;
    }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public BigDecimal getLimitAmount() { return limitAmount; }
    public void setLimitAmount(BigDecimal limitAmount) { this.limitAmount = limitAmount; }
    public BigDecimal getSpentAmount() { return spentAmount; }
    public void setSpentAmount(BigDecimal spentAmount) { this.spentAmount = spentAmount; }
    public double getUsagePercentage() { return usagePercentage; }
    public void setUsagePercentage(double usagePercentage) { this.usagePercentage = usagePercentage; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public static BudgetStatusDtoBuilder builder() {
        return new BudgetStatusDtoBuilder();
    }

    public static class BudgetStatusDtoBuilder {
        private String category;
        private BigDecimal limitAmount;
        private BigDecimal spentAmount;
        private double usagePercentage;
        private String status;

        public BudgetStatusDtoBuilder category(String category) { this.category = category; return this; }
        public BudgetStatusDtoBuilder limitAmount(BigDecimal limitAmount) { this.limitAmount = limitAmount; return this; }
        public BudgetStatusDtoBuilder spentAmount(BigDecimal spentAmount) { this.spentAmount = spentAmount; return this; }
        public BudgetStatusDtoBuilder usagePercentage(double usagePercentage) { this.usagePercentage = usagePercentage; return this; }
        public BudgetStatusDtoBuilder status(String status) { this.status = status; return this; }

        public BudgetStatusDto build() {
            return new BudgetStatusDto(category, limitAmount, spentAmount, usagePercentage, status);
        }
    }
}
