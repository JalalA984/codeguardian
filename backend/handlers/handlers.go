// handlers/handlers.go
package handlers

import (
	"bytes"
	"codeguardian/models"
	"encoding/json"
	"net/http"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func Register(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req models.RegisterRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
			return
		}

		user := models.User{
			Username: req.Username,
			Email:    req.Email,
			Password: string(hashedPassword),
		}

		if err := db.Create(&user).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "User already exists"})
			return
		}

		c.JSON(http.StatusCreated, gin.H{"message": "User created successfully"})
	}
}

func Login(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req models.LoginRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		var user models.User
		if err := db.Where("email = ?", req.Email).First(&user).Error; err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
			return
		}

		if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
			return
		}

		token, err := generateToken(user.ID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"token": token})
	}
}

func SubmitCode(db *gorm.DB) gin.HandlerFunc {
    return func(c *gin.Context) {
        var submission models.CodeSubmission
        if err := c.ShouldBindJSON(&submission); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
            return
        }

        userID, exists := c.Get("user_id")
        if !exists {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
            return
        }

        submission.UserID = userID.(uint)
        submission.Status = "pending"

        if err := db.Create(&submission).Error; err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to submit code"})
            return
        }

        go func() {
            payload, err := json.Marshal(submission)
            if err != nil {
                submission.Status = "error"
                db.Save(&submission)
                return
            }

            resp, err := http.Post("http://ml-service:8000/analyze", "application/json", bytes.NewBuffer(payload))
            if err != nil || resp.StatusCode != http.StatusOK {
                submission.Status = "error"
                db.Save(&submission)
                return
            }
            defer resp.Body.Close()

            var result models.CodeSubmissionResponse
            if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
                submission.Status = "error"
                db.Save(&submission)
                return
            }

            // Assign the results
            submission.Status = result.Status
            submission.Results = result.Results // Now it's correctly assigned
            db.Save(&submission)
        }()

        c.JSON(http.StatusAccepted, gin.H{
            "message": "Code submitted successfully",
            "id":      submission.ID,
        })
    }
}


func GetReviews(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, _ := c.Get("user_id")
		
		var submissions []models.CodeSubmission
		if err := db.Where("user_id = ?", userID).Find(&submissions).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch reviews"})
			return
		}

		c.JSON(http.StatusOK, submissions)
	}
}

func GetReview(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		userID, _ := c.Get("user_id")

		var submission models.CodeSubmission
		if err := db.Where("id = ? AND user_id = ?", id, userID).
			Preload("Results").First(&submission).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Review not found"})
			return
		}

		c.JSON(http.StatusOK, submission)
	}
}