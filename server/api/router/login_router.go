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

func NewLoginRouter(env *bootstrap.Env, timeout time.Duration, db mongo.Database, group *gin.RouterGroup) {
	ur := repository.NewUserRepository(db, domain.CollectionUser)
	lc := &controller.LoginController{
		LoginUsecase: usecase.NewLoginUsecase(ur, timeout),
		Env:          env,
	}
	group.POST("/login", lc.Login)
}
