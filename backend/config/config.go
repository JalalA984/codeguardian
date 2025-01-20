// config/config.go
package config

import (
	"codeguardian/models" // Add this import
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func LoadEnv() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}
}

func InitDB() *gorm.DB {
	dsn := "host=" + os.Getenv("DB_HOST") +
		" user=" + os.Getenv("DB_USER") +
		" password=" + os.Getenv("DB_PASSWORD") +
		" dbname=" + os.Getenv("DB_NAME") +
		" port=" + os.Getenv("DB_PORT") +
		" sslmode=disable"

	log.Println("Before gorm open")
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	log.Println("After gorm open")
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Auto migrate models
	db.AutoMigrate(&models.User{}, &models.CodeSubmission{}, &models.SecurityIssue{}) // Updated this line

	return db
}
