export const judgeEmptyStr = (strings) => {
   return strings.replace(/(^\s*)|(\s*$)/g, "").length == 0
}
export const initWebsocket = (_this)=>{
   // let _this = this;
   const ws = new WebSocket('ws://localhost:8080');
   _this.ws = ws;
   ws.onopen = function () {
       console.log('连接成功...')
   }
   ws.onerror = function () {
       console.log('连接失败...')
   }
   ws.onmessage = function (event) {
       console.log('event' + event.data)
   }
   ws.onclose = function () {
       console.log('连接已关闭...')
   }
}