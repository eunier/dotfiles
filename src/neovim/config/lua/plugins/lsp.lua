return {
    {
        "mason-org/mason.nvim",
        opts = {
            ui = {
                icons = {
                    package_installed = "✓",
                    package_pending = "➜",
                    package_uninstalled = "✗"
                }
            }
        }
    },
    {
        "mason-org/mason-lspconfig.nvim",
        dependencies = {
            "mason-org/mason.nvim",
            "neovim/nvim-lspconfig",
        },
        opts = {
            ensure_installed = {
                "eslint",
                "lua_ls",
                "ts_ls",
                "zls",
            },
        },
    },
    {
        "neovim/nvim-lspconfig",
        -- :h vim.lsp.buf
        -- vim.keymap.set('n', 'K', vim.lsp.buf.hover, {}),

        -- vim.api.nvim_create_user_command(
        --     'Hover',
        --     function()
        --         vim.lsp.buf.hover()
        --     end,
        --     {}
        -- )

        vim.keymap.set('n', 'K', vim.lsp.buf.hover, { desc = 'Hover' }),
        vim.keymap.set('n', 'gd', vim.lsp.buf.definition, { desc = 'Go to Definition' }),
        vim.keymap.set('n', '<leader>ca', vim.lsp.buf.code_action, { desc = "LSP Code Action" })
    },
}
