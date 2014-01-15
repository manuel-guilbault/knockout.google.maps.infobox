/*
*   knockout.google.maps.clusterer 0.1.0 (2014-01-15)
*   Created by Manuel Guilbault (https://github.com/manuel-guilbault)
*
*   Source: https://github.com/manuel-guilbault/knockout.google.maps.clusterer
*   MIT License: http://www.opensource.org/licenses/MIT
*/
(function (factory) {
    // Module systems magic dance.

    if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
        // CommonJS or Node: hard-coded dependency on "knockout"
        factory(require("knockout"), exports);
    } else if (typeof define === "function" && define.amd) {
        // AMD anonymous module with hard-coded dependency on "knockout"
        define(["knockout", "exports"], factory);
    } else {
        // <script> tag: use the global `ko` object, attaching a `mapping` property
        factory(ko, ko.validation = {});
    }
}(function ( ko, exports ) {
    if (typeof (ko.google.maps) === undefined) { throw "knockout.google.maps is required, please ensure it is loaded before loading this plugin"; }
(function () {
    function showInfoBox(element, bindings, viewModel, bindingContext, subscriptions) {
        element = element.cloneNode(true);
        ko.applyBindingsToDescendants(bindingContext.extend({ $subscriptions: subscriptions }), element);

        var options = ko.google.maps.binder.getCreateOptions(bindingContext, bindings, ko.bindingHandlers.infobox.binders);
        options.content = element;
        var infobox = new InfoBox(options);

        ko.google.maps.binder.bind(bindingContext, bindings, infobox, subscriptions, ko.bindingHandlers.infobox.binders);
        infoBox.open(bindingContext.$map, ko.utils.unwrapObservable(bindings.anchor));
    }

    function hideInfoBox(infobox, subscriptions) {
        if (infobox) {
            infobox.close();
        }
        subscriptions.dispose();
    }

    function panToInfoBox(infobox) {
        infobox.panBox_(infobox.disableAutoPan_);
    }

    ko.bindingHandlers.infobox = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            if (bindingContext.$map === undefined) {
                throw 'infobox binding must be used only inside the scope of a map binding.';
            }

            var bindings = ko.utils.unwrapObservable(valueAccessor());
            if (bindings.anchor === undefined) {
                throw 'infobox binding requires an anchor binding.';
            }
            if (bindings.visible === undefined) {
                throw 'infobox binding requires a visible binding.';
            }

            element = element.cloneNode(true);

            var infobox,
                parentSubscriptions = bindingContext.$subscriptions,
                subscriptions = new ko.google.maps.Subscriptions();
            if (ko.isObservable(bindings.visible)) {
                parentSubscriptions.addKOSubscription(bindings.visible.subscribe(function (visible) {
                    if (visible) {
                        infobox = showInfoBox(element, bindings, viewModel, bindingContext, subscriptions);
                    } else {
                        hideInfoBox(infobox, subscriptions);
                    }
                }));
            } else if (bindings.visible) {
                infobox = showInfoBox(element, bindings, viewModel, bindingContext, subscriptions);
            }

            parentSubscriptions.add(function () {
                hideInfoBox(infobox, subscriptions);
            });

            return { controlsDescendantBindings: true };
        },

        binders: {
            panToSelfWhenShown: {
                bind: function(bindingContext, bindings, infobox, subscriptions) {
                    if (ko.isObservable(bindings.visible)) {
                        subscriptions.addKOSubscription(bindings.visible.subscribe(function (visible) {
                            if (ko.utils.unwrapObservable(bindings.panToSelfWhenShown) && visible) {
                                setTimeout(function () { panToInfoBox(infobox); }, 0);
                            }
                        }));
                    } else if (ko.utils.unwrapObservable(bindings.panToSelfWhenShown) && ko.utils.unwrapObservable(bindings.visible)) {
                        setTimeout(function () { panToInfoBox(infobox); }, 0);
                    }
                }
            },
            disableAutoPan: {
                createOptions: 'disableAutoPan',
                bindings: 'disableAutoPan'
            },
            maxWidth: {
                createOptions: 'maxWidth',
                bindings: 'maxWidth'
            },
            pixelOffset: {
                createOptions: 'pixelOffset',
                bindings: 'pixelOffset'
            },
            position: {
                createOptions: 'position',
                bindings: { name: 'position', vmToObj: { setter: 'setPosition' } }
            },
            alignBottom: {
                createOptions: 'alignBottom',
                bindings: 'alignBottom'
            },
            boxClass: {
                createOptions: 'boxClass',
                bindings: 'boxClass'
            },
            infoBoxClearance: {
                createOptions: 'infoBoxClearance',
                bindings: 'infoBoxClearance'
            }
        }
    };
})();
}));