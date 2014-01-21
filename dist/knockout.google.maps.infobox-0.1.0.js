/*
*   knockout.google.maps.infobox 0.1.0 (2014-01-21)
*   Created by Manuel Guilbault (https://github.com/manuel-guilbault)
*
*   Source: https://github.com/manuel-guilbault/knockout.google.maps.infobox
*   MIT License: http://www.opensource.org/licenses/MIT
*/!function(a){"function"==typeof require&&"object"==typeof exports&&"object"==typeof module?a(require("knockout"),exports):"function"==typeof define&&define.amd?define(["knockout","exports"],a):a(ko,ko.validation={})}(function(a){if(void 0===typeof a.google.maps)throw"knockout.google.maps is required, please ensure it is loaded before loading this plugin";!function(){function b(b,c,d,e,f){b=b.cloneNode(!0),a.applyBindingsToDescendants(e.extend({$subscriptions:f}),b);var g=a.google.maps.binder.getCreateOptions(e,c,a.bindingHandlers.infobox.binders);g.content=b;var h=new InfoBox(g);return a.google.maps.binder.bind(e,c,h,f,a.bindingHandlers.infobox.binders),h.open(e.$map,a.utils.unwrapObservable(c.anchor)),h}function c(a,b){a&&a.close(),b.dispose()}function d(a){a.panBox_(a.disableAutoPan_)}a.bindingHandlers.infobox={init:function(d,e,f,g,h){if(void 0===h.$map)throw"infobox binding must be used only inside the scope of a map binding.";var i=a.utils.unwrapObservable(e());if(void 0===i.anchor)throw"infobox binding requires an anchor binding.";if(void 0===i.visible)throw"infobox binding requires a visible binding.";d=d.cloneNode(!0);var j,k=h.$subscriptions,l=new a.google.maps.Subscriptions;return a.isObservable(i.visible)&&k.addKOSubscription(i.visible.subscribe(function(a){a?j=b(d,i,g,h,l):c(j,l)})),a.utils.unwrapObservable(i.visible)&&(j=b(d,i,g,h,l)),k.add(function(){c(j,l)}),{controlsDescendantBindings:!0}},binders:{panToSelfWhenShown:{bind:function(b,c,e,f){a.isObservable(c.visible)?f.addKOSubscription(c.visible.subscribe(function(b){a.utils.unwrapObservable(c.panToSelfWhenShown)&&b&&setTimeout(function(){d(e)},0)})):a.utils.unwrapObservable(c.panToSelfWhenShown)&&a.utils.unwrapObservable(c.visible)&&setTimeout(function(){d(e)},0)}},disableAutoPan:{createOptions:{name:"disableAutoPan",type:"bool"},bindings:{name:"disableAutoPan",type:"bool"}},maxWidth:{createOptions:"maxWidth",bindings:"maxWidth"},pixelOffset:{createOptions:"pixelOffset",bindings:"pixelOffset"},position:{createOptions:"position",bindings:{name:"position",vmToObj:{setter:"setPosition"}}},alignBottom:{createOptions:{name:"alignBottom",type:"bool"},bindings:{name:"alignBottom",type:"bool"}},boxClass:{createOptions:"boxClass",bindings:"boxClass"},infoBoxClearance:{createOptions:"infoBoxClearance",bindings:"infoBoxClearance"}}}}()});