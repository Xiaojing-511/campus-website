module.exports = {
    publicPath: '/',
    // publicPath: process.env.NODE_ENV === 'production' ? '' : '/',
    devServer: {
        open: true,
        hot:true,
        proxy:
        {
            '/api': {
                // 此处的写法，目的是为了 将 /api 替换成 http://localhost:3000/
                target: 'http://127.0.0.1:3000',
                // 允许跨域
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    "^/api": "" //这里理解成用'/api'代替target里面的地址,比如我要调用'http://localhost:3000/user/add'，直接写'/api/user/add'即可
                }
            }
        }
    }
}