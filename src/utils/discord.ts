/**
 * https://discord.com/developers/docs/topics/gateway-events#activity-object-activity-types
 */
export enum ActivityType  {
	/**
	 * Playing {game}
	 */
	Playing,
	/**
	 * Streaming {details}
	 */
	Streaming,
	/**
	 * Listening to {name}
	 */
	Listening,
	/**
	 * Watching {details}
	 */
	Watching,
	/**
	 * {emoji} {state}
	 */
	Custom,
	/**
	 * Competing in {name}
	 */
	Competing,
}