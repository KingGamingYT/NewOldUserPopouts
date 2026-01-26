import { Webpack, Data, Components, Patcher, DOM, Utils } from "betterdiscord";
import { createElement, useMemo, useState } from 'react'
import { entireProfileModal, FormSwitch } from "./modules"
import { headerBuilder, bodyBuilder, footerBuilder } from "./builders";
import { popoutCSS } from './styles'
import { settings } from './settings'

function Starter({props, res}) {
    const options = {
        walkable: [
            'props',
            'children'
        ],
        ignore: []
    };
    const data = Utils.findInTree(props, (tree) => Object.hasOwn(tree, 'isHoveringOrFocusing'), options)
    const user = props.user
    const currentUser = data?.currentUser;
    const displayProfile = props.displayProfile;

    const detailsCheck = useMemo(() => { 
        if (!props.displayProfile._userProfile) return null;
        return props.displayProfile._userProfile; }, [ props.displayProfile._userProfile ]
    );
    if (!detailsCheck) return;
    if (Data.load('disableProfileThemes' || 'main.disableProfileThemes.initial')) {
        res.props.className = Utils.className(res.props.className, "disable-profile-themes");
    }
    return [
        createElement('div', {className: "userPopout"}, 
            [
                createElement(headerBuilder, {data, user, displayProfile}),
                createElement(bodyBuilder, {data, user, displayProfile}),
                createElement(footerBuilder, {user, currentUser})
            ]
        )
    ]
}

export default class NewOldUserPopouts {
    start() {
        Data.save("settings", settings);
        DOM.addStyle('popoutCSS', popoutCSS);
        Patcher.after(entireProfileModal.A, "render", (that, [props], res) => {
            if (!props.themeType?.includes("POPOUT")) return;
            if (!Utils.findInTree(
                props, x => x?.displayProfile, { walkable: ['props', 'children'] }) 
                || Utils.findInTree(res, (tree) => tree?.action === "PRESS_SWITCH_ACCOUNTS", { walkable: ['props', 'children'] })
            ) return;
            res.props.children = createElement(Starter, {props, res})
        })
    }
    stop() {
        Patcher.unpatchAll("NewOldUserPopouts");
        DOM.removeStyle('popoutCSS');
    }

    getSettingsPanel() {
        return (
        createElement('div', {style: { display: "flex", flexDirection: "column", gap: "var(--space-8)" }}, [
            createElement(() => Object.keys(settings.main).map((key) => {
                    const { name, note, initial, changed } = settings.main[key];
                    const [state, setState] = useState(Data.load(key));
                    Data.save(key, state ?? initial);

                    return createElement(FormSwitch, {
                        label: name,
                        description: note,
                        checked: state ?? initial,
                        onChange: (v) => {
                            Data.save(key, v);
                            setState(v);
                            if (changed)
                                changed(v);
                        }
                    });
                }
            )),
            createElement(Components.Text, {size: Components.Text.Sizes.SIZE_16, strong: true, style: { borderTop: "thin solid var(--border-subtle)", paddingTop: "var(--space-12)"}}, "Profile Sections"),
            createElement(Components.Text, {color: Components.Text.Colors.HEADER_SECONDARY, size: Components.Text.Sizes.SIZE_12}, "Mix and match! The world is your oyster."),
            createElement(() => Object.keys(settings.profileSections).map((key) => {
                    const { name, initial, changed } = settings.profileSections[key];
                    const [state, setState] = useState(Data.load(key));
                    Data.save(key, state ?? initial);

                    return createElement(FormSwitch, {
                        label: name,
                        checked: state ?? initial,
                        onChange: (v) => {
                            Data.save(key, v);
                            setState(v);
                            if (changed)
                                changed(v);
                        }
                    });
                }
            )),
	    ])
    )}
}