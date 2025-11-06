vim.g.mapleader = " "

vim.opt.expandtab = true
vim.opt.number = true
vim.opt.shiftwidth = 4
vim.opt.softtabstop = 4
vim.opt.tabstop = 4
vim.opt.wrap = true


vim.pack.add({
    { src = 'https://github.com/neovim/nvim-lspconfig' },
    { src = "https://github.com/folke/which-key.nvim" },
    { src = "https://github.com/navarasu/onedark.nvim" },
    { src = "https://github.com/nvim-mini/mini.icons" },
    { src = "https://github.com/nvim-tree/nvim-web-devicons" },
})

vim.cmd("colorscheme onedark")

vim.lsp.enable({ "lua_ls" })
vim.keymap.set('n', '<leader>lf', vim.lsp.buf.format, { desc = "Format" })


local wk = require("which-key")
wk.setup()

vim.keymap.set("n", "<leader>?", function()
    wk.show({ mode = "n" })
end, { desc = "WhichKey" })
