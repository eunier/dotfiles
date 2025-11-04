return {
    "nvim-treesitter/nvim-treesitter",
    branch = 'master',
    lazy = false,
    build = ":TSUpdate",
    ensure_installed = {
        "javascript",
        "lua",
        "markdown_inline",
        "markdown",
        "typescript",
        "vim",
        "zig",
    },
    highlight = { enable = true },
    indent = { enable = true },
}
