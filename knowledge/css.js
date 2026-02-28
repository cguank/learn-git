/**
 * absolute：他的意思是绝对定位，他是参照浏览器的左上角，配合TOP、RIGHT、BOTTOM、LEFT(下面简称TRBL)进行定位，在没有设定TRBL，默认依据父级的做标原始点为原始点。如果设定TRBL并且父级没有设定position属性，那么当前的absolute则以浏览器左上角为原始点进行定位，位置将由TRBL决定。
 * Relative，CSS中的写法是：position:relative;  他的意思是绝对相对定位，他是参照父级的原始点为原始点（父级无需设置position），无父级则以BODY的原始点为原始点，配合TRBL进行定位，当父级内有padding等CSS属性时，当前级的原始点则参照父级内容区的原始点进行定位。
relative没有跳出文本流，定位是相对于父级和兄弟节点。absolute跳出文本流，是相对于父级且带有定位，如果父级没有定位属性，那么就会往上一级再找是否带定位，找到顶级之后如果还没有定位，就以浏览器视窗定位。
 */

/**
 * 获得元素在页面的位置，和本身大小
 * 1.大小：item.offetHeight,offetWidth
 * 2.位置：
 * 左位置：item.getBoundingClientRect().left+window.scrollX，
 * 上位置：item.getBoundingClientRect().top+window.scrollY
 */

/**
 * 可继承的css：
 * 1.font-size、font-family，font-style，font-weight（字体）
 * 2.text-align,color,line-height（文本）
 * 3.visibility
 * 不可继承css：
 * 1.display
 * 2.盒子模型属性（padding，border，margin，width，height）
 * 3.背景属性
 * 4.定位属性
 */

/**
 * 怎么画1px的线,怎么给盒子加上边框为1px：问的是移动端适配
 * .box{
  width:100px;
  height: 100px;
}
.box::before {
  display: block;
  content:"";
  width:200%;
  height: 200%;
   border:1px solid red;
  transform: scale(0.5);
  transform-origin: 0 0;
}
 */