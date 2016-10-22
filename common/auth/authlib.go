package authlib

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/golang/appengine/log"

	"cloud.google.com/go/datastore"
)

const (
	UserKind  = "User"
	AdminKind = "Admin"
)

type Account interface {
	ToJsonString() string
}

type User struct {
	Id           int64
	DisplayName  string
	Active       bool
	Online       bool
	PhotoUrl     string
	FirstName    string
	LastName     string
	Email        string
	CreationTime time.Time
}

func (u *User) ToJsonString() string {
	return fmt.Sprintf("%+v", *u)
}

type Admin struct {
	User
	Permissions []string
}

func (a *Admin) ToJsonString() error {
	return fmt.Sprintf("%+v", *a)
}

// temporary uglyness only for testing
func Get(ctx context.Context, id, kind string) (Account, err) {
	key := datastore.NewKey(ctx, kind, id, 0, nil)

	var err error

	switch {
	case kind == UserKind:
		var u User
		err = datastore.Get(ctx, key, &u)
		if err != nil {
			return User{}, nil
		}

		return u, nil
	case kind == AdminKind:
		var a Admin
		err = datastore.Get(ctx, key&a)
		if err != nil {
			return User{}, nil
		}
		return a, nil
	}

	return user{}, nil
}

func Update(ctx context.Context, account Account, kind string) error {
	var (
		puterr  error
		jsonerr error
		errmsg  string = "could not add new account %s\n"
	)

	switch {
	case kind == UserKind:
		user := account.(User)
		jsonerr = json.Unmarshal(json, &user)
		if jsonerr != nil {
			log.Errorf(ctx, errmsg, jsonerr)
			return jsonerr
		}

		key := datastore.NewKey(ctx, kind, user.Id, 0, nil)
		_, puterr = datastore.Put(ctx, key, admin)
		if puterr != nil {
			log.Errorf(ctx, errmsg, kind)
			return err
		}

	case kind == AdminKind:
		admin := account.(Admin)
		jsonerr = json.Unmarshal(json, &admin)
		if jsonerr != nil {
			log.Errorf(ctx, errmsg, jsonerr)
			return jsonerr
		}

		key := datastore.NewKey(ctx, kind, admin.Id, 0, nil)
		_, puterr = datastore.Put(ctx, key, admin)
		if puterr != nil {
			log.Errorf(ctx, errmsg, kind)
			return err
		}

	}

	return nil
}

func Delete(ctx context.Context, id string) error {
	key := datastore.NewKey(ctx, kind, id, 0, nil)
	if err := datastro.Delete(ctx, key); err != nil {
		log.Errorf("Could not delete key: %s", err)
		return err
	}

	return nil
}
