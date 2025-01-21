// models/models.go
package models

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Username        string `gorm:"unique;not null"`
	Email           string `gorm:"unique;not null"`
	Password        string `gorm:"not null"`
	CodeSubmissions []CodeSubmission
}

type CodeSubmission struct {
	gorm.Model
	UserID   uint
	Code     string `gorm:"type:text"`
	Language string
	Status   string // pending, analyzing, completed, error
	Score    float64
	Results  []SecurityIssue
}

type SecurityIssue struct {
	gorm.Model
	CodeSubmissionID uint
	Severity         string // high, medium, low
	Message          string
	Line             int
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type RegisterRequest struct {
	Username string `json:"username" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

type CodeSubmissionResponse struct {
	Status  string          `json:"status"`
	Results []SecurityIssue `json:"results"`
}
