package com.example.financeapp.service.impl;

import com.example.financeapp.entity.Goal;
import com.example.financeapp.entity.User;
import com.example.financeapp.repository.GoalRepository;
import com.example.financeapp.service.GoalService;
import com.example.financeapp.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GoalServiceImpl implements GoalService {

    private final GoalRepository goalRepository;
    private final UserService userService;

    @Override
    @Transactional
    public Goal createGoal(Long userId, Goal goal) {
        User user = userService.getUserById(userId);
        goal.setUser(user);
        return goalRepository.save(goal);
    }

    @Override
    @Transactional
    public Goal updateGoal(Long goalId, Goal goalDetails, Long userId) {
        Goal existingGoal = getGoalById(goalId, userId);
        
        existingGoal.setTitle(goalDetails.getTitle());
        existingGoal.setTargetAmount(goalDetails.getTargetAmount());
        existingGoal.setCurrentAmount(goalDetails.getCurrentAmount());
        existingGoal.setTargetDate(goalDetails.getTargetDate());
        
        return goalRepository.save(existingGoal);
    }

    @Override
    @Transactional
    public void deleteGoal(Long goalId, Long userId) {
        Goal goal = getGoalById(goalId, userId);
        goalRepository.delete(goal);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Goal> getUserGoals(Long userId) {
        return goalRepository.findByUserId(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public Goal getGoalById(Long goalId, Long userId) {
        Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new RuntimeException("Goal not found"));
        
        if (!goal.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized to access this goal");
        }
        
        return goal;
    }

    @Override
    @Transactional(readOnly = true)
    public double calculateGoalProximityPercentage(Long goalId, Long userId, double annualInflationRate) {
        Goal goal = getGoalById(goalId, userId);
        BigDecimal adjustedTarget = goal.calculateInflationAdjustedTarget(annualInflationRate);
        
        if (adjustedTarget.compareTo(BigDecimal.ZERO) == 0) {
            return 100.0;
        }
        
        BigDecimal percentage = goal.getCurrentAmount()
                .divide(adjustedTarget, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100));
                
        return percentage.doubleValue();
    }
}
