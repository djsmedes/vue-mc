import Vue from 'vue'
import merge from 'lodash/merge'

export const defineModelStore = (() => {
    const definedFor = {};
    return (store, storeKey) => {
        if (!definedFor[storeKey]) {
            if (store) {
                console.log("defining model store", storeKey);
                definedFor[storeKey] = true;
                store.registerModule("$_vue-mc_" + storeKey, {
                    namespaced: true,
                    state: {},
                    mutations: {
                        UPDATE: (state, payload) => {
                            let { identifier, reference } = payload;
                            let newState = merge({}, state[reference[identifier]], reference);
                            Vue.set(state, reference[identifier], newState);
                        },
                    },
                });
            }
        }
        return store;
    };
})();
