import { register } from "@lego/core";
register({
  type: "orderList",
  constructor: [
    {
      type: "micloud-page-title",
      options: {
        label: "工单列表",
      },
    },
    {
      type: "micloud-row",
      refs: {
        content: {
          type: "micloud-button",
          options: {
            label: "申请工单",
            link: "/add",
          },
        },
      },
      options: {
        children: "@content",
      },
    },
    {
      type: "micloud-tab",
      refs: {
        unapprove: [
          {
            type: "micloud-table",
            options: {
              datas: "${getUnapprove.data}",
              columns: [
                {
                  title: "订单ID",
                  key: "id",
                  primary: true,
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
                  transform: function (value) {
                    return new Date(value).toLocaleString();
                  },
                },
              ],
              operator: {
                title: "操作",
                buttons: [
                  {
                    label: "修改",
                    key: "modify",
                  },
                ],
              },
            },
          },
          {
            type: "micloud-ajax",
            name: "getUnapprove",
            options: {
              url: "/api/v1/order/approval/list",
              params: {
                username: "${$props.username}",
              },
              transform: function (res) {
                return res.map((item) => item.order);
              },
            },
          },
        ],
      },
      options: {
        tabs: [
          {
            title: "未审批",
            key: "unapprove",
            content: "@unapprove",
          },
          {
            title: "已审批",
            key: "approve",
            content: "",
          },
        ],
      },
    },
  ],
});
