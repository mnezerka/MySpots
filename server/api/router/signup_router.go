package router

import (
	"mnezerka/MySpots/server/api/controller"
	"mnezerka/MySpots/server/bootstrap"
	"mnezerka/MySpots/server/domain"
	"mnezerka/MySpots/server/mongo"
	"mnezerka/MySpots/server/repository"
	"mnezerka/MySpots/server/usecase"
	"time"

	"github.com/gin-gonic/gin"
)

func NewSignupRouter(env *bootstrap.Env, timeout time.Duration, db mongo.Database, group *gin.RouterGroup) {
	ur := repository.NewUserRepository(db, domain.CollectionUser)
	sc := controller.SignupController{
		SignupUsecase: usecase.NewSignupUsecase(ur, timeout),
		Env:           env,
	}
	group.POST("/signup", sc.Signup)
}
