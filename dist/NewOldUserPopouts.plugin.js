/**
 * @name NewOldUserPopouts
 * @author KingGamingYT
 * @description A full, largely accurate restoration of Discord's profile popouts used from 2018 to 2021. Features modern additions such as banners, theme colors, and guild tags.
 * @version 1.0.0
 */

/*@cc_on
@if (@_jscript)

	// Offer to self-install for clueless users that try to run this directly.
	var shell = WScript.CreateObject("WScript.Shell");
	var fs = new ActiveXObject("Scripting.FileSystemObject");
	var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\BetterDiscord\plugins");
	var pathSelf = WScript.ScriptFullName;
	// Put the user at ease by addressing them in the first person
	shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
	if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
		shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40);
	} else if (!fs.FolderExists(pathPlugins)) {
		shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
	} else if (shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
		fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
		// Show the user where to put plugins in the future
		shell.Exec("explorer " + pathPlugins);
		shell.Popup("I'm installed!", 0, "Successfully installed", 0x40);
	}
	WScript.Quit();

@else@*/

'use strict';

const betterdiscord = new BdApi("NewOldUserPopouts");
const react = BdApi.React;

// modules.js
const [
	entireProfileModal,
	ActivityTimer,
	ActivityButtons,
	ActivityCardClasses,
	AvatarFetch,
	EmojiRenderer,
	FetchGames,
	RoleRenderer,
	RolePermissionCheck,
	RoleAddButton,
	RoleUpdater,
	MarkdownRenderer,
	MediaProgressBar,
	MessageBar,
	MessagePrompt,
	ModalAccessUtils,
	Tooltip,
	TagGuildRenderer,
	Popout,
	SpotifyButtons,
	CallButtons,
	VoiceBox,
	VoiceList,
	VoiceIcon,
	BotTagRenderer,
	FormSwitch,
	GameProfile,
	intl
] = betterdiscord.Webpack.getBulk(
	{ filter: betterdiscord.Webpack.Filters.bySource("forceShowPremium", "pendingThemeColors") },
	{ filter: betterdiscord.Webpack.Filters.byStrings("timestamps", ".TEXT_FEEDBACK_POSITIVE"), searchExports: true },
	{ filter: betterdiscord.Webpack.Filters.byStrings("activity", "USER_PROFILE_ACTIVITY_BUTTONS") },
	{ filter: betterdiscord.Webpack.Filters.byKeys("gameState", "clickableImage") },
	{ filter: betterdiscord.Webpack.Filters.byStrings("displayProfile", "onOpenProfile", "animateOnHover", "previewStatus") },
	{ filter: betterdiscord.Webpack.Filters.byStrings("translateSurrogatesToInlineEmoji") },
	{ filter: betterdiscord.Webpack.Filters.byKeys("getDetectableGamesSupplemental") },
	{ filter: betterdiscord.Webpack.Filters.byStrings("role", "canRemove", "unsafe_rawColors.PRIMARY_300") },
	{ filter: betterdiscord.Webpack.Filters.byStrings(".ADMINISTRATOR", ".MANAGE_MESSAGES") },
	{ filter: betterdiscord.Webpack.Filters.byStrings("guildMember", "numRoles", "highestRole", "onAddRole") },
	{ filter: (x) => x.updateMemberRoles },
	{ filter: betterdiscord.Webpack.Filters.byStrings("userBio", "className", ".parseBioReact") },
	{ filter: betterdiscord.Webpack.Filters.byStrings("start", "end", "duration", "percentage") },
	{ filter: betterdiscord.Webpack.Filters.byStrings(".USER_PROFILE", "SEND_DIRECT_MESSAGE") },
	{ filter: betterdiscord.Webpack.Filters.byStrings("shareToChannelMode should only be true if a valid channel is passed"), searchExports: true },
	{ filter: (x) => x.openUserProfileModal },
	{ filter: betterdiscord.Webpack.Filters.byPrototypeKeys("renderTooltip"), searchExports: true },
	{ filter: betterdiscord.Webpack.Filters.byStrings("guildId", "name", "setPopoutRef", "onClose", "fetchGuildProfile") },
	{ filter: betterdiscord.Webpack.Filters.byStrings("Unsupported animation config:"), searchExports: true },
	{ filter: betterdiscord.Webpack.Filters.byStrings("activity", "PRESS_PLAY_ON_SPOTIFY_BUTTON") },
	{ filter: betterdiscord.Webpack.Filters.byStrings("PRESS_JOIN_CALL_BUTTON") },
	{ filter: betterdiscord.Webpack.Filters.byStrings("users", "channel", "themeType") },
	{ filter: betterdiscord.Webpack.Filters.byStrings("maxUsers", "guildId") },
	{ filter: betterdiscord.Webpack.Filters.byStrings("channel", "isGuildStageVoice", "isDM", "Pl.CONNECT") },
	{ filter: betterdiscord.Webpack.Filters.bySource(".botTag", "invertColor") },
	{ filter: betterdiscord.Webpack.Filters.byStrings('"data-toggleable-component":"switch"', 'layout:"horizontal"'), searchExports: true },
	{ filter: (x) => x.openGameProfileModal },
	{ filter: (x) => x.t && x.t.formatToMarkdownString }
);
const ActivityStore = betterdiscord.Webpack.getStore("PresenceStore");
const ApplicationStore = betterdiscord.Webpack.getStore("ApplicationStore");
const ApplicationStreamPreviewStore = betterdiscord.Webpack.getStore("ApplicationStreamPreviewStore");
const ChannelStore = betterdiscord.Webpack.getStore("ChannelStore");
const DetectableGameSupplementalStore = betterdiscord.Webpack.getStore("DetectableGameSupplementalStore");
const RelationshipStore = betterdiscord.Webpack.getStore("RelationshipStore");
const GuildStore = betterdiscord.Webpack.getStore("GuildStore");
const GuildMemberStore = betterdiscord.Webpack.getStore("GuildMemberStore");
const GuildRoleStore = betterdiscord.Webpack.getStore("GuildRoleStore");
const StreamStore = betterdiscord.Webpack.getStore("ApplicationStreamingStore");
const UserStore = betterdiscord.Webpack.getStore("UserStore");
const VoiceStateStore = betterdiscord.Webpack.getStore("VoiceStateStore");
const { useStateFromStores } = betterdiscord.Webpack.getMangled((m) => m.Store, {
	useStateFromStores: betterdiscord.Webpack.Filters.byStrings("useStateFromStores")
}, { raw: true });
const UserNote = react.lazy(() => {
	const modalModule = betterdiscord.Webpack.getMangled("onCloseRequest:null==", {
		openModalLazy: betterdiscord.Webpack.Filters.byRegex(/^async function/)
	});
	const { promise, resolve } = Promise.withResolvers();
	const openUserModal = betterdiscord.Webpack.getByKeys("openUserProfileModal");
	const undo = betterdiscord.Patcher.instead(modalModule, "openModalLazy", (that, args, original) => {
		if (!String(args[1]?.modalKey).startsWith("USER_PROFILE_MODAL_KEY:")) return original.apply(that, args);
		args[0]().then(() => {
			resolve({
				default: betterdiscord.Webpack.getByStrings("hidePersonalInformation", "onUpdate", "placeholder")
			});
		});
		undo();
	});
	openUserModal.openUserProfileModal({
		userId: UserStore.getCurrentUser().id
	});
	return promise;
});

// presence.jsx
function userVoice({ voice }) {
	let participants = [];
	const channelParticipants = Object.keys(VoiceStateStore.getVoiceStatesForChannel(voice));
	for (let i = 0; i < channelParticipants.length; i++) {
		participants.push(UserStore.getUser(channelParticipants[i]));
	}
	return participants;
}
const headers = {
	0: intl.intl.formatToPlainString(intl.t["iKo3yJ"]),
	1: intl.intl.formatToPlainString(intl.t["4CQq9Q"], { name: "" }),
	2: intl.intl.formatToPlainString(intl.t["NF5xop"], { name: "" }),
	3: intl.intl.formatToPlainString(intl.t["pW3Ip3"], { name: "" }),
	5: intl.intl.formatToPlainString(intl.t["QQ2wVE"], { name: "" })
};
function FallbackAsset(props) {
	return BdApi.React.createElement("svg", { ...props }, BdApi.React.createElement(
		"path",
		{
			style: { transform: "scale(1.65)" },
			fill: "white",
			d: "M5 2a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3H5Zm6.81 7c-.54 0-1 .26-1.23.61A1 1 0 0 1 8.92 8.5 3.49 3.49 0 0 1 11.82 7c1.81 0 3.43 1.38 3.43 3.25 0 1.45-.98 2.61-2.27 3.06a1 1 0 0 1-1.96.37l-.19-1a1 1 0 0 1 .98-1.18c.87 0 1.44-.63 1.44-1.25S12.68 9 11.81 9ZM13 16a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm7-10.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM18.5 20a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM7 18.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM5.5 7a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
		}
	));
}
function ActivityCard({ user, activity, check }) {
	const [shouldLargeFallback, setShouldLargeFallback] = react.useState(false);
	const [shouldSmallFallback, setShouldSmallFallback] = react.useState(false);
	const filterCheck = activityCheck({ activities: [activity] });
	const gameId = activity?.application_id;
	react.useEffect(() => {
		(async () => {
			if (!DetectableGameSupplementalStore.getGame(gameId)) {
				await FetchGames.getDetectableGamesSupplemental([gameId]);
			}
		})();
	}, [gameId]);
	const game = DetectableGameSupplementalStore.getGame(gameId);
	const application = ApplicationStore.getApplication(activity?.application_id);
	return BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement("h3", { className: "headerTextNormal headerText size12", style: { color: "var(--white)", marginBottom: "8px" } }, (check?.listening || check?.watching) && [2, 3].includes(activity?.type) ? headers[activity.type] + activity?.name : filterCheck?.xbox || filterCheck?.playstation ? intl.intl.formatToPlainString(intl.t["A17aM8"], { platform: activity?.platform }) : headers[activity.type]), BdApi.React.createElement("div", { className: activity?.assets ? "bodyAlignCenter" : "bodyNormal", style: { display: "flex", alignItems: "center", width: "auto" } }, BdApi.React.createElement(
		"div",
		{
			className: "assets",
			style: { position: "relative" },
			onMouseOver: (e) => game && e.currentTarget.classList.add(`${ActivityCardClasses.clickableImage}`),
			onMouseLeave: (e) => game && e.currentTarget.classList.remove(`${ActivityCardClasses.clickableImage}`),
			onClick: () => game && GameProfile.openGameProfileModal({
				applicationId: gameId,
				gameProfileModalChecks: {
					shouldOpenGameProfile: true,
					applicationId: gameId
				},
				source: "tony",
				sourceUserId: user.id,
				appContext: {}
			})
		},
		activity?.assets && activity?.assets.large_image && BdApi.React.createElement(TooltipBuilder, { note: activity.assets.large_text || activity?.details }, shouldLargeFallback ? BdApi.React.createElement(FallbackAsset, { className: "assetsLargeImage assetsLargeImageUserPopout" }) : BdApi.React.createElement(
			"img",
			{
				className: "assetsLargeImage assetsLargeImageUserPopout",
				"aria-label": activity?.assets?.large_text,
				alt: activity?.assets?.large_text,
				src: activity?.assets?.large_image?.includes("external") ? "https://media.discordapp.net/external" + activity.assets.large_image.substring(activity.assets.large_image.indexOf("/")) : "https://cdn.discordapp.com/app-assets/" + activity.application_id + "/" + activity?.assets.large_image + ".png",
				onError: () => setShouldLargeFallback(true)
			}
		)),
		activity?.platform?.includes("xbox") && BdApi.React.createElement(
			"img",
			{
				className: "assetsLargeImageXbox assetsLargeImage assetsLargeImageUserPopout",
				style: { width: "60px", height: "60px" },
				src: "https://discord.com/assets/d8e257d7526932dcf7f88e8816a49b30.png"
			}
		),
		activity?.platform?.includes("ps5") && BdApi.React.createElement(
			"img",
			{
				className: "assetsLargeImagePlaystation assetsLargeImage assetsLargeImageUserPopout",
				style: { width: "60px", height: "60px" },
				src: "https://media.discordapp.net/external" + activity.assets.small_image.substring(activity.assets.small_image.indexOf("/"))
			}
		),
		activity?.application_id && (!activity?.assets || !activity?.assets.large_image) && !activity?.platform?.includes("xbox") && shouldLargeFallback ? BdApi.React.createElement(FallbackAsset, { className: "gameIcon", style: { width: "40px", height: "40px" } }) : activity?.application_id && (!activity?.assets || !activity?.assets.large_image) && !activity?.platform?.includes("xbox") && BdApi.React.createElement(
			"img",
			{
				className: "gameIcon",
				style: { width: "40px", height: "40px" },
				src: "https://cdn.discordapp.com/app-icons/" + activity.application_id + "/" + application?.icon + ".png",
				onError: () => setShouldLargeFallback(true)
			}
		),
		!(user.bot || activity?.assets || activity?.application_id || application?.icon) && BdApi.React.createElement(FallbackAsset, { style: { width: "40px", height: "40px" } }),
		activity?.assets && activity?.assets?.large_image && activity?.assets?.small_image && BdApi.React.createElement(TooltipBuilder, { note: activity.assets.small_text || activity?.details }, shouldSmallFallback ? BdApi.React.createElement(FallbackAsset, { className: "assetsSmallImage assetsSmallImageUserPopout" }) : BdApi.React.createElement(
			"img",
			{
				className: "assetsSmallImage assetsSmallImageUserPopout",
				"aria-label": activity?.assets?.small_text,
				alt: activity?.assets?.small_text,
				src: activity?.assets?.small_image?.includes("external") ? "https://media.discordapp.net/external" + activity.assets.small_image.substring(activity.assets.small_image.indexOf("/")) : "https://cdn.discordapp.com/app-assets/" + activity.application_id + "/" + activity?.assets.small_image + ".png",
				onError: () => setShouldSmallFallback(true)
			}
		))
	), BdApi.React.createElement("div", { className: betterdiscord.Utils.className(activity?.assets ? "contentImagesUserPopout" : application?.icon ? "contentGameImageUserPopout" : "contentNoImagesUserPopout", "content"), style: { display: "grid", flex: "1", marginBottom: "3px" } }, BdApi.React.createElement("div", { className: "nameNormal textRow ellipsis", style: { fontWeight: "600" } }, (check?.listening || check?.watching) && [2, 3].includes(activity?.type) ? activity.details : activity.name), !(filterCheck?.listening || filterCheck?.watching) && BdApi.React.createElement("div", { className: "details textRow ellipsis" }, activity.details), BdApi.React.createElement("div", { className: "state textRow ellipsis" }, activity?.party && activity?.party?.size ? activity.state + " (" + activity.party.size[0] + " of " + activity.party.size[1] + ")" : activity.state), activity?.timestamps?.end ? BdApi.React.createElement("div", { className: "mediaProgressBarContainer" }, BdApi.React.createElement(MediaProgressBar, { start: activity?.timestamps?.start || activity?.created_at, end: activity?.timestamps?.end })) : BdApi.React.createElement(ActivityTimer, { activity }))), BdApi.React.createElement("div", { className: "buttonsWrapper actionsUserPopout" }, BdApi.React.createElement(ActivityButtons, { user, activity })));
}
function VoiceCards({ voice, stream }) {
	const channel = useStateFromStores([ChannelStore], () => ChannelStore.getChannel(voice));
	if (stream || !channel) return;
	return BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement("div", { className: "activityUserPopoutContainerVoice" }, BdApi.React.createElement("h3", { className: "headerTextNormal headerText size12", style: { color: "var(--white)", marginBottom: "8px" } }, intl.intl.formatToPlainString(intl.t["grGyaf"])), BdApi.React.createElement("div", { className: "bodyNormal", style: { display: "flex", alignItems: "center", width: "auto" } }, BdApi.React.createElement(VoiceBox, { users: userVoice({ voice }), channel, themeType: "MODAL" }), BdApi.React.createElement("div", { className: "contentImagesUserPopout content" }, BdApi.React.createElement("h3", { className: "textRow", style: { display: "flex", alignItems: "center" } }, VoiceIcon({ channel }), BdApi.React.createElement("h3", { className: "nameWrap nameNormal textRow", style: { fontWeight: "600" } }, channel.name || RelationshipStore.getNickname(channel.getRecipientId()))), GuildStore.getGuild(channel.guild_id)?.name && BdApi.React.createElement("div", { className: "state textRow ellipsis" }, intl.intl.formatToPlainString(intl.t["Xe4de2"], { channelName: GuildStore.getGuild(channel.guild_id)?.name })))), BdApi.React.createElement("div", { className: "buttonsWrapper actionsUserPopout" }, BdApi.React.createElement(CallButtons, { channel }))));
}
function StreamCards({ user, voice }) {
	const streams = useStateFromStores([StreamStore], () => StreamStore.getAllApplicationStreamsForChannel(voice));
	const _streams = streams.filter((streams2) => streams2 && streams2.ownerId == user.id);
	const channel = useStateFromStores([ChannelStore], () => ChannelStore.getChannel(voice));
	return _streams.map(
		(stream) => BdApi.React.createElement("div", { className: "activityUserPopoutContainerStream" }, BdApi.React.createElement("h3", { className: "headerTextNormal headerText size12", style: { color: "var(--white)", marginBottom: "8px" } }, intl.intl.formatToPlainString(intl.t["sddlGK"], { server: GuildStore.getGuild(channel.guild_id)?.name || channel.name || intl.intl.formatToPlainString(intl.t["jN2DfZ"]) })), BdApi.React.createElement("div", { className: "bodyNormal", style: { display: "flex", alignItems: "center", width: "auto" } }, ApplicationStreamPreviewStore.getPreviewURLForStreamKey(stream?.streamType + ":" + stream?.guildId + ":" + stream?.channelId + ":" + stream?.ownerId) ? BdApi.React.createElement(
			"img",
			{
				className: "streamPreviewImage",
				src: ApplicationStreamPreviewStore.getPreviewURLForStreamKey(stream?.streamType + ":" + stream?.guildId + ":" + stream?.channelId + ":" + stream?.ownerId)
			}
		) : BdApi.React.createElement(
			"img",
			{
				className: "streamPreviewPlaceholder",
				src: "https://discord.com/assets/6b1a461f35c05c7a.svg"
			}
		), BdApi.React.createElement("div", { className: "contentImagesUserPopout content" }, BdApi.React.createElement("h3", { className: "textRow", style: { display: "flex", alignItems: "center" } }, VoiceIcon({ channel }), BdApi.React.createElement("h3", { className: "nameWrap nameNormal textRow", style: { fontWeight: "600" } }, channel.name || RelationshipStore.getNickname(channel.getRecipientId()))), BdApi.React.createElement(
			VoiceList,
			{
				className: "userList",
				users: userVoice({ voice }),
				maxUsers: userVoice({ voice }).length,
				guildId: stream.guildId,
				channelId: stream.channelId
			}
		))), BdApi.React.createElement("div", { className: "buttonsWrapper actionsUserPopout" }, BdApi.React.createElement(CallButtons, { channel })))
	);
}
function ActivityCards({ user, activities, voice, stream, check }) {
	const _activities = activities.filter((activity) => activity && [0, 2, 3, 5].includes(activity?.type) && activity?.type !== 4 && activity.name && !activity.name.includes("Spotify"));
	const filterCheck = activityCheck({ activities: _activities });
	if (voice) {
		return BdApi.React.createElement("div", { className: "activityUserPopout activity", id: voice, key: voice }, !stream ? BdApi.React.createElement(VoiceCards, { voice, stream }) : BdApi.React.createElement(StreamCards, { user, voice }));
	}
	return BdApi.React.createElement("div", { className: "activityUserPopout activity", id: _activities[0].created_at + "-" + _activities[0].type, key: _activities[0].created_at + "-" + _activities[0].type }, BdApi.React.createElement(ActivityCard, { user, activity: _activities[0], check: filterCheck }));
}
function SpotifyCards({ user, activities }) {
	const _activities = activities.filter((activity) => activity && activity.name && activity.name.includes("Spotify"));
	return BdApi.React.createElement(BdApi.React.Fragment, null, _activities.map((activity) => BdApi.React.createElement("div", { className: "activityUserPopout activity" }, BdApi.React.createElement("h3", { className: "headerTextNormal headerText size12", style: { color: "var(--white)", marginBottom: "8px" } }, headers[activity.type] + activity?.name), BdApi.React.createElement("div", { className: "bodyNormal", style: { display: "flex", alignItems: "center", width: "auto" } }, BdApi.React.createElement("div", { className: "assets", style: { position: "relative" } }, activity?.assets && activity?.assets.large_image ? BdApi.React.createElement(TooltipBuilder, { note: activity.assets.large_text || activity?.details }, BdApi.React.createElement(
		"img",
		{
			className: "assetsLargeImageUserPopout",
			"aria-label": activity?.assets?.large_text,
			alt: activity?.assets?.large_text,
			src: "https://i.scdn.co/image/" + activity.assets.large_image.substring(activity.assets.large_image.indexOf(":") + 1)
		}
	)) : BdApi.React.createElement("svg", { style: { width: "60px", height: "60px" } }, BdApi.React.createElement(
		"path",
		{
			style: { transform: "scale(1.65)" },
			fill: "white",
			d: "M5 2a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3H5Zm6.81 7c-.54 0-1 .26-1.23.61A1 1 0 0 1 8.92 8.5 3.49 3.49 0 0 1 11.82 7c1.81 0 3.43 1.38 3.43 3.25 0 1.45-.98 2.61-2.27 3.06a1 1 0 0 1-1.96.37l-.19-1a1 1 0 0 1 .98-1.18c.87 0 1.44-.63 1.44-1.25S12.68 9 11.81 9ZM13 16a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm7-10.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM18.5 20a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM7 18.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM5.5 7a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
		}
	))), BdApi.React.createElement("div", { className: "contentImagesUserPopout content" }, BdApi.React.createElement("div", { className: "nameNormal textRow ellipsis", style: { fontWeight: "600" } }, activity.details), BdApi.React.createElement("div", { className: "details textRow ellipsis" }, "by " + activity.state), activity.assets?.large_text && BdApi.React.createElement("div", { className: "state textRow ellipsis" }, "on " + activity.assets?.large_text), activity?.timestamps?.end ? null : BdApi.React.createElement(ActivityTimer, { activity }))), BdApi.React.createElement("div", { className: "mediaProgressBarContainer" }, BdApi.React.createElement(MediaProgressBar, { start: activity?.timestamps?.start, end: activity?.timestamps?.end })), BdApi.React.createElement("div", { className: "buttonsWrapper actionsUserPopout" }, BdApi.React.createElement(SpotifyButtons, { user, activity })))));
}
function TwitchCards({ user, activities }) {
	const _activities = activities.filter((activity) => activity && activity.name && activity.type === 1);
	const __activities = [_activities[0]];
	return BdApi.React.createElement("div", { className: "activityUserPopoutContainerTwitch" }, __activities.map((activity) => BdApi.React.createElement("div", { className: "activityUserPopout activity" }, BdApi.React.createElement("h3", { className: "headerTextNormal headerText size12", style: { color: "var(--white)", marginBottom: "8px" } }, intl.intl.formatToPlainString(intl.t["Dzgz4u"], { platform: activity?.name || intl.intl.formatToPlainString(intl.t["5AyH/p"]) })), BdApi.React.createElement("div", { className: "bodyNormal", style: { display: "flex", alignItems: "center", width: "auto" } }, BdApi.React.createElement("div", { className: "assets", style: { position: "relative" } }, activity?.assets && activity?.assets.large_image ? BdApi.React.createElement("div", null, BdApi.React.createElement(
		"img",
		{
			className: "assetsLargeImageTwitch assetsLargeImageUserPopout",
			"aria-label": activity?.assets?.large_text,
			alt: activity?.assets?.large_text,
			src: activity.name.includes("YouTube") ? "https://i.ytimg.com/vi/" + activity.assets.large_image.substring(activity.assets.large_image.indexOf(":") + 1) + "/hqdefault_live.jpg" : "https://static-cdn.jtvnw.net/previews-ttv/live_user_" + activity.assets.large_image.substring(activity.assets.large_image.indexOf(":") + 1) + "-162x90.jpg",
			onError: (e) => e.currentTarget.src = "https://static-cdn.jtvnw.net/ttv-static/404_preview-162x90.jpg"
		}
	)) : BdApi.React.createElement("svg", { style: { width: "40px", height: "40px" } }, BdApi.React.createElement(
		"path",
		{
			style: { transform: "scale(1.65)" },
			fill: "white",
			d: "M5 2a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3H5Zm6.81 7c-.54 0-1 .26-1.23.61A1 1 0 0 1 8.92 8.5 3.49 3.49 0 0 1 11.82 7c1.81 0 3.43 1.38 3.43 3.25 0 1.45-.98 2.61-2.27 3.06a1 1 0 0 1-1.96.37l-.19-1a1 1 0 0 1 .98-1.18c.87 0 1.44-.63 1.44-1.25S12.68 9 11.81 9ZM13 16a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm7-10.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM18.5 20a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM7 18.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM5.5 7a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
		}
	))), BdApi.React.createElement("div", { className: "contentImagesUserPopout content" }, BdApi.React.createElement("div", { className: "nameNormal textRow ellipsis", style: { fontWeight: "600" } }, activity.details), activity.state && BdApi.React.createElement("div", { className: "state textRow ellipsis" }, intl.intl.formatToPlainString(intl.t["BMTj29"]) + " " + activity.state))), BdApi.React.createElement("div", { className: "buttonsWrapper actionsUserPopout" }, BdApi.React.createElement(ActivityButtons, { user, activity })))));
}

// builders.jsx
const TooltipBuilder = ({ note, position, children }) => {
	return BdApi.React.createElement(Tooltip, { text: note, position: position || "top" }, (props) => {
		children.props = {
			...props,
			...children.props
		};
		return children;
	});
};
function activityCheck({ activities }) {
	let pass = {
		playing: 0,
		xbox: 0,
		playstation: 0,
		streaming: 0,
		listening: 0,
		spotify: 0,
		watching: 0,
		competing: 0,
		custom: 0
	};
	for (let i = 0; i < activities.length; i++) {
		if (activities[i].type == 4) {
			pass.custom = 1;
		}
		if (activities[i].type == 0) {
			pass.playing = 1;
		}
		if (activities[i]?.platform?.includes("xbox")) {
			pass.xbox = 1;
		}
		if (activities[i]?.platform?.includes("playstation") || activities[i]?.platform?.includes("ps5")) {
			pass.playstation = 1;
		}
		if (activities[i].type == 1) {
			pass.streaming = 1;
		}
		if (activities[i].type == 2) {
			pass.listening = 1;
		}
		if (activities[i].name.includes("Spotify")) {
			pass.spotify = 1;
		}
		if (activities[i].type == 3) {
			pass.watching = 1;
		}
		if (activities[i].type == 5) {
			pass.competing = 1;
		}
	}
	return pass;
}
function BioBuilder({ displayProfile }) {
	if (displayProfile?._guildMemberProfile?.bio) {
		return BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement("div", { className: "bodyTitle size12" }, intl.intl.formatToPlainString(intl.t["61W33d"])), BdApi.React.createElement(MarkdownRenderer, { userBio: displayProfile.bio, className: "userBio", setLineClamp: false, textColor: "text-default" }));
	}
	if (displayProfile._userProfile.bio) {
		return BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement("div", { className: "bodyTitle size12" }, intl.intl.formatToPlainString(intl.t["61W33d"])), BdApi.React.createElement(MarkdownRenderer, { userBio: displayProfile._userProfile.bio, className: "userBio", setLineClamp: false, textColor: "text-default" }));
	}
	return;
}
function ClanTagBuilder({ user }) {
	const [showPopout, setShowPopout] = react.useState(false);
	const refDOM = react.useRef(null);
	return BdApi.React.createElement(
		"div",
		{
			className: "clanTagContainer"
		},
		BdApi.React.createElement(
			Popout,
			{
				targetElementRef: refDOM,
				clickTrap: true,
				onRequestClose: () => setShowPopout(false),
				renderPopout: () => BdApi.React.createElement(TagGuildRenderer, { guildId: user.primaryGuild?.identityGuildId }),
				position: "right",
				shouldShow: showPopout
			},
			(props) => BdApi.React.createElement(
				"div",
				{
					...props,
					className: "clanTag",
					ref: refDOM,
					onClick: () => {
						setShowPopout(true);
					}
				},
				BdApi.React.createElement(
					"div",
					{
						className: "clanTagInner"
					},
					BdApi.React.createElement(
						"img",
						{
							className: "tagBadge",
							src: "https://cdn.discordapp.com/clan-badges/" + user.primaryGuild?.identityGuildId + "/" + user.primaryGuild?.badge + ".png?size=16"
						}
					),
					BdApi.React.createElement(
						"div",
						{
							className: "tagName",
							style: {
								color: "var(--text-default)",
								lineHeight: "16px",
								fontWeight: "600",
								fontSize: "14px"
							}
						},
						user.primaryGuild?.tag
					)
				)
			)
		)
	);
}
function RoleBuilder({ user, data, role, serverMember }) {
	return BdApi.React.createElement(
		RoleRenderer,
		{
			className: "role",
			role,
			guildId: data.guild.id,
			canRemove: RolePermissionCheck({ guildId: data.guild.id }).canRemove,
			onRemove: () => {
				return RoleUpdater.updateMemberRoles(data.guild.id, user.id, serverMember.roles.filter((mRole) => mRole !== role.id), [], [role.id]);
			}
		}
	);
}
function RolesInnerBuilder({ user, data, serverMember, selfServerMember, MemberRoles }) {
	const refDOM = react.useRef(null);
	return BdApi.React.createElement("div", { className: "rolesList", "aria-orientation": "vertical" }, MemberRoles.map(
		(role) => BdApi.React.createElement(
			RoleBuilder,
			{
				user,
				data,
				role,
				serverMember
			}
		)
	), BdApi.React.createElement(
		RoleAddButton,
		{
			guild: data.guild,
			guildMember: serverMember,
			numRoles: MemberRoles.length,
			highestRole: GuildRoleStore.getRole(data.guild.id, selfServerMember.highestRoleId),
			onAddRole: (w) => {
				let b = serverMember.roles;
				b.push(w);
				return RoleUpdater.updateMemberRoles(data.guild.id, user.id, b, [w], []);
			},
			buttonRef: refDOM
		}
	));
}
function NoRolesInnerBuilder({ user, data, serverMember, selfServerMember, MemberRoles }) {
	const refDOM = react.useRef(null);
	return BdApi.React.createElement("div", { className: "rolesList", "aria-orientation": "vertical" }, BdApi.React.createElement(
		RoleAddButton,
		{
			guild: data.guild,
			guildMember: serverMember,
			numRoles: MemberRoles.length,
			highestRole: GuildRoleStore.getRole(data.guild.id, selfServerMember.highestRoleId),
			onAddRole: (w) => {
				let b = serverMember.roles;
				b.push(w);
				return RoleUpdater.updateMemberRoles(data.guild.id, user.id, b, [w], []);
			},
			buttonRef: refDOM
		}
	));
}
function RolesBuilder({ user, data }) {
	if (!data?.guild?.id) {
		return;
	}
	const serverMember = GuildMemberStore.getMember(data.guild?.id, user.id);
	const selfServerMember = GuildMemberStore.getMember(data.guild?.id, data.currentUser.id);
	const MemberRoles = serverMember.roles?.map((role) => GuildRoleStore.getRole(data.guild.id, role));
	if (!serverMember?.roles?.length) {
		return BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement(
			"div",
			{
				className: "bodyTitle size12",
				style: { marginBottom: RolePermissionCheck({ guildId: data.guild.id, channelId: data.channelId }).canRemove ? null : "28px" }
			},
			intl.intl.formatToPlainString(intl.t["nZfHsf"])
		), BdApi.React.createElement(
			NoRolesInnerBuilder,
			{
				user,
				data,
				serverMember,
				selfServerMember,
				MemberRoles
			}
		));
	}
	return BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement("div", { className: "bodyTitle size12" }, serverMember?.roles?.length !== 1 ? intl.intl.formatToPlainString(intl.t["2SZsWX"]) : intl.intl.formatToPlainString(intl.t["XPGZXP"])), BdApi.React.createElement(
		RolesInnerBuilder,
		{
			user,
			data,
			serverMember,
			selfServerMember,
			MemberRoles
		}
	));
}
function PronounsBuilder({ displayProfile }) {
	return BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement("div", { className: "bodyTitle size12" }, intl.intl.formatToPlainString(intl.t["1w6drw"])), BdApi.React.createElement("div", { className: "userPronouns", style: { color: "var(--text-default)", fontSize: "14px" } }, displayProfile.pronouns));
}
function NoteBuilder({ user }) {
	return BdApi.React.createElement(BdApi.React.Fragment, null, BdApi.React.createElement("div", { className: "bodyTitle size12" }, intl.intl.formatToPlainString(intl.t["PbMNh2"])), BdApi.React.createElement("div", { className: "note" }, BdApi.React.createElement(react.Suspense, null, BdApi.React.createElement(UserNote, { userId: user.id }))));
}
function HeaderInnerBuilder({ data, user, displayProfile, tagName, displayName, nickName, activities }) {
	const _activities = activities.filter((activity) => activity && activity.type === 4);
	const _emoji = _activities.filter((activity) => activity.emoji);
	const serverMember = GuildMemberStore.getMember(displayProfile.guildId, user.id);
	return BdApi.React.createElement("div", { className: "headerTop", style: { flex: "1 1 auto" } }, BdApi.React.createElement(AvatarFetch, { className: "avatarWrapper", user, guildId: displayProfile.guildId, onOpenProfile: () => {
		ModalAccessUtils.openUserProfileModal({ userId: user.id });
		data.onClose();
	} }), BdApi.React.createElement("div", { className: betterdiscord.Utils.className("headerText", (betterdiscord.Data.load("disableDiscrim") || !displayProfile._userProfile?.legacyUsername) && !user.bot && "headerTextPomelo", "size16") }, (!user.bot || serverMember?.nick) && BdApi.React.createElement("div", { className: "headerNameWrapper" }, BdApi.React.createElement("div", { className: "headerName" }, serverMember?.nick || nickName || displayName || tagName)), BdApi.React.createElement("div", { className: "flexHorizontal", style: { flex: "1 1 auto" } }, BdApi.React.createElement("div", { className: `headerTag ${serverMember?.nick ? "headerTagNickname" : "headerTagNoNickname"} ${serverMember?.nick || (betterdiscord.Data.load("disableDiscrim") || !displayProfile._userProfile?.legacyUsername) && !user.bot ? "size14" : "size16"}` }, (serverMember?.nick && !betterdiscord.Data.load("disableDiscrim") && displayProfile._userProfile?.legacyUsername || user.bot) && BdApi.React.createElement("div", { className: "nameDisplay" }, displayName || tagName), !betterdiscord.Data.load("disableDiscrim") && displayProfile._userProfile?.legacyUsername ? BdApi.React.createElement("div", { className: "discriminator" }, displayProfile._userProfile?.legacyUsername?.substring(displayProfile._userProfile?.legacyUsername?.indexOf("#"))) : user.bot ? BdApi.React.createElement("div", { className: "discriminator" }, "#" + user.discriminator) : BdApi.React.createElement("div", { className: "userTag" }, "@" + tagName), user.bot && BdApi.React.createElement(
		BotTagRenderer.Z,
		{
			type: user.system ? BotTagRenderer.Z.Types.OFFICIAL : BotTagRenderer.Z.Types.BOT,
			verified: user.publicFlags & 1 << 16,
			className: "botTag"
		}
	)))), user.primaryGuild?.tag && betterdiscord.Data.load("showGuildTag") && BdApi.React.createElement(ClanTagBuilder, { user }), _activities.length > 0 && BdApi.React.createElement("div", { className: "customStatus" }, _emoji.map((emoji) => BdApi.React.createElement(EmojiRenderer, { emoji: _activities[0].emoji })), BdApi.React.createElement("div", { className: "customStatusText" }, _activities[0].state)));
}
function headerBuilder({ data, user, displayProfile }) {
	const tagName = user.username;
	const displayName = user.globalName;
	const nickName = RelationshipStore.getNickname(user.id);
	const activities = useStateFromStores([ActivityStore], () => ActivityStore.getActivities(user.id));
	const check = activityCheck({ activities });
	const voice = useStateFromStores([VoiceStateStore], () => VoiceStateStore.getVoiceStateForUser(user.id)?.channelId);
	const stream = useStateFromStores([StreamStore], () => StreamStore.getAnyStreamForUser(user.id));
	if (activities.length !== 0 && (check.playing || check.listening || check.watching || check.competing) && (!check.spotify && !check.streaming && !check.xbox) || voice !== void 0) {
		return BdApi.React.createElement("div", { className: "headerPlaying header", style: { backgroundColor: "var(--bg-brand)" } }, displayProfile.banner && BdApi.React.createElement(
			"img",
			{
				className: "userBanner",
				src: displayProfile.getBannerURL({ canAnimate: true }),
				style: {
					width: "250px",
					height: "100px"
				},
				alt: ""
			}
		), BdApi.React.createElement(
			HeaderInnerBuilder,
			{
				data,
				user,
				displayProfile,
				tagName,
				displayName,
				nickName,
				activities
			}
		), BdApi.React.createElement(
			ActivityCards,
			{
				user,
				activities,
				voice,
				stream,
				check
			}
		));
	} else if (activities.length !== 0 && (check.spotify && !check.streaming) || voice !== void 0) {
		return BdApi.React.createElement("div", { className: "headerSpotify header", style: { backgroundColor: "#1db954" } }, displayProfile.banner && BdApi.React.createElement(
			"img",
			{
				className: "userBanner",
				src: displayProfile.getBannerURL({ canAnimate: true }),
				style: {
					width: "250px",
					height: "100px"
				},
				alt: ""
			}
		), BdApi.React.createElement(
			HeaderInnerBuilder,
			{
				data,
				user,
				displayProfile,
				tagName,
				displayName,
				nickName,
				activities
			}
		), BdApi.React.createElement(
			SpotifyCards,
			{
				user,
				activities
			}
		));
	} else if (activities.length !== 0 && check.streaming || voice !== void 0) {
		return BdApi.React.createElement("div", { className: "headerStreaming header", style: { backgroundColor: "#593695" } }, displayProfile.banner && BdApi.React.createElement(
			"img",
			{
				className: "userBanner",
				src: displayProfile.getBannerURL({ canAnimate: true }),
				style: {
					width: "250px",
					height: "100px"
				},
				alt: ""
			}
		), BdApi.React.createElement(
			HeaderInnerBuilder,
			{
				data,
				user,
				displayProfile,
				tagName,
				displayName,
				nickName,
				activities
			}
		), BdApi.React.createElement(
			TwitchCards,
			{
				user,
				activities
			}
		));
	} else if (activities.length !== 0 && check.xbox || voice !== void 0) {
		return BdApi.React.createElement("div", { className: "headerXbox header", style: { backgroundColor: "#107c10" } }, displayProfile.banner && BdApi.React.createElement(
			"img",
			{
				className: "userBanner",
				src: displayProfile.getBannerURL({ canAnimate: true }),
				style: {
					width: "250px",
					height: "100px"
				},
				alt: ""
			}
		), BdApi.React.createElement(
			HeaderInnerBuilder,
			{
				data,
				user,
				displayProfile,
				tagName,
				displayName,
				nickName,
				activities
			}
		), BdApi.React.createElement(
			ActivityCards,
			{
				user,
				activities,
				check
			}
		));
	}
	return BdApi.React.createElement("div", { className: "headerNormal header", style: { backgroundColor: "var(--background-tertiary, var(--background-base-lowest))" } }, displayProfile.banner && BdApi.React.createElement(
		"img",
		{
			className: "userBanner",
			src: displayProfile.getBannerURL({ canAnimate: true }),
			style: {
				width: "250px",
				height: "100px"
			},
			alt: ""
		}
	), BdApi.React.createElement(
		HeaderInnerBuilder,
		{
			data,
			user,
			displayProfile,
			tagName,
			displayName,
			nickName,
			activities
		}
	));
}
function bodyBuilder({ data, user, displayProfile }) {
	return BdApi.React.createElement("div", { className: "body scrollerBase", style: { overflow: "hidden scroll", paddingRight: "0px" } }, BdApi.React.createElement("div", { className: "bodyInnerWrapper" }, betterdiscord.Data.load("pronouns") && displayProfile?.pronouns && BdApi.React.createElement(PronounsBuilder, { displayProfile }), betterdiscord.Data.load("bio") && BdApi.React.createElement(BioBuilder, { displayProfile }), betterdiscord.Data.load("roles") && displayProfile._guildMemberProfile && BdApi.React.createElement(RolesBuilder, { user, data }), betterdiscord.Data.load("note") && BdApi.React.createElement(NoteBuilder, { user })));
}
function footerBuilder({ user, currentUser }) {
	react.useRef(null);
	return BdApi.React.createElement("div", { className: "footer" }, currentUser?.id && user.id !== currentUser?.id && BdApi.React.createElement("div", { className: "inputWrapper" }, BdApi.React.createElement(MessageBar, { user })), BdApi.React.createElement("div", { className: "protip" }, BdApi.React.createElement("h3", { className: "pro" }, intl.intl.formatToPlainString(intl.t["8tvIiN"]) + ": "), BdApi.React.createElement("div", { className: "tip" }, "Right click user for more actions")));
}

// styles.js
const styles = Object.assign(
	{
		roleName: betterdiscord.Webpack.getByKeys("role", "roleName", "roleNameOverflow").roleName,
		primaryButton: betterdiscord.Webpack.getByKeys("primaryButton", "customButtons").primaryButton,
		customButtons: betterdiscord.Webpack.getByKeys("primaryButton", "customButtons").customButtons,
		hasText: betterdiscord.Webpack.getModule((x) => x.primary && x.hasText && !x.hasTrailing).hasText,
		sm: betterdiscord.Webpack.getModule((x) => x.primary && x.hasText && !x.hasTrailing).sm,
		clickableImage: betterdiscord.Webpack.getByKeys("gameState", "clickableImage").clickableImage
	},
	betterdiscord.Webpack.getByKeys("container", "bar", "progress"),
	betterdiscord.Webpack.getByKeys("outer", "overlay"),
	betterdiscord.Webpack.getByKeys("root", "pill", "expandButton"),
	betterdiscord.Webpack.getByKeys("inlineContainer", "themedBackground"),
	betterdiscord.Webpack.getByKeys("badgeContainer", "badgesContainer"),
	betterdiscord.Webpack.getByKeys("tabularNumbers")
);
const popoutCSS = webpackify(
	`\n  			body {\n  					--background-brand: var(--bg-brand);\n  					--profile-banner-background-pattern: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAhwAAAGqCAMAAAB3W227AAAAG1BMVEX///////////////////////////////////8HBRbfAAAACXRSTlMAAwYJDA8SFRePYxEqAAAHV0lEQVR4Ae3d2VrjPLOA0dJgle7/inf4MjgJ9u4B0j+GtY46PmryvJRlK8HxK4x5ZwTc5HyQAfdzI1uJKC3vZge0tYdrKS3eQD7OinE9sUB7jiEvowOWtYW1liXgPChK3CmXUQLz5FdH+KfEgdMKJaJakG4hs45ZXcqyuzVR3QR7RtvdzXT7nLbZho03ao9olze0V1v2rOqcb3Wc23hcd/iwjzbOdZzbOGwdLedFtvjCykkcRclzHdc2ssRBtSXnzKXFl3ask167XsXWaZn/z+LIxeTgXr3FMeYcB1pzZH3xmoM++yWOZZ70w1yt5Jz15VcrbiaNMk/acS6p6rmN/7poNXiRvNypK+VpM8jeCiVvC/6aWeytcG+5LTRKzZNxkKXSHNp4vTbi6kC/jH2JNuLl+EAciANKbIORNbZAt4vFDnuc7Nu/RwpVG+wqJQAAAAAAAAAAAAAAAAAAAAAAAAAAAADg66rnZ/3X4BOUnjNH2z54NDXnRdb4KPo8y7J98FD6vNODz3o7s2wePGgbH6+DOle5ffBoP8xSIsry8WePk+ez8/nNbNsHj/bD/KfmB8umzJMSJ28hLNsHDzU46tar30c/WU/SYy1i62DGUTym/Hdlk9fJEGNdts2tg/3kgD/W35fN+XdqPYFsHjyeebL9+vfRzov6ddG2cfCnIueqbh/8qShrCH3nIOro7w5qgzZyZi/bB38qAAAAAAAAAAAAmM8yXgxxIA7EAT8zDsSBOBAH4kAciMNfV976arc46POii+MRY94McXCvzzvi4E65Pvugpjge0de3NsXxgFz/qmE9bhxzeRJ88t+cPWocG+JXEAdOK+LYZkFan4jDpeyvz5S4CSYOt8/FYeNNHLbsxYE4EAfiQByIA3GAOBAH4gAA7GK3AHEgDsSBOF4McSAOxIE4EAfiAACAkTdxp+bNiB+KnDdxp3rEHOJAHH+DcrN3+EcCAGy8IQ7EMTfFp0MciANxII6NI6+HOBDH69HGGFUcuxAH4kAciANxIA4QB+JAHIgDW/b/HuJAHCXOEEfryzJGvjEBf0HoI86g7Q5AyP93cGB05NJbS4ODjdGRcWJwsDk6WsTYHhxYdUSZJ0u8g9HRdwcHRsfW4IC6e48Dcm9wQN0dHJB7gwPK7uCAnLPHFihfeHDQemvxP5Q9virSSX8Pn7giRByIAy6fuCk1bmCZmWOZJyPnnCWuYMwHLa4g54MemxBHjhZwpzSPPN3D+NP1Bj6nB3m9jl3im6tLzplLjT9hcJzXHTW+s5rzImv8Fi4zY3z3NWl3yf7H2mW1Ub75e9b/4oYOy5z98u71777qXkpEWeZvn0Ipy6WS8t2/zV/vFh8ZsA6Ouv0K5865bL2Ep48jFOeVG+bJxmsQB04rWJDiUhY3wXD7HBtv2LLHh32+JXxMEAAAAAAAAAAAAPBME8SBOBAH4oC5ChAH4uCD8kwc/4J1KeJAHGBV+mnEgThAHACttxawJZ0f/wF3bRAH4oDLsylKDbhZZuZY5sl4fEYWjPmgxRWk55f8FnHkaHEHSjuXEe/AsN7YQd3bYIa8XseOeA+DozTP4WR7cCwRw5qUZ+2y2ihuc7zDcmmia+MdynKppPyMPef1NTztKBarK26WOeey+xIX63XrFeTdg+9rOqu8Y4NgKRFlmQ+DA7pPreyia2MXNedF1ngEdck5c6nxyQAAgNoDtuUM2NTc2ftO/GWmGv8CbZ4scSjt3/yHyfmmxJGMh83x2nsrwYsGx9FGx33O/WU/ADnPykE/9T3mRQavGBxvgSzHjGPMmxGfz+Do9WijI69rjpwn2Vu+7CfwlcVxsF+8ZZ600vI2MYbPYb1mcEQcbXSU+Xw2qS/K2+A43uhoaxu+bPbCwbGUWtsyT+oB61jW159ft8Fx1OV+Hzl6eTw/fh5yPqpxWI///VJrCT6izScZR1XmSVy09EWBTxkcmTnGsvTeWqv10J0vz/OwBTzEMd6dJvGF5lznRo4xL0fgcllb8/yP9b4e9Hfr6mHVcUHOq2XNpQec5GMbsZgc3LScM5fyuK0PG2rOGbCt9fhiAAAAAAAAAAAAAAAAAAAAAAAAAADarHE1SsBNnzNLnI31nxDl7sEhw2MiHtBudSye2M6TfmmiXyqB1TJPlqYNNozdZ3tCzrMSbFNHjXegpIdS7aF80TaacfYF1B5fULcQYpNbL7+ijRLwbNHGr2ljjGCbNu73A2Gsa9GcJz3Ypo0RoI2X00Y9ie+HNYiS82SJP+fumTbEoQ1xbNFGD3EQT8Oizg+0UcTx/Xy8jTYfLPFd0B7baPEj42ijxHu087Boaxs/LY7Sc85gS/1YG1HzzXyTJ0scSx3zTezhsY0fdLXSc57FHnKe1PhhcdQxrzL2UPLcxk+Ko+dcZeyiZI2fFMc6NLI3u9AvcNw4xrwYLaK++hqLUkocR7+0sd7qeYRtg5ntHEcP2Bge/fkqHsqY/0lxvEebVzXgyRDHLlr6E0u7WHa3VqCmOD7o/wD/omtFVdaovwAAAABJRU5ErkJggg==");\n  			}\n\n  			.outer.user-profile-popout {\n  					width: fit-content;\n  			}\n\n  			.outer.user-profile-popout.custom-user-profile-theme:not(.disable-profile-themes) {\n  					/* background: linear-gradient(var(--profile-gradient-primary-color) / 50%, var(--profile-gradient-secondary-color) / 50%); */\n  					--profile-gradient-start: color-mix(in oklab, var(--profile-gradient-primary-color) 100%, var(--profile-gradient-primary-color)) !important;\n  					--profile-gradient-end: color-mix(in oklab, var(--profile-gradient-secondary-color) 100%, var(--profile-gradient-secondary-color)) !important;\n  					--custom-user-profile-theme-color-blend: linear-gradient(color-mix(in oklab, var(--profile-gradient-overlay-color), var(--profile-gradient-start)), color-mix(in oklab, var(--profile-gradient-overlay-color), var(--profile-gradient-end)));\n  			}\n\n  			.outer.user-profile-popout.custom-user-profile-theme.disable-profile-themes {\n  					--custom-user-profile-theme-padding: 0;\n  					--custom-theme-base-color-amount: 0% !important;\n  					--custom-theme-text-color-amount: 0% !important;\n  			}\n\n  			:where(.theme-dark) .outer:not(.disable-profile-themes) .userPopout {\n  					background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), var(--custom-theme-base-color, var(--background-secondary, var(--background-base-lower))) !important;\n  			}\n  			:where(.theme-light) .outer:not(.disable-profile-themes) .userPopout {\n  					background: var(--custom-theme-base-color, var(--background-secondary, var(--background-base-lower))) !important;\n  			}\n\n  			.custom-theme-background:is(.user-profile-popout) .theme-dark, .theme-dark.custom-theme-background:is(.user-profile-popout) {\n  					--custom-theme-base-color: var(--custom-user-profile-theme-color-blend, var(--theme-base-color-dark)) !important;\n  			}\n  			.custom-theme-background:is(.user-profile-popout) .theme-light, .theme-light.custom-theme-background:is(.user-profile-popout) {\n  					--custom-theme-base-color: var(--custom-user-profile-theme-color-blend, var(--theme-base-color-light)) !important;\n  			}\n\n  			.userPopout {\n  					box-shadow: 0 2px 10px 0 rgba(0,0,0,.2), 0 0 0 1px rgba(32,34,37,.6);\n  					width: 250px;\n  					border-radius: 5px;\n  					overflow: hidden;\n  					max-height: calc(100vh - 20px);\n  					display: flex;\n  					flex-direction: column;\n  			}\n\n  			.size14 {\n  					font-size: 14px;\n  			}\n\n  			.size16 {\n  					font-size: 16px;\n  			}\n\n  			.size12 {\n  					font-size: 12px;\n  			}\n\n  			.userPopout .userBanner {\n  					margin-bottom: -50px;\n  					mask-image: linear-gradient(to bottom, #fff, rgb(255 255 255 / 0%));\n  					pointer-events: none;\n  			}\n  			\n  			.headerTop {\n  					padding: 16px;\n  					flex-direction: column;\n  					flex-wrap: nowrap;\n  					justify-content: center;\n  					align-items: center;\n  					display: flex;\n  			}\n\n  			.avatarWrapper {\n  					margin-bottom: 12px;\n  					position: relative;\n  					left: unset !important;\n  					top: unset !important;\n  					width: initial;\n  			}\n\n  			.userPopout .body .headerText {\n  					flex-direction: column;\n  					text-align: center;\n  					align-items: center;\n  					display: flex;\n  					user-select: text;\n  					overflow: hidden;\n  			}\n\n  			.userPopout .headerNameWrapper {\n  					align-items: center;\n  					justify-items: center;\n  					justify-content: center;\n  					display: flex;\n  			}\n\n  			.userPopout .headerName {\n  					color: var(--header-primary);\n  					font-weight: 600;\n  					white-space: normal;\n  					text-align: center;\n  					text-overflow: ellipsis;\n  					overflow: hidden;\n  			}\n\n  			.userPopout .headerText:is(.headerTextPomelo) .headerName {\n  					margin-bottom: 2px;\n  			}\n\n  			.userPopout .headerTag:is(.headerTagNickname) {\n  					margin-top: 2px;\n  			}\n  			\n  			.flexHorizontal {\n  					flex-direction: row;\n  					flex-wrap: nowrap;\n  					justify-content: center;\n  					align-items: center;\n  					display: flex;\n  			}\n\n  			.userPopout :is(.headerName, .headerTag) {\n  					font-weight: 600;\n  			}\n\n  			.userPopout .headerTag {\n  					color: var(--header-secondary);\n  					font-weight: 500;\n  					line-height: 18px;\n  					flex-wrap: wrap;\n  					display: flex;\n  					justify-content: center;\n  					align-items: center;\n  					overflow: hidden;\n  			}\n  			\n  			.userPopout .nameDisplay {\n  					flex: 0 1 auto;\n  					text-overflow: ellipsis;\n  					overflow: hidden;\n  			}\n\n  			.userPopout .flexHorizontal:only-child .nameDisplay {\n  					color: var(--header-primary);\n  					font-weight: 600;\n  			}\n\n  			.userPopout .headerText:not(.headerTextPomelo, :has(.headerTagNickname, .botTag)) {\n  					flex-direction: row;\n  			}\n\n  			.userPopout .headerText {\n  					display: flex;\n  					flex-direction: column;\n  			}\n\n  			.userPopout :is(.discriminator, .userTag) {\n  					font-weight: 500;\n  			}\n  			\n  			.userPopout :is(.nameTag, .discriminator, .userTag) {\n  					display: block;\n  			}\n\n  			.customStatus {\n  					color: var(--header-secondary);\n  					margin-top: 12px;\n  					text-align: center;\n  					width: 100%;\n  					overflow-wrap: break-word;\n  					font-size: 14px;\n  					line-height: 18px;\n  					font-weight: 500;\n  			}\n\n  			.customStatus .emoji {\n  					width: 20px;\n  					height: 20px;\n  			}\n\n  			.customStatus .emoji:not(:last-child) {\n  					margin-right: 8px;\n  			}\n\n  			.customStatus .emoji+.customStatusText {\n  					display: inline;\n  			}\n  			\n  			.customStatus:has(.customStatusText:empty) .emoji {\n  					height: 48px;\n  					width: 48px;\n  			}\n\n  			.userPopout .customStatusText {\n  					user-select: text;\n  					text-align: baseline;\n  					max-height: 70px;\n  					overflow: hidden;\n  			}\n\n  			.userPopout .botTag {\n  					flex: 0 0 auto;\n  					margin-left: 1ch;\n  			}\n\n  			.userPopout .clanTagContainer {\n  					max-width: 80px;\n  					overflow: hidden;\n  					margin-top: 8px;\n  			}\n\n  			.userPopout .clanTag {\n  					align-items: center;\n  					background: rgba(0,0,0,0.2);\n  					border-radius: 4px;\n  					display: inline-flex;\n  					line-height: 16px !important;\n  					padding: 0 4px;\n  					transition: background .1s ease-in-out;\n  					vertical-align: middle;\n  					height: 20px;\n  			}\n\n  			.userPopout .clanTagInner {\n  					align-items: center;\n  					display: inline-flex;\n  					line-height: 16px !important;\n  					max-width: 60px;\n  			}\n\n  			.userPopout .tagBadge {\n  					margin-right: 2px;\n  					margin-top: 0;\n  					width: 14px;\n  					height: 14px;\n  			}\n\n  			.userPopout .scrollerBase {\n  					position: relative;\n  					box-sizing: border-box;\n  					min-height: 0;\n  					flex: 1 1 auto;\n  					&::-webkit-scrollbar {\n  					background: none;\n  					border-radius: 8px;\n  					width: 8px;\n  					}\n  					&::-webkit-scrollbar-thumb {\n  							background-clip: padding-box;\n  							border: solid 2px #0000;\n  							border-radius: 8px;\n  					}\n  					&:hover::-webkit-scrollbar-thumb {\n  							background-color: var(--bg-overlay-6, var(--background-tertiary, var(--background-base-lowest)));\n  					}\n  			}\n\n  			.userPopout .body {\n  					flex: 0 1 auto;\n  					min-height: 0;\n  					padding: 16px 8px 16px 16px;\n  			}\n\n  			.userPopout .footer {\n  					flex: 0 0 auto;\n  					position: relative;\n  					padding: 0 8px 16px 16px;\n  			}\n\n  			.userPopout :is(.body, .footer) {\n  					background-color: var(--background-secondary, var(--background-base-lower));\n  					color: hsla(0,0%,100%,.8);\n  			}\n\n  			.userPopout .bodyInnerWrapper {\n  					padding-right: 8px;\n  			}\n\n  			.userPopout .bodyTitle {\n  					font-weight: 700;\n  					color: var(--header-secondary);\n  					margin-bottom: 8px;\n  					text-transform: uppercase;\n  			}\n\n  			.userPopout .bodyInnerWrapper .userPronouns {\n  					margin-bottom: 16px;\n  			}\n\n  			.userPopout .bodyInnerWrapper .userBio {\n  					margin-bottom: 16px;\n  					-webkit-line-clamp: 190 !important;\n  					max-height: 92px;\n  					overflow-x: hidden;\n  					overflow-y: auto;\n  							&::-webkit-scrollbar {\n  							background: none;\n  							border-radius: 8px;\n  							width: 8px;\n  					}\n  					&::-webkit-scrollbar-thumb {\n  							background-clip: padding-box;\n  							border: solid 2px #0000;\n  							border-radius: 8px;\n  					}\n  					&:hover::-webkit-scrollbar-thumb {\n  							background-color: var(--bg-overlay-6, var(--background-tertiary, var(--background-base-lowest)));\n  					}\n  			}\n  			\n  			.userPopout .bodyInnerWrapper .rolesList {\n  					position: relative;\n  					flex-wrap: wrap;\n  					display: flex;\n  					margin-top: 12px;\n  					margin-bottom: 16px;\n  					.role {\n  							height: 22px;\n  							border: 1px solid;\n  							border-radius: 11px;\n  							.roleName {\n  									margin-top: 2px;\n  							}\n  					}\n  			}\n\n  			.userPopout .bodyInnerWrapper .note {\n  					margin-left: -4px;\n  					margin-right: -4px;\n  			}\n\n  			.userPopout .bodyInnerWrapper .note textarea {\n  					background-color: transparent;\n  					border: none;\n  					box-sizing: border-box;\n  					color: var(--text-default);\n  					font-size: 12px;\n  					line-height: 14px;\n  					max-height: 88px;\n  					padding: 4px;\n  					resize: none;\n  					width: 100%;\n  			}\n\n  			.userPopout .bodyInnerWrapper .note textarea:focus {\n  					background-color: var(--background-tertiary, var(--background-base-lowest)) !important;\n  			}\n\n  			.userPopout .footer .inputWrapper {\n  					display: flex;\n  					-webkit-box-orient: vertical;\n  					-webkit-box-direction: normal;\n  					flex-direction: column;\n  					padding-right: 9px;\n  					.inlineContainer {\n  							background: var(--deprecated-text-input-bg);\n  							border: 1px solid var(--deprecated-text-input-border);\n  					}\n  			}\n\n  			.userPopout .footer .protip {\n  					text-align: center;\n  					align-content: center;\n  					margin-top: 8px;\n  					margin-right: 10px;\n  					.pro, .tip {\n  							font-size: 12px;\n  							display: inline;\n  					}\n  					.pro {\n  							color: var(--green, var(--text-feedback-positive));\n  							margin-right: 3px;\n  							font-weight: 700;\n  							text-transform: uppercase;\n  					}\n  					.tip {\n  							color: var(--text-default);\n  							line-height: 16px;\n  							opacity: .6;\n  					}\n  			}\n\n  			.userPopout .activityUserPopout {\n  					background-color: rgba(0,0,0,.05);\n  					padding: 16px;\n  			}\n\n  			.userPopout .activityUserPopout .headerText {\n  					font-family: var(--font-display);\n  					line-height: 1.2857142857142858;\n  					font-weight: 700;\n  					text-transform: uppercase;\n  			}\n\n  			.userPopout .activityUserPopout .bodyAlignCenter {\n  					-webkit-box-align: center;\n  					align-content: center;\n  			}\n\n  			.userPopout .activityUserPopout .contentGameImageUserPopout {\n  					margin-bottom: -1px;\n  					margin-left: 10px;\n  			}\n\n  			.userPopout .activityUserPopout .contentImagesUserPopout {\n  					margin-left: 10px;\n  					overflow: hidden;\n  			}\n\n  			.activityUserPopoutContainerVoice .bodyNormal > div:nth-child(1) {\n  					height: 60px;\n  					width: 60px;\n  					background: rgb(255 255 255 / 0.15) !important;\n  			}\n  			.activityUserPopoutContainerVoice .bodyNormal > div:nth-child(1):before {\n  					background: rgb(255 255 255 / 0.15) !important;\n  			}\n\n  			:is(.activityUserPopoutContainerVoice, .activityUserPopoutContainerStream) .textRow svg {\n  					width: 18px;\n  					height: 18px;\n  					margin-right: 2px;\n  					position: relative;\n  					bottom: 1px;\n  					path {\n  							fill: #fff;\n  					}\n  			}\n\n  			.userPopout .activityUserPopout .mediaProgressBarContainer {\n  					margin-top: 10px;\n  					width: auto;\n  					&> div {\n  							display: grid;\n  							grid-template-areas: "progressbar progressbar" "lefttext righttext";\n  					}\n  					.bar {\n  							background-color: rgba(79,84,92,.16);\n  							height: 4px;\n  							grid-area: progressbar;\n  					}\n  					[data-text-variant="text-xs/normal"] {\n  							color: var(--white) !important;\n  							grid-area: lefttext;\n  					}\n  					[data-text-variant="text-xs/normal"]:last-child {\n  							justify-self: end;\n  							grid-area: righttext;\n  					}   \n  			}\n\n  			.userPopout .activityUserPopout :is(.nameNormal, .details, .state, .timestamp) {\n  					color: #fff;\n  			}\n\n  			.userPopout .activityUserPopout .textRow {\n  					display: block;\n  					font-size: 14px;\n  					line-height: 18px;\n  			}\n\n  			.userPopout .activityUserPopout :is(.ellipsis, .state) {\n  					white-space: nowrap;\n  					text-overflow: ellipsis;\n  					overflow: hidden;\n  			}\n\n  			.userPopout .activityUserPopout .actionsUserPopout {\n  					display: flex;\n  					flex: 1 1 auto;\n  					flex-direction: column;\n  					flex-wrap: nowrap;\n  					margin-top: 12px;\n  			}\n\n  			.userPopout .activityUserPopout .actionsUserPopout:empty {\n  					display: none;\n  			}\n\n  			.activityUserPopout .buttonContainer {\n  					flex-direction: inherit;\n  					gap: inherit;\n  			}\n\n  			.activityUserPopout .customButtons {\n  					gap: 8px;\n  			}\n\n  			.activityUserPopout .actionsUserPopout .hasText {\n  					padding: 2px 16px;\n  					&:has(svg path[d^="M20.97 4.06c0 .18.08.35.24.43.55.28.9.82 1.04 1.42.3 1.24.75 3.7.75 7.09v4.91a3.09 3.09 0 0 1-5.85 1.38l-1.76-3.51a1.09 1.09 0 0 0-1.23-.55c-.57.13-1.36.27-2.16.27s-1.6-.14-2.16-.27c-.49-.11-1 .1-1.23.55l-1.76 3.51A3.09 3.09 0 0 1 1"]) {\n  							background: var(--white) !important;\n  							border: unset !important;\n  							color: var(--background-brand);\n  							&:hover {\n  									background: #e6e6e6 !important;\n  							}\n  							&:active {\n  									background: #ccc !important;\n  							}\n  					}\n  			}\n  			.activityUserPopout .actionsUserPopout .sm:not(.hasText) {\n  					padding: 0;\n  					width: calc(var(--custom-button-button-sm-height) + 4px);\n  			}\n\n  			.activityUserPopout .actionsUserPopout button {\n  					background: transparent !important;\n  					border: 1px solid var(--white) !important;\n  					font-size: 14px;\n  					width: 100%;\n  					height: 32px;\n  					min-height: 32px !important;\n  					color: #fff;\n  					svg {\n  							display: none;\n  					}\n  			}\n\n  			:where(.button).icon {\n  					width: var(--custom-button-button-sm-height) !important;\n  			} \n\n  			.activityUserPopout .actionsUserPopout button:active {\n  					background-color: hsla(0,0%,100%,.1) !important;\n  			}\n\n  			.activityUserPopout .actionsUserPopout button svg {\n  					display: unset;\n  			}\n\n  			.activityUserPopout .actionsUserPopout .disabledButtonWrapper {\n  					margin-bottom: 8px;\n  					width: auto;\n  			}\n\n  			.activityUserPopout .badgeContainer .tabularNumbers {\n  					color: #f6fbf9 !important;\n  			}\n\n  			.activityUserPopout .badgeContainer svg path {\n  					fill: #f6fbf9 !important;\n  			}\n\n  			.activityUserPopout .assets .gameIcon {\n  					-webkit-user-drag: none;\n  					background-size: 100%;\n  					border-radius: 3px;\n  			}\n\n  			.activityUserPopout .assets .assetsLargeImageUserPopout {\n  					width: 60px;\n  					height: 60px;\n  					border-radius: 8px; \n  					object-fit: cover;\n  			}\n\n  			.activityUserPopout .assets .assetsLargeImageUserPopoutTwitch {\n  					width: 60px;\n  					height: 60px;\n  			}\n\n  			.activityUserPopout .assets:has(.assetsSmallImageUserPopout) .assetsLargeImageUserPopout {\n  					mask: url('https://discord.com/assets/3a10988d0f55c63294100b270818207a.svg');\n  			}\n\n  			.activityUserPopout .assets .assetsSmallImageUserPopout, .activityUserPopout .assets .assetsSmallImageUserPopout path {\n  					width: 20px;\n  					height: 20px;\n  					border-radius: 50%;\n  					position: absolute;\n  					bottom: -2px;\n  					right: -4px; \n  			}\n\n  			.activityUserPopout .assets .assetsLargeImageUserPopout path {\n  					transform: scale(2.55) !important;\n  			}\n\n  			.activityUserPopout .assets svg.assetsSmallImageUserPopout {\n  					border-radius: unset !important;\n  			}   \n\n  			.activityUserPopout .assets .assetsSmallImageUserPopout path {\n  					transform: scale(1.3) !important;\n  			}\n\n  			.activityUserPopout .activityUserPopoutContainerStream .bodyNormal {\n  					flex-direction: column;\n  			}\n\n  			.activityUserPopout .activityUserPopoutContainerStream .streamPreviewImage {\n  					height: 100%;\n  					object-fit: contain;\n  					width: 100%;\n  					border-radius: 8px;\n  					padding-bottom: 5px;\n  			}\n\n  			.activityUserPopout .activityUserPopoutContainerStream .streamPreviewPlaceholder {\n  					width: 146px;\n  					height: 120px;\n  					padding-bottom: 5px;\n  			}\n\n  			.activityUserPopout .assets.clickableImage {\n  					border-radius: 3px;\n  					cursor: pointer;\n  					&:after {\n  							border-radius: 3px;\n  					}\n  			}\n\n  			.activityUserPopout .activityUserPopoutContainerStream .contentImagesUserPopout {\n  					display: flex;\n  					flex-direction: row;\n  					margin-left: 0;\n  					align-self: start;\n  					width: 100%;\n  					> .textRow {\n  							flex: 1;\n  					}\n  			}\n\n  			.userPopout .headerSpotify .activityUserPopout {\n  					.details {\n  							white-space: wrap;\n  					}\n  					.actionsUserPopout {\n  							flex-direction: row;\n  							gap: 8px;\n  							.primaryButton {\n  									flex: 1;\n  									button {\n  											width: 100%;\n  									}\n  							}\n  					}\n  			}\n  			\n  			:is(.headerPlaying, .headerSpotify, .headerStreaming, .headerXbox) {\n  					.avatarWrapper rect {\n  							fill: #fff;\n  					}\n  					.headerName, .nameDisplay, .discriminator, .userTag, .customStatus {\n  							color: var(--white) !important;\n  					}\n  					.botTag {\n  							background: var(--white);\n  							> span {\n  									color: var(--bg-brand);\n  							}\n  					}\n  			}\n  	`
);
function webpackify(css) {
	for (const key in styles) {
		let regex = new RegExp(`\\.${key}([\\s,.):>])`, "g");
		css = css.replace(regex, `.${styles[key]}$1`);
	}
	return css;
}

// settings.js
const settings = {
	main: {
		showGuildTag: {
			name: "Show user guild tag",
			note: "Displays a user's guild tag under their pfp.",
			initial: true
		},
		disableDiscrim: {
			name: "Disable discriminators",
			note: "Don't like legacy discriminators? This will always display a user's modern @ tag.",
			initial: false
		},
		disableProfileThemes: {
			name: "Disable profile themes",
			note: "Disable a user's custom nitro profile colors.",
			initial: false
		}
	},
	profileSections: {
		pronouns: {
			name: intl.intl.formatToPlainString(intl.t["+T3RI/"]),
			initial: true
		},
		bio: {
			name: intl.intl.formatToPlainString(intl.t["NepzEw"]),
			initial: true
		},
		roles: {
			name: intl.intl.formatToPlainString(intl.t["LPJmL/"]),
			initial: true
		},
		note: {
			name: intl.intl.formatToPlainString(intl.t["PbMNh2"]),
			initial: true
		}
	}
};

// index.js
function Starter({ props, res }) {
	const options = {
		walkable: [
			"props",
			"children"
		],
		ignore: []
	};
	const data = betterdiscord.Utils.findInTree(props, (tree) => Object.hasOwn(tree, "isHoveringOrFocusing"), options);
	const user = props.user;
	const currentUser = data?.currentUser;
	const displayProfile = props.displayProfile;
	const detailsCheck = react.useMemo(
		() => {
			if (!props.displayProfile._userProfile) return null;
			return props.displayProfile._userProfile;
		},
		[props.displayProfile._userProfile]
	);
	if (!detailsCheck) return;
	if (betterdiscord.Data.load("disableProfileThemes")) {
		res.props.className = betterdiscord.Utils.className(res.props.className, "disable-profile-themes");
	}
	return [
		react.createElement(
			"div",
			{ className: "userPopout" },
			[
				react.createElement(headerBuilder, { data, user, displayProfile }),
				react.createElement(bodyBuilder, { data, user, displayProfile }),
				react.createElement(footerBuilder, { user, currentUser })
			]
		)
	];
}
class NewOldUserPopouts {
	start() {
		betterdiscord.Data.save("settings", settings);
		betterdiscord.DOM.addStyle("popoutCSS", popoutCSS);
		betterdiscord.Patcher.after(entireProfileModal.Z, "render", (that, [props], res) => {
			if (!props.themeType?.includes("POPOUT")) return;
			if (!betterdiscord.Utils.findInTree(
				props,
				(x) => x?.displayProfile,
				{ walkable: ["props", "children"] }
			) || betterdiscord.Utils.findInTree(res, (tree) => tree?.action === "PRESS_SWITCH_ACCOUNTS", { walkable: ["props", "children"] })) return;
			res.props.children = react.createElement(Starter, { props, res });
		});
	}
	stop() {
		betterdiscord.Patcher.unpatchAll("NewOldUserPopouts");
		betterdiscord.DOM.removeStyle("popoutCSS");
	}
	getSettingsPanel() {
		return react.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "var(--space-8)" } }, [
			react.createElement(() => Object.keys(settings.main).map(
				(key) => {
					const { name, note, initial, changed } = settings.main[key];
					const [state, setState] = react.useState(betterdiscord.Data.load(key));
					betterdiscord.Data.save(key, state ?? initial);
					return react.createElement(FormSwitch, {
						label: name,
						description: note,
						checked: state ?? initial,
						onChange: (v) => {
							betterdiscord.Data.save(key, v);
							setState(v);
							if (changed)
								changed(v);
						}
					});
				}
			)),
			react.createElement(betterdiscord.Components.Text, { size: betterdiscord.Components.Text.Sizes.SIZE_16, strong: true, style: { borderTop: "thin solid var(--border-subtle)", paddingTop: "var(--space-12)" } }, "Profile Sections"),
			react.createElement(betterdiscord.Components.Text, { color: betterdiscord.Components.Text.Colors.HEADER_SECONDARY, size: betterdiscord.Components.Text.Sizes.SIZE_12 }, "Mix and match! The world is your oyster."),
			react.createElement(() => Object.keys(settings.profileSections).map(
				(key) => {
					const { name, initial, changed } = settings.profileSections[key];
					const [state, setState] = react.useState(betterdiscord.Data.load(key));
					betterdiscord.Data.save(key, state ?? initial);
					return react.createElement(FormSwitch, {
						label: name,
						checked: state ?? initial,
						onChange: (v) => {
							betterdiscord.Data.save(key, v);
							setState(v);
							if (changed)
								changed(v);
						}
					});
				}
			))
		]);
	}
}

module.exports = NewOldUserPopouts;

/*@end@*/