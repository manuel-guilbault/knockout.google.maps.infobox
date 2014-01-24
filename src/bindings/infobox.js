(function () {
    function showInfoBox(element, bindings, viewModel, bindingContext, subscriptions) {
        var elementClone = ko.google.maps.utils.cloneNode(element, true);
        ko.applyBindingsToDescendants(bindingContext.extend({ $subscriptions: subscriptions }), elementClone);

        var options = ko.google.maps.binder.getCreateOptions(bindingContext, bindings, ko.bindingHandlers.infobox.binders);
        options.content = elementClone;
        var infobox = new InfoBox(options);

        ko.google.maps.binder.bind(bindingContext, bindings, infobox, subscriptions, ko.bindingHandlers.infobox.binders);
        infobox.open(bindingContext.$map, ko.utils.unwrapObservable(bindings.anchor));

        subscriptions.add(function () {
            ko.cleanNode(elementClone);
        });

        return infobox;
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

            //element = element.cloneNode(true);

            var infobox = null,
                parentSubscriptions = bindingContext.$subscriptions,
                subscriptions = new ko.google.maps.Subscriptions();
            if (ko.isObservable(bindings.visible)) {
                parentSubscriptions.addKOSubscription(bindings.visible.subscribe(function (visible) {
                    if (visible) {
                        infobox = showInfoBox(element, bindings, viewModel, bindingContext, subscriptions);
                    } else {
                        hideInfoBox(infobox, subscriptions);
                        infobox = null;
                    }
                }));
            }
            if (ko.utils.unwrapObservable(bindings.visible)) {
                infobox = showInfoBox(element, bindings, viewModel, bindingContext, subscriptions);
            }

            parentSubscriptions.add(function () {
                if (infobox) {
                    hideInfoBox(infobox, subscriptions);
                }
            });

            return { controlsDescendantBindings: true };
        },

        binders: {
            panToSelfWhenShown: {
                bind: function (bindingContext, bindings, infobox, subscriptions) {
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
                createOptions: { name: 'disableAutoPan', type: 'bool' },
                bindings: { name: 'disableAutoPan', type: 'bool' }
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
                createOptions: { name: 'alignBottom', type: 'bool' },
                bindings: { name: 'alignBottom', type: 'bool' }
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