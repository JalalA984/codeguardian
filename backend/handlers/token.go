// handlers/token.go
package handlers

import (
    "os"
    "time"
    "github.com/golang-jwt/jwt/v5"
)

func generateToken(userID uint) (string, error) {
    // Create the token
    token := jwt.New(jwt.SigningMethodHS256)

    // Set claims
    claims := token.Claims.(jwt.MapClaims)
    claims["user_id"] = userID
    claims["exp"] = time.Now().Add(time.Hour * 72).Unix() // Token expires in 72 hours

    // Generate signed token
    tokenString, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
    if err != nil {
        return "", err
    }

    return tokenString, nil
}