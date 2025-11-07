local wk = require("which-key")
wk.setup()

vim.keymap.set("n", "<leader>?", function()
    wk.show({ mode = "n" })
end, { desc = "WhichKey" })
