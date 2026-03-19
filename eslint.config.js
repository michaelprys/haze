import js from '@eslint/js';
import pluginQuasar from '@quasar/app-vite/eslint';
import prettierSkipFormatting from '@vue/eslint-config-prettier/skip-formatting';
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript';
import pluginVue from 'eslint-plugin-vue';
import globals from 'globals';

export default defineConfigWithVueTs(
    {
        /**
         * Ignore the following files.
         */
        // ignores: []
    },

    pluginQuasar.configs.recommended(),
    js.configs.recommended,
    pluginVue.configs['flat/strongly-recommended'],
    {
        files: ['**/*.ts', '**/*.vue'],
        rules: {
            '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
            // 'vue/attributes-order': 'off',
        },
    },

    vueTsConfigs.recommendedTypeChecked,

    {
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.node,
                process: 'readonly',
                ga: 'readonly',
                cordova: 'readonly',
                Capacitor: 'readonly',
                chrome: 'readonly',
                browser: 'readonly',
            },
        },

        rules: {
            'prefer-promise-reject-errors': 'off',

            // allow debugger during development only
            'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

            'vue/block-order': [
                'error',
                {
                    order: ['script', 'template', 'style'],
                },
            ],
        },
    },

    {
        files: ['src-pwa/custom-service-worker.ts'],
        languageOptions: {
            globals: {
                ...globals.serviceworker,
            },
        },
    },

    prettierSkipFormatting,
);
