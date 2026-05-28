import {
    DUIButton,
    DUINavigationButton,
    DUISelect,
    RequestManager,
    SourceStateManager
} from "@paperback/types"

import {
    DEFAULT_SERVER_SOURCE,
    fetchServerCategories,
    fetchServerSources,
    getAuthState,
    getCategoriesIds,
    getCategoryNameFromId,
    getCategoryRowState,
    getCategoryRowStyle,
    getLanguageCodes,
    getLanguageName,
    getMangaPerRow,
    getPassword,
    getSelectedCategories,
    getSelectedLanguages,
    getSelectedSources,
    getServerCategories,
    getServerLanguages,
    getServerSources,
    getServerURL,
    getSourceNameFromId,
    getSourceRowState,
    getSourceRowStyle,
    getSourcesIds,
    getUpdatedRowState,
    getUpdatedRowStyle,
    getUsername,
    resetSettings,
    rowStyles,
    setAuthState,
    setCategoryRowState,
    setCategoryRowStyle,
    setMangaPerRow,
    setPassword,
    setSelectedCategories,
    setSelectedLanguages,
    setSelectedSources,
    setServerCategories,
    setServerSources,
    setServerURL,
    setSourceRowState,
    setSourceRowStyle,
    setUpdatedRowState,
    setUpdatedRowStyle,
    setUsername,
    styleResolver,
    testRequest
} from "./Common"

// ---------------------------------------------------------------------------
// Server settings page (URL + Auth)
// ---------------------------------------------------------------------------
export const serverAddressSettings = (stateManager: SourceStateManager, requestManager: RequestManager): DUINavigationButton => {
    return App.createDUINavigationButton({
        id: "serverSettings",
        label: "Server Settings",
        form: App.createDUIForm({
            onSubmit: async () => {
                await setServerURL(stateManager, await getServerURL(stateManager), false)

                try {
                    const serverSources = await fetchServerSources(stateManager, requestManager)
                    const serverCategories = await fetchServerCategories(stateManager, requestManager)
                    await setServerSources(stateManager, serverSources)
                    await setServerCategories(stateManager, serverCategories)
                } catch (e) {
                    console.log(`Server settings submit failed: ${e}`)
                    throw new Error(`Failed to fetch server. ${e instanceof Error ? e.message : ''}`)
                }
            },
            sections: async () => {
                let testResults = "Click on the button!"
                return [
                    App.createDUISection({
                        id: "urlSection",
                        header: "Server Address",
                        isHidden: false,
                        rows: async () => [
                            App.createDUIInputField({
                                id: "urlInputField",
                                label: "Server URL",
                                value: App.createDUIBinding({
                                    async get() {
                                        return await getServerURL(stateManager)
                                    },
                                    async set(newValue) {
                                        await setServerURL(stateManager, newValue, true)
                                    }
                                })
                            }),
                            App.createDUIButton({
                                id: "testServerButton",
                                label: "Test Server",
                                onTap: async () => {
                                    console.log('Testing server');
                                    try {
                                        const value = await testRequest(stateManager, requestManager)
                                        if (value instanceof Error) {
                                            testResults = `Error: ${value.message}`
                                        } else {
                                            testResults = `Response: ${JSON.stringify(value)}`
                                        }
                                    } catch (e) {
                                        testResults = `Error: ${e instanceof Error ? e.message : String(e)}`
                                    }
                                    console.log(`Test results: ${testResults}`)
                                }
                            }),
                            App.createDUILabel({
                                id: "test_label",
                                label: testResults,
                            })
                        ]
                    }),
                    App.createDUISection({
                        id: "authSettings",
                        header: "Authorization",
                        isHidden: false,
                        rows: async () => [
                            App.createDUISwitch({
                                id: "authStateSwitch",
                                label: "Enabled",
                                value: App.createDUIBinding({
                                    async get() {
                                        return await getAuthState(stateManager)
                                    },
                                    async set(newValue) {
                                        await setAuthState(stateManager, newValue as boolean)
                                    }
                                })
                            }),
                            App.createDUIInputField({
                                id: "UsernameInputField",
                                label: "Username",
                                value: App.createDUIBinding({
                                    async get() {
                                        return await getUsername(stateManager)
                                    },
                                    async set(newValue) {
                                        await setUsername(stateManager, newValue as string)
                                    }
                                })
                            }),
                            App.createDUISecureInputField({
                                id: "passwordInputField",
                                label: "Password",
                                value: App.createDUIBinding({
                                    async get() {
                                        return await getPassword(stateManager)
                                    },
                                    async set(newValue) {
                                        await setPassword(stateManager, newValue as string)
                                    }
                                })
                            })
                        ]
                    })
                ]
            }
        })
    })
}

// ---------------------------------------------------------------------------
// Homepage settings page
// ---------------------------------------------------------------------------
export const HomepageSettings = (stateManager: SourceStateManager, _requestManager: RequestManager): DUINavigationButton => {
    return App.createDUINavigationButton({
        id: "homepageSettings",
        label: "Homepage Settings",
        form: App.createDUIForm({
            sections: async () => {
                return [
                    App.createDUISection({
                        id: "mangaPerRowSection",
                        header: "Manga Per Row",
                        isHidden: false,
                        rows: async () => [
                            App.createDUIStepper({
                                id: "mangaPerRowStepper",
                                label: "",
                                min: 0,
                                value: App.createDUIBinding({
                                    async get() {
                                        return await getMangaPerRow(stateManager)
                                    },
                                    async set(newValue) {
                                        await setMangaPerRow(stateManager, newValue)
                                    }
                                })
                            })
                        ]
                    }),
                    App.createDUISection({
                        id: "updatedRowSection",
                        header: "Updated Feed",
                        isHidden: false,
                        rows: async () => [
                            App.createDUISwitch({
                                id: "updatedRowStateSwitch",
                                label: "Show",
                                value: App.createDUIBinding({
                                    async get() {
                                        return await getUpdatedRowState(stateManager)
                                    },
                                    async set(newValue) {
                                        await setUpdatedRowState(stateManager, newValue)
                                    }
                                })
                            }),
                            App.createDUISelect({
                                id: "updatedRowStyleSelect",
                                label: "Style",
                                options: rowStyles,
                                allowsMultiselect: false,
                                value: App.createDUIBinding({
                                    async get() {
                                        return await getUpdatedRowStyle(stateManager)
                                    },
                                    async set(newValue) {
                                        await setUpdatedRowStyle(stateManager, newValue)
                                    }
                                }),
                                labelResolver: async (option) => styleResolver(option),
                            })
                        ]
                    }),
                    App.createDUISection({
                        id: "categoryRowSection",
                        header: "Library Categories",
                        isHidden: false,
                        rows: async () => [
                            App.createDUISwitch({
                                id: "categoryRowStateSwitch",
                                label: "Show",
                                value: App.createDUIBinding({
                                    async get() {
                                        return await getCategoryRowState(stateManager)
                                    },
                                    async set(newValue) {
                                        await setCategoryRowState(stateManager, newValue)
                                    }
                                })
                            }),
                            App.createDUISelect({
                                id: "categoryRowStyleSelect",
                                label: "Style",
                                options: rowStyles,
                                allowsMultiselect: false,
                                value: App.createDUIBinding({
                                    async get() {
                                        return await getCategoryRowStyle(stateManager)
                                    },
                                    async set(newValue) {
                                        await setCategoryRowStyle(stateManager, newValue)
                                    }
                                }),
                                labelResolver: async (option) => styleResolver(option),
                            }),
                        ]
                    }),
                    App.createDUISection({
                        id: "sourceRowSection",
                        header: "Sources",
                        isHidden: false,
                        rows: async () => [
                            App.createDUISwitch({
                                id: "sourceRowStateSwitch",
                                label: "Show",
                                value: App.createDUIBinding({
                                    async get() {
                                        return await getSourceRowState(stateManager)
                                    },
                                    async set(newValue) {
                                        await setSourceRowState(stateManager, newValue)
                                    }
                                })
                            }),
                            App.createDUISelect({
                                id: "sourceRowStyleSelect",
                                label: "Style",
                                options: rowStyles,
                                allowsMultiselect: false,
                                value: App.createDUIBinding({
                                    async get() {
                                        return await getSourceRowStyle(stateManager)
                                    },
                                    async set(newValue) {
                                        await setSourceRowStyle(stateManager, newValue)
                                    }
                                }),
                                labelResolver: async (option) => styleResolver(option),
                            }),
                        ]
                    })
                ]
            }
        })
    })
}

// ---------------------------------------------------------------------------
// Category selection
// All getters read fresh from stateManager each time -> no captured closures,
// fixes "JSManagedValue was released" when the select is re-rendered.
// ---------------------------------------------------------------------------
export const categoriesSettings = async (stateManager: SourceStateManager, _requestManager: RequestManager): Promise<DUISelect> => {
    const serverCategories = await getServerCategories(stateManager);
    const selected = await getSelectedCategories(stateManager);

    const known = getCategoriesIds(serverCategories);
    const missedSelected = selected.filter((id) => !known.includes(id));
    const options = known.concat(missedSelected);

    return App.createDUISelect({
        id: "CategoriesSelection",
        label: "Categories",
        allowsMultiselect: true,
        options,
        labelResolver: async (option) => {
            // Read fresh inside the callback so we don't hold a captured ref
            const cats = await getServerCategories(stateManager);
            return getCategoryNameFromId(cats, option) ?? "";
        },
        value: App.createDUIBinding({
            async get() {
                return await getSelectedCategories(stateManager)
            },
            async set(newValue) {
                await setSelectedCategories(stateManager, newValue)
            }
        }),
    })
}

// ---------------------------------------------------------------------------
// Source selection
// ---------------------------------------------------------------------------
export const sourceSettings = async (stateManager: SourceStateManager, _requestManager: RequestManager): Promise<DUISelect> => {
    const serverSources = await getServerSources(stateManager);
    const selectedLanguages = await getSelectedLanguages(stateManager);
    const selectedSources = await getSelectedSources(stateManager);

    // Filter sources by selected languages
    const filtered = Object.keys(serverSources).filter((key) => {
        const source = serverSources[key] ?? DEFAULT_SERVER_SOURCE;
        return selectedLanguages.includes(source.lang);
    });

    // Add any selected sources that aren't in the filtered list (so users can deselect them)
    const knownIds = getSourcesIds(serverSources);
    const missedSelected = selectedSources.filter((id) => !knownIds.includes(id) || !filtered.includes(id));

    // Deduplicate while preserving order
    const seen = new Set<string>();
    const options: string[] = [];
    for (const id of [...filtered, ...missedSelected]) {
        if (!seen.has(id)) {
            seen.add(id);
            options.push(id);
        }
    }

    return App.createDUISelect({
        id: "SourcesSelection",
        label: "Sources",
        allowsMultiselect: true,
        options,
        labelResolver: async (option) => {
            const sources = await getServerSources(stateManager);
            return getSourceNameFromId(sources, option);
        },
        value: App.createDUIBinding({
            async get() {
                return await getSelectedSources(stateManager)
            },
            async set(newValue) {
                await setSelectedSources(stateManager, newValue)
            }
        })
    })
}

// ---------------------------------------------------------------------------
// Language selection
// ---------------------------------------------------------------------------
export const languageSettings = async (stateManager: SourceStateManager): Promise<DUISelect> => {
    const serverLangs = await getServerLanguages(stateManager);
    const options = getLanguageCodes().concat(serverLangs);

    // Deduplicate
    const seen = new Set<string>();
    const uniqueOptions = options.filter((l) => {
        if (seen.has(l)) return false;
        seen.add(l);
        return true;
    });

    return App.createDUISelect({
        id: "languageSelection",
        label: "Languages",
        allowsMultiselect: true,
        options: uniqueOptions,
        labelResolver: async (option) => getLanguageName(option),
        value: App.createDUIBinding({
            async get() {
                return await getSelectedLanguages(stateManager)
            },
            async set(newValue) {
                await setSelectedLanguages(stateManager, newValue)
            }
        }),
    })
}

// ---------------------------------------------------------------------------
// Reset settings button
// ---------------------------------------------------------------------------
export const resetSettingsButton = async (stateManager: SourceStateManager): Promise<DUIButton> => {
    return App.createDUIButton({
        id: "resetSettingsButton",
        label: "Reset Settings",
        onTap: async () => {
            await resetSettings(stateManager)
        }
    })
}