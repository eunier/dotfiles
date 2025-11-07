require("mason").setup({
    ui = {
        icons = {
            package_installed = "✓",
            package_pending = "➜",
            package_uninstalled = "✗"
        }
    }
});

require("mason-lspconfig").setup({
    -- Whether installed servers should automatically be enabled via `:h vim.lsp.enable()`.
    --
    -- To exclude certain servers from being automatically enabled:
    -- ```lua
    --   automatic_enable = {
    --     exclude = { "rust_analyzer", "ts_ls" }
    --   }
    -- ```
    --
    -- To only enable certain servers to be automatically enabled:
    -- ```lua
    --   automatic_enable = {
    --     "lua_ls",
    --     "vimls"
    --   }
    -- ```
    ---@type boolean | string[] | { exclude: string[] }
    automatic_enable = true,

    -- A list of servers to automatically install if they're not already installed.
    -- Example: { "rust_analyzer@nightly", "lua_ls" }
    ---@type string[]
    ensure_installed = {
        "eslint",
        "lua_ls",
        "stylua",
        "ts_ls",
        "zls",
    }
})
