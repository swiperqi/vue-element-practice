module.exports = {
    publicPath: './',
    devServer: {
        host: 'localhost',
        port: '7001',
        https: false,
        hotOnly: false,
        proxy: {
            '/api': {
                target: 'http://localhost:7080',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
}