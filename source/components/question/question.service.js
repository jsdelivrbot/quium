'use strict'

angular.module('crowdferenceApp')
  .service('Question', function ($location, User, $route, $q, $http) {
    var that = this
    this.view = {}

    this.checkVoted = function () {
      return this.votes.votes.some(function (vote) {
        return vote.user._id === User.user._id && vote.vote === 1
      })
    }

    this.vote = function () {
      var vote = that.checkVoted.call(this) ? '0' : '1'
      User.$http.put('/api/question/' + this._id + '/' + vote)
      .then(function (response) {
        this.votes = response.data.votes
      }.bind(this))
    }

    this.save = function (where, what) {
      return User.$http.put('/api/question/' + this.view._id + '/' + where, {
        what: what
      }).then(function (response) {
        if (what === 'answer') {
          this.view.isAnswered = true
        }
      }.bind(this))
    }

    var loading = false
    this.load = function () {
      if ($route.current.params.question === this.view._id) {
        return $q.when(this.view)
      }
      if (!loading) {
        loading = User.loading.then(function () {
          return $http.get('/api/question/' + $route.current.params.question)
          .then(function (response) {
            loading = false
            this.view = response.data.question
            return this.view
          }.bind(this))
          .catch(function () {
            loading = false
          })
        }.bind(this))
      }
      return loading
    }
  })
