// main.go
package main

import (
	"codeguardian/config"
	"codeguardian/middleware"
	"codeguardian/routes"
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// Initialize configuration
	config.LoadEnv()
	db := config.InitDB()

	// Initialize router
	r := gin.Default()

	// Configure CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		AllowCredentials: true,
	}))

	// Setup middleware
	r.Use(middleware.Logger())

	// Initialize routes
	api := r.Group("/api")
	routes.SetupAuthRoutes(api, db)
	routes.SetupCodeReviewRoutes(api, db)

	// Start server
	if err := r.Run(":8080"); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}