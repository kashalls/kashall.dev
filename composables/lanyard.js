import { useLanyard } from '@leonardssh/use-lanyard';

export const leonLanyard = () => {
	const { public: { DISCORD_USER_ID } } = useRuntimeConfig();
	let activity = ref()


	if (process.client) {
		useLanyard({
			userId: DISCORD_USER_ID,
			socket: true,
			onPresenceUpdate(presence) {
				activity.value = presence
			}
		});
	}

	return useState('lanyard', () => activity);
};