import { Webpack, Patcher, ReactUtils } from 'betterdiscord';
import { lazy } from 'react';

export const [
    entireProfileModal,
    ActivityTimer,
    ActivityButtons,
    ActivityCardClasses,
    AvatarFetch,
    EmojiRenderer,
    FetchGames,
    RoleAddPopout,
    RoleRenderer,
    RolePermissionCheck,
    RoleUpdater,
    MarkdownRenderer,
    MediaProgressBar,
    MessageBar,
    MessagePrompt,
    ModalAccessUtils,
    Tooltip,
    TagGuildRenderer,
    Popout,
    PopoutContainer,
    SpotifyButtons,
    CallButtons,
    VoiceBox, 
    VoiceList, 
    VoiceIcon,
    BotTagRenderer,
    FormSwitch,
    GameProfile,
    intl,
] = /* @__PURE__ */ Webpack.getBulk(
    { filter: /* @__PURE__ */ Webpack.Filters.bySource('forceShowPremium', 'pendingThemeColors') },
    { filter: /* @__PURE__ */ Webpack.Filters.byStrings('timestamps', '.TEXT_FEEDBACK_POSITIVE'), searchExports: true },
    { filter: /* @__PURE__ */ Webpack.Filters.byStrings('activity', 'USER_PROFILE_ACTIVITY_BUTTONS') },
    { filter: /* @__PURE__ */ Webpack.Filters.byKeys('gameState', 'clickableImage') },
    { filter: /* @__PURE__ */ Webpack.Filters.byStrings('displayProfile', 'onOpenProfile', 'animateOnHover', 'previewStatus') },
    { filter: /* @__PURE__ */ Webpack.Filters.byStrings('translateSurrogatesToInlineEmoji') },
    { filter: /* @__PURE__ */ Webpack.Filters.byKeys('getDetectableGamesSupplemental') },
    { filter: /* @__PURE__ */ Webpack.Filters.byStrings('popoutRoleDot', 'getSortedRoles'), searchExports: true },
    { filter: /* @__PURE__ */ Webpack.Filters.byStrings('role', 'canRemove', 'unsafe_rawColors.PRIMARY_300') },
    { filter: /* @__PURE__ */ Webpack.Filters.byStrings('.ADMINISTRATOR', '.MANAGE_MESSAGES') },
    { filter: /* @__PURE__ */ x=>x.updateMemberRoles },
    { filter: /* @__PURE__ */ Webpack.Filters.byStrings('userBio', 'className', '.parseBioReact') },
    { filter: /* @__PURE__ */ Webpack.Filters.byStrings('start', 'end', 'duration', 'percentage') },
    { filter: /* @__PURE__ */ Webpack.Filters.byStrings('.USER_PROFILE', 'SEND_DIRECT_MESSAGE')},
    { filter: /* @__PURE__ */ Webpack.Filters.byStrings('shareToChannelMode should only be true if a valid channel is passed'), searchExports: true },
    { filter: /* @__PURE__ */ x=>x.openUserProfileModal },
    { filter: /* @__PURE__ */ Webpack.Filters.byPrototypeKeys(("renderTooltip")), searchExports: true  },
    { filter: /* @__PURE__ */ Webpack.Filters.byStrings('guildId', 'name', 'setPopoutRef', 'onClose', 'fetchGuildProfile') },
    { filter: /* @__PURE__ */ Webpack.Filters.byStrings("Unsupported animation config:"), searchExports: true },
    { filter: /* @__PURE__ */ Webpack.Filters.byStrings('type', 'position', 'data-popout-animating'), searchExports: true },
    { filter: /* @__PURE__ */ Webpack.Filters.byStrings('activity', 'PRESS_PLAY_ON_SPOTIFY_BUTTON') },
    { filter: /* @__PURE__ */ Webpack.Filters.byStrings('PRESS_JOIN_CALL_BUTTON') },
    { filter: /* @__PURE__ */ Webpack.Filters.byStrings('users', 'channel', 'themeType') },
    { filter: /* @__PURE__ */ Webpack.Filters.byStrings('maxUsers', 'guildId') },
    { filter: /* @__PURE__ */ Webpack.Filters.byStrings('channel', 'isGuildStageVoice', 'isDM', 'Pl.CONNECT') },
    { filter: /* @__PURE__ */ Webpack.Filters.bySource(".botTag", "invertColor") },
    { filter: /* @__PURE__ */ Webpack.Filters.byStrings('"data-toggleable-component":"switch"', 'layout:"horizontal"'), searchExports: true },
    { filter: x => x.openGameProfileModal },
    { filter: /* @__PURE__ */ x=>x.t && x.t.formatToMarkdownString },
)
export const ActivityStore = /* @__PURE__ */ Webpack.getStore("PresenceStore");
export const ApplicationStore = /* @__PURE__ */ Webpack.getStore('ApplicationStore');
export const ApplicationStreamPreviewStore = /* @__PURE__ */ Webpack.getStore('ApplicationStreamPreviewStore');
export const ChannelStore = /* @__PURE__ */ Webpack.getStore("ChannelStore");
export const DetectableGameSupplementalStore = /* @__PURE__ */ Webpack.getStore("DetectableGameSupplementalStore");
export const RelationshipStore = /* @__PURE__ */ Webpack.getStore('RelationshipStore');
export const GuildStore = /* @__PURE__ */ Webpack.getStore("GuildStore");
export const GuildMemberStore = /* @__PURE__ */ Webpack.getStore('GuildMemberStore');
export const GuildRoleStore = /* @__PURE__ */ Webpack.getStore('GuildRoleStore');
export const PermissionStore = /* @__PURE__ */ Webpack.getStore('PermissionStore');
export const SelectedGuildStore = /* @__PURE__ */ Webpack.getStore('SelectedGuildStore');
export const StreamStore = /* @__PURE__ */ Webpack.getStore('ApplicationStreamingStore');
export const UserStore = /* @__PURE__ */ Webpack.getStore('UserStore');
export const UserProfileStore = /* @__PURE__ */ Webpack.getStore('UserProfileStore');
export const VoiceStateStore = /* @__PURE__ */  Webpack.getStore('VoiceStateStore');

export const { useStateFromStores } = /* @__PURE__ */ Webpack.getMangled(m => m.Store, {
        useStateFromStores: /* @__PURE__ */ Webpack.Filters.byStrings("useStateFromStores")
    }, { raw: true });
    
export const UserNote = lazy(() => {
    const modalModule = /* @__PURE__ */ Webpack.getMangled("onCloseRequest:null==", {
        openModalLazy: /* @__PURE__ */ Webpack.Filters.byRegex(/^async function/)
    });

    const { promise, resolve } = Promise.withResolvers();

    const openUserModal = /* @__PURE__ */ Webpack.getByKeys("openUserProfileModal")

    const undo = Patcher.instead(modalModule, "openModalLazy", (that, args, original) => {
        if (!String(args[1]?.modalKey).startsWith("USER_PROFILE_MODAL_KEY:"))  return original.apply(that, args);

        args[0]().then(() => {
            resolve({
                default: /* @__PURE__ */ Webpack.getByStrings('hidePersonalInformation', 'onUpdate', 'placeholder')
            });
        });
    
        undo();
    });

    openUserModal.openUserProfileModal({
        userId: /* @__PURE__ */ UserStore.getCurrentUser().id
    });

    return promise;
});