import { Data, Utils } from 'betterdiscord';
import { useState, useRef, Suspense } from 'react';
import {
    ActivityStore,
    AvatarFetch,
    BotTagRenderer,
    EmojiRenderer,
    GuildMemberStore,
    GuildRoleStore,
    intl,
    MarkdownRenderer,
    MessageBar,
    ModalAccessUtils,
    RoleAddButton,
    RolePermissionCheck,
    RoleRenderer,
    RoleUpdater,
    RelationshipStore,
    StreamStore,
    Tooltip,
    TagGuildRenderer,
    Popout,
    UserNote,
    useStateFromStores,
    VoiceStateStore
} from './modules'
import { ActivityCards, SpotifyCards, TwitchCards } from './presence';

export const TooltipBuilder = ({ note, position, children }) => {
    return (
        <Tooltip text={note} position={position || "top" }>
            { props => {
                children.props = {
                    ...props,
                    ...children.props
                };
                return children;
            }}
        </Tooltip>
    )
}

export function activityCheck({activities}) {
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

function BioBuilder({displayProfile}) {
    if (displayProfile?._guildMemberProfile?.bio) {
        return (
            <>
                <div className="bodyTitle size12">{intl.intl.formatToPlainString(intl.t['61W33d'])}</div>
                <MarkdownRenderer userBio={displayProfile.bio} className="userBio" setLineClamp={false} textColor="text-default" />
            </>
        )
    }
    
    if (displayProfile._userProfile.bio) {
        return (
            <>
                <div className="bodyTitle size12">{intl.intl.formatToPlainString(intl.t['61W33d'])}</div>
                <MarkdownRenderer userBio={displayProfile._userProfile.bio} className="userBio" setLineClamp={false} textColor="text-default" />
            </>
        )
    }
    return;
}

function ClanTagBuilder({user}) {
    const [showPopout, setShowPopout] = useState(false);
    const refDOM = useRef(null);
    return (
        <div 
            className="clanTagContainer">
            <Popout 
                targetElementRef={refDOM}
                clickTrap={true}
                onRequestClose={ () => setShowPopout(false) } 
                renderPopout={ () => <TagGuildRenderer guildId={user.primaryGuild?.identityGuildId}/> } 
                position="right" shouldShow={showPopout}>
                {(props) => <div 
                    {...props} 
                    className="clanTag" 
                    ref={refDOM} 
                    onClick={ () => { setShowPopout(true) }}>
                    <div 
                        className="clanTagInner">
                        <img 
                            className="tagBadge" 
                            src={ 'https://cdn.discordapp.com/clan-badges/' + user.primaryGuild?.identityGuildId + '/' + user.primaryGuild?.badge + '.png?size=16' }
                        />
                        <div 
                            className="tagName"
                            style={{ 
                                color: "var(--text-default)", 
                                lineHeight: "16px", 
                                fontWeight: "600", 
                                fontSize: "14px" 
                            }}>
                            {user.primaryGuild?.tag}
                        </div>
                    </div>
                </div>}
            </Popout>
        </div>
    )
}

function RoleBuilder({user, data, role, serverMember}) {
    return (
        <RoleRenderer
            className="role"
            role={role}
            guildId={data.guild.id}
            canRemove={RolePermissionCheck({guildId: data.guild.id}).canRemove}
            onRemove={() => { return RoleUpdater.updateMemberRoles(data.guild.id, user.id, serverMember.roles.filter(mRole => mRole !== role.id), [], [role.id]) }}
        />
    )
}

function RolesInnerBuilder({user, data, serverMember, selfServerMember, MemberRoles}) {
    const refDOM = useRef(null);
    return (
        <div className="rolesList" aria-orientation="vertical">
            {
                MemberRoles.map(role => 
                    <RoleBuilder
                        user={user}
                        data={data}
                        role={role}
                        serverMember={serverMember}
                    />
                )
            }
            <RoleAddButton
                guild={data.guild}
                guildMember={serverMember}
                numRoles={MemberRoles.length}
                highestRole={GuildRoleStore.getRole(data.guild.id, selfServerMember.highestRoleId)}
                onAddRole={(w) => { let b = serverMember.roles; b.push(w); return RoleUpdater.updateMemberRoles(data.guild.id, user.id, b, [w], []) }} 
                buttonRef={refDOM}
            />
        </div>
    )
}

function NoRolesInnerBuilder({user, data, serverMember, selfServerMember, MemberRoles}) {
    const refDOM = useRef(null);
    return (
        <div className="rolesList" aria-orientation="vertical">
            <RoleAddButton
                guild={data.guild}
                guildMember={serverMember}
                numRoles={MemberRoles.length}
                highestRole={GuildRoleStore.getRole(data.guild.id, selfServerMember.highestRoleId)}
                onAddRole={(w) => { let b = serverMember.roles; b.push(w); return RoleUpdater.updateMemberRoles(data.guild.id, user.id, b, [w], []) }} 
                buttonRef={refDOM}
            />
        </div>
    )
}

function RolesBuilder({user, data}) {
    if (!data?.guild?.id) {
        return;
    }
    const serverMember = GuildMemberStore.getMember(data.guild?.id, user.id);
    const selfServerMember = GuildMemberStore.getMember(data.guild?.id, data.currentUser.id);
    const MemberRoles = serverMember.roles?.map(role => GuildRoleStore.getRole(data.guild.id, role))

    if (!serverMember?.roles?.length) {
        return (
            <>
                <div 
                    className="bodyTitle size12" 
                    style={{ marginBottom: RolePermissionCheck({guildId: data.guild.id, channelId: data.channelId}).canRemove ? null : "28px" }}
                    >
                        {intl.intl.formatToPlainString(intl.t['nZfHsf'])}
                </div>
                <NoRolesInnerBuilder
                    user={user}
                    data={data}
                    serverMember={serverMember}
                    selfServerMember={selfServerMember}
                    MemberRoles={MemberRoles}
                />
            </>
        )
    }
    return (
        <>
            <div className="bodyTitle size12">
                {
                    serverMember?.roles?.length !== 1 ?
                        intl.intl.formatToPlainString(intl.t['2SZsWX'])
                    :
                        intl.intl.formatToPlainString(intl.t['XPGZXP'])
                }
            </div>
            <RolesInnerBuilder
                user={user}
                data={data}
                serverMember={serverMember}
                selfServerMember={selfServerMember}
                MemberRoles={MemberRoles}
            />
        </>
    )
}

function PronounsBuilder({displayProfile}) {
    return (
        <>
            <div className="bodyTitle size12">{intl.intl.formatToPlainString(intl.t['1w6drw'])}</div>
            <div className="userPronouns" style={{ color: "var(--text-default)", fontSize: "14px" }}>{displayProfile.pronouns}</div>
        </>
    )
}

function NoteBuilder({user}) {
    return (
        <>
            <div className="bodyTitle size12">{intl.intl.formatToPlainString(intl.t['PbMNh2'])}</div>
            <div className="note">
                <Suspense>
                    <UserNote userId={user.id} />
                </Suspense>
            </div>
        </>
    )
}

function HeaderInnerBuilder({data, user, displayProfile, tagName, displayName, nickName, activities}) {
    const _activities = activities.filter(activity => activity && activity.type === 4);
    const _emoji = _activities.filter(activity => activity.emoji);
    const serverMember = GuildMemberStore.getMember(displayProfile.guildId, user.id);

    return (
        <div className="headerTop" style={{ flex: "1 1 auto" }}>
            <AvatarFetch className="avatarWrapper" user={user} guildId={displayProfile.guildId} onOpenProfile={() => { ModalAccessUtils.openUserProfileModal({ userId: user.id }); data.onClose()}} />
            <div className={Utils.className("headerText", ((Data.load("disableDiscrim" || "main.disableDiscrim.initial") || !displayProfile._userProfile?.legacyUsername) && !user.bot) && "headerTextPomelo", "size16")}>
                { (!user.bot || serverMember?.nick) && <div className="headerNameWrapper">
                    <div className="headerName">{serverMember?.nick || nickName || displayName || tagName}</div>
                </div>
                }
                <div className="flexHorizontal" style={{ flex: "1 1 auto" }}>
                    <div className={`headerTag ${serverMember?.nick ? "headerTagNickname" : "headerTagNoNickname"} ${(serverMember?.nick || (Data.load("disableDiscrim" || "main.disableDiscrim.initial") || !displayProfile._userProfile?.legacyUsername) && !user.bot) ? "size14" : "size16"}`}>
                        {((serverMember?.nick && !Data.load("disableDiscrim" || "main.disableDiscrim.initial") && displayProfile._userProfile?.legacyUsername) || user.bot) && <div className="nameDisplay">{displayName || tagName}</div>}
                        {    
                            !Data.load("disableDiscrim" || "main.disableDiscrim.initial") && displayProfile._userProfile?.legacyUsername ?
                                <div className="discriminator">{displayProfile._userProfile?.legacyUsername?.substring(displayProfile._userProfile?.legacyUsername?.indexOf("#"))}</div>
                            : user.bot ? 
                                <div className="discriminator">{"#" + user.discriminator}</div>
                            :
                                <div className="userTag">{"@" + tagName}</div>
                        }
                        {
                            user.bot && <BotTagRenderer.Z 
                                type={
                                    user.system ?
                                        BotTagRenderer.Z.Types.OFFICIAL
                                    :
                                        BotTagRenderer.Z.Types.BOT
                                }
                                verified={user.publicFlags & (1<<16)}
                                className="botTag"
                            />
                        }
                    </div>
                </div>
            </div>
            {user.primaryGuild?.tag && Data.load("showGuildTag" || "main.showGuildTag.initial") && <ClanTagBuilder user={user} />}
            {
                _activities.length > 0 && <div className="customStatus">
                    { _emoji.map(emoji => <EmojiRenderer emoji={_activities[0].emoji} />) }
                    <div className="customStatusText">{_activities[0].state}</div>
                </div>
            }
        </div>
    )
}

export function headerBuilder({data, user, displayProfile}) {
    const tagName = user.username;
    const displayName = user.globalName;
    const nickName = RelationshipStore.getNickname(user.id)
    const activities = useStateFromStores([ ActivityStore ], () => ActivityStore.getActivities(user.id));
    const check = activityCheck({activities});
    const voice = useStateFromStores([ VoiceStateStore ], () => VoiceStateStore.getVoiceStateForUser(user.id)?.channelId);
    const stream = useStateFromStores([ StreamStore ], () => StreamStore.getAnyStreamForUser(user.id));

    if (activities.length !== 0 && (check.playing || check.listening || check.watching || check.competing) && (!check.spotify && !check.streaming && !check.xbox) || voice !== undefined) {
        return (
            <div className="headerPlaying header" style={{ backgroundColor: "var(--bg-brand)" }}>
                { displayProfile.banner && 
                    <img 
                        className="userBanner" 
                        src={displayProfile.getBannerURL({canAnimate: true})} 
                        style={{
                            width: "250px", 
                            height: "100px"
                        }} 
                        alt=""
                    /> 
                }
                <HeaderInnerBuilder 
                    data={data} 
                    user={user} 
                    displayProfile={displayProfile} 
                    tagName={tagName} 
                    displayName={displayName} 
                    nickName={nickName} 
                    activities={activities} 
                />
                <ActivityCards
                    user={user} 
                    activities={activities} 
                    voice={voice} 
                    stream={stream}
                    check={check}
                /> 
            </div>
        )
    }
    else if (activities.length !== 0 && (check.spotify && !check.streaming) || voice !== undefined) {
        return (
            <div className="headerSpotify header" style={{ backgroundColor: "#1db954" }}>
                { displayProfile.banner && 
                    <img 
                        className="userBanner" 
                        src={displayProfile.getBannerURL({canAnimate: true})} 
                        style={{
                            width: "250px", 
                            height: "100px"
                        }} 
                        alt=""
                    /> 
                }
                <HeaderInnerBuilder 
                    data={data} 
                    user={user} 
                    displayProfile={displayProfile} 
                    tagName={tagName} 
                    displayName={displayName} 
                    nickName={nickName} 
                    activities={activities} 
                />
                <SpotifyCards
                    user={user} 
                    activities={activities} 
                /> 
            </div>
        )
    }
    else if (activities.length !== 0 && check.streaming || voice !== undefined) {
        return (
            <div className="headerStreaming header" style={{ backgroundColor: "#593695" }}>
                { displayProfile.banner && 
                    <img 
                        className="userBanner" 
                        src={displayProfile.getBannerURL({canAnimate: true})} 
                        style={{
                            width: "250px", 
                            height: "100px"
                        }} 
                        alt=""
                    /> 
                }
                <HeaderInnerBuilder 
                    data={data} 
                    user={user} 
                    displayProfile={displayProfile} 
                    tagName={tagName} 
                    displayName={displayName} 
                    nickName={nickName} 
                    activities={activities} 
                />
                <TwitchCards
                    user={user} 
                    activities={activities} 
                /> 
            </div>
        )
    }
    else if (activities.length !== 0 && check.xbox || voice !== undefined) {
        return (
            <div className="headerXbox header" style={{ backgroundColor: "#107c10" }}>
                { displayProfile.banner && 
                    <img 
                        className="userBanner" 
                        src={displayProfile.getBannerURL({canAnimate: true})} 
                        style={{
                            width: "250px", 
                            height: "100px"
                        }} 
                        alt=""
                    /> 
                }
                <HeaderInnerBuilder 
                    data={data} 
                    user={user} 
                    displayProfile={displayProfile} 
                    tagName={tagName} 
                    displayName={displayName} 
                    nickName={nickName} 
                    activities={activities} 
                />
                <ActivityCards
                    user={user} 
                    activities={activities} 
                    check={check}
                /> 
            </div>
        )
    }
    return (
        <div className="headerNormal header" style={{ backgroundColor: "var(--background-tertiary, var(--background-base-lowest))" }}>
            { displayProfile.banner && 
                <img 
                    className="userBanner" 
                    src={displayProfile.getBannerURL({canAnimate: true})} 
                    style={{
                        width: "250px", 
                        height: "100px"
                    }} 
                    alt=""
                /> 
            }
            <HeaderInnerBuilder 
                data={data} 
                user={user} 
                displayProfile={displayProfile} 
                tagName={tagName} 
                displayName={displayName} 
                nickName={nickName} 
                activities={activities} 
            />
        </div>
    )
}

export function bodyBuilder({data, user, displayProfile}) {
    return (
        <div className="body scrollerBase" style={{ overflow: "hidden scroll", paddingRight: "0px" }}>
            <div className="bodyInnerWrapper">
                { Data.load("pronouns" || "profileSections.pronouns.initial") && displayProfile?.pronouns && <PronounsBuilder displayProfile={displayProfile} /> }
                { Data.load("bio" || "profileSections.pronouns.bio") && <BioBuilder displayProfile={displayProfile} /> }
                { Data.load("roles" || "profileSections.roles.initial") && displayProfile._guildMemberProfile && <RolesBuilder user={user} data={data} /> }
                { Data.load("note" || "profileSections.note.initial") && <NoteBuilder user={user}/>}
            </div>
        </div>
    )
}

export function footerBuilder({user, currentUser}) {
    const refDOM = useRef(null);

    return (
        <div className="footer">
            {(currentUser?.id && user.id !== currentUser?.id) &&
            <div className="inputWrapper">
                <MessageBar user={user} />
            </div>
            }
            <div className="protip">
                <h3 className="pro">{intl.intl.formatToPlainString(intl.t['8tvIiN']) + ": "}</h3>
                <div className="tip">{"Right click user for more actions"}</div>
            </div>
        </div>
    )
}