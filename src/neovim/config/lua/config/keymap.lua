vim.keymap.set('n', '<leader>lf', vim.lsp.buf.format, { desc = "Format" })

vim.keymap.set('n', '<leader>pra', function()
    local packs = vim.pack.get()

    local names = vim.tbl_map(function(v)
        return v.spec.name
    end, vim.tbl_values(packs))

    vim.pack.del(names)
    print('All plugins deleted')
end, { desc = "Del all plugins" })
