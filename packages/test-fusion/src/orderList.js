import { register } from "@lego/core";
register({
  type: "orderList",
  constructor: [
    {
      type: "micloud-ajax",
      name: "getlist",
      options: {
        url: "${$props.url}",
        params: {
          username: "${$global.root.userinfo.name}",
        },
      },
    },
    {
      type: "micloud-table",
      options: {
        datas: "${(getlist && getlist.data||[]).map(item=>item.order)||[]}",
        columns: [
          {
            title: "订单ID",
            key: "id",
          },
          {
            title: "申请人",
            key: "creator",
          },
          {
            title: "描述",
            key: "description",
          },
          {
            title: "创建时间",
            key: "createtime",
          },
          {
            title: "操作",
            key: "actions",
          },
        ],
      },
    },
  ],
});
