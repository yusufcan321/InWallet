package com.example.financeapp.controller;

import com.example.financeapp.entity.Goal;
import com.example.financeapp.service.GoalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users/{userId}/goals")
@RequiredArgsConstructor
public class GoalController {

    private final GoalService goalService;

    @PostMapping
    public ResponseEntity<Goal> createGoal(@PathVariable Long userId, @RequestBody Goal goal) {
        return new ResponseEntity<>(goalService.createGoal(userId, goal), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Goal>> getUserGoals(@PathVariable Long userId) {
        return ResponseEntity.ok(goalService.getUserGoals(userId));
    }

    @GetMapping("/{goalId}")
    public ResponseEntity<Goal> getGoalById(@PathVariable Long goalId, @PathVariable Long userId) {
        return ResponseEntity.ok(goalService.getGoalById(goalId, userId));
    }

    @PutMapping("/{goalId}")
    public ResponseEntity<Goal> updateGoal(@PathVariable Long goalId, @PathVariable Long userId, @RequestBody Goal goal) {
        return ResponseEntity.ok(goalService.updateGoal(goalId, goal, userId));
    }

    @GetMapping("/{goalId}/proximity")
    public ResponseEntity<Double> getGoalProximity(
            @PathVariable Long userId, 
            @PathVariable Long goalId, 
            @RequestParam(defaultValue = "0.0") double inflationRate) {
        return ResponseEntity.ok(goalService.calculateGoalProximityPercentage(goalId, userId, inflationRate));
    }

    @DeleteMapping("/{goalId}")
    public ResponseEntity<Void> deleteGoal(@PathVariable Long goalId, @PathVariable Long userId) {
        goalService.deleteGoal(goalId, userId);
        return ResponseEntity.noContent().build();
    }
}
