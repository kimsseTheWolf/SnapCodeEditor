const { LanguageClient, TransportKind } = require('vscode-languageclient');

const languageServers = {
    'javascript': {
        command: 'tsserver',
        transport: TransportKind.stdio
    },
    'html': {
        command: 'tsserver',
        transport: TransportKind.stdio
    },
    'css': {
        command: 'tsserver',
        transport: TransportKind.stdio
    },
    'python': {
        command: 'pyls',
        transport: TransportKind.stdio
    },
    'cpp': {
        command: 'clangd',
        transport: TransportKind.stdio
    },
    'java': {
        command: 'java',
        args: ['-Declipse.application=org.eclipse.jdt.ls.core.id1', '-Dosgi.bundles.defaultStartLevel=4', '-Declipse.product=org.eclipse.jdt.ls.core.product', '-Dlog.level=ALL', '-noverify', '-Xmx1G', '-jar', '/path/to/eclipse.jdt.ls/product/target/repository/plugins/org.eclipse.equinox.launcher_*.jar', '-configuration', '/path/to/eclipse.jdt.ls/product/target/repository/config_win', '-data', '/path/to/workspace'],
        transport: TransportKind.stdio
    }
};

function getLanguageClient(language) {
    const serverOptions = languageServers[language];
    if (!serverOptions) {
        return null;
    }

    return new LanguageClient(language, `${language.charAt(0).toUpperCase() + language.slice(1)} Language Server`, serverOptions);
}

module.exports = getLanguageClient;