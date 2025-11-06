return {
    "neovim/nvim-lspconfig",
    vim.lsp.enable('lua_ls'),
    vim.lsp.enable('zls'),
    -- :h vim.lsp.buf
    -- vim.keymap.set('n', 'K', vim.lsp.buf.hover, {}),

    -- vim.api.nvim_create_user_command(
    --     'Hover',
    --     function()
    --         vim.lsp.buf.hover()
    --     end,
    --     {}
    -- )

    vim.keymap.set('n', '<leader>ca', vim.lsp.buf.code_action, { desc = "LSP Code Action" })

}
