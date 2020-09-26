const db = require('../models')
const User = db.User
const Comment = db.Comment
const Restaurant = db.Restaurant
const Favorite = db.Favorite
const Like = db.Like
const Followship = db.Followship

const userService = {
  getUser: (req, res, callback) => {
    return User.findByPk(req.params.id, {
      include: [
        { model: Comment, include: [Restaurant] },
        { model: Restaurant, as: 'FavoritedRestaurants' },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    }).then(user => {
      const uniqueComments = user.toJSON().Comments.map(e => e['RestaurantId'])
        .map((e, i, final) => final.indexOf(e) === i && i)
        .filter(e => user.toJSON().Comments[e])
        .map(e => user.toJSON().Comments[e])

      callback({ profile: user.toJSON(), uniqueComments: uniqueComments })
    })
  },
  putUser: (req, res, callback) => {
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return User.findByPk(req.params.id).then((user) => {
          user.update({
            name: req.body.name,
            image: img.data.link
          }).then((user) => {
            callback({ status: 'success', message: 'user was successfully to update' })
          })
        })
      })
    } else {
      return User.findByPk(req.params.id).then((user) => {
        user.update({
          name: req.body.name
        }).then((user) => {
          callback({ status: 'success', message: 'user was successfully to update' })
        })
      })
    }
  },
  addFavorite: (req, res, callback) => {
    return Favorite.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    })
      .then(() => {
        callback({ status: 'success', message: '' })
      })
  },
  removeFavorite: (req, res, callback) => {
    return Favorite.findOne({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      }
    })
      .then((favorite) => {
        favorite.destroy()
          .then(() => {
            callback({ status: 'success', message: '' })
          })
      })
  },
  addLike: (req, res, callback) => {
    return Like.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    })
      .then((like) => {
        callback({ status: 'success', message: '' })
      })
  },
  removeLike: (req, res, callback) => {
    return Like.findOne({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      }
    })
      .then((like) => {
        like.destroy()
          .then((like) => {
            callback({ status: 'success', message: '' })
          })
      })
  },
  getTopUser: (req, res, callback) => {
    return User.findAll({
      include: [
        { model: User, as: 'Followers' }
      ]
    }).then(users => {
      users = users.map(user => ({
        ...user.dataValues,
        FollowerCount: user.Followers.length,
        isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
      }))
      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)
      callback({ users: users })
    })
  },
  addFollowing: (req, res, callback) => {
    return Followship.create({
      followerId: req.user.id,
      followingId: req.params.userId
    })
      .then((followship) => {
        callback({ status: 'success', message: '' })
      })
  },
  removeFollowing: (req, res, callback) => {
    return Followship.findOne({
      where: {
        followerId: req.user.id,
        followingId: req.params.userId
      }
    })
      .then((followship) => {
        followship.destroy()
          .then((followship) => {
            callback({ status: 'success', message: '' })
          })
      })
  }
}

module.exports = userService