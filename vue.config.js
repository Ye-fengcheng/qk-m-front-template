module.exports = {
    publicPath: '/',
    assetsDir: 'static',
    productionSourceMap: false,
    devServer: {
        port: 8000,
    //     host: 'local.test.cn',
    //     proxy: {
    //         '/api':{
    //             target:'http://api.test.com',
    //             changeOrigin:true,
    //             pathRewrite:{
    //                 '/api':''
    //             }
    //         }
    //     }
    }
}