/**
 * Runs a scheduler until any `Actor` which has a specified priority has run.
 *
 * Throws an exception if no `Actor` has run before `timeout`.
 *
 * @method runUntilActorHasRun
 * @static
 * @param scheduler {ActorScheduler}
 *     The scheduler in which `Actor`s are scheduled.
 * @param priority {number}
 *     The priority of `Actor`s to wait for.
 * @param timeout {number}
 *     The maximum number of `run`s to wait for.
 *     10000 if omitted.
 */
function runUntilActorHasRun(scheduler, priority, timeout) {
	timeout = timeout || 10000;
	var triggered = false;
	var trigger = new Actor(priority, function () {
		triggered = true;
	});
	scheduler.schedule(trigger);
	while (!triggered && timeout > 0) {
		scheduler.run();
		--timeout;
	}
	if (!triggered) {
		throw 'no actor has run';
	}
}

/**
 * Runs a scheduler until `ActorPriorities.CONTROL` has run.
 *
 * Equivalent to the following call,
 *
 *     runUntilActorHasRun(scheduler, ActorPriorities.CONTROL, timeout)
 *
 * @method runActorsUntilControlIsBack
 * @static
 * @param scheduler {ActorScheduler}
 *     The scheduler in which `Actor`s are scheduled.
 * @param timeout {number}
 *     The maximum number of `run`s to be wait for.
 *     May be omitted.
 */
 /*
function runActorsUntilControlIsBack(scheduler, timeout) {
	runUntilActorHasRun(scheduler, ActorPriorities.CONTROL, timeout);
}
*/
