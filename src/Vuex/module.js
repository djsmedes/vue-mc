import Vue from 'vue'
import merge from 'lodash/merge'
import some from 'lodash/some'
import matches from 'lodash/matches'

export const defineModelStore = (() => {
    const definedFor = {};
    return (store, storeKey) => {
        if (!definedFor[storeKey]) {
            if (store) {
                definedFor[storeKey] = true;
                store.registerModule("$_vue-mc_" + storeKey, {
                    namespaced: true,
                    state: {},
                    mutations: {
                        UPDATE: (state, payload) => {
                            let { identifier, reference } = payload;
                            let newState = merge({}, state[identifier], reference);
                            Vue.set(state, identifier, newState);
                        },
                        REMOVE: (state, payload) => {
                            let { identifier } = payload;
                            Vue.delete(state, identifier)
                        },
                    },
                });
            }
        }
        return store;
    };
})();

const filterCacheOperations = (() => {
    let cache = {};
    return {
        checkFilterCache: (storeKey, filter) => {
            if (!cache[storeKey]) {
                cache[storeKey] = [];
            }

            // if {} is in the cache, everything should match it (because you've run a request with no filter)
            // if a more-specific filter is attempted to run, but a less-specific (i.e. superset) filter has already been run,
            //   it should be matched. So we want to do the inverse of _.some's "matches shorthand"
            const predicate = cachedItem => matches(cachedItem)(filter);

            if (some(cache[storeKey], predicate)) {
                return null;
            } else {
                return () => cache[storeKey].push(filter);
            }
        },
        clearFilterCache: storeKey => {
            if (storeKey) {
                delete cache[storeKey]
            } else {
                cache = {}
            }
        },
    }
})();

export const checkFilterCache = filterCacheOperations.checkFilterCache;
export const clearFilterCache = filterCacheOperations.clearFilterCache;
