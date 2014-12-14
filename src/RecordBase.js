/**
 * Provides connection to a score database.
 *
 * Throws an exception if `baseUri` is not a string.
 *
 * Promise
 * -------
 *
 * {{#crossLink "RecordBase/requestScores:method"}}{{/crossLink}} and
 * {{#crossLink "RecordBase/registerScore:method"}}{{/crossLink}} will be
 * performed asynchronously and return a `Promise`.
 *
 * If the request has succeeded, `done` will be invoked with the following
 * argument,
 *  1. A {{#crossLink "ScoreList"}}{{/crossLink}}
 *
 * If the request has failed, `fail` will be invoked with the following
 * argument,
 *  1. An object which represents an error
 *
 * @class RecordBase
 * @constructor
 * @param baseUri {string}
 *     The URI of the database.
 */
RecordBase = (function () {
	function RecordBase(baseUri) {
		var self = this;

		if (typeof baseUri !== 'string') {
			throw new Error('baseUri must be a string');
		}

		/**
		 * Requests the list of scores in the database.
		 *
		 * The top 10 scores will be requested.
		 *
		 * @method requestScores
		 * @return {Promise}
		 *     A promise object to obtain the results of the request.
		 */
		self.requestScores = function () {
			var request = $.Deferred();
			$.get(baseUri + '/record?from=0&to=10')
				.done(forwardScoreListTo(request))
				.fail(function (_, x, error) {
					request.reject(error);
				});
			return request.promise();
		};

		/**
		 * Registers a specified score to the database.
		 *
		 * Throws an exception if `score` is not
		 * a {{#crossLink "Score"}}{{/crossLink}}.
		 *
		 * @method registerScore
		 * @param score {Score}
		 *     The score to be registered.
		 * @return {Promise}
		 *     A promise object to obtain the results of the request.
		 */
		self.registerScore = function (score) {
			if (!Score.isClassOf(score)) {
				throw new Error('score must be a Score');
			}
			// the request will be resolved in 2 steps; authentication and post
			var request = $.Deferred();
			// an access token will be obtained by authentication
			$.ajax({
				url: baseUri + '/authenticate',
				headers: {
					'Authorization': 'Basic ' + btoa('guest:mikan')
				}
			}).done(function (tokenJson) {
				// posts the score with the access token
				$.ajax({
					url: baseUri + '/record?from=0&to=10',
					type: 'POST',
					headers: {
						'Authorization': 'Bearer ' + tokenJson.token
					},
					contentType: 'application/json',
					data: JSON.stringify({
						value:  score.value,
						level:  score.level,
						player: score.player,
						date:   score.date
					})
				}).done(
					forwardScoreListTo(request)
				).fail(function (_, _, error) {
					request.reject(error);
				});
			}).fail(function (_, _, error) {
				request.reject(error);
			});
			return request.promise();
		};

		/**
		 * Returns a function which forwards a `ScoreList` returned from
		 * the server to a specified `Deferred`.
		 *
		 * @method forwardScoreListTo
		 * @param deferred {Deferred}
		 *     The `Deferred` which processes a `ScoreList`.
		 * @return {function}
		 *     A callback function which accepts a response object.
		 */
		function forwardScoreListTo(deferred) {
			return function (scoresJson) {
				try {
					// scoresJson must be a ScoreList
					if (!ScoreList.canAugment(scoresJson)) {
						throw new Error('Invalid response from server: '
										+ scoreJson);
					}
					deferred.resolve(ScoreList.augment(scoresJson));
				} catch (err) {
					deferred.reject(err);
				}
			};
		}
	}

	return RecordBase;
})();
