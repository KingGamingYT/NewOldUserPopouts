import { Webpack } from 'betterdiscord';

const styles = Object.assign(
    {
        roleName: Webpack.getByKeys('role', 'roleName', 'roleNameOverflow').roleName,
        primaryButton: Webpack.getByKeys('primaryButton', 'customButtons').primaryButton,
        customButtons: Webpack.getByKeys('primaryButton', 'customButtons').customButtons,
        hasText: Webpack.getModule(x=>x.primary && x.hasText && !x.hasTrailing).hasText,
        sm: Webpack.getModule(x=>x.primary && x.hasText && !x.hasTrailing).sm,
        clickableImage: Webpack.getByKeys('gameState', 'clickableImage').clickableImage
    },
    Webpack.getByKeys('container', 'bar', 'progress'),
    Webpack.getByKeys('outer', 'overlay'),
    Webpack.getByKeys('root', 'pill', 'expandButton'),
    Webpack.getByKeys('inlineContainer', 'themedBackground'),
    Webpack.getByKeys('badgeContainer', 'badgesContainer'),
    Webpack.getByKeys('tabularNumbers'),
);

export const popoutCSS = webpackify(
    `
        body {
            --background-brand: var(--bg-brand);
            --profile-banner-background-pattern: url("data:image/png;base64,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");
        }

        .outer.user-profile-popout {
            width: fit-content;
        }

        .outer.user-profile-popout.custom-user-profile-theme:not(.disable-profile-themes) {
            /* background: linear-gradient(var(--profile-gradient-primary-color) / 50%, var(--profile-gradient-secondary-color) / 50%); */
            --profile-gradient-start: color-mix(in oklab, var(--profile-gradient-primary-color) 100%, var(--profile-gradient-primary-color)) !important;
            --profile-gradient-end: color-mix(in oklab, var(--profile-gradient-secondary-color) 100%, var(--profile-gradient-secondary-color)) !important;
            --custom-user-profile-theme-color-blend: linear-gradient(color-mix(in oklab, var(--profile-gradient-overlay-color), var(--profile-gradient-start)), color-mix(in oklab, var(--profile-gradient-overlay-color), var(--profile-gradient-end)));
        }

        .outer.user-profile-popout.custom-user-profile-theme.disable-profile-themes {
            --custom-user-profile-theme-padding: 0;
            --custom-theme-base-color-amount: 0% !important;
            --custom-theme-text-color-amount: 0% !important;
        }

        :where(.theme-dark) .outer:not(.disable-profile-themes) .userPopout {
            background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), var(--custom-theme-base-color, var(--background-secondary, var(--background-base-lower))) !important;
        }
        :where(.theme-light) .outer:not(.disable-profile-themes) .userPopout {
            background: var(--custom-theme-base-color, var(--background-secondary, var(--background-base-lower))) !important;
        }

        .custom-theme-background .theme-dark, .theme-dark.custom-theme-background {
            --custom-theme-base-color: var(--custom-user-profile-theme-color-blend, var(--theme-base-color-dark)) !important;
        }
        .custom-theme-background .theme-light, .theme-light.custom-theme-background {
            --custom-theme-base-color: var(--custom-user-profile-theme-color-blend, var(--theme-base-color-light)) !important;
        }

        .userPopout {
            box-shadow: 0 2px 10px 0 rgba(0,0,0,.2), 0 0 0 1px rgba(32,34,37,.6);
            width: 250px;
            border-radius: 5px;
            overflow: hidden;
            max-height: calc(100vh - 20px);
            display: flex;
            flex-direction: column;
        }

        .size14 {
            font-size: 14px;
        }

        .size16 {
            font-size: 16px;
        }

        .size12 {
            font-size: 12px;
        }

        .userPopout .userBanner {
            margin-bottom: -50px;
            mask-image: linear-gradient(to bottom, #fff, rgb(255 255 255 / 0%));
            pointer-events: none;
        }
        
        .headerTop {
            padding: 16px;
            flex-direction: column;
            flex-wrap: nowrap;
            justify-content: center;
            align-items: center;
            display: flex;
        }

        .avatarWrapper {
            margin-bottom: 12px;
            position: relative;
            left: unset !important;
            top: unset !important;
            width: initial;
        }

        .userPopout .body .headerText {
            flex-direction: column;
            text-align: center;
            align-items: center;
            display: flex;
            user-select: text;
            overflow: hidden;
        }

        .userPopout .headerNameWrapper {
            align-items: center;
            justify-items: center;
            justify-content: center;
            display: flex;
        }

        .userPopout .headerName {
            color: var(--header-primary);
            font-weight: 600;
            white-space: normal;
            text-align: center;
            text-overflow: ellipsis;
            overflow: hidden;
        }

        .userPopout .headerText:is(.headerTextPomelo) .headerName {
            margin-bottom: 2px;
        }

        .userPopout .headerTag:is(.headerTagNickname) {
            margin-top: 2px;
        }
        
        .flexHorizontal {
            flex-direction: row;
            flex-wrap: nowrap;
            justify-content: center;
            align-items: center;
            display: flex;
        }

        .userPopout :is(.headerName, .headerTag) {
            font-weight: 600;
        }

        .userPopout .headerTag {
            color: var(--header-secondary);
            font-weight: 500;
            line-height: 18px;
            flex-wrap: wrap;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
        }
        
        .userPopout .nameDisplay {
            flex: 0 1 auto;
            text-overflow: ellipsis;
            overflow: hidden;
        }

        .userPopout .flexHorizontal:only-child .nameDisplay {
            color: var(--header-primary);
            font-weight: 600;
        }

        .userPopout .headerText:not(.headerTextPomelo, :has(.headerTagNickname, .botTag)) {
            flex-direction: row;
        }

        .userPopout .headerText {
            display: flex;
            flex-direction: column;
        }

        .userPopout :is(.discriminator, .userTag) {
            font-weight: 500;
        }
        
        .userPopout :is(.nameTag, .discriminator, .userTag) {
            display: block;
        }

        .customStatus {
            color: var(--header-secondary);
            margin-top: 12px;
            text-align: center;
            width: 100%;
            overflow-wrap: break-word;
            font-size: 14px;
            line-height: 18px;
            font-weight: 500;
        }

        .customStatus .emoji {
            width: 20px;
            height: 20px;
        }

        .customStatus .emoji:not(:last-child) {
            margin-right: 8px;
        }

        .customStatus .emoji+.customStatusText {
            display: inline;
        }
        
        .customStatus:has(.customStatusText:empty) .emoji {
            height: 48px;
            width: 48px;
        }

        .userPopout .customStatusText {
            user-select: text;
            text-align: baseline;
            max-height: 70px;
            overflow: hidden;
        }

        .userPopout .botTag {
            flex: 0 0 auto;
            margin-left: 1ch;
        }

        .userPopout .clanTagContainer {
            max-width: 80px;
            overflow: hidden;
            margin-top: 8px;
        }

        .userPopout .clanTag {
            align-items: center;
            background: rgba(0,0,0,0.2);
            border-radius: 4px;
            display: inline-flex;
            line-height: 16px !important;
            padding: 0 4px;
            transition: background .1s ease-in-out;
            vertical-align: middle;
            height: 20px;
        }

        .userPopout .clanTagInner {
            align-items: center;
            display: inline-flex;
            line-height: 16px !important;
            max-width: 60px;
        }

        .userPopout .tagBadge {
            margin-right: 2px;
            margin-top: 0;
            width: 14px;
            height: 14px;
        }

        .userPopout .scrollerBase {
            position: relative;
            box-sizing: border-box;
            min-height: 0;
            flex: 1 1 auto;
            &::-webkit-scrollbar {
            background: none;
            border-radius: 8px;
            width: 8px;
            }
            &::-webkit-scrollbar-thumb {
                background-clip: padding-box;
                border: solid 2px #0000;
                border-radius: 8px;
            }
            &:hover::-webkit-scrollbar-thumb {
                background-color: var(--bg-overlay-6, var(--background-tertiary, var(--background-base-lowest)));
            }
        }

        .userPopout .body {
            flex: 0 1 auto;
            min-height: 0;
            padding: 16px 8px 16px 16px;
        }

        .userPopout .footer {
            flex: 0 0 auto;
            position: relative;
            padding: 0 8px 16px 16px;
        }

        .userPopout :is(.body, .footer) {
            background-color: var(--background-secondary, var(--background-base-lower));
            color: hsla(0,0%,100%,.8);
        }

        .userPopout .bodyInnerWrapper {
            padding-right: 8px;
        }

        .userPopout .bodyTitle {
            font-weight: 700;
            color: var(--header-secondary);
            margin-bottom: 8px;
            text-transform: uppercase;
        }

        .userPopout .bodyInnerWrapper .userPronouns {
            margin-bottom: 16px;
        }

        .userPopout .bodyInnerWrapper .userBio {
            margin-bottom: 16px;
            -webkit-line-clamp: 190 !important;
            max-height: 92px;
            overflow-x: hidden;
            overflow-y: auto;
                &::-webkit-scrollbar {
                background: none;
                border-radius: 8px;
                width: 8px;
            }
            &::-webkit-scrollbar-thumb {
                background-clip: padding-box;
                border: solid 2px #0000;
                border-radius: 8px;
            }
            &:hover::-webkit-scrollbar-thumb {
                background-color: var(--bg-overlay-6, var(--background-tertiary, var(--background-base-lowest)));
            }
        }
        
        .userPopout .bodyInnerWrapper .rolesList {
            position: relative;
            flex-wrap: wrap;
            display: flex;
            margin-top: 12px;
            margin-bottom: 16px;
            .role {
                height: 22px;
                border: 1px solid;
                border-radius: 11px;
                .roleName {
                    margin-top: 2px;
                }
            }
        }

        .userPopout .bodyInnerWrapper .note {
            margin-left: -4px;
            margin-right: -4px;
        }

        .userPopout .bodyInnerWrapper .note textarea {
            background-color: transparent;
            border: none;
            box-sizing: border-box;
            color: var(--text-default);
            font-size: 12px;
            line-height: 14px;
            max-height: 88px;
            padding: 4px;
            resize: none;
            width: 100%;
        }

        .userPopout .bodyInnerWrapper .note textarea:focus {
            background-color: var(--background-tertiary, var(--background-base-lowest)) !important;
        }

        .userPopout .footer .inputWrapper {
            display: flex;
            -webkit-box-orient: vertical;
            -webkit-box-direction: normal;
            flex-direction: column;
            padding-right: 9px;
            .inlineContainer {
                background: var(--deprecated-text-input-bg);
                border: 1px solid var(--deprecated-text-input-border);
            }
        }

        .userPopout .footer .protip {
            text-align: center;
            align-content: center;
            margin-top: 8px;
            margin-right: 10px;
            .pro, .tip {
                font-size: 12px;
                display: inline;
            }
            .pro {
                color: var(--green, var(--text-feedback-positive));
                margin-right: 3px;
                font-weight: 700;
                text-transform: uppercase;
            }
            .tip {
                color: var(--text-default);
                line-height: 16px;
                opacity: .6;
            }
        }

        .userPopout .activityUserPopout {
            background-color: rgba(0,0,0,.05);
            padding: 16px;
        }

        .userPopout .activityUserPopout .headerText {
            font-family: var(--font-display);
            line-height: 1.2857142857142858;
            font-weight: 700;
            text-transform: uppercase;
        }

        .userPopout .activityUserPopout .bodyAlignCenter {
            -webkit-box-align: center;
            align-content: center;
        }

        .userPopout .activityUserPopout .contentGameImageUserPopout {
            margin-bottom: -1px;
            margin-left: 10px;
        }

        .userPopout .activityUserPopout .contentImagesUserPopout {
            margin-left: 10px;
            overflow: hidden;
        }

        .activityUserPopoutContainerVoice .bodyNormal > div:nth-child(1) {
            height: 60px;
            width: 60px;
            background: rgb(255 255 255 / 0.15) !important;
        }
        .activityUserPopoutContainerVoice .bodyNormal > div:nth-child(1):before {
            background: rgb(255 255 255 / 0.15) !important;
        }

        :is(.activityUserPopoutContainerVoice, .activityUserPopoutContainerStream) .textRow svg {
            width: 18px;
            height: 18px;
            margin-right: 2px;
            position: relative;
            bottom: 1px;
            path {
                fill: #fff;
            }
        }

        .userPopout .activityUserPopout .mediaProgressBarContainer {
            margin-top: 10px;
            width: auto;
            &> div {
                display: grid;
                grid-template-areas: "progressbar progressbar" "lefttext righttext";
            }
            .bar {
                background-color: rgba(79,84,92,.16);
                height: 4px;
                grid-area: progressbar;
            }
            [data-text-variant="text-xs\/normal"] {
                color: var(--white) !important;
                grid-area: lefttext;
            }
            [data-text-variant="text-xs\/normal"]:last-child {
                justify-self: end;
                grid-area: righttext;
            }   
        }

        .userPopout .activityUserPopout :is(.nameNormal, .details, .state, .timestamp) {
            color: #fff;
        }

        .userPopout .activityUserPopout .textRow {
            display: block;
            font-size: 14px;
            line-height: 18px;
        }

        .userPopout .activityUserPopout :is(.ellipsis, .state) {
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }

        .userPopout .activityUserPopout .actionsUserPopout {
            display: flex;
            flex: 1 1 auto;
            flex-direction: column;
            flex-wrap: nowrap;
            margin-top: 12px;
        }

        .userPopout .activityUserPopout .actionsUserPopout:empty {
            display: none;
        }

        .activityUserPopout .buttonContainer {
            flex-direction: inherit;
            gap: inherit;
        }

        .activityUserPopout .customButtons {
            gap: 8px;
        }

        .activityUserPopout .actionsUserPopout .hasText {
            padding: 2px 16px;
            &:has(svg path[d^="M20.97 4.06c0 .18.08.35.24.43.55.28.9.82 1.04 1.42.3 1.24.75 3.7.75 7.09v4.91a3.09 3.09 0 0 1-5.85 1.38l-1.76-3.51a1.09 1.09 0 0 0-1.23-.55c-.57.13-1.36.27-2.16.27s-1.6-.14-2.16-.27c-.49-.11-1 .1-1.23.55l-1.76 3.51A3.09 3.09 0 0 1 1"]) {
                background: var(--white) !important;
                border: unset !important;
                color: var(--background-brand);
                &:hover {
                    background: #e6e6e6 !important;
                }
                &:active {
                    background: #ccc !important;
                }
            }
        }
        .activityUserPopout .actionsUserPopout .sm:not(.hasText) {
            padding: 0;
            width: calc(var(--custom-button-button-sm-height) + 4px);
        }

        .activityUserPopout .actionsUserPopout button {
            background: transparent !important;
            border: 1px solid var(--white) !important;
            font-size: 14px;
            width: 100%;
            height: 32px;
            min-height: 32px !important;
            color: #fff;
            svg {
                display: none;
            }
        }

        :where(.button).icon {
            width: var(--custom-button-button-sm-height) !important;
        } 

        .activityUserPopout .actionsUserPopout button:active {
            background-color: hsla(0,0%,100%,.1) !important;
        }

        .activityUserPopout .actionsUserPopout button svg {
            display: unset;
        }

        .activityUserPopout .actionsUserPopout .disabledButtonWrapper {
            margin-bottom: 8px;
            width: auto;
        }

        .activityUserPopout .badgeContainer .tabularNumbers {
            color: #f6fbf9 !important;
        }

        .activityUserPopout .badgeContainer svg path {
            fill: #f6fbf9 !important;
        }

        .activityUserPopout .assets .gameIcon {
            -webkit-user-drag: none;
            background-size: 100%;
            border-radius: 3px;
        }

        .activityUserPopout .assets .assetsLargeImageUserPopout {
            width: 60px;
            height: 60px;
            border-radius: 8px; 
            object-fit: cover;
        }

        .activityUserPopout .assets .assetsLargeImageUserPopoutTwitch {
            width: 60px;
            height: 60px;
        }

        .activityUserPopout .assets:has(.assetsSmallImageUserPopout) .assetsLargeImageUserPopout {
            mask: url('https://discord.com/assets/3a10988d0f55c63294100b270818207a.svg');
        }

        .activityUserPopout .assets .assetsSmallImageUserPopout, .activityUserPopout .assets .assetsSmallImageUserPopout path {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            position: absolute;
            bottom: -2px;
            right: -4px; 
        }

        .activityUserPopout .assets .assetsLargeImageUserPopout path {
            transform: scale(2.55) !important;
        }

        .activityUserPopout .assets svg.assetsSmallImageUserPopout {
            border-radius: unset !important;
        }   

        .activityUserPopout .assets .assetsSmallImageUserPopout path {
            transform: scale(1.3) !important;
        }

        .activityUserPopout .activityUserPopoutContainerStream .bodyNormal {
            flex-direction: column;
        }

        .activityUserPopout .activityUserPopoutContainerStream .streamPreviewImage {
            height: 100%;
            object-fit: contain;
            width: 100%;
            border-radius: 8px;
            padding-bottom: 5px;
        }

        .activityUserPopout .activityUserPopoutContainerStream .streamPreviewPlaceholder {
            width: 146px;
            height: 120px;
            padding-bottom: 5px;
        }

        .activityUserPopout .assets.clickableImage {
            border-radius: 3px;
            cursor: pointer;
            &:after {
                border-radius: 3px;
            }
        }

        .activityUserPopout .activityUserPopoutContainerStream .contentImagesUserPopout {
            display: flex;
            flex-direction: row;
            margin-left: 0;
            align-self: start;
            width: 100%;
            > .textRow {
                flex: 1;
            }
        }

        .userPopout .headerSpotify .activityUserPopout {
            .details {
                white-space: wrap;
            }
            .actionsUserPopout {
                flex-direction: row;
                gap: 8px;
                .primaryButton {
                    flex: 1;
                    button {
                        width: 100%;
                    }
                }
            }
        }
        
        :is(.headerPlaying, .headerSpotify, .headerStreaming, .headerXbox) {
            .avatarWrapper rect {
                fill: #fff;
            }
            .headerName, .nameDisplay, .discriminator, .userTag, .customStatus {
                color: var(--white) !important;
            }
            .botTag {
                background: var(--white);
                > span {
                    color: var(--bg-brand);
                }
            }
        }
    `
)

export function webpackify(css) {
    for (const key in styles) {
        let regex = new RegExp(`\\.${key}([\\s,.):>])`, 'g');
        css = css.replace(regex, `.${styles[key]}$1`);
    }
    return css;
}