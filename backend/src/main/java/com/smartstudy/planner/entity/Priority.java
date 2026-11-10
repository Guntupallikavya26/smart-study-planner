package com.smartstudy.planner.entity;

/**
 * Priority level for study tasks.
 * Mapped as a String in the database via @Enumerated(EnumType.STRING).
 */
public enum Priority {
    LOW,
    MEDIUM,
    HIGH
}

