/** https://mp.weixin.qq.com/s/StqqafHePlBkWAPQZg3NrA
 * 区别：
 * 1.http采用明文发送，https采用密文发送，所以https安全性高
 * 2.http端口80，https：443
 * 3.https要购买证书，成本高
 * 4.https请求效率低
 * 5.https实际上是http+ssl
 * 
 * ssl安全套接层
 * 工作流程：
 * 服务器向ca购买证书
 * 将自己的公钥和其他信息以及数字签名生成数字证书发给客户端；
 * 浏览器用已经预置好的ca的公钥对数字签名解密，比对解密后的消息摘要；
 * 若一致，则用服务器的公钥加密随机生成的对称密钥发给服务器
 * 服务器用私钥解密，至此双方都有了对称密钥，便用它来加密通信
 * 
 * 消息摘要：服务器将自己的公钥以及其他信息，用hash算法生成消息摘要
 * 数字签名：ca用自己私钥对服务器的消息摘要加密生成数字签名
 * （其中浏览器拿到公钥要使用相同的hash算法生成消息摘要，并比对解密后的数字签名）
 * 
 */

/**
 * tcp udp的区别
 * tcp：面向连接的，可靠的，通过字节流传输的协议，支持1对1通信
 * udp：面向无连接，不可靠，通过报文传输的协议，支持1对多
 * 其中：
 * 面向连接：通信前需要3次握手，通信结束要4此挥手
 * 可靠性：，不丢包，按顺序,
 * 通过：确认应答+序列号、超时重传、拥塞控制、流量控制、校验和
 */

/**
 * http 头部有哪些字段
 * 1.cache-control
 * 2.Connection:Keep-Alive
 * 3.Content-Type(text/html,image/png,application/json,multipart/form-data)
 * 7.Accept-encoding/content-encoding(gzip,deflat,br)
 * 4.ETag(If-None-Match)
 * 5.Last-Modified(If-Modified-since)
 * 6.reffer
 *  */

/**
 * http有哪些请求
 * 1.options：预检请求，跨域时发送options来检测服务器是否支持实际请求
 * 2.get/post：a.在浏览器设置中get有长度限制，post没有；b.get请求的参数可以被浏览器缓存下来，post不能c.get时幂等的而post不是
 * 3.put：幂等用来改变信息
 * 4.head:只请求头部信息
 */

/**
 * 为什么要减少http请求
 * 1.请求本身资源很小，可能请求头比实际数据还大，这种请求多了，传输自然就慢了
 * 2.http1.1只能串行发送，也就是第100个请求要等第99个请求完成才能发送，这会造成较大的网络延迟，而网络延迟就是合并请求的主要动力
 * 3.通过dns获得实际的ip地址也是比较浪费时间，即使有dns缓存，那也需要查找
 */
/**
 * 如何减少http请求
 * 1.减少图片请求（1.使用图片精灵2.使用内联图片主要是data：url方式）
 * 2.减少脚本文件和css文件的请求
 */

/**
 * http2
 * 1. 1.x中采用文本传输，2采用2进制传输（有多种文本形式，要使用就必须考虑多种场景，二进制则方便健壮）
 * 2. 采用多路复用，一个tcp连接可以有多条流，对端可以通过帧标识知道属于哪个请求。这样就可以避免队头阻塞，极大提高性能（帧代表最小的数据单位，每个帧会标识出属于哪个流，流由多个帧组成）
 * 3.对头部压缩
 * 4.服务器可以进行推送（请求style.css，服务器还会多发一个script.js）
 * 缺点： tcp队头阻塞。 如果HTTP / 2 连接双方的网络中有一个数据包丢失， 或者任何一方的网络出现中断， 整个TCP连接就会暂停， 丢失的数据包需要被重新传输。 因为TCP是一个按序传输的链条， 因此如果其中一个点丢失了， 链路上之后的内容就都需要等待。
 */

/**
 * html优化
 * 1.减少http请求
 * 2.利用好浏览器强缓存和协商缓存
 * 3.利用cdn，内容分发网络，会选择对用户响应最快的节点来响应用户
 * 4.用户端可以设置accept-encoding，服务端可以设置content-encoding
 * 5.css放头部，js放底部，都可以加快首屏的加载时间
 * 6.最好使用外联js和css，因为内联虽然减少请求但增大了文件的体积，且外联之后能被浏览器缓存
 * 7.减小js、css体积，即删除不必要的字符和空格
 */

/**
 * html5新特性
 * 1.语义化标签（header、footer、nav、aside）
 * 2.web存储增加，localstorge，sessionstorage
 * 3.增加音频，audio，vedio
 * 4.websocket
 */

/**
 * 为什么使用vue
 * 1.首先第一年有接触过一个vue项目，算是边看边学了
 * 2.网上查询相比react，vue比较适合小型项目3.就是学长的建议
 */



/**
 * script属性和link属性
 * 下载script文件和执行script文件都会阻塞dom解析
 * 加上defer就是下载不会阻塞，下载号后最后执行
 * async下载不会阻塞，下载号后立即执行
 * 1.script:
 * a.src b.type="text/javascript" c.defer/async
 * 2.link:
 * rel="stylesheet" href="" type="text/css"
 */

/**
 * 常用meta
 * 1.优化移动设备name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,use-scalable=no"
 * 2.搜索隐形关键字name="keywords" content="关键字1，····"
 * 3. name="description" content="网页描述"
 * 4.不缓存 http-equiv="cache-control" content="no-cache"
 * 5. 设置字符集 <meta charset="utf-8">
 */

/**
 * webassembly？
 * 1.生成的文件是二进制的，意味着更小的文件，更快的下载分发
 * 2.可以由非js语言来编写，主要用于计算复杂的地方。
 */