// 三层结构
const a ={
  // 文档节点
  "type": "document",
  "children": [
    {
      // 块节点
      "type": "paragraph",
      "children": [
        // 文本节点
        { "text": "这是" },
        { "text": "红色加粗", "bold": true, "color": "#f00" }
      ]
    },
    {
      "type": "block-quote",
      "children": [
        { "text": "这是引用块" }
      ]
    },
    {
      "type": "numbered-list",
      "children": [
        {
          "type": "list-item",
          "children": [{ "text": "列表项1" }]
        },
        {
          "type": "list-item",
          "children": [{ "text": "列表项2" }]
        }
      ]
    }
  ]
}