// routes/routes.go
package routes

import (
	"codeguardian/handlers"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupAuthRoutes(r *gin.RouterGroup, db *gorm.DB) {
	auth := r.Group("/auth")
	{
		auth.POST("/register", handlers.Register(db))
		auth.POST("/login", handlers.Login(db))
	}
}

func SetupCodeReviewRoutes(r *gin.RouterGroup, db *gorm.DB) {
	code := r.Group("/code")
	{
		code.POST("/submit", handlers.SubmitCode(db))
		code.GET("/reviews", handlers.GetReviews(db))
		code.GET("/review/:id", handlers.GetReview(db))
	}
}