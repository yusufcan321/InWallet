package com.example.financeapp.service;

import com.example.financeapp.entity.Goal;
import java.util.List;

public interface GoalService {
    Goal createGoal(Long userId, Goal goal);
    Goal updateGoal(Long goalId, Goal goal, Long userId);
    void deleteGoal(Long goalId, Long userId);
    List<Goal> getUserGoals(Long userId);
    Goal getGoalById(Long goalId, Long userId);
    
    /**
     * Calculates the percentage of how close the user is to the inflation-adjusted goal target.
     * @param goalId the goal ID
     * @param userId the user ID
     * @param annualInflationRate e.g., 0.05 for 5% inflation
     * @return the proximity percentage (e.g., 45.5)
     */
    double calculateGoalProximityPercentage(Long goalId, Long userId, double annualInflationRate);
}
