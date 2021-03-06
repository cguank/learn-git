/**
 * 为什么要3次握手，而不是2次或者4次
 * 1.主要原因，防止历史连接初始化了连接。比如三次握手下旧请求seq=90，新请求seq=100，旧请求先到达服务器
 * 服务器发送ack=91，客户端发现ack不对，则发送rst终止请求。
 * 2.可以初始化双方的序列号（序列号作用：接收方可以去除重复数据包；可以根据序列号按序接受；可以标识发送的数据包哪些是对方已经收到的）
 * 3.如果客户端syn在网络中阻塞了，重复发送多个syn，那么服务端会建立多个无效连接，浪费服务端资源
 */

/**
 * 为什么要等待2msl
 * 1.假设发送方最后的应答丢失了，而此时发送方直接关闭，那么会造成接收方无法正常关闭，
 * 等待2msl，可以确保收到接收方的超时重传
 * 2.可以让本次连接的所有报文在网络中消失，这样下一次连接就没有旧报文了
 */

/**
 * 有了ip地址为什么还要mac地址
 * 答：网络层是工作在物理层之上的，而物理层的传输就是通过mac地址
 */

/**
 * 内网和公网
 * 首先内网ip只有在公司内部才能访问，外网访问不到内网，访问则需要NAT协议，通过把内网ip转成内网所在的外网ip来访问外网
 */