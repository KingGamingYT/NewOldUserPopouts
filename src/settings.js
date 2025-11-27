import { intl } from "./modules";

export const settings = {
    main: {
        showGuildTag: {
            name: "Show user guild tag",
            note: "Displays a user's guild tag under their pfp.",
            initial: true,
        },
        disableDiscrim: {
            name: "Disable discriminators",
            note: "Don't like legacy discriminators? This will always display a user's modern @ tag.",
            initial: false,
        },
        disableProfileThemes: {
            name: "Disable profile themes",
            note: "Disable a user's custom nitro profile colors.",
            initial: false,
        },
    },
    profileSections: {
        pronouns: {
            name: intl.intl.formatToPlainString(intl.t['+T3RI/']),
            initial: true
        },
        bio: {
            name: intl.intl.formatToPlainString(intl.t['NepzEw']),
            initial: true
        },
        roles: {
            name: intl.intl.formatToPlainString(intl.t['LPJmL/']),
            initial: true
        },
        note: {
            name: intl.intl.formatToPlainString(intl.t['PbMNh2']),
            initial: true
        }
    }
};